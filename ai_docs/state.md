# hueJitsu - State Management Architecture

## Overview

This document outlines the state management decisions and implementation strategy for hueJitsu, focusing on minimal external dependencies while leveraging Next.js 13-15's native capabilities.

## Core Principle: Minimal External Dependencies

We can build hueJitsu with **only one external state library (Jotai)** thanks to Next.js's evolved capabilities for server state management.

## State Architecture

### 1. Server State: Next.js Native Features ✅

**No external library needed** - leveraging built-in Next.js capabilities.

#### Technologies Used:
- Server Components with automatic request deduplication
- Built-in `fetch` caching + experimental `use cache` directive
- `revalidatePath()` and `revalidateTag()` for cache invalidation
- React's native `useOptimistic` hook for optimistic updates
- Server Actions for mutations with automatic background updates

#### Implementation:

```typescript
// app/dashboard/page.tsx - Server Component
export default async function Dashboard() {
  // Automatically cached and deduped across components
  const designSystems = await getDesignSystems();
  const user = await getUserProfile();
  
  return (
    <div>
      <DesignSystemsList systems={designSystems} />
      <CreateSystemForm />
    </div>
  );
}

// lib/actions.ts - Server Actions
export async function saveDesignSystem(formData: FormData) {
  'use server';
  
  const system = {
    name: formData.get('name'),
    designTokens: JSON.parse(formData.get('tokens'))
  };
  
  // Save to database
  await db.designSystems.create(system);
  
  // Automatically invalidate cache
  revalidatePath('/dashboard');
  revalidateTag('design-systems');
  
  return system;
}

// components/DesignSystemsList.tsx - Optimistic Updates
'use client';
import { useOptimistic, useTransition } from 'react';

export function DesignSystemsList({ systems }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticSystems, addOptimisticSystem] = useOptimistic(
    systems,
    (state, newSystem) => [...state, newSystem]
  );

  const handleCreate = (formData: FormData) => {
    // 1. Update UI immediately (optimistic)
    addOptimisticSystem({
      id: Date.now().toString(),
      name: formData.get('name'),
      status: 'creating...'
    });
    
    // 2. Send to server in background
    startTransition(async () => {
      await saveDesignSystem(formData);
      // Next.js auto-revalidates and syncs real data
    });
  };

  return (
    <div>
      {optimisticSystems.map(system => (
        <SystemCard key={system.id} system={system} />
      ))}
      {isPending && <div>Creating...</div>}
    </div>
  );
}
```

### 2. Design System State: Jotai ✅

**Single external dependency** (~14kb) - chosen over useReducer for specific advantages.

#### Why Jotai:
- **Atomic data structure** - colors, typography, spacing are separate concerns
- **Excellent derived state** - color harmonies, contrast ratios, CSS variables
- **Surgical re-renders** - color changes don't re-render typography components
- **Built-in persistence** - `atomWithStorage` handles localStorage automatically
- **Natural composition** - easy to compose complex derived state

#### Implementation:

```typescript
// atoms/design-system.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Base atoms with automatic persistence
export const colorsAtom = atomWithStorage('huejitsu-colors', {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#FFFFFF',
  text: '#111827',
  palette: {}
});

export const typographyAtom = atomWithStorage('huejitsu-typography', {
  primaryFont: 'Inter',
  secondaryFont: 'Roboto Mono',
  typeScale: {
    h1: { fontSize: '2.5rem', lineHeight: '1.2' },
    h2: { fontSize: '2rem', lineHeight: '1.3' },
    h3: { fontSize: '1.5rem', lineHeight: '1.4' },
    body: { fontSize: '1rem', lineHeight: '1.6' }
  }
});

export const spacingAtom = atomWithStorage('huejitsu-spacing', {
  baseUnit: 8,
  scale: [4, 8, 16, 24, 32, 48, 64],
  tokens: {}
});

export const componentsAtom = atomWithStorage('huejitsu-components', {
  borderRadius: 8,
  borderWidth: 1,
  shadowStyle: 'subtle',
  opacityLevels: [0.1, 0.25, 0.5, 0.75, 0.9]
});

// Derived atoms (automatically update when dependencies change)
export const colorHarmonyAtom = atom((get) => {
  const colors = get(colorsAtom);
  return generateTriadicHarmony(colors.primary);
});

export const contrastRatiosAtom = atom((get) => {
  const colors = get(colorsAtom);
  return {
    primaryOnBackground: calculateContrast(colors.primary, colors.background),
    textOnPrimary: calculateContrast(colors.text, colors.primary),
    secondaryOnBackground: calculateContrast(colors.secondary, colors.background),
    accentOnBackground: calculateContrast(colors.accent, colors.background)
  };
});

export const previewCSSAtom = atom((get) => {
  const colors = get(colorsAtom);
  const typography = get(typographyAtom);
  const spacing = get(spacingAtom);
  const components = get(componentsAtom);
  
  return {
    // Color variables
    '--primary-color': colors.primary,
    '--secondary-color': colors.secondary,
    '--accent-color': colors.accent,
    '--background-color': colors.background,
    '--text-color': colors.text,
    
    // Typography variables
    '--font-primary': typography.primaryFont,
    '--font-secondary': typography.secondaryFont,
    '--text-h1': typography.typeScale.h1.fontSize,
    '--line-height-h1': typography.typeScale.h1.lineHeight,
    
    // Spacing variables
    '--spacing-base': `${spacing.baseUnit}px`,
    '--spacing-sm': `${spacing.scale[0]}px`,
    '--spacing-md': `${spacing.scale[1]}px`,
    '--spacing-lg': `${spacing.scale[2]}px`,
    
    // Component variables
    '--border-radius': `${components.borderRadius}px`,
    '--border-width': `${components.borderWidth}px`
  };
});

// Computed export data
export const exportDataAtom = atom((get) => {
  const colors = get(colorsAtom);
  const typography = get(typographyAtom);
  const spacing = get(spacingAtom);
  const components = get(componentsAtom);
  
  return {
    tailwind: generateTailwindConfig({ colors, typography, spacing, components }),
    css: generateCSSVariables({ colors, typography, spacing, components }),
    shadcn: generateShadcnCSS({ colors, typography, spacing, components }),
    scss: generateSCSSVariables({ colors, typography, spacing, components }),
    json: { colors, typography, spacing, components }
  };
});
```

