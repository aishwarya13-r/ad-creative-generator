import type { AdProject, InsertAdProject, UpdateAdProject, AdTemplate, InsertAdTemplate } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { adProjects, adTemplates } from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  createAdProject(project: InsertAdProject): Promise<AdProject>;
  getAdProject(id: string): Promise<AdProject | undefined>;
  updateAdProject(id: string, updates: UpdateAdProject): Promise<AdProject>;
  getAllAdProjects(): Promise<AdProject[]>;
  
  createAdTemplate(template: InsertAdTemplate): Promise<AdTemplate>;
  getAdTemplate(id: string): Promise<AdTemplate | undefined>;
  getAllAdTemplates(): Promise<AdTemplate[]>;
  seedTemplates(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createAdProject(insertProject: InsertAdProject): Promise<AdProject> {
    const id = randomUUID();
    const [project] = await db.insert(adProjects).values({
      id,
      ...insertProject,
    }).returning();
    return project;
  }

  async getAdProject(id: string): Promise<AdProject | undefined> {
    const [project] = await db.select().from(adProjects).where(eq(adProjects.id, id));
    return project;
  }

  async updateAdProject(id: string, updates: UpdateAdProject): Promise<AdProject> {
    const [updated] = await db.update(adProjects)
      .set(updates)
      .where(eq(adProjects.id, id))
      .returning();
    
    if (!updated) {
      throw new Error("Ad project not found");
    }
    
    return updated;
  }

  async getAllAdProjects(): Promise<AdProject[]> {
    return await db.select().from(adProjects);
  }

  async createAdTemplate(insertTemplate: InsertAdTemplate): Promise<AdTemplate> {
    const id = randomUUID();
    const [template] = await db.insert(adTemplates).values({
      id,
      ...insertTemplate,
    }).returning();
    return template;
  }

  async getAdTemplate(id: string): Promise<AdTemplate | undefined> {
    const [template] = await db.select().from(adTemplates).where(eq(adTemplates.id, id));
    return template;
  }

  async getAllAdTemplates(): Promise<AdTemplate[]> {
    return await db.select().from(adTemplates).where(eq(adTemplates.isActive, 1));
  }

  async seedTemplates(): Promise<void> {
    // Check if templates already exist
    const existing = await this.getAllAdTemplates();
    if (existing.length > 0) return;

    // Seed pre-designed templates
    const templates: InsertAdTemplate[] = [
      {
        name: "Minimalist Clean",
        description: "Clean, simple design with lots of white space and subtle elegance",
        style: "minimalist",
        promptModifier: "Use a minimalist design with plenty of white space, clean sans-serif typography, and subtle accents. Focus on simplicity and clarity with a muted color palette.",
        isActive: 1,
      },
      {
        name: "Bold & Vibrant",
        description: "Eye-catching design with bold colors and dynamic composition",
        style: "bold",
        promptModifier: "Create a bold, vibrant design with high-contrast colors, large bold typography, and dynamic visual elements. Use energetic gradients and strong graphic shapes.",
        isActive: 1,
      },
      {
        name: "Elegant Luxury",
        description: "Sophisticated design with premium feel and refined aesthetics",
        style: "elegant",
        promptModifier: "Design an elegant, luxury-focused ad with sophisticated typography (serif or elegant sans-serif), subtle gold/metallic accents, refined color palette, and premium visual treatment.",
        isActive: 1,
      },
      {
        name: "Playful & Fun",
        description: "Energetic design with playful elements and cheerful vibes",
        style: "playful",
        promptModifier: "Create a playful, fun design with bright cheerful colors, rounded shapes, whimsical typography, and energetic visual elements. Include playful patterns or illustrations.",
        isActive: 1,
      },
      {
        name: "Modern Tech",
        description: "Contemporary design with tech-forward aesthetics",
        style: "modern",
        promptModifier: "Design a modern, tech-focused ad with geometric shapes, gradients, futuristic typography, and contemporary color schemes. Include subtle tech-inspired visual elements.",
        isActive: 1,
      },
      {
        name: "Vintage Classic",
        description: "Timeless design with retro-inspired elements",
        style: "classic",
        promptModifier: "Create a vintage-inspired design with retro color palettes, classic typography, nostalgic visual elements, and a timeless aesthetic reminiscent of classic advertising.",
        isActive: 1,
      },
      {
        name: "Nature Organic",
        description: "Natural, earthy design with organic elements",
        style: "organic",
        promptModifier: "Design a natural, organic-themed ad with earthy color tones, organic shapes, nature-inspired elements, and a calming, sustainable aesthetic.",
        isActive: 1,
      },
    ];

    for (const template of templates) {
      await this.createAdTemplate(template);
    }
  }
}

export const storage = new DatabaseStorage();

// Seed templates on startup with retry logic
async function initializeDatabase() {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to seed templates (attempt ${attempt}/${maxRetries})...`);
      await storage.seedTemplates();
      console.log("Template seeding completed successfully");
      return;
    } catch (error) {
      console.error(`Template seeding attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  console.error("Failed to seed templates after all retries");
}

initializeDatabase();
