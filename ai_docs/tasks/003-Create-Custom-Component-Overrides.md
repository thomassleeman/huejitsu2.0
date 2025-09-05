# AI Task Planning Template

---

## 1. Task Overview

### Task Title

**Title:** Create Custom Component Overrides for Design System Integration

### Goal Statement

**Goal:** Create wrapper components for ShadCN components that integrate seamlessly with the design system state management, allowing for dynamic theming and enhanced functionality while maintaining ShadCN's core behavior and accessibility features. This will enable real-time preview updates and provide a foundation for advanced component customization.

---

## 2. Strategic Analysis & solution options

### Problem Context

The current ShadCN components are standard implementations that don't directly integrate with our Jotai-based design system state. While they work well with CSS custom properties, we need wrapper components that can dynamically respond to design token changes, provide enhanced functionality for the design system builder, and serve as a bridge between our state management and the component library.

### SOLUTION OPTIONS ANALYSIS

#### Option 1: Wrapper Components with Prop Overrides

**Approach:** Create wrapper components that extend ShadCN components with additional props and design system integration
**Pros:**

- Maintains full ShadCN compatibility
- Easy to implement and understand
- Allows for gradual migration
- Preserves all existing ShadCN features and accessibility

**Cons:**

- Requires creating wrapper for every component
- Slight complexity in component hierarchy
- May need to maintain both versions during transition

**Implementation complexity:** Low - Straightforward wrapper pattern
**Risk Level:** Low - No breaking changes to existing ShadCN components

#### Option 2: Fork and Modify ShadCN Components

**Approach:** Directly modify ShadCN component source code to include design system integration
**Pros:**

- Direct integration without wrapper layer
- Potentially cleaner API
- Full control over component behavior

**Cons:**

- Breaks compatibility with ShadCN updates
- Requires maintaining forked components
- Difficult to upgrade ShadCN in future
- Loss of community support and updates

**Implementation complexity:** Medium - Requires understanding ShadCN internals
**Risk Level:** High - Creates maintenance burden and upgrade challenges

#### Option 3: Custom Hook Integration

**Approach:** Create custom hooks that inject design system values into existing ShadCN components
**Pros:**

- Minimal component changes required
- Flexible integration approach
- Preserves ShadCN component structure

**Cons:**

- Requires manual hook usage in every component instance
- Less discoverable than component API
- Potential for inconsistent usage

**Implementation complexity:** Medium - Hook development and integration patterns
**Risk Level:** Medium - Relies on consistent developer usage

### Recommendation & Rationale

**RECOMMENDED SOLUTION:** Option 1 - Wrapper Components with Prop Overrides

**Why is this the best choice:**

1. **Maintainability** - Preserves ShadCN upgradability while adding our functionality
2. **Compatibility** - No breaking changes to existing components or usage patterns
3. **Gradual adoption** - Can be implemented incrementally without disrupting current code
4. **Clear separation** - Design system logic is separate from base component functionality

**Key Decision Factors:**

- **Performance Impact:** Minimal - wrapper components add negligible overhead
- **User Experience:** Enhanced - enables real-time design system updates in preview
- **Complexity & Maintainability:** Low - simple wrapper pattern that's easy to understand
- **Scalability:** High - pattern can be applied to all ShadCN components consistently
- **Security:** No impact - maintains ShadCN's existing security patterns
- **Cost:** Low - minimal development overhead with high value return

**Alternative consideration:**
Custom hooks (Option 3) could be useful for specific advanced use cases, but wrapper components provide a more consistent and discoverable API for the main use case.

---

## 3. Context & Problem Definition

### Problem Statement

Currently, our ShadCN components work with CSS custom properties but don't directly integrate with our Jotai-based design system state management. This creates a gap where:

1. Components can't dynamically respond to design token changes beyond CSS variables
2. We can't add design-system-specific functionality (like design token hints, validation, etc.)
3. The preview system lacks the ability to demonstrate advanced component features
4. Component behavior can't be influenced by design system state (e.g., showing validation based on contrast ratios)

