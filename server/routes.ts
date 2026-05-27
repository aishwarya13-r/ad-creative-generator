import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAdCreative } from "./gemini";
import { generateAdRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate ad creative using AI
  app.post("/api/generate-ad", async (req, res) => {
    try {
      const validatedData = generateAdRequestSchema.parse(req.body);

      // Get template if specified
      let templateModifier: string | undefined;
      if (validatedData.templateId) {
        const template = await storage.getAdTemplate(validatedData.templateId);
        if (template) {
          templateModifier = template.promptModifier;
        }
      }

      // Generate the ad image using Gemini AI
      const generatedImageUrl = await generateAdCreative(
        validatedData.productImageUrl,
        validatedData.adText,
        validatedData.targetAudience,
        templateModifier,
        validatedData.productDisplay
      );

      // Store the ad project
      const adProject = await storage.createAdProject({
        productImageUrl: validatedData.productImageUrl,
        targetAudience: validatedData.targetAudience,
        adText: validatedData.adText,
        templateId: validatedData.templateId,
      });

      // Update with generated image
      await storage.updateAdProject(adProject.id, {
        generatedImageUrl,
        generatedAt: new Date(),
      });

      res.json({
        success: true,
        imageUrl: generatedImageUrl,
        projectId: adProject.id,
      });
    } catch (error: any) {
      console.error("Error generating ad:", error);
      
      // Check if it's a validation error
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          error: "Invalid request data",
          details: error.errors,
        });
        return;
      }
      
      // Check for AI generation specific errors
      if (error.message?.includes("Invalid product image format") || 
          error.message?.includes("too large") ||
          error.message?.includes("Unsupported image format")) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }
      
      // Check for Gemini API errors about invalid images
      if (error.message?.includes("Provided image is not valid") ||
          error.message?.includes("INVALID_ARGUMENT") ||
          (error.status === 400 && error.message)) {
        res.status(400).json({
          success: false,
          error: "The uploaded image could not be processed. Please ensure your image is at least 100x100 pixels and in a supported format (JPEG, PNG, or WebP).",
        });
        return;
      }
      
      // Generic server error
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate ad creative. Please try again.",
      });
    }
  });

  // Get all ad projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllAdProjects();
      res.json({ projects });
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch projects",
      });
    }
  });

  // Get single ad project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getAdProject(req.params.id);
      if (!project) {
        res.status(404).json({
          success: false,
          error: "Project not found",
        });
        return;
      }
      res.json({ project });
    } catch (error: any) {
      console.error("Error fetching project:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch project",
      });
    }
  });

  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllAdTemplates();
      
      // If no templates exist, try to seed them
      if (templates.length === 0) {
        console.log("No templates found, attempting to seed...");
        await storage.seedTemplates();
        const seededTemplates = await storage.getAllAdTemplates();
        res.json({ templates: seededTemplates });
        return;
      }
      
      res.json({ templates });
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch templates",
      });
    }
  });

  // Health check endpoint for database status
  app.get("/api/health", async (req, res) => {
    try {
      const templates = await storage.getAllAdTemplates();
      res.json({
        status: "healthy",
        database: "connected",
        templatesCount: templates.length,
      });
    } catch (error: any) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "unhealthy",
        database: "error",
        error: error.message,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