#### Component Usage:

```typescript
// components/builder/ColorTab.tsx
'use client';
import { useAtom, useAtomValue } from 'jotai';
import { colorsAtom, colorHarmonyAtom, contrastRatiosAtom } from '@/atoms/design-system';

export function ColorTab() {
  const [colors, setColors] = useAtom(colorsAtom);
  const harmony = useAtomValue(colorHarmonyAtom); // Auto-updates when primary changes
  const contrasts = useAtomValue(contrastRatiosAtom); // Auto-updates when colors change
  
  const handlePrimaryColorChange = (newColor: string) => {
    setColors(prev => ({ ...prev, primary: newColor }));
    // harmony and contrasts automatically recalculate
  };
  
  return (
    <div>
      <ColorPicker 
        color={colors.primary}
        onChange={handlePrimaryColorChange}
      />
      <ColorHarmony colors={harmony} />
      <ContrastChecker ratios={contrasts} />
    </div>
  );
}

// components/builder/TypographyTab.tsx
'use client';
import { useAtom } from 'jotai';
import { typographyAtom } from '@/atoms/design-system';

export function TypographyTab() {
  const [typography, setTypography] = useAtom(typographyAtom);
  // Only re-renders when typography changes, not colors or spacing
  
  return (
    <div>
      <FontSelector 
        font={typography.primaryFont}
        onChange={(primaryFont) => 
          setTypography(prev => ({ ...prev, primaryFont }))
        }
      />
      <TypeScaleEditor 
        scale={typography.typeScale}
        onChange={(typeScale) => 
          setTypography(prev => ({ ...prev, typeScale }))
        }
      />
    </div>
  );
}

// components/preview/PreviewPanel.tsx
'use client';
import { useAtomValue } from 'jotai';
import { previewCSSAtom } from '@/atoms/design-system';

export function PreviewPanel() {
  const cssVars = useAtomValue(previewCSSAtom);
  
  useEffect(() => {
    // Automatically updates when any design system part changes
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [cssVars]);
  
  return (
    <div className="preview-container">
      <ComponentShowcase />
    </div>
  );
}
```

### 3. UI/Navigation State: Local Component State ✅

**No external library needed** - using React's built-in state management.

#### Implementation:

```typescript
// components/builder/DesignSystemBuilder.tsx
'use client';
export function DesignSystemBuilder() {
  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const [previewPanelWidth, setPreviewPanelWidth] = useState(400);
  const [showPreview, setShowPreview] = useState(true);
  
  return (
    <div className="builder-container">
      <TabNavigation 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />
      
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60}>
          <TabContent activeTab={activeTab} />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel 
          defaultSize={40} 
          minSize={20}
          collapsible={true}
        >
          <PreviewPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

// components/export/ExportModal.tsx
'use client';
export function ExportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('tailwind');
  const [isExporting, setIsExporting] = useState(false);
  
  const exportData = useAtomValue(exportDataAtom);
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = exportData[selectedFormat];
      await downloadFile(data, selectedFormat);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Export format selection and download logic */}
    </Dialog>
  );
}

// components/builder/ColorPicker.tsx - Form state
'use client';
import { useForm } from 'react-hook-form';

export function ColorPicker({ color, onChange }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [tempColor, setTempColor] = useState(color);
  
  const form = useForm({
    defaultValues: { color },
    mode: 'onChange'
  });
  
  const handleColorCommit = (newColor: string) => {
    onChange(newColor);
    setIsPickerOpen(false);
  };
  
  return (
    <div>
      <ColorSwatch 
        color={color}
        onClick={() => setIsPickerOpen(true)}
      />
      
      {isPickerOpen && (
        <ColorPickerPopover
          color={tempColor}
          onChange={setTempColor}
          onCommit={handleColorCommit}
          onCancel={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  );
}
```