### Success Criteria

- [ ] Create wrapper components for all existing ShadCN components (Button, Card, Input, Select, Slider, Dialog, Tooltip, Tabs)
- [ ] Wrappers maintain full ShadCN component API compatibility
- [ ] Integrate design system hooks for dynamic styling
- [ ] Add optional design-system-specific props for enhanced functionality
- [ ] Ensure accessibility features are preserved and enhanced
- [ ] Test wrapper components in ComponentShowcase with real-time updates
- [ ] Maintain performance with no noticeable rendering delays

---

## 4. Analysing the project before making changes

### Technology & Architecture

- **Frameworks & Versions:** Next.js 15 with App Router, React 19, TypeScript 5
- **Language:** TypeScript with strict mode enabled
- **Database & ORM:** Not applicable for this component-focused task
- **UI & Styling:** ShadCN/ui with Tailwind CSS 4, CSS variables for dynamic theming
- **Authentication:** Not applicable for this task
- **Key Architectural Patterns:** Jotai for state management, CSS custom properties for theming, react-resizable-panels for layout
- **Relevant Existing Components:**
  - ShadCN components in `/components/ui/` (button, card, dialog, input, select, slider, tabs, tooltip)
  - ComponentShowcase in `/components/preview/`
  - Design system atoms in `/atoms/design-system.ts`
- **Other relevant existing code:**
  - useDesignSystem hook in `/hooks/useDesignSystem.ts`
  - previewCSSAtom for CSS variable generation
  - TypeScript interfaces in `/types/design-system.ts`

### Fitting in with what is already there

The most efficient approach is to create wrapper components that extend the existing ShadCN components without modifying them. This preserves our ability to update ShadCN while adding design system integration. We should:

1. Create new wrapper components in `/components/ui/` that import and extend the base ShadCN components
2. Use the existing Jotai atoms and hooks for state integration
3. Leverage the existing CSS custom property system for dynamic styling
4. Maintain the existing component API while adding optional design-system-specific props

### Do we need to refactor existing code to achieve our aims while keeping the code as clean as possible?

Minimal refactoring is needed. We should:

1. **Rename existing ShadCN components** to `BaseButtom`, `BaseCard`, etc. to avoid naming conflicts
2. **Create new wrapper components** with the original names (`Button`, `Card`, etc.)
3. **Update ComponentShowcase** to use the new wrapper components
4. **Ensure backward compatibility** by maintaining identical APIs

This approach provides clean separation between base components and enhanced components while allowing gradual adoption.

---

## 5. Development Mode Context

- **Project Stage:** This is a new application in active development.
- **Breaking Changes:** Breaking changes are ok where absolutely necessary.
- **Data Handling:** Data loss acceptable where necessary.
- **User Base:** Users are internal staff, not end users.
- **Priority:** Prioritise speed and simplicity over data preservation.
- **Aggressive Refactoring Allowed:** delete/recreate components as needed where it makes sense to do so.

---

## 6. Frontend Changes

### New Components

**Wrapper Components** (in `/components/ui/`):

- Enhanced Button component with design system integration
- Enhanced Card component with dynamic theming
- Enhanced Input component with validation feedback
- Enhanced Select component with theme-aware styling
- Enhanced Slider component with design token integration
- Enhanced Dialog component with dynamic theming
- Enhanced Tooltip component with design system styling
- Enhanced Tabs component with design token integration

**Hook Components** (in `/components/builder/`):

- DesignSystemProvider wrapper for component context
- Enhanced component examples for preview system

### Component Features

Each wrapper component will include:

- Full API compatibility with original ShadCN component
- Integration with design system state via Jotai hooks
- Optional design-system-specific props (e.g., `dsTheme`, `dsVariant`)
- Enhanced accessibility with design system context
- Dynamic styling based on design tokens
- Performance optimization with proper memoization

