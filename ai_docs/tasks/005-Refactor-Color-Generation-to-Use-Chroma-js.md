# AI Task Planning Template

---

## 1. Task Overview

### Task Title

**Title:** Refactor Color Generation System to Use Chroma-js

### Goal Statement

**Goal:** Replace the current manual HSL-to-hex color calculations with chroma-js library to align with the masterplan architecture, improve color theory accuracy, and provide a more robust foundation for advanced color harmony generation and accessibility features.

---

## 2. Strategic Analysis & solution options

### Problem Context

The current color generation system in `generateColorVariation.ts` uses manual HSL-to-hex conversion and basic mathematical calculations for color harmony generation. However, the masterplan and blueprint specifically call for using chroma-js for color manipulation and theory algorithms. This misalignment creates technical debt and limits the system's ability to implement advanced color features like proper contrast checking, accessibility validation, and more sophisticated color theory calculations.

### SOLUTION OPTIONS ANALYSIS

#### Option 1: Complete Refactor with Chroma-js

**Approach:** Replace all manual color calculations with chroma-js methods, restructure the color generation architecture to match the blueprint's planned structure with separate files for harmony algorithms, contrast calculation, and color conversion.

**Pros:**

- Aligns perfectly with masterplan architecture
- Provides access to advanced color theory methods
- Better color accuracy and mathematical precision
- Enables future accessibility features
- More maintainable and extensible code

**Cons:**

- Requires rewriting significant portions of existing code
- May temporarily break existing functionality during transition

**Implementation complexity:** Medium - Well-defined scope but requires careful refactoring

**Risk Level:** Low - chroma-js is a mature, well-tested library with excellent documentation

#### Option 2: Gradual Migration

**Approach:** Keep existing functions but gradually replace internal calculations with chroma-js while maintaining the same API surface.

**Pros:**

- Minimal disruption to existing code
- Lower immediate risk
- Can be done incrementally

**Cons:**

- Doesn't fully leverage chroma-js capabilities
- Maintains technical debt temporarily
- Doesn't align with blueprint architecture

**Implementation complexity:** Low - Minimal structural changes

**Risk Level:** Low - Backwards compatible approach

#### Option 3: Hybrid Approach

**Approach:** Implement new chroma-js based functions alongside existing ones, then gradually deprecate the old system.

**Pros:**

- Allows testing new implementation without breaking existing
- Provides fallback options
- Gradual transition possible

**Cons:**

- Code duplication during transition period
- More complex codebase temporarily
- Doesn't address architectural alignment immediately

**Implementation complexity:** Medium - Managing dual implementations

**Risk Level:** Medium - More complex codebase during transition

### Recommendation & Rationale

**RECOMMENDED SOLUTION:** Option 1 - Complete Refactor with Chroma-js

**Why is this the best choice:**

1. **Architectural Alignment** - Directly implements the blueprint's planned structure with separate files for different color operations
2. **Technical Foundation** - Provides the robust foundation needed for future accessibility and advanced color features
3. **Code Quality** - Eliminates technical debt and provides more maintainable, testable code
4. **Future-Proofing** - Enables implementation of advanced features outlined in the masterplan

**Key Decision Factors:**

- **Performance Impact:** chroma-js is optimized and will likely perform better than manual calculations
- **User Experience:** More accurate color harmony generation and better color relationships
- **Complexity & Maintainability:** Cleaner, more modular architecture that matches the blueprint
- **Scalability:** Better foundation for future color features like accessibility checking
- **Security:** Using a well-tested library reduces risk of calculation errors
- **Cost:** No additional cost, chroma-js is already installed

**Alternative consideration:**
Option 2 could be chosen if there are time constraints, but given this is a new application in active development where breaking changes are acceptable, the complete refactor provides the best long-term value.

---

## 3. Context & Problem Definition

### Problem Statement

The current color generation system uses manual HSL-to-hex calculations and basic mathematical operations for color harmony generation. This approach:

1. **Doesn't align with the masterplan specification** which explicitly calls for chroma-js
2. **Limits color accuracy** due to manual calculation precision issues
3. **Prevents implementation of advanced features** like proper contrast checking and accessibility validation
4. **Creates technical debt** by not following the planned architecture in the blueprint
5. **Misses opportunities for better color theory** that chroma-js provides

The system needs to be refactored to use chroma-js while maintaining existing functionality and preparing for future enhancements outlined in the masterplan.

### Success Criteria

- [ ] All color generation functions use chroma-js instead of manual calculations
- [ ] Color harmony generation produces more accurate results
- [ ] Code structure aligns with blueprint architecture (separate files for different color operations)
- [ ] Existing color generation API remains compatible
- [ ] All existing tests continue to pass
- [ ] Foundation is prepared for future contrast checking and accessibility features
- [ ] Performance is maintained or improved

