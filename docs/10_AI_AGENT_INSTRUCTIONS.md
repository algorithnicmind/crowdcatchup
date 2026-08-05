# AI Agent Coding Instructions & Developer Conventions (`AGENTIC_RULES`)
**Project Name:** CrowdShield: AI-Powered Early Warning System for Preventing Crowd Stampedes  
**Document Type:** LLM / AI Assistant Customization, Codebase Rules & Pattern Guide  
**Document Version:** 1.0 (Production Release)  

---

## 1. Purpose of this Document
This specification is designed specifically for automated **AI Coding Assistants** (e.g., Antigravity, Cursor Rules, GitHub Copilot Workspace Agents, LLM Code Generators) and human collaborative developers. 

When generating new features, refactoring components, or writing production integration tests for **CrowdShield**, any AI system interacting with this codebase **MUST strictly adhere to the rules, patterns, and boundaries outlined below**.

---

## 2. Mandatory Architectural Constraints (Never Violate)

### 2.1 Rule 1: Zero-Build & Vanilla Web Architecture
* **Do NOT introduce npm build toolchains** (Webpack, Vite, Babel, TypeScript compilers) unless explicitly demanded by the user in a breaking change request.
* **Do NOT install external third-party GUI or physics frameworks** (e.g., TailwindCSS, React, Vue, Three.js, Matter.js, D3.js). The application relies entirely on standard ES6 modules (`<script type="module">`), Vanilla CSS design variables ([styles/main.css](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/styles/main.css)), and native HTML5 Canvas 2D Rendering APIs.
* **Why?** To ensure instantaneous compatibility on offline, low-resource municipal operational computers and rapid demonstration deployment without dependency resolution failures.

### 2.2 Rule 2: Decouple Rendering Loops from Analytics Calculation
* In [digitalTwinEngine.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/simulation/digitalTwinEngine.js), graphical canvas drawing via `requestAnimationFrame` runs up to 60 times per second.
* **Do NOT execute heavy mathematical aggregations, DOM manipulation, or UI string updates inside the frame rendering loop.**
* All state evaluation, gauge synchronization, and AI risk threshold transitions must execute solely inside the decoupled **400ms interval timer** (`lastTelemetryEmit`).

---

## 3. Standard Operating Procedures for Extending Code

### 3.1 Procedure: Adding a New Venue Preset (e.g., "Jagannath Rath Yatra" or "Delhi Stadium")
When instructed to add a new physical venue to the simulation suite, modify **only** [src/simulation/venuePresets.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/simulation/venuePresets.js) following this strict schema:

1. Append a new property object under `VENUE_PRESETS` keyed by a unique string ID (e.g., `'rathyatra'`).
2. Include required metadata: `id`, `name`, `description`, and `defaultCrowdCount` (keep between $1,000$ and $1,600$ for optimal rendering).
3. Define physical bounding boundaries inside array coordinates ($W = 760, H = 500$ canvas mapping):
   * `gates: [ { id, x, y, width, height, isOpen: true, type: 'exit'|'entrance', canBottleneck: boolean } ]`
   * `barriers: [ { x, y, width, height, type: 'wall'|'water'|'stage'|'vip' } ]`
   * `securityOutposts: [ { id, label, x, y, personnel } ]`
4. In [index.html](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/index.html), add `<option value="rathyatra">Jaganath Rath Yatra Corridor</option>` inside `<select id="venue-select">`. The application orchestrator will automatically handle binding and resets.

### 3.2 Procedure: Adding a New Regional Language (e.g., Bengali, Telugu, Gujarati)
When instructed to introduce additional multilingual localization capabilities, modify **only** [src/data/translations.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/data/translations.js):

1. Add the ISO-639-1 language key (e.g., `'bn'` for Bengali) to the root `TRANSLATIONS` export dictionary.
2. Provide exact string counterparts for all mandatory keys: `safeStatusTitle`, `safeStatusSub`, `dangerStatusTitle`, `dangerStatusSub`, `navGuideText`, `sosSuccess`, `voiceGuide`, and nested `broadcasts` (`gateClosed`, `oneWayFlow`, `emergencyEvac`, `downpourSurge`).
3. **Calm Phrasing Constraint (Anti-Panic Protocol):** When crafting citizen-facing translated broadcast strings, **never use vocabulary that incites panic** (e.g., *Do NOT write: "Stampede! Run for your lives!"*). Always formulate reassuring, direction-oriented instruction (e.g., *Write: "To assure comfortable walking space, please follow the designated Green Route via Gate 5."*).
4. Update `getLangCode()` inside [src/modules/mobileAppController.js](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/src/modules/mobileAppController.js) to return the correct regional audio syntax code (e.g., `'bn-IN'`).
5. Add `<option value="bn">বাংলা (Bengali)</option>` inside `<select id="mobile-lang-select">` in [index.html](file:///C:/Users/ankit/OneDrive/Documents/GitHub/crowdcatchup/index.html).

---

## 4. Code Style & Documentation Conventions
* **Clickable File & Symbol Links:** Whenever an AI assistant replies to user prompts or generates markdown documentation, it **must always use clickable GitHub-style file schemes** (e.g., `[filename](file:///path/to/file#L10-L20)`).
* **Documentation Integrity:** Never strip existing descriptive JSDoc headers or explanatory comments when editing Javascript files unless explicitly asked to shorten code.
* **Defensive DOM Querying:** When binding event listeners in JavaScript controllers, always wrap DOM element lookup calls in null checks (`if (this.btnElement) this.btnElement.addEventListener(...)`) to prevent initialization crashes during headless testing or UI modifications.
