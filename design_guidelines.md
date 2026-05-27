# Design Guidelines: Ad Creative Generator

## Design Approach
**Hybrid Creative-Utility System** - Inspired by Canva and Adobe Express, balancing professional productivity tools with creative visual appeal. This application requires both efficient workflow (utility) and inspiring creative environment (visual richness).

**Reference Products**: Canva's ad maker, Adobe Express, Figma's interface patterns for creator tools.

## Typography System

**Font Families**:
- Primary: Inter (body text, UI elements, forms)
- Display: Poppins (headings, CTAs, feature labels)

**Type Scale**:
- Hero/Display: text-5xl to text-6xl (Poppins, font-bold)
- Section Headers: text-3xl to text-4xl (Poppins, font-semibold)
- Card Titles: text-xl to text-2xl (Poppins, font-medium)
- Body Text: text-base (Inter, font-normal)
- Labels/Meta: text-sm (Inter, font-medium)
- Helper Text: text-xs (Inter, font-normal)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24 consistently throughout.
- Tight spacing: p-2, gap-2 (form labels, small UI)
- Standard spacing: p-4, gap-4 (cards, form fields)
- Section padding: p-6 to p-8 (containers, panels)
- Large spacing: p-12 to p-16 (major sections)
- Generous margins: mt-24 (section breaks)

**Dashboard Grid**:
- Left sidebar: 280px fixed width (navigation, templates)
- Main workspace: Flexible, min 800px
- Right panel: 360px (properties, settings) - collapsible
- Mobile: Single column stack, bottom navigation

## Component Library

### Navigation & Structure

**Top Header Bar**:
- Height: h-16
- Logo on left, user profile/credits on right
- Background with subtle gradient using primary/secondary colors
- Shadow: shadow-sm

**Left Sidebar**:
- Templates gallery (scrollable cards)
- Recent projects list
- "New Project" CTA button (primary orange, prominent)
- Category filters with icon + label

**Main Canvas Area**:
- Large preview card showing generated ad (aspect ratio 1:1 for Instagram, 4:5 for feed)
- Centered with max-w-5xl
- White background with shadow-lg
- Zoom controls in corner

### Form Components

**Product Upload Section**:
- Drag-and-drop zone with dashed border (border-2 border-dashed)
- Large icon (cloud upload) + instructional text
- Image preview thumbnails in grid (grid-cols-4 gap-4)
- Remove button overlays on hover

**Audience Input Form**:
- Card-based sections with rounded-xl borders
- Age range: Dual slider component
- Gender: Radio buttons with custom styling
- Persona: Textarea with character counter
- Each field group has label (font-medium) + helper text (text-gray-600)

**Ad Text Editor**:
- Rich textarea with formatting toolbar (optional bold/italic)
- Live character count (text-sm, color changes approaching limit)
- Preset message templates in dropdown
- Value proposition chips (removable tags)

### Action Components

**Generate Button**:
- Large, prominent (h-14, px-12)
- Primary orange background with gradient overlay
- Poppins font, text-lg, font-semibold
- Loading state with spinner animation
- Positioned prominently below inputs

**Download Options**:
- Format selector (Instagram Square, Story, Facebook Feed)
- Quality toggle (Standard/High)
- Download button (secondary deep blue)
- Batch download for multiple variations

### Preview & Results

**Generated Ad Display**:
- Full-size preview in 1:1 aspect ratio container
- Overlaid text rendering exactly as it will appear
- Before/After comparison slider
- Variation thumbnails below (grid-cols-3)
- Edit/Regenerate buttons beneath preview

**Variation Gallery**:
- Card grid showing 3-4 AI-generated options
- Hover: Scale and shadow increase
- Select state: Border highlight in accent purple
- Quick actions (download, edit, favorite)

## Visual Enhancements

**Gradient Accents**:
- Header: Subtle gradient from #FF6B35 to #FF8555
- CTA buttons: Diagonal gradient for depth
- Card hovers: Gentle gradient overlay

**Cards & Containers**:
- Border radius: rounded-xl (standard), rounded-2xl (featured)
- Shadows: shadow-md (cards), shadow-lg (modals), shadow-xl (elevated)
- Borders: 1px solid with subtle gray-200
- Padding: p-6 for content cards

**Interactive States**:
- Hover: Slight scale (scale-105), shadow increase
- Active: Reduced opacity, deeper shadow
- Disabled: opacity-50, cursor-not-allowed
- Focus: Ring with accent purple (ring-2 ring-purple-500)

## Images

**Hero Section**: Full-width banner (h-80) showing example ad creatives in a tilted card showcase. Demonstrates the tool's output quality with 3-4 sample ads arranged dynamically. Background uses gradient from light grey to white.

**Empty States**: Illustrations for "no uploads yet", "generating...", "no results" - simple, friendly line art style.

**Example Gallery**: Grid of professional ad templates below the fold, showing diverse industries and styles.

**Background**: Subtle geometric pattern in #F7F9FC for dashboard background, keeping interface professional yet modern.

## Accessibility

- All form inputs have visible labels
- Color contrast meets WCAG AA (charcoal text on light backgrounds)
- Focus indicators on all interactive elements
- Alt text for all generated ads
- Keyboard navigation for entire workflow

## Layout Flow

1. **Dashboard Entry**: Left sidebar + main canvas + right properties panel
2. **Workflow Steps**: Vertical progression through upload → audience → text → generate
3. **Results Display**: Large preview center, variations below, actions right
4. **Mobile**: Stack to single column, sticky generate button at bottom