# 009-Add-Background-Theme-Preference-Control

---

## 1. Task Overview

### Task Title

**Title:** Add Background Theme Preference Control

### Goal Statement

**Goal:** Implement user controls for background theme preference (light, dark, or random) to eliminate the frustration of repeatedly pressing spacebar to get the desired background color scheme. This gives users immediate control over theme direction while maintaining the option for random exploration, improving the creative workflow without disrupting existing color generation or pinning functionality.

---

## 2. Solution Approach

### Implementation Strategy

**Approach:** Create a new atom for background theme preference with three options (light, dark, random), add UI controls in ColorTab, and modify the generation logic to respect this preference.

**Benefits:**
- Clean separation of concerns using existing Jotai architecture
- Maintains backward compatibility with existing random behavior
- Works seamlessly with existing pinning system
- Provides immediate user control without disrupting workflow
- Leverages existing localStorage persistence pattern
- Non-breaking change that enhances existing functionality

---

## 3. Context & Problem Definition

### Problem Statement

Users creating design systems often have a specific theme direction in mind (light mode for their light theme, dark mode for their dark theme) but the current system randomly generates background themes. This forces users to repeatedly press spacebar until they get their desired theme, which is frustrating and disrupts the creative flow. For design professionals building design systems, this lack of control over fundamental theme direction significantly hampers productivity and user experience.

### Success Criteria

- [ ] Users can select light, dark, or random background theme preference
- [ ] Theme preference persists across sessions using localStorage
- [ ] Color generation respects the selected theme preference
- [ ] Random option maintains current 70% light / 30% dark behavior
- [ ] Existing pinning system continues to work unchanged
- [ ] Spacebar generation respects theme preference
- [ ] UI controls are intuitive and fit naturally into existing ColorTab layout

---

## 4. Analysing the project before making changes

### Technology & Architecture

- **Frameworks & Versions:** Next.js 15 with App Router, React 19.1.0, TypeScript 5
- **Language:** TypeScript with strict mode enabled
- **Database & ORM:** Not applicable for this client-side feature
- **UI & Styling:** ShadCN/ui components with Tailwind CSS v4
- **Authentication:** Not applicable for this feature
- **Key Architectural Patterns:** Jotai atomic state management with localStorage persistence, client components for interactive functionality
- **Relevant Existing Components:**
  - `components/builder/color/ColorTab.tsx` - Current color interface that needs the new controls
  - `atoms/design-system.ts` - Contains color and pinning state atoms with localStorage persistence
  - `lib/color/generateColorVariation.ts` - Color generation logic that needs modification
- **Other relevant existing code:**
  - Existing color scheme dropdown and controls pattern in ColorTab
  - `atomWithStorage` pattern for persistent preferences
  - Random background generation logic in generateColorVariation

### Fitting in with what is already there

The implementation should follow the existing patterns exactly:

1. **State Management:** Create `backgroundThemePreferenceAtom` using `atomWithStorage` pattern like other preference atoms
2. **UI Integration:** Add theme preference selector near existing color scheme controls in ColorTab
3. **Generation Logic:** Modify `generateColorVariation.ts` to check theme preference before random logic
4. **Component Patterns:** Use existing ShadCN Select component to match the color scheme dropdown

This leverages the existing architecture perfectly without introducing new patterns or complexity.

### Do we need to refactor existing code to achieve our aims while keeping the code as clean as possible?

No significant refactoring required. The changes are additive and follow existing patterns:

1. **Add new atom** - Following existing `atomWithStorage` pattern used for other preferences
2. **Extend generation logic** - Small modification to existing random logic in one function
3. **Add UI controls** - Using existing component patterns from ColorTab

This approach maintains code cleanliness by reusing established patterns rather than creating new architectural approaches.

---

## 5. Development Mode Context

- **Project Stage:** This is a new application in active development.
- **Breaking Changes:** Breaking changes are ok where absolutely necessary.
- **Data Handling:** Data loss acceptable where necessary.
- **User Base:** Users are internal staff, not end users.
- **Priority:** Prioritise speed and simplicity over data preservation.
- **Aggressive Refactoring Allowed:** delete/recreate components as needed where it makes sense to do so.

---

## 8. Frontend Changes

### New Components

No new components needed - using existing ShadCN Select component for UI controls.

### Page Updates

- `components/builder/color/ColorTab.tsx` - Add background theme preference selector in the color scheme controls section

### State Management

**New Atom:**
- `backgroundThemePreferenceAtom` - Stores user's theme preference ('light' | 'dark' | 'random')
- Uses `atomWithStorage` for localStorage persistence
- Defaults to 'random' to maintain current behavior

**Data Flow:**
1. User selects theme preference in ColorTab UI
2. Preference stored in atom and persisted to localStorage  
3. `generateColorVariation` function reads preference during generation
4. Theme logic respects preference instead of using pure random

---

## 9. Implementation Plan

### Phase 1: State Management

1. **Add background theme preference atom**
   - Create `backgroundThemePreferenceAtom` in `atoms/design-system.ts`
   - Use `atomWithStorage` pattern for persistence
   - Set default value to 'random'

### Phase 2: Generation Logic Update

2. **Modify color generation function**
   - Update `generateColorVariation.ts` to read theme preference
   - Replace random `shouldUseLightTheme` logic with preference-based logic
   - Maintain random behavior when 'random' is selected

### Phase 3: UI Controls

3. **Add theme preference selector to ColorTab**
   - Add Select component near existing color scheme dropdown
   - Create options for "Light Background", "Dark Background", "Random"
   - Connect to backgroundThemePreferenceAtom
   - Style consistently with existing controls

### Phase 4: Testing and Polish

4. **Test integration and functionality**
   - Verify theme preference persists across page refreshes
   - Test spacebar generation respects preference
   - Ensure pinning system continues to work
   - Test with all three preference options

---

## 10. Task Completion Tracking

### Real-Time Progress Tracking

Update progress as each phase completes:

- [ ] Phase 1: Background theme preference atom created and configured
- [ ] Phase 2: Color generation logic updated to respect theme preference  
- [ ] Phase 3: UI controls added to ColorTab and properly connected
- [ ] Phase 4: Testing completed and all functionality verified

Report any issues or unexpected findings during implementation.

---

## 11. File Structure & Organization

### Files to Create:

None - all changes are modifications to existing files.

### Files to Modify:

- `atoms/design-system.ts` - Add `backgroundThemePreferenceAtom` with localStorage persistence
- `lib/color/generateColorVariation.ts` - Update generation logic to respect theme preference
- `components/builder/color/ColorTab.tsx` - Add theme preference selector UI controls

### Files to Test:

- Theme preference persistence across page refreshes
- Color generation with all three preference options (light, dark, random)
- Integration with existing pinning functionality
- Spacebar generation workflow with theme preferences
- UI integration and styling consistency with existing controls

---