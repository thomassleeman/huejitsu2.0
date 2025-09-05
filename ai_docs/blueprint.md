# hueJitsu - Application Blueprint & Development Plan

## Overview
This blueprint outlines the complete technical architecture and implementation plan for the hueJitsu MVP. It serves as the detailed companion to `huejitsu_masterplan.md`, focusing on the specific technical implementation details, file structure, and development workflow.

**Key Reference**: All features and objectives align with `huejitsu_masterplan.md` - consult that document for business logic, user requirements, and feature specifications.

## Technology Stack

### Core Framework
- **Framework**: Next.js 15 with App Router (TypeScript)
- **UI Library**: ShadCN/ui components
- **Styling**: Tailwind CSS with custom design token generation
- **Icons**: Lucide React (default for ShadCN compatibility)

### Backend & Database (Preferred: Supabase)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Real-time**: Supabase real-time subscriptions
- **File Storage**: Supabase Storage for export files
- **Edge Functions**: Supabase Edge Functions for export generation

### Alternative Backend Stack (If not Supabase)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk or NextAuth.js
- **Deployment**: Vercel
- **File Storage**: Vercel Blob or AWS S3

### Supporting Libraries
- **Color Manipulation**: `chroma-js` for color theory algorithms
- **Font Management**: `next/font` with Google Fonts API
- **UI Animation**: `framer-motion` for smooth interactions
- **Form Handling**: `react-hook-form` with `zod` validation
- **Layout**: `react-resizable-panels` for preview panel
- **Payment**: Stripe for subscription management

## Project Structure

```
huejitsu/
├── README.md
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── .env.local
├── .env.example
├── app/                        # Next.js 15 App Router
├── components/                 # React components
├── lib/                       # Utility functions and core logic
├── types/                     # TypeScript type definitions
├── hooks/                     # Custom React hooks
├── stores/                    # State management (TBD)
├── supabase/                  # Database schema and migrations
├── public/                    # Static assets
└── docs/                      # Development documentation
```

## Pages & Routes (App Router)

### Public Routes
```typescript
app/
├── page.tsx                   # Landing page with value prop
├── pricing/page.tsx           # Subscription plans and pricing
├── login/page.tsx            # User authentication
├── signup/page.tsx           # User registration
└── demo/page.tsx             # Public demo (optional)
```

### Protected Routes
```typescript
app/(authenticated)/
├── dashboard/page.tsx         # User's saved design systems
├── create/page.tsx           # Main design system builder
├── create/[id]/page.tsx      # Edit existing design system
├── settings/page.tsx         # Account settings
└── billing/page.tsx          # Subscription management
```

### API Routes
```typescript
app/api/
├── auth/                     # Authentication endpoints
│   ├── callback/route.ts     # OAuth callback
│   └── signout/route.ts      # Sign out handler
├── design-systems/           # Design system CRUD
│   ├── route.ts              # GET (list), POST (create)
│   └── [id]/route.ts         # GET, PUT, DELETE individual
├── exports/                  # Export generation
│   ├── tailwind/route.ts     # Tailwind config export
│   ├── css/route.ts          # CSS variables export
│   ├── shadcn/route.ts       # ShadCN global.css export
│   └── documentation/route.ts # Style guide export
├── fonts/                    # Google Fonts integration
│   └── search/route.ts       # Font search and pairing
└── webhooks/                 # External service webhooks
    └── stripe/route.ts       # Stripe payment webhooks
```

## Component Architecture

### Layout Components
```typescript
components/layout/
├── Header.tsx                 # Main app navigation
│   ├── Logo component
│   ├── Navigation menu
│   ├── User profile dropdown
│   └── Subscription status indicator
├── Footer.tsx                 # Site footer
├── Sidebar.tsx                # Design system builder navigation
│   ├── Tab navigation (Colors, Typography, etc.)
│   ├── Save/Export actions
│   └── Upgrade prompts
├── AuthLayout.tsx             # Wrapper for auth pages
└── DashboardLayout.tsx        # Wrapper for authenticated pages
```

