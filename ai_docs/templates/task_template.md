# AI Task Planning Template

<!--

AI Agent: You have been instructed to use this document because we are discussing some work to be done for the project we are currently working on. By using this template you will create a 'task', which is a detailed markdown document to be used as a prompt by an AI coding agent to complete the work. This is intended as a way to structure the requirement so that it can be processed by the AI agent in a way that is consistent and predictable.

IMPORTANT:Before doing anything else!!! Read through the following documents associated with the project to get an understanding of the relevant context:
Mandatory: masterplan.md - provides a background to the project and the objectives of the project.
Mandatory: blueprint.md - Gives details of the stack and architecture of the project.
Optional, ignore if the task has nothing to do with state: state.md - Gives details of the state management architecture of the project.

In order to use the templpate you must:
If you cannot access this file, ask me to share it with you.
1. Work through each section of the template, filling in the relevant information as you go.
2. Ask any questions if you feel there is not enough information to complete the template or if you feel the task risks being ambiguous.
3. Remove all comments from the final document before saving.
4. When you have completed the template, save the task as a markdown file with the name of the task.
5. If you have access to the project itself, save the file to ai_docs/tasks/[task-name].md if you do not have access to the project, create the markdown file and I will load it into the project myself.
6. If you have access to the project, apply a number to the task which is 1 higher than the number of the highest task in the tasks folder. In this way it can clearly be seen which order tasks have been created in. Use 3 digits for the number, padded with zeros. If there are no tasks in the folder, start at 001. Apply this numbering system to the task file name. So for example, if you decide to name the task 'Add User Authentication System', you would save it to aiDocs/tasks/001-Add-User-Authentication-System.md.
7. Give the user the opportunity to read the created task before you go ahead with the work.
-->

---

## 1. Task Overview

### Task Title

<!-- Give your task a clear, specific name that describes what you're building or fixing -->

**Title:** [Brief, descriptive title - e.g., "Add User Authentication System" or "Fix Payment Integration Bug"]

### Goal Statement

<!-- Write one paragraph explaining what you want to achieve and why it matters for your project -->

**Goal:** [Clear statement of the end result you want and the business/user value it provides]

---

## 2. Strategic Analysis & solution options

<!--
Use your judgment to determine when strategic analysis is needed vs direct implementation.

**CONDUCT STRATEGIC ANALYSIS WHEN:**
-Multiple viable technical approaches exist
-Trade offs between different solutions are significant
-User requirements could be met through different UX patterns
-Architectural decisions will impact future development
-Implementation approach affects performance, security, or maintainability significantly
-Change touches multiple systems or has broad impact
-User has expressed uncertainty about the best approach

**SKIP STRATEGIC ANALYSIS WHEN:**
-Only one obvious technical solution exists
-It’s a straight-forward bug fix or minor enhancement
-The implementation pattern is clearly established in the codebase
-Change is small and isolated with minimal impact
-User has already specified the exact approach they want
-Giving options would complicate the process unnecessarily

**DEFAULT BEHAVIOUR:** When in doubt, provide strategic analysis. It’s better to oner-communicate than to assume.
–>

###Problem Context
<!-- Restate the problem and why it needs strategic consideration -->

[Restate the problem and why it needs strategic consideration. What makes this decition important?]

### SOLUTION OPTIONS ANALYSIS

#### Option 1: [Solution Name]

**Approach:** [Describe the approach for this solution]
**Pros:** [List the pros of this solution]
**Cons:** [List the cons of this solution]
**Implementation complecity:** [Low/Medium/High] - [Brief justification]
**Risk Level:** [Low/Medium/High] - [Primary risk factors and mitigation strategies]

#### Option 2: [Solution Name]

**Approach:** [Describe the approach for this solution]
**Pros:** [List the pros of this solution]
**Cons:** [List the cons of this solution]
**Implementation complecity:** [Low/Medium/High] - [Brief justification]
**Risk Level:** [Low/Medium/High] - [Primary risk factors and mitigation strategies]

#### Option 3: [Solution Name]

**Approach:** [Describe the approach for this solution]
**Pros:** [List the pros of this solution]
**Cons:** [List the cons of this solution]
**Implementation complecity:** [Low/Medium/High] - [Brief justification]
**Risk Level:** [Low/Medium/High] - [Primary risk factors and mitigation strategies]

### Recommendation & Rationale

** RECOMMENDED SOLUTION: ** Option [x] - [Solution Name]

**Why is this the best choice:**

1. **[Primary reason]** - [specific justification]
2. **[Secondary reason]** - [specific justification]
3. **[Tertiary reason]** - [specific justification]
4. **[Other considerations]** - [specific justification]

**Key Decision Factors:**

- **Performance Impact:** [How this affects app performance]
- **User Experience:** [How this affects user experience]
- **Complexity & Maintainability:** [How this affects code complexity and maintainability]
- **Scalability:** [How this affects scalability]
- **Security:** [How this affects security]
- **Cost:** [How this affects cost]

**Alternative consideration:**
[If there's a close second choice, explain why it wasn't selected and under what circumstances it might be preferred]

**USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option [x]), or would you prefer to explore a different approach?

**Questions for you to consider:**

- Does the recommended solution align with your priorities?
- Are there any constraints pr preferences I should factor in?
- Do you have a different timeline or complexity preference?