---

## 4. Analysing the project before making changes

### Technology & Architecture

- **Frameworks & Versions:** Next.js 15 with App Router, TypeScript
- **Language:** TypeScript 5
- **Database & ORM:** Not applicable for this color system refactor
- **UI & Styling:** Tailwind CSS 4, ShadCN/ui components
- **Authentication:** Not applicable for this task
- **Key Architectural Patterns:** Next.js App Router, modular lib structure, atomic design system
- **Relevant Existing Components:**
  - `generateColorVariation.ts` - Main color generation logic
  - `ColorTab.tsx` - UI component that uses color generation
  - `design-system.ts` types - Color system type definitions
- **Other relevant existing code:**
  - chroma-js is already installed (v3.1.2) with TypeScript types
  - Jotai for state management
  - ColorSystem and related TypeScript interfaces

### Fitting in with what is already there

The current `generateColorVariation.ts` file contains all color logic in a single file with manual calculations. The blueprint calls for a more modular structure with separate files for:

- `harmony-algorithms.ts` - Color theory calculations
- `contrast-calculator.ts` - WCAG contrast ratios
- `color-converter.ts` - Format conversions
- `semantic-mapping.ts` - Color role assignments
- `accessibility-checker.ts` - Color accessibility validation

The most efficient approach is to refactor the existing monolithic file into this modular structure while introducing chroma-js, rather than trying to incrementally modify the existing structure.

### Do we need to refactor existing code to acheive our aims while keeping the code as clean as possible?

Yes, refactoring is necessary and beneficial:

**Proposed refactoring:**

1. **Split the monolithic file** into the blueprint's planned structure
2. **Replace manual calculations** with chroma-js methods
3. **Maintain the same public API** so existing components continue to work
4. **Add proper TypeScript types** for chroma-js integration

**Trade-off analysis:**

- **Additional work:** Moderate - requires restructuring and rewriting calculation logic
- **Benefits:**
  - Aligns with masterplan architecture
  - Enables future accessibility features
  - More maintainable and testable code
  - Better color accuracy
  - Prepares for advanced color theory features

The benefits strongly outweigh the additional work, especially given this is a new application where breaking changes are acceptable.

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

**New utility files to be created (following blueprint architecture):**

- `lib/color/harmony-algorithms.ts` - Core color theory calculations using chroma-js
- `lib/color/color-converter.ts` - Format conversions and color manipulation utilities
- `lib/color/contrast-calculator.ts` - Basic contrast calculation functions (foundation for future WCAG features)

### State Management

The color generation functions are pure utilities that don't require state management changes. The existing Jotai atoms in the color tab component will continue to work with the refactored functions as the public API will remain the same.

---

## 7. Implementation Plan

### Phase 1: Set up new modular structure (1-2 hours)

1. Create new files according to blueprint architecture:
   - `lib/color/harmony-algorithms.ts`
   - `lib/color/color-converter.ts`
   - `lib/color/contrast-calculator.ts`

### Phase 2: Implement chroma-js based color functions (2-3 hours)

2. Implement color conversion utilities using chroma-js in `color-converter.ts`
3. Implement color harmony algorithms using chroma-js in `harmony-algorithms.ts`
4. Add basic contrast calculation functions in `contrast-calculator.ts`

### Phase 3: Refactor main generation function (1-2 hours)

5. Update `generateColorVariation.ts` to use the new modular functions
6. Ensure the public API remains compatible with existing components
7. Remove old manual calculation code

### Phase 4: Testing and validation (1 hour)

8. Test color generation with existing components
9. Verify color accuracy improvements
10. Ensure no breaking changes to existing functionality

---

## 8. Task Completion Tracking

### Real-Time Progress Tracking

Update progress as each phase completes:

- [ ] Phase 1: New file structure created
- [ ] Phase 2: Chroma-js functions implemented
- [ ] Phase 3: Main generation function refactored
- [ ] Phase 4: Testing completed and verified

Report any issues or unexpected findings during implementation.

---

## 9. File Structure & Organization

### Files to be created:

- `/lib/color/harmony-algorithms.ts` - Color theory calculations using chroma-js
- `/lib/color/color-converter.ts` - Format conversions and utilities
- `/lib/color/contrast-calculator.ts` - Basic contrast calculations

### Files to be modified:

- `/lib/color/generateColorVariation.ts` - Refactor to use new modular functions and chroma-js
- Update imports in any files that import from generateColorVariation.ts if needed

### Files to be removed:

- None (refactoring existing code)

---