### Core Builder Components
```typescript
components/builder/
├── DesignSystemBuilder.tsx    # Main builder container
├── TabNavigation.tsx          # Tab switching interface
├── PreviewPanel.tsx           # Resizable preview container
└── BuilderProvider.tsx        # Context provider for builder state

# Color System Components
├── color/
│   ├── ColorSystemTab.tsx     # Main color tab container
│   ├── ColorPicker.tsx        # HSL/RGB color picker
│   ├── HarmonyGenerator.tsx   # Color harmony algorithms
│   │   ├── Tetradic harmony
│   │   ├── Triadic harmony
│   │   ├── Complementary harmony
│   │   └── Analogous harmony
│   ├── SemanticColorMapper.tsx # Primary, secondary, accent mapping
│   ├── ContrastChecker.tsx    # WCAG compliance checker
│   └── ColorPalette.tsx       # Visual color swatch display

# Typography System Components
├── typography/
│   ├── TypographyTab.tsx      # Main typography container
│   ├── FontSelector.tsx       # Google Fonts integration
│   ├── FontPairings.tsx       # Curated font combinations
│   ├── TypeScale.tsx          # Heading hierarchy (H1-H6)
│   ├── LineHeightControls.tsx # Line height adjustments
│   └── FontPreview.tsx        # Live typography preview

# Spacing System Components
├── spacing/
│   ├── SpacingTab.tsx         # Main spacing container
│   ├── BaseUnitSelector.tsx   # 4pt, 6pt, 8pt selection
│   ├── ScaleGenerator.tsx     # Multiplier-based scale
│   ├── SpacingVisualizer.tsx  # Visual spacing demonstration
│   └── ComponentSpacing.tsx   # Padding/margin examples

# Component Styling Components
├── components/
│   ├── ComponentsTab.tsx      # Main components container
│   ├── BorderRadiusControl.tsx # Corner radius slider
│   ├── BorderWeightControl.tsx # Border thickness
│   ├── ShadowControls.tsx     # Elevation/shadow system
│   ├── OpacityControls.tsx    # Transparency levels
│   └── IconSystemControls.tsx # Icon styling options
```

### Preview System Components
```typescript
components/preview/
├── ComponentShowcase.tsx      # Main preview container
├── ShadcnComponents.tsx       # ShadCN component examples
│   ├── ButtonExamples.tsx     # Primary, secondary, outline, destructive
│   ├── FormElements.tsx       # Inputs, selects, checkboxes
│   ├── CardExamples.tsx       # Various card layouts
│   ├── NavigationExamples.tsx # Nav bars, breadcrumbs
│   └── TypographyExamples.tsx # Heading and text samples
├── ResponsivePreview.tsx      # Mobile/tablet/desktop views
├── InteractiveStates.tsx      # Hover, focus, active states
└── LiveStyleUpdater.tsx       # CSS custom property injector
```

### Export System Components
```typescript
components/export/
├── ExportModal.tsx            # Export format selection modal
├── ExportFormatCard.tsx       # Individual export format option
├── ExportProgress.tsx         # Generation progress indicator
├── ExportPreview.tsx          # Generated code preview
├── UpgradePrompt.tsx          # Paywall for premium exports
└── DownloadButton.tsx         # File download handler
```

### UI Components (ShadCN + Custom)
```typescript
components/ui/
├── [all-shadcn-components]    # Standard ShadCN components
├── ColorSwatch.tsx            # Color display with copy-to-clipboard
├── DesignTokenCard.tsx        # Token value display
├── SliderWithLabel.tsx        # Custom labeled slider
├── CodeBlock.tsx              # Syntax-highlighted code display
├── FeatureCard.tsx            # Landing page feature cards
├── PricingCard.tsx            # Subscription plan cards
└── LoadingSpinner.tsx         # Custom loading states
```

## Core Functions & Utilities

