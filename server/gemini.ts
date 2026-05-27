// Using Replit AI Integrations for Gemini - blueprint:javascript_gemini_ai_integrations
import { GoogleGenAI, Modality } from "@google/genai";

// This is using Replit's AI Integrations service, which provides Gemini-compatible API access without requiring your own Gemini API key.
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY!,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL!,
  },
});

export async function generateAdCreative(
  productImageBase64: string,
  adText: string,
  targetAudience: {
    ageMin: number;
    ageMax: number;
    gender: string;
    persona: string;
  },
  templateModifier?: string,
  productDisplay?: "standalone" | "on-person"
): Promise<string> {
  // Extract base64 data and mime type from data URL
  const base64Match = productImageBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (!base64Match) {
    throw new Error("Invalid product image format. Expected base64 data URL.");
  }
  
  const productMimeType = base64Match[1];
  const productBase64Data = base64Match[2];
  
  // Validate image size (Gemini has 8MB limit, we'll use 5MB to be safe)
  const imageSizeBytes = (productBase64Data.length * 3) / 4; // Approximate decoded size
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB
  if (imageSizeBytes > maxSizeBytes) {
    throw new Error(`Product image is too large (${(imageSizeBytes / 1024 / 1024).toFixed(2)}MB). Please use an image smaller than 5MB.`);
  }
  
  // Validate mime type
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!supportedTypes.includes(productMimeType)) {
    throw new Error(`Unsupported image format: ${productMimeType}. Please use JPEG, PNG, or WebP.`);
  }
  
  console.log(`Processing image: ${productMimeType}, size: ${(imageSizeBytes / 1024).toFixed(2)}KB`);
  
  // Step 1: Analyze the product image using gemini-2.5-flash (vision model)
  console.log("Step 1: Analyzing product image...");
  const analysisResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{
      role: "user",
      parts: [
        { text: "Describe this product image in detail. Focus on: the product type, key features, colors, style, materials, and any text or branding visible. Be specific and descriptive." },
        {
          inlineData: {
            mimeType: productMimeType,
            data: productBase64Data,
          },
        },
      ],
    }],
  });
  
  const productDescription = analysisResponse.text || "a product";
  console.log(`Product description: ${productDescription.substring(0, 100)}...`);
  
  // Step 2: Generate ad creative using the description
  console.log("Step 2: Generating ad creative...");
  
  // Determine age group description for better targeting
  let ageGroupDescription: string;
  if (targetAudience.ageMax <= 12) {
    ageGroupDescription = "children/kids";
  } else if (targetAudience.ageMin >= 13 && targetAudience.ageMax <= 19) {
    ageGroupDescription = "teenagers";
  } else if (targetAudience.ageMin >= 20 && targetAudience.ageMax <= 35) {
    ageGroupDescription = "young adults";
  } else if (targetAudience.ageMin >= 36 && targetAudience.ageMax <= 55) {
    ageGroupDescription = "middle-aged adults";
  } else if (targetAudience.ageMin >= 56) {
    ageGroupDescription = "seniors/elderly";
  } else {
    ageGroupDescription = `ages ${targetAudience.ageMin}-${targetAudience.ageMax}`;
  }
  
  const audienceDescription = `${targetAudience.gender === "all" ? "everyone" : targetAudience.gender + " audience"}, ${ageGroupDescription} (ages ${targetAudience.ageMin}-${targetAudience.ageMax}), ${targetAudience.persona}`;
  
  // Determine model type based on age
  let modelDescription: string;
  if (targetAudience.ageMax <= 12) {
    modelDescription = targetAudience.gender === "male" ? "a boy child" : targetAudience.gender === "female" ? "a girl child" : "a child";
  } else if (targetAudience.ageMin >= 13 && targetAudience.ageMax <= 19) {
    modelDescription = targetAudience.gender === "male" ? "a teenage boy" : targetAudience.gender === "female" ? "a teenage girl" : "a teenager";
  } else if (targetAudience.ageMin >= 56) {
    modelDescription = targetAudience.gender === "male" ? "an elderly man" : targetAudience.gender === "female" ? "an elderly woman" : "an elderly person";
  } else {
    modelDescription = targetAudience.gender === "male" ? "a male model" : targetAudience.gender === "female" ? "a female model" : "a model";
  }
  
  // Determine product presentation based on display preference
  const displayInstructions = productDisplay === "on-person" 
    ? `- Show the product being worn or used by ${modelDescription}\n- IMPORTANT: The person in the ad MUST be ${ageGroupDescription} matching ages ${targetAudience.ageMin}-${targetAudience.ageMax}\n- Lifestyle shot with the product in real-world use\n- Natural, authentic setting that shows product benefits`
    : `- Showcase the product as a standalone item, no people\n- Clean, professional product photography aesthetic\n- Product should be the sole focus with complementary background\n- Design should appeal to ${ageGroupDescription}`;
  
  let prompt = `Create a professional, eye-catching Instagram/Facebook ad image for e-commerce.

Product Description: ${productDescription}

Target Audience: ${audienceDescription}

Ad Headline: "${adText}"

Requirements:
${displayInstructions}
- Modern, professional design inspired by Canva and Adobe Express
- Display the headline text "${adText}" prominently on the image with excellent readability
- Use vibrant, attention-grabbing colors (vibrant orange #FF6B35, deep blue #004E89, or purple #805AD5 accents)
- Ensure text has high contrast with background (use shadows, overlays, or contrasting backgrounds)
- Instagram square format (1:1 aspect ratio)
- High-quality commercial ad aesthetic suitable for e-commerce
- Include subtle gradient accents to add depth and visual interest
- Professional typography with clear hierarchy
- Clean, modern composition that drives conversions
- Background should complement but not overshadow the product
- Add visual elements that enhance product appeal

Style: Professional e-commerce advertisement, clean and modern, high-converting design optimized for social media`;

  // Add template modifier if provided
  if (templateModifier) {
    prompt += `\n\nTEMPLATE STYLE:\n${templateModifier}`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);
  
  if (!imagePart?.inlineData?.data) {
    throw new Error("No image data in response from AI");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}