## State Flow Processes

### 1. Design System Updates Process

```
User Input (Color Picker) 
  ↓
Update colorsAtom
  ↓
Derived atoms automatically recalculate:
  - colorHarmonyAtom
  - contrastRatiosAtom  
  - previewCSSAtom
  ↓
Components re-render with new values:
  - ColorTab (harmony display)
  - PreviewPanel (CSS variables)
  - ContrastChecker (accessibility info)
```

### 2. Save Design System Process

```
User clicks "Save"
  ↓
Read current design system atoms
  ↓
Create optimistic update (useOptimistic)
  ↓
Call Server Action in background
  ↓
Server Action saves to database
  ↓
revalidatePath() invalidates cache
  ↓
Server Components refetch data
  ↓
UI syncs with real server state
```

### 3. Export Generation Process

```
User selects export format
  ↓
Read exportDataAtom (derived from all atoms)
  ↓
exportDataAtom automatically computes:
  - Tailwind config
  - CSS variables
  - ShadCN CSS
  - SCSS variables
  ↓
Download generated file
```

## Component State Dependencies

### Components Using Server State:
- `Dashboard` - List of saved design systems
- `DesignSystemsList` - CRUD operations on systems  
- `UserProfile` - User account info
- `SubscriptionStatus` - Billing information

### Components Using Design System State (Jotai):
- `ColorTab` → `colorsAtom`, `colorHarmonyAtom`, `contrastRatiosAtom`
- `TypographyTab` → `typographyAtom`
- `SpacingTab` → `spacingAtom`
- `ComponentsTab` → `componentsAtom`
- `PreviewPanel` → `previewCSSAtom` (derived from all atoms)
- `ExportModal` → `exportDataAtom` (derived from all atoms)

### Components Using Local State:
- `DesignSystemBuilder` - Active tab, panel sizes
- `ColorPicker` - Picker open state, temp color
- `FontSelector` - Dropdown state, search query
- `Modal` components - Open/close state
- `Form` components - Form validation, loading states

## Benefits of This Architecture

### 1. **Minimal Bundle Size**
- Only one external state library (Jotai ~14kb)
- No redundant server state libraries
- Leverages built-in Next.js capabilities

### 2. **Optimal Performance**
- Surgical re-renders with Jotai's atomic updates
- Automatic request deduplication with Server Components
- Built-in caching with Next.js

### 3. **Developer Experience**
- Automatic persistence with `atomWithStorage`
- Built-in optimistic updates with `useOptimistic`
- Simple mental model: server state vs client state

### 4. **Maintainable**
- Clear separation of concerns
- Predictable state updates
- Easy to test individual atoms

### 5. **Future-Proof**
- Built on React/Next.js primitives
- Easy to add complexity when needed
- No vendor lock-in with state libraries

## Migration Path

### Phase 1: Start Simple
```typescript
// Single atom approach
export const designSystemAtom = atomWithStorage('huejitsu-design-system', {
  colors: defaultColors,
  typography: defaultTypography,
  spacing: defaultSpacing,
  components: defaultComponents
});
```

### Phase 2: Split When Needed
```typescript
// Break into focused atoms for better performance
export const colorsAtom = focusAtom(designSystemAtom, (optic) => optic.prop('colors'));
export const typographyAtom = focusAtom(designSystemAtom, (optic) => optic.prop('typography'));
```

### Phase 3: Add Complexity As Required
- Real-time collaboration state (when multiplayer features are added)
- More sophisticated caching strategies (if needed)
- Team management state (for enterprise features)

## Testing Strategy

### Server State Testing:
- Test Server Actions with Next.js test utilities
- Mock database calls
- Test optimistic update behavior

### Design System State Testing:
```typescript
// Test individual atoms
import { colorsAtom, colorHarmonyAtom } from '@/atoms/design-system';

test('colorHarmonyAtom updates when primary color changes', () => {
  const store = getDefaultStore();
  
  // Set initial color
  store.set(colorsAtom, { ...defaultColors, primary: '#FF0000' });
  
  // Check derived value
  const harmony = store.get(colorHarmonyAtom);
  expect(harmony).toEqual(expectedTriadicColors);
});
```

### UI State Testing:
- Standard React Testing Library for component state
- Test user interactions and state changes
- Mock Jotai atoms for isolation

This architecture provides a solid foundation for hueJitsu that's both performant and maintainable, while staying aligned with modern React and Next.js best practices.