### Color System Logic
```typescript
lib/color/
├── harmony-algorithms.ts      # Color theory calculations
│   ├── generateTriadic()
│   ├── generateTetradic()
│   ├── generateComplementary()
│   └── generateAnalogous()
├── contrast-calculator.ts     # WCAG contrast ratios
│   ├── calculateContrast()
│   ├── checkAACompliance()
│   └── checkAAACompliance()
├── color-converter.ts         # Format conversions
│   ├── hexToRgb()
│   ├── rgbToHsl()
│   ├── hslToHex()
│   └── generateColorVariants()
├── semantic-mapping.ts        # Color role assignments
│   ├── generateSemanticPalette()
│   ├── assignColorRoles()
│   └── validateColorSystem()
└── accessibility-checker.ts   # Color accessibility validation
```

### Typography System Logic
```typescript
lib/typography/
├── font-pairings.ts           # Curated font combinations
│   ├── FONT_PAIRINGS constant
│   ├── getFontPairings()
│   ├── suggestPairing()
│   └── validateFontPair()
├── type-scale.ts              # Typography hierarchy
│   ├── generateTypeScale()
│   ├── calculateLineHeight()
│   └── generateTypographyTokens()
├── google-fonts-api.ts        # Google Fonts integration
│   ├── searchFonts()
│   ├── getFontDetails()
│   ├── generateFontUrl()
│   └── loadFont()
└── baseline-grid.ts           # Grid-based spacing
```

### Spacing System Logic
```typescript
lib/spacing/
├── scale-generator.ts         # Spacing scale calculations
│   ├── generateSpacingScale()
│   ├── validateBaseUnit()
│   └── generateSpacingTokens()
├── component-spacing.ts       # Component-specific spacing
│   ├── generatePaddingScale()
│   ├── generateMarginScale()
│   └── mapSpacingToComponents()
└── responsive-spacing.ts      # Responsive spacing utilities
```

### Export Generation Logic
```typescript
lib/exports/
├── tailwind-generator.ts      # Generate tailwind.config.js
│   ├── generateTailwindConfig()
│   ├── generateColorTokens()
│   ├── generateTypographyTokens()
│   ├── generateSpacingTokens()
│   └── generateComponentTokens()
├── css-generator.ts           # Generate CSS custom properties
│   ├── generateCSSVariables()
│   ├── generateColorCSS()
│   └── generateRootVariables()
├── shadcn-generator.ts        # Generate ShadCN global.css
│   ├── generateShadcnCSS()
│   ├── generateShadcnVariables()
│   └── mapToShadcnTokens()
├── scss-generator.ts          # Generate SCSS variables
├── js-generator.ts            # Generate JavaScript tokens
├── json-generator.ts          # Generate JSON export
└── documentation-generator.ts # Generate style guide docs
```

### Core Utilities
```typescript
lib/utils/
├── design-system.ts           # Core design system operations
│   ├── createDesignSystem()
│   ├── updateDesignSystem()
│   ├── validateDesignSystem()
│   └── mergeDesignSystems()
├── validation.ts              # Zod validation schemas
│   ├── designSystemSchema
│   ├── colorSystemSchema
│   ├── typographySystemSchema
│   └── userSchema
├── storage.ts                 # Browser storage utilities
│   ├── saveToLocalStorage()
│   ├── loadFromLocalStorage()
│   └── clearLocalStorage()
├── formatting.ts              # Value formatting helpers
│   ├── formatColorValue()
│   ├── formatSpacingValue()
│   └── formatFontSize()
└── constants.ts               # App-wide constants
```

## Database Schema (Supabase)

### Users Table (handled by Supabase Auth)
```sql
-- Extended user profile
create table user_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  subscription_tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Design Systems Table
```sql
create table design_systems (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references user_profiles(id) on delete cascade,
  name text not null,
  description text,
  design_tokens jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  is_public boolean default false
);