### State Management

The wrapper components will integrate with the existing Jotai state management:

- Connect to `previewCSSAtom` for dynamic CSS variables
- Use `colorsAtom`, `componentsAtom` for styling decisions
- Implement proper state subscription for real-time updates
- Maintain component-level state for local interactions

---

## 7. Implementation Plan

### Phase 1: Foundation Setup (Week 1, Days 1-2)

1. **Rename existing ShadCN components**

   - Rename `button.tsx` to `base-button.tsx`
   - Rename all other UI components to `base-[component].tsx`
   - Update imports in existing files

2. **Create wrapper component structure**
   - Set up wrapper component template
   - Create enhanced component interfaces
   - Set up proper TypeScript types

### Phase 2: Core Component Wrappers (Week 1, Days 3-5)

3. **Implement Button wrapper**

   - Extend base Button with design system integration
   - Add dynamic theming capabilities
   - Test with different design tokens

4. **Implement Card wrapper**

   - Add dynamic background and border styling
   - Integrate with spacing and color systems
   - Test responsive behavior

5. **Implement Input wrapper**
   - Add validation feedback based on design system
   - Integrate with color system for states
   - Test accessibility features

### Phase 3: Advanced Components (Week 2, Days 1-3)

6. **Implement Select, Slider, Dialog wrappers**

   - Add complex state integration
   - Ensure proper event handling
   - Test interactive behaviors

7. **Implement Tooltip and Tabs wrappers**
   - Add dynamic positioning and styling
   - Integrate with typography system
   - Test cross-component consistency

### Phase 4: Integration and Testing (Week 2, Days 4-5)

8. **Update ComponentShowcase**

   - Replace base components with wrapper components
   - Add examples showcasing enhanced functionality
   - Test real-time design system updates

9. **Performance optimization and testing**
   - Implement proper memoization
   - Test rendering performance
   - Ensure no accessibility regressions

---

## 8. Task Completion Tracking

### Real-Time Progress Tracking

The AI coding agent should:

- Update progress after completing each component wrapper
- Test each wrapper component individually before moving to the next
- Verify that existing functionality is preserved
- Document any API changes or enhancements made
- Ensure ComponentShowcase properly demonstrates new capabilities

Track completion by verifying:

- [ ] All 8 wrapper components are created and functional
- [ ] Existing ShadCN API compatibility is maintained
- [ ] Design system integration works for real-time updates
- [ ] ComponentShowcase demonstrates enhanced functionality
- [ ] No accessibility regressions are introduced
- [ ] Performance remains optimal with new wrapper layer

---

## 9. File Structure & Organization

### New Files to Create:

```
components/ui/
├── base-button.tsx          # Renamed from button.tsx
├── base-card.tsx           # Renamed from card.tsx
├── base-dialog.tsx         # Renamed from dialog.tsx
├── base-input.tsx          # Renamed from input.tsx
├── base-select.tsx         # Renamed from select.tsx
├── base-slider.tsx         # Renamed from slider.tsx
├── base-tabs.tsx           # Renamed from tabs.tsx
├── base-tooltip.tsx        # Renamed from tooltip.tsx
├── button.tsx              # New wrapper component
├── card.tsx                # New wrapper component
├── dialog.tsx              # New wrapper component
├── input.tsx               # New wrapper component
├── select.tsx              # New wrapper component
├── slider.tsx              # New wrapper component
├── tabs.tsx                # New wrapper component
└── tooltip.tsx             # New wrapper component
```

### Files to Modify:

```
components/preview/ComponentShowcase.tsx  # Update to use new wrapper components
hooks/useDesignSystem.ts                  # Ensure compatibility with wrapper components
types/design-system.ts                    # Add wrapper component types if needed
```

### Files to Check for Import Updates:

```
All files importing from @/components/ui/* # Update if needed for base component usage
```

---
