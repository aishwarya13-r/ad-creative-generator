# Ad Creative Generator

An AI-powered tool that generates professional social media ad creatives from your product images.

## How to Use

1. **Upload a product image** — drag and drop or click to upload (JPEG, PNG, or WebP, max 5MB)
2. **Set your target audience** — choose age range, gender, and describe your ideal customer
3. **Write your ad headline** — enter the text you want featured in the ad
4. **Pick a template** — select a design style that fits your brand
5. **Generate** — click Generate Ad and wait a few seconds for the AI to create your creative
6. **Download** — choose your format (Instagram Square, Instagram Story, Facebook Feed, or full original) and download

## Setup

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5000`.

## Requirements

- Node.js 18+
- PostgreSQL database (`DATABASE_URL` env var)
- Google Gemini API access (`AI_INTEGRATIONS_GEMINI_API_KEY` and `AI_INTEGRATIONS_GEMINI_BASE_URL` env vars)
