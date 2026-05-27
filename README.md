# Ad Creative Generator

A web application that creates professional social media ad creatives using Google's Gemini AI models. Upload product images, define your target audience, and generate Instagram/Facebook ads with AI-powered design—no design expertise required.

## 🎯 Overview

This application leverages **Replit's AI Integrations** (managed AI service) to provide a Canva-like interface for e-commerce brands to create engaging ad content. The tool uses a sophisticated two-step AI workflow to analyze products and generate professional ad creatives optimized for social media platforms.

## 🤖 AI Workflow: Two-Step Generation Process

The application uses a **two-step AI workflow** powered by Google's Gemini models via Replit's AI Integrations:

### Step 1: Product Analysis (Vision Model)
**Model Used:** `gemini-2.5-flash` (Multimodal Vision Model)

When you upload a product image, the first step analyzes the image to extract detailed information:

```
Input: Product image (base64 data URL)
Process: AI analyzes the image and extracts:
  - Product type and category
  - Key features and design elements
  - Colors and materials
  - Style characteristics
  - Visible text or branding
Output: Detailed text description of the product
```

**Why this step?** The `gemini-2.5-flash-image` model (used in Step 2) can only generate images from text prompts—it cannot accept images as input. By analyzing the uploaded product image first, we create a rich textual description that the image generation model can understand.

**Example Flow:**
```
User uploads: [Photo of a blue baseball cap]
↓
gemini-2.5-flash analyzes and outputs:
"A plain baseball cap in navy blue, featuring an unstructured 
crown with a curved brim. The hat has a classic 'dad hat' style 
with an adjustable fabric strap closure..."
```

### Step 2: Ad Creative Generation (Image Model)
**Model Used:** `gemini-2.5-flash-image` (Image Generation Model)

Using the product description from Step 1, this step generates the final ad creative:

```
Inputs:
  - Product description (from Step 1)
  - Target audience (age, gender, persona)
  - Ad headline text
  - Template style (optional)
  - Product display preference (standalone/on-person)

Process: AI generates a professional ad image with:
  - Product as central focal point
  - Headline text overlaid with high contrast
  - Brand colors and visual hierarchy
  - Platform-optimized composition (Instagram/Facebook)
  
Output: Professional ad creative (1080x1080px base64 image)
```

**Complete Workflow Diagram:**
```
┌─────────────────┐
│ User Uploads    │
│ Product Image   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ STEP 1: Product Analysis        │
│ Model: gemini-2.5-flash         │
│ Input: Product image (base64)   │
│ Output: Text description        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ STEP 2: Ad Creative Generation  │
│ Model: gemini-2.5-flash-image   │
│ Input: Description + Params     │
│ Output: Final ad image          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Generated Ad    │
│ Ready to Export │
└─────────────────┘
```

## ⚡ Replit AI Integrations

This project uses **Replit's AI Integrations**, a managed AI service that provides access to Google's Gemini models without requiring your own API key.

### What is Replit AI Integrations?

Replit AI Integrations is a managed service that:
- **No API Key Required**: You don't need to sign up for Google AI Studio or manage your own Gemini API keys
- **Simplified Billing**: AI usage is billed directly to your Replit credits
- **Easy Setup**: Works out of the box with environment variables automatically configured
- **Enterprise Features**: Includes rate limiting, error handling, and monitoring

### How It Works

Instead of calling Google's Gemini API directly, the application uses Replit's proxy service:

```typescript
// Traditional approach (requires your own API key)
// const ai = new GoogleGenAI({ apiKey: "YOUR_GEMINI_API_KEY" });

// Replit AI Integrations (no API key needed!)
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY!,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL!,
  },
});
```

The environment variables (`AI_INTEGRATIONS_GEMINI_API_KEY` and `AI_INTEGRATIONS_GEMINI_BASE_URL`) are automatically provided by Replit when you add the Gemini AI integration to your project.

### Benefits
- ✅ **Zero Configuration**: No API key management or signup required
- ✅ **Cost Control**: Usage billed to Replit credits with transparent pricing
- ✅ **Reliability**: Enterprise-grade infrastructure with automatic retries
- ✅ **Security**: API keys never exposed in your code or environment

## 🎨 Features

### Core Functionality
- **📤 Product Image Upload**: Drag-and-drop interface with validation (≥100x100px, ≤5MB)
- **🎯 Target Audience Customization**: Define age range, gender, and detailed persona
- **✍️ Ad Copywriting**: Create compelling headlines (up to 200 characters)
- **🎨 Template Library**: Choose from 7 pre-designed styles:
  - Minimalist Clean
  - Bold & Vibrant
  - Elegant Luxury
  - Playful & Fun
  - Modern Tech
  - Vintage Classic
  - Nature Organic
- **👥 Product Display Options**:
  - **Standalone**: Clean product photography (product only)
  - **On a Person**: Lifestyle shots with models wearing/using the product
- **💾 Multi-Format Export**: Download optimized images for:
  - Instagram Square (1:1 - 1080x1080px)
  - Instagram Story (9:16 - 1080x1920px)
  - Facebook Feed (4:5 - 1080x1350px)

### Technical Features
- **Real-time Preview**: See your generated ad instantly
- **Database Persistence**: All ad projects saved to PostgreSQL
- **Client & Server Validation**: Comprehensive error handling
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Ready**: UI supports light/dark themes

## 🏗️ Technical Architecture

### Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **AI**: Google Gemini via Replit AI Integrations
- **UI**: Tailwind CSS + shadcn/ui + Radix UI

### Project Structure
```
├── client/
│   └── src/
│       ├── components/      # React components
│       ├── pages/          # Page components
│       └── lib/            # Utilities and API client
├── server/
│   ├── index.ts           # Express server
│   ├── routes.ts          # API endpoints
│   ├── gemini.ts          # AI generation logic
│   └── storage.ts         # Database operations
└── shared/
    └── schema.ts          # Drizzle schema + Zod validation
```

### API Endpoints

#### `POST /api/generate-ad`
Generate a new ad creative using AI.

**Request Body:**
```json
{
  "productImageUrl": "data:image/png;base64,...",
  "targetAudience": {
    "ageMin": 18,
    "ageMax": 35,
    "gender": "male",
    "persona": "hip, young, professional"
  },
  "adText": "25% off for winter",
  "templateId": "uuid-optional",
  "productDisplay": "on-person"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,...",
  "projectId": "uuid"
}
```

#### `GET /api/templates`
Fetch all available design templates.

**Response:**
```json
{
  "templates": [
    {
      "id": "uuid",
      "name": "Minimalist Clean",
      "description": "Clean, simple design...",
      "style": "minimalist",
      "promptModifier": "..."
    }
  ]
}
```

## 🚀 Getting Started

### Prerequisites
- Replit account with AI Integrations enabled
- PostgreSQL database (automatically provided by Replit)

### Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Database**:
   Database URL is automatically set via `DATABASE_URL` environment variable by Replit.

3. **Sync Database Schema**:
   ```bash
   npm run db:push
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Server runs on port 5000, serving both API and frontend.

### Environment Variables
Automatically configured by Replit:
- `DATABASE_URL` - PostgreSQL connection string
- `AI_INTEGRATIONS_GEMINI_API_KEY` - Managed Gemini API key
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Replit's Gemini proxy endpoint
- `SESSION_SECRET` - Session encryption key

## 📊 Database Schema

### `ad_projects`
Stores generated ad campaigns.

```typescript
{
  id: varchar (UUID primary key)
  productImageUrl: text (base64 data URL)
  targetAudience: jsonb {
    ageMin: number
    ageMax: number
    gender: "male" | "female" | "all"
    persona: string
  }
  adText: text
  templateId: varchar (optional FK)
  generatedImageUrl: text (base64 data URL)
  generatedAt: timestamp
  createdAt: timestamp
}
```

### `ad_templates`
Pre-designed template styles.

```typescript
{
  id: varchar (UUID primary key)
  name: varchar
  description: text
  style: varchar
  promptModifier: text (AI prompt addition)
  previewImageUrl: text (optional)
  isActive: integer
  createdAt: timestamp
}
```

## 🎯 Usage Workflow

1. **Upload Product Image**: Click or drag-drop your product photo
2. **Choose Display Style**: Select "Standalone" or "On a Person"
3. **Set Target Audience**: Define age range, gender, and persona
4. **Write Ad Text**: Enter your headline (pre-filled with "25% off for winter")
5. **Select Template** (Optional): Choose a design style
6. **Generate**: Click "Generate Ad Creative"
7. **Download**: Export in your preferred format (Instagram/Facebook)

## 🔒 Security & Validation

- **Image Validation**: Size limits (≤5MB), dimension requirements (≥100x100px)
- **Format Support**: JPEG, PNG, WebP only
- **Input Sanitization**: All user inputs validated with Zod schemas
- **Error Handling**: Comprehensive client and server-side error messages
- **Database Constraints**: Age range validation, persona length checks

## 🎨 Design System

**Color Palette:**
- Primary: Vibrant Orange (`#FF6B35`)
- Secondary: Deep Blue (`#004E89`)
- Accent: Purple (`#805AD5`)

**Typography:**
- Display/Headings: Poppins (via Google Fonts)
- Body Text: Inter (via Google Fonts)

**UI Framework:**
- Component library: shadcn/ui
- Primitives: Radix UI
- Styling: Tailwind CSS

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- **Google Gemini**: AI models powering the generation
- **Replit**: AI Integrations platform and hosting
- **shadcn/ui**: Beautiful component library
- **Radix UI**: Accessible component primitives

---

**Built with ❤️ using Replit's AI Integrations**
