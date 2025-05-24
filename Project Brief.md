**Project Brief: Messy - A Family Task Organizer for Neurodivergent Households**

---

**Project Name:** Messy Mind

**Project Type:** Mobile-First Progressive Web App (PWA)

**Primary Goal:**
To provide a structured, sensory-considerate, and user-friendly task management tool for families with neurodivergent members. Messy Mind enables parents to assign and monitor tasks while allowing children to engage with daily routines in a clear, visual, and positive way.

---

## Target Users:

* Families with neurodivergent children (e.g., ADHD, Autism)
* Parents and caregivers managing household routines
* Children and teens who benefit from structured, visual task support

---

## Key Features (MVP):

### 1. User Roles:

* **Parent:**

  * Log in securely
  * Create daily tasks
  * Assign tasks to their child
  * Monitor task progress and completion

* **Child:**

  * Log in securely
  * View assigned tasks
  * Check off tasks as completed

### 2. Task Management:

* Task title, description, optional time estimate
* Task assignment to a specific user (child)
* Completion status toggle

### 3. Interface Design:

* Mobile-first design with accessibility in mind
* Child-friendly UI: large buttons, icons, minimal text
* Parent-friendly dashboard with task creation and progress tracking

---

## Future Features (Post-MVP):

* Visual rewards system (stars, points, avatars)
* Routine templates (e.g., morning routine)
* Daily/weekly progress summaries
* Real-time updates using Supabase
* Push notifications (where supported)
* Custom themes and sensory settings
* Multi-child and multi-parent accounts

---

## Technical Stack:

* **Frontend:** Nuxt 3 (Vue.js framework)
* **Styling:** Tailwind 3 CSS (mobile-first, utility-first)
* **Javascript** Do not use typescript
* **State Management:** Vue composables
* **Backend (Post-MVP):** Supabase (auth, realtime DB, storage)
* **Mock Data (MVP):** Local JSON-based task/user structures


---

## UX/UI Principles:

* Calm, customizable color themes
* Large, touch-friendly controls
* Clear visual hierarchy (prioritize tasks by time or urgency)
* Role-specific dashboards (Parent vs Child experience)
* Rounded white cards with soft shadows on a light gray background
* Friendly, readable font with good spacing
* Badges or info blocks with icon + label (e.g., XP, streak, level)
* A header card with name, avatar (with placeholder if missing), join date, and stats
* Bright buttons with full-width styling and soft corners
* Sections for progress (like “Complete your profile”) with call-to-action boxes
* Subtle colors and clean layout — mobile-first


---

## Development Phases:

1. **Scaffolding:** Basic routes and page components (login, parent dashboard, child dashboard)
2. **Mock UI:** Design with Tailwind and static task data
3. **Interactivity:** Task creation, completion toggles
4. **Visual polish:** Animations, transitions, icons
5. **Backend Integration:** Swap mock data for Supabase
6. **Progress Tracking and Role Switching**
7. **Optional PWA setup and web push notifications**

---

**Notes:**

* PWA approach avoids app store limitations
* iPad/tablet-first UX ideal for family accessibility
* App UI should scale perfectly on phone and desktop
* App functionality should scale to more users and routines over time

---

**Author:** \[Barry Allen]
**Version:** 1.0
