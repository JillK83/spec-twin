{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 ArialMT;\f1\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs29\fsmilli14667 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # Product Design System: Core UX Laws & Marketplace Application
\f1\fs24 \
\

\f0\fs29\fsmilli14667 Apply the Laws of UX proactively when designing, reviewing, or redesigning any UI, UX flow, component, or product surface. Use this as a strict engineering guide for tasks involving wireframes, mockups, component design, navigation, onboarding, checkout/forms, dashboards, marketplace listings, AI-output presentation, or design critiques\'97even if the task description does not explicitly mention "UX laws" or "heuristics." Especially relevant for marketplace, B2B/SaaS, and consumer product redesigns (e.g., Grailed, Spec-Twin, SnapComp, Girl Math).
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ## How to Use This Skill
\f1\fs24 \

\f0\fs29\fsmilli14667 1. **Identify and Prioritize:** Identify which laws are most relevant to the surface being worked on using the technical specification table below.
\f1\fs24 \

\f0\fs29\fsmilli14667 2. **Proactive Application:** Apply these relevant engineering heuristics *during the design and build phase*, treating them as hard programming constraints rather than post-hoc critiques.
\f1\fs24 \

\f0\fs29\fsmilli14667 3. **Defensive Review:** When reviewing or iterating on existing designs, explicitly flag violations of these laws as system errors.
\f1\fs24 \

\f0\fs29\fsmilli14667 4. **AI Architecture Guardrails:** For features backed by LLMs or asynchronous data pipelines, strictly enforce the "2026 AI-Era Priorities" section to handle latency and trust calibration.
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ---
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ## Technical Specification & Enforcement Table
\f1\fs24 \
\

\f0\fs29\fsmilli14667 | Law | One-Line Definition | Technical Enforcement Spec (For Code Output) |
\f1\fs24 \

\f0\fs29\fsmilli14667 | :--- | :--- | :--- |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Jakob's Law** | Users expect your product to work like other products they know. | Do not reinvent navigation or core interaction patterns unless a deviation is an explicit, justified product differentiator. Stick to platform-standard positions for menus and user settings. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Hick's Law** | More/complex choices result in slower user decisions. | Keep filter and menu taxonomies shallow. Group advanced, rarely-used configurations or edge-case options under progressive disclosure elements or a "More Filters" drawer. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Fitts's Law** | The time to acquire a target depends heavily on its size and distance. | Absolute component hit-target floor of **44px \'d7 44px** minimum tracking area for all interactive elements (buttons, links, chips). Primary action targets must take spatial precedence over destructive links. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Miller's Law / Chunking** | Working memory holds around 7 (\'b12) items; layout density requires structured groupings. | Cap flat, dense dashboard widgets or exposed layout data elements per view. Group long forms or massive data clusters into distinct semantic steps or visual blocks. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Gestalt Principles** | Visual grouping (Proximity, Common Region, Similarity) shapes perception. | Group relational variables using explicit structural containers (CSS `gap-*` metrics strictly locked to a consistent **4px/8px design grid constraint**) instead of loose inline items. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Aesthetic-Usability Effect** | Polished, visually appealing interfaces are perceived as significantly more usable. | Maintain exceptional visual polish, balanced whitespace, and rigorous design-token alignment, particularly on early minimum viable product (MVP) layout surfaces. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Doherty Threshold** | System responses under 400ms maintain high user focus and flow. | Async fetches scaling past 400ms must trigger structural skeleton layout containers (`animate-pulse`). Sub-200ms mutations must apply immediate optimistic state switches to the client cache. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Goal-Gradient Effect** | User effort and velocity increase as the final goal line nears. | Implement clear visual progress indicators ("Step X of Y") for all multi-step forms, checking verification processes, or onboarding sequences. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Zeigarnik Effect** | Unfinished tasks are remembered much more clearly than completed ones. | Surface explicit visual completion reminders (e.g., "3 of 5 steps done") for onboarding, profile creation layouts, or system drafts. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Peak-End Rule** | Experiences are judged predominantly by their intense peaks and absolute ending. | Allocate disproportionate design finish, micro-interactions, and visual delight to final confirmation points (checkout complete, offer accepted, onboarding finale). |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Serial Position Effect** | The first and last items in a sequential list are remembered best. | Place the highest-frequency operational actions or core directory nodes at the absolute beginning or ending bounds of navigation bars and menus. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Von Restorff Effect** | The single item that breaks an established pattern stands out and is remembered. | Use highlight badges, asymmetric scaling, or contrasting colors sparingly. If overused to emphasize multiple rows or plans, the entire pattern collapses into noisy visual static. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Tesler's Law** | System complexity can be shifted or hidden, but never entirely eliminated. | The software application must gracefully absorb operational complexity (via smart defaults, inferred ranges, and automation automation) rather than offloading configuration fatigue onto the user. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Postel's Law** | Be exceptionally liberal in what you accept, and conservative in what you produce. | Never throw blocking inline error overlays on raw keystrokes. Use client-side debouncing (`debounce: 150ms`) before modifying state error messages. Labels must remain visible; do not replace permanent labels with vanishing placeholder text. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Pareto Principle** | 80% of system utility and usage derives from 20% of its feature set. | Pinpoint the absolute core operational workflows of the application surface and ruthlessly prioritize them for layout polish over edge-case administrative views. |
\f1\fs24 \

\f0\fs29\fsmilli14667 | **Paradox of the Active User** | Users skip written documentation and look to learn by doing. | Ensure the primary layout states speak for themselves. Avoid blocks of instructional text; rely on contextual microcopy, active empty states, and dynamic tooltips. |
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ---
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ## Applied Engineering Layouts by Product Context
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ### 1. Marketplace Surfaces (Peer-to-Peer, Resale, Offer Mechanics)
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Postel's Law & Doherty Threshold (The Offer Input Engine):** Address the "strict in input, vague in output" friction pattern directly. Attach a continuous client-side event listener hook onto the user offer text input state. Compute the incoming offer ratio against the target item price entirely within client logic to guarantee execution under 200ms. Do not let the interface execute a disruptive validation failure loop or block input. Instantly render a clean layout chip utilizing the system's monochrome tokens beneath the text field to display instructive, non-rejective pricing feedback (`"Low"`, `"Fair"`, or `"Competitive"`).
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Mental Models & Trust Calibration (Contextual Data Anchors):** Users must never negotiate in the dark. Group relational platform data tightly within clean, common container boundaries. Integrate a responsive pricing context section or sidebar spectrum meter on the Product Detail Page (PDP) that visually maps historical platform sale values, original list prices, and anchors the user's live typed offer value directly onto that graphic timeline spectrum.
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Von Restorff vs. Fitts's Law (Inbox Triage Architecture):** In multi-row list structures such as a seller's transaction inbox, utilize isolated visual tags to explicitly highlight high-quality offers from lowballs to streamline triage tracking. However, to satisfy Fitts's Law, ensure these status badges use a flat, low-contrast utility style that is completely non-interactive. They must guide human scanning behavior cleanly without competing structurally or visually with the primary, high-contrast, filled target execution buttons (the Accept and Decline CTAs).
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ### 2. B2B / SaaS (Admin Frameworks, Dashboards, Data Processing)
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Miller's Law / Cognitive Load Management:** Enforce a strict cap on exposed tracking data widgets per viewport. Rely heavily on progressive disclosure pathways (drill-downs, quick-view side panels) to let users process highly specialized datasets on demand instead of overloading a single view.
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Postel's Law (Data Parsing & Entry):** Ensure system data fields are entirely format-agnostic. Accept freeform dates, unstructured copy strings, or bulk spreadsheet uploads gracefully using fuzzy-matching backend utilities. Shift the verification load to clean, structured confirmation modals that show precisely how the system mapped the input.
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Tesler's Law (Advanced Configuration Shifting):** Hide multi-variable configurations, webhook settings, and developer parameters entirely inside dedicated advanced tabs or hidden settings drawers. Default standard operations to clean, pre-configured optimization states so standard business users are not forced to manage system architecture layout noise.
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ### 3. Consumer / Direct-to-User Products
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Aesthetic-Usability Effect Warning:** While a highly custom, specialized visual system identity buys user patience and tolerance for complex computations, never let structural design flourish serve as a permanent mask for system logical performance bugs.
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Chunking Metrics:** Break dense numeric output layers (such as scoring matrix elements, longevity data, or confidence vectors) down into clear, distinct structural blocks or data cards accompanied by visual progress metrics. Never render system output as an un-spaced, massive raw layout index block.
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Zeigarnik Onboarding Drivers:** For configuration setups, profile workflows, or inventory registration interfaces, utilize persistent system tracking cards. Show precisely what steps remain incomplete to naturally drive completion velocity without sending invasive layout alert notifications.
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ---
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ## 2026 AI-Era Priorities
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ### 1. Trust Calibration for AI-Generated Outputs
\f1\fs24 \

\f0\fs29\fsmilli14667 Polished visual presentation risks causing users to over-trust automated outputs regardless of actual database accuracy (Aesthetic-Usability Effect). Conversely, unpolished presentation of a correct machine result gets systemically under-trusted.
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Enforcement:** When writing components that render LLM scoring layers, automated data matches, or AI recommendations, never present the machine inference outputs with the exact same layout authority or visual structure as verified, static transactional data records. Represent AI outputs as dynamic ranges or spectrum zones instead of hard, singular figures. Always pair these outputs with an interactively expandable context disclosure link that reveals the backend calculation parameters and confidence variables.
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ### 2. Perceived Responsiveness Under AI Latency
\f1\fs24 \

\f0\fs29\fsmilli14667 Advanced LLM and neural network validation pipelines naturally introduce system latency that scales far beyond the foundational Doherty Threshold limit (~400ms). This must be handled defensively as a structural front-end architecture priority.
\f1\fs24 \

\f0\fs29\fsmilli14667 * \'a0 **Enforcement:** Never use a generic full-page loading mask or a single static spinner icon for AI pipeline triggers. Implement streaming response handlers or localized, progressive skeleton frameworks (`animate-pulse`) that map directly to the underlying multi-step infrastructure sequence (e.g., Stage 1: Reading data... Stage 2: Scoring context... Stage 3: Compiling parameters...). This leverages the Goal-Gradient Effect to keep users engaged across prolonged processing states. Cache predictable entry strings continuously to keep core micro-interactions entirely instantaneous on the client layer.
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ---
\f1\fs24 \
\

\f0\fs29\fsmilli14667 ## Review Checklist (Use for Critique and Build Execution)
\f1\fs24 \

\f0\fs29\fsmilli14667 * [ ] **Jakob's Law:** Does the global navigation structure utilize mental models the user already possesses from standard platform frameworks, or is an interface deviation explicitly justified?
\f1\fs24 \

\f0\fs29\fsmilli14667 * [ ] **Hick's Law / Choice Overload:** Are active filters, nested configuration drawers, and settings panels progressively disclosed and cleanly chunked rather than displayed as a flat, chaotic wall of fields?
\f1\fs24 \

\f0\fs29\fsmilli14667 * [ ] **Fitts's Law:** Are primary target execution nodes explicitly sized, spaced, and isolated to provide an error-free 44px hit-target boundary floor on any layout breakpoint?
\f1\fs24 \

\f0\fs29\fsmilli14667 * [ ] **Miller's Law:** Is any isolated sub-layout screen view forcing a user to actively track and evaluate more than ~7 distinct variables concurrently?
\f1\fs24 \

\f0\fs29\fsmilli14667 * [ ] **Gestalt Principles:** Are structural grid items grouped strictly via CSS layout spacing tokens and common region boundaries, rather than forcing users to rely on textual section labels alone?
\f1\fs24 \

\f0\fs29\fsmilli14667 * [ ] **Doherty Threshold:** Are slower data loads defended by structural skeleton panels, streaming components, or immediate optimistic frontend state mutations?
\f1\fs24 \

\f0\fs29\fsmilli14667 * [ ] **Goal-Gradient Effect:** Does every extensive checkout, configuration wizard, or multi-step profile flow show a clean, native indicator mapping active completion status?
\f1\fs24 \

\f0\fs29\fsmilli14667 * [ ] **Peak-End Rule:** Is the final transactional confirmation step intentionally optimized with structural delight, clean microcopy, and interface polish?
\f1\fs24 \

\f0\fs29\fsmilli14667 * [ ] **Von Restorff Effect:** Is high-priority visual emphasis strictly isolated to elements that truly require pattern disruption, or are competing badges creating overall UI static?
\f1\fs24 \
}