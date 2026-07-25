# Fix Dashboard AI Insights, User Profile Persistence, and Clips Page Components

This PR addresses three critical issues to improve the clips-frontend application:

## Changes

### Task 1: Fix AIInsightCard (#669)
- **Issue**: AIInsightCard unconditionally returned null, rendering nothing in the dashboard
- **Solution**: Implemented full component with:
  - Data fetching from GET /api/insights
  - Loading skeleton while data loads
  - Empty state ("No insights yet — upload a video to get started") when no data
  - Placeholder card with "Coming soon" if API doesn't exist (404)
  - Error handling with user-friendly error state
  - Proper sanitization of user content using DOMPurify

### Task 2: Implement User Profile Persistence (#675)
- **Issue**: GET /api/user/profile and POST /api/user/onboarding returned hardcoded mock responses with no database integration
- **Solution**: 
  - Created Prisma schema with User model (id, email, name, avatarUrl, plan, planUsagePercent, onboardingStep, onboardingData)
  - Created Prisma client singleton at app/lib/prisma.ts
  - Updated GET /api/user/profile to fetch real user data from database
  - Updated PATCH /api/user/profile to update name and avatarUrl in database
  - Updated POST /api/user/onboarding to save onboarding step and data to database
  - All routes maintain auth checks (401 for unauthorized)

### Task 3: Implement Missing /clips Page Components (#670)
- **Issue**: app/clips/page.tsx imported non-existent components, causing build failures
- **Solution**: Created all four missing components with Storybook stories:
  - **ClipsNavbar.tsx**: Top navigation with logo, user avatar, and upload CTA
  - **Hero.tsx**: Page hero with tagline and sub-copy
  - **CreateClipsForm.tsx**: URL input + file upload form that calls POST /api/upload
  - **ClipsStats.tsx**: Stat chips showing total clips, avg virality, and total earnings
  - Added Storybook stories for all four components

## Files Changed

### Modified
- components/dashboard/AIInsightCard.tsx
- app/api/user/profile/route.ts
- app/api/user/onboarding/route.ts

### Created
- prisma/schema.prisma
- app/lib/prisma.ts
- components/clips/ClipsNavbar.tsx
- components/clips/Hero.tsx
- components/clips/CreateClipsForm.tsx
- components/clips/ClipsStats.tsx
- stories/ClipsNavbar.stories.tsx
- stories/Hero.stories.tsx
- stories/CreateClipsForm.stories.tsx
- stories/ClipsStats.stories.tsx

## Dependencies Required

To run the database integration, you'll need to:
1. Install Prisma: `npm install prisma @prisma/client`
2. Set up DATABASE_URL in .env
3. Run migrations: `npx prisma migrate dev --name init`
4. Generate Prisma client: `npx prisma generate`

Closes #669, #675, #670