-- Add indexes for performance
create index design_systems_user_id_idx on design_systems(user_id);
create index design_systems_updated_at_idx on design_systems(updated_at);
```

### Design Token Structure (JSONB)
```typescript
interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    palette: Record<string, string>;
  };
  typography: {
    primaryFont: string;
    secondaryFont: string;
    typeScale: Record<string, { fontSize: string; lineHeight: string; }>;
  };
  spacing: {
    baseUnit: number;
    scale: number[];
    tokens: Record<string, string>;
  };
  components: {
    borderRadius: number;
    borderWidth: number;
    shadowStyle: string;
    opacityLevels: number[];
  };
  icons: {
    library: string;
    weight: string;
    sizeScale: number[];
  };
}
```

## API Design

### REST Endpoints
```typescript
// GET /api/design-systems
interface GetDesignSystemsResponse {
  data: DesignSystem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// POST /api/design-systems
interface CreateDesignSystemRequest {
  name: string;
  description?: string;
  design_tokens: DesignTokens;
}

// PUT /api/design-systems/[id]
interface UpdateDesignSystemRequest {
  name?: string;
  description?: string;
  design_tokens?: Partial<DesignTokens>;
}

// POST /api/exports/[format]
interface ExportRequest {
  design_system_id: string;
  format: 'tailwind' | 'css' | 'shadcn' | 'scss' | 'js' | 'json' | 'docs';
  options?: Record<string, any>;
}

interface ExportResponse {
  filename: string;
  content: string;
  download_url?: string; // For file downloads
}
```

### Supabase Edge Functions
```typescript
// /supabase/functions/generate-export/index.ts
interface ExportFunctionPayload {
  design_tokens: DesignTokens;
  export_type: string;
  user_id: string;
}
```

## Custom Hooks

```typescript
hooks/
├── useDesignSystem.ts         # Design system CRUD operations
├── useColorHarmony.ts         # Color harmony generation
├── useExportGeneration.ts     # Export file generation
├── useLocalStorage.ts         # Browser storage management
├── usePreview.ts              # Preview panel state
├── useSubscription.ts         # User subscription status
└── useDebounce.ts             # Debounced input handling
```

## Development Workflow

### Phase 1: Foundation (Weeks 1-2)
1. **Project Setup**
   - Initialize Next.js 15 with TypeScript
   - Configure Tailwind CSS and ShadCN
   - Set up Supabase project and local development
   - Implement basic authentication flow

2. **Core Layout**
   - Build responsive layout components
   - Implement resizable preview panel
   - Create tab navigation system
   - Set up routing structure

### Phase 2: Core Features (Weeks 3-6)
3. **Color System**
   - Implement color picker and harmony generation
   - Build contrast checking functionality
   - Create semantic color mapping interface
   - Add real-time preview updates

4. **Typography System**
   - Integrate Google Fonts API
   - Build font pairing recommendations
   - Implement type scale generation
   - Create typography preview components

### Phase 3: Advanced Features (Weeks 7-8)
5. **Spacing & Components**
   - Build spacing scale generator
   - Implement component styling controls
   - Create comprehensive component preview
   - Add icon system integration

6. **Export System**
   - Implement export format generators
   - Build export selection interface
   - Add file download functionality
   - Create upgrade prompts for premium features

### Phase 4: Polish & Launch (Weeks 9-10)
7. **Authentication & Payments**
   - Complete user authentication flow
   - Integrate Stripe subscription management
   - Implement design system saving/loading
   - Add user dashboard

8. **Testing & Optimization**
   - Comprehensive testing suite
   - Performance optimization
   - Mobile responsiveness
   - Error handling and validation

## File Structure Reference

```
huejitsu/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── create/page.tsx
│   │   ├── create/[id]/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── design-systems/
│   │   ├── exports/
│   │   └── webhooks/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   ├── builder/
│   ├── preview/
│   ├── export/
│   └── ui/
├── lib/
│   ├── color/
│   ├── typography/
│   ├── spacing/
│   ├── exports/
│   └── utils/
├── types/
│   ├── design-system.ts
│   ├── user.ts
│   └── api.ts
├── hooks/
├── supabase/
│   ├── migrations/
│   └── functions/
└── public/
    ├── fonts/
    └── images/
```

## Next Steps
1. Review and approve this blueprint
2. Set up development environment
3. Initialize project with chosen tech stack
4. Begin Phase 1 development
5. Regular progress reviews against masterplan objectives

---

*This blueprint should be updated as development progresses and technical decisions are finalized. It serves as the technical companion to the business requirements outlined in huejitsu_masterplan.md.*