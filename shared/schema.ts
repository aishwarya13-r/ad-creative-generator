import { z } from "zod";
import { pgTable, text, integer, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Database Tables
export const adProjects = pgTable("ad_projects", {
  id: varchar("id").primaryKey(),
  productImageUrl: text("product_image_url").notNull(),
  targetAudience: jsonb("target_audience").notNull().$type<{
    ageMin: number;
    ageMax: number;
    gender: "male" | "female" | "all";
    persona: string;
  }>(),
  adText: text("ad_text").notNull(),
  templateId: varchar("template_id"),
  generatedImageUrl: text("generated_image_url"),
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adTemplates = pgTable("ad_templates", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  style: varchar("style", { length: 50 }).notNull(), // minimalist, bold, elegant, playful, vibrant, modern, classic
  promptModifier: text("prompt_modifier").notNull(), // Additional instructions for AI
  previewImageUrl: text("preview_image_url"),
  isActive: integer("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod Schemas with validation
export const insertAdProjectSchema = createInsertSchema(adProjects, {
  targetAudience: z.object({
    ageMin: z.number().min(0).max(100),
    ageMax: z.number().min(0).max(100),
    gender: z.enum(["male", "female", "all"]),
    persona: z.string().min(10).max(500),
  }).refine(
    (data) => data.ageMin <= data.ageMax,
    { message: "Minimum age must be less than or equal to maximum age" }
  ),
  adText: z.string().min(1).max(200),
}).omit({
  id: true,
  generatedImageUrl: true,
  generatedAt: true,
  createdAt: true,
});

export const updateAdProjectSchema = z.object({
  generatedImageUrl: z.string().optional(),
  generatedAt: z.date().optional(),
});

export const selectAdProjectSchema = createSelectSchema(adProjects);

export type AdProject = typeof adProjects.$inferSelect;
export type InsertAdProject = z.infer<typeof insertAdProjectSchema>;
export type UpdateAdProject = z.infer<typeof updateAdProjectSchema>;

// Template Schemas
export const insertAdTemplateSchema = createInsertSchema(adTemplates).omit({
  id: true,
  createdAt: true,
});

export const selectAdTemplateSchema = createSelectSchema(adTemplates);

export type AdTemplate = typeof adTemplates.$inferSelect;
export type InsertAdTemplate = z.infer<typeof insertAdTemplateSchema>;

export const generateAdRequestSchema = z.object({
  productImageUrl: z.string().refine(
    (val) => val.startsWith("data:image/") && val.includes(";base64,"),
    { message: "Product image must be a valid base64 data URL" }
  ),
  targetAudience: z.object({
    ageMin: z.number(),
    ageMax: z.number(),
    gender: z.string(),
    persona: z.string(),
  }),
  adText: z.string(),
  templateId: z.string().optional(),
  productDisplay: z.enum(["standalone", "on-person"]).optional(),
});

export type GenerateAdRequest = z.infer<typeof generateAdRequestSchema>;