**Next Steps:**
Once you approave the srategic direction, I'll create the detailed implementation plan in the sections below.

---

## 3. Context & Problem Definition

### Problem Statement

<!-- This is where you clearly define the specific problem you're solving -->

[Detailed explanation of the problem, including user impact, pain points, and why it needs to be solved now]

### Success Criteria

<!-- Define exactly how you'll know when this task is complete and successful -->

- [ ] [Specific, measurable outcome 1]
- [ ] [Specific, measurable outcome 2]
- [ ] [Specific, measurable outcome 3]

---

## 4. Analysing the project before making changes

### Technology & Architecture

<!-- AI Agent: Analyze the project to fill this out.
- Refer to the masterplan.md and blueprint.md files associated with the project.
- Check `package.json` for versions and dependencies.
- Check `tsconfig.json` for Typescript configuration.
- Check `tailwind.config.ts` for styling and theme.
- Check for database schemas
- Check for type definitions
- Check middleware.ts for authentication and routing.
- Check `components/` for existing UI patterns
IMPORTANT: files within the folder 'ai_docs/reference_code/' are examples of code from other projects and should NOT under any circumstances be condered as part of this analysis as they are NOT part of the current project.
-->

- **Frameworks & Versions:** [List the main frameworks and versions]
- **Language:** [Specify the programming language and version]
- **Database & ORM:** [Define the database and ORM choice]
- **UI & Styling:** [List the UI framework and styling approach]
- **Authentication:** [Specify the authentication system]
- **Key Architectural Patterns:** [e.g., Next.js App Router, Server Components for data fetching, Server Actions for mutations]
- **Relevant Existing Components:** [List any existing components that are relevant to the task]
- **Other relevant existing code:** [List any other relevant code eg functions, etc.]

### Fitting in with what is already there

<!-- IMPORTANT!: This project wants clean code! DRY: don't repeat yourself. In seeking to acheive new functionality or any other kind of change to the project it is vital to have an awareness of the existing codebase and ensure we are not creating duplicate functionality. An example of duplicate functionality would be creating a new function to perform some similar or identical functionality to an existing function rather than refactoring the existing function to make it more general and reusable. -->

[Analysis of the current codebase. What is the most efficient way of acheiving our goals keeping the code as clean as possible.]

### Do we need to refactor existing code to acheive our aims while keeping the code as clean as possible?

[If you propose refactoring, include the reasoning here along with the changes you propose to make. Include an analysis of the trade off between additional work to acheive the refactoring and the benefits of the refactoring.]

---

## 5. Development Mode Context

### Development Mode Context

<!-- This is where we tell the AI codingagent about the project's constraints and priorities. This section has been completed and does not need to be edited. -->

- **Project Stage:** This is a new application in active development.
- **Breaking Changes:** Breaking changes are ok where absolutely necessary.
- **Data Handling:** Data loss acceptable where necessary.
- **User Base:** Users are internal staff, not end users.
- **Priority:** Prioritise speed and simplicity over data preservation.
- **Aggressive Refactoring Allowed:** delete/recreate components as needed where it makes sense to do so.

---

<!-- The following sections (number 6 onwards)are optional. If they are relevant they must be used, if they are not relevant do not include them in the task. -->

## 6. Data & Database Changes

### Database Schema Changes

<!-- This is where you specify any database modifications needed. How will this effect existing code, what changes are needed to types and database schemas? -->

[Include an analysis of the changes needed to the database schema, how they will effect existing code.]

### Data Model Updates

<!-- This is where you define TypeScript types, schema updates, or data structure changes -->

[Include an analysis of the changes needed to the types, interfaces, and data structure changes.]

### Data Migration Plan

<!-- This is where you plan how to handle existing data during changes. For example, if you are making a change to a database schema, do we need to add fields to existing records? How can this be acheived in the simplest way possible? Is there any risk to existing records? -->

[If you propose any changes to the database schema, include a plan for how to handle existing data during changes.]

---

## 7. API & Backend Changes

### Data Access Pattern Rules

<!-- This is where you define any additions or modifications to data access patterns (mutations, queries, API routes). -->

[Include an analysis of the changes needed to the data access patterns, how they will effect existing code.]

### Server Actions

<!-- List the backend mutation operations you need -->

[List your create, update, delete operations and what they do]

### Database Queries

<!-- Specify how you'll fetch data -->

[Define your data fetching approach (direct queries vs separate functions)]

---

## 8. Frontend Changes

### New Components

<!-- This is where you specify UI components to be created -->

[List the new components you need to create and their purpose]

### Page Updates

<!-- This is where you list pages that need modifications -->

[List the pages that need changes and what modifications are required]

### State Management

<!-- This is where you include any information about state management and how data flows through the frontend. If this is being built or changed, how will it work and how does it relate to other parts of the codebase? -->

[Define your state management approach and data flow strategy]

---

## 9. Implementation Plan

[Break your work into phases with specific tasks and file paths]

---

## 10. Task Completion Tracking

### Real-Time Progress Tracking

<!-- This is where you tell the AI coding agent to update progress as work is completed -->

[Define how you want the AI coding agent to track and report progress on tasks]

---

## 11. File Structure & Organization

<!-- Here you give details or all files that will be created or modified as part of the task. As always, be aware of the existing codebase and ensure we are not creating duplicate functionality. -->

[Plan what new files to create and existing files to modify]

---
