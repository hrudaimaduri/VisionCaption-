# VISIONCAPTION+

Adaptive Multi-Purpose Image Caption Generation and Verification.

VisionCaption+ is a specialized image-captioning platform designed to generate the right caption for the right purpose, at the right level of detail, and verify that its important claims are supported by the image.

## Architecture

- **Frontend/Backend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Database:** PostgreSQL (via Prisma ORM) *Note: SQLite is currently configured in Prisma to enable running the application in constrained environments without Docker/PostgreSQL.*
- **Authentication:** NextAuth.js (Credentials Provider)
- **AI Integration:** Abstracted `VisionCaptionProvider` (Mock provider active by default for development/demo).

### Layer 1: Generation
- Visual Understanding
- Purpose/Language/Detail Control
- Purpose-Aware Caption Generation

### Layer 2: Verification
- Evidence-grounded verification
- Unsupported claim detection
- Caption refinement

## Setup & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment & Storage Setup:**
   Ensure your `.env` is configured correctly (refer to `.env.example`).
   Images uploaded by users are stored securely in `public/uploads`.
   All `/api/captions/*` endpoints are protected by NextAuth session checks and an in-memory rate limiter.

2. **Environment Variables:**
   Create a `.env` file from `.env.example` (or use the one already created).

3. **Database:**
   To run with Docker + Postgres (Optional):
   ```bash
   docker-compose up -d
   # Change Prisma provider in schema.prisma to postgresql and update DATABASE_URL
   npx prisma db push
   ```

   To run with the default SQLite setup (No Docker needed):
   ```bash
   # Ensure schema.prisma has provider = "sqlite"
   npx prisma db push
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

5. **Demo Mode:**
   - Go to `http://localhost:3000`
   - Sign up or log in (e.g. demo@example.com / password123)
   - Go to the Workspace
   - Upload any image
   - Try the "Safety" purpose with "Detailed" level to see the refinement process in action.

## Connecting Real ML Model (Phase 2)

VisionCaption+ now supports real caption generation using Google's Gemini 2.5 Flash model!

To connect the actual ML model:
1. In your `.env` file, change `AI_PROVIDER` to `"gemini"`.
2. Add your server-side API key to `.env`: `GEMINI_API_KEY="your_api_key_here"`
3. (Optional) Set the model version: `GEMINI_MODEL="gemini-2.5-flash"`

**SECURITY WARNING:**
Never commit your API key. `.env.local` or `.env` files containing secrets must be ignored by git.
The API key is strictly used server-side in the generation API route.

**FREE-TIER USAGE AWARENESS:**
The current Google AI Studio project may have a limited free-tier quota. The application only calls the Gemini API when a user explicitly clicks "Generate & Verify". Do not create automated scripts that repeatedly call the real generation API.
