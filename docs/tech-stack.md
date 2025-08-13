# Tech Stack & Architecture — DreamTalk (MVP)

### TL;DR

DreamTalk is a mobile-first SaaS app for iOS and Android that lets users record their dreams by voice, transcribes them using speech-to-text, and delivers AI-powered interpretations. Built with Expo SDK 53 and React Native 0.79, the MVP focuses on a seamless, accessible experience with a soft-modern pastel design and a custom floating tab bar.

---

## Overview

DreamTalk’s architecture leverages Expo SDK 53 and React Native 0.79 for rapid cross-platform mobile development. The core flow is:

1. User records a dream (audio)

2. Audio is uploaded to a backend

3. Backend transcribes audio (OpenAI Whisper API)

4. Transcript is interpreted by an LLM (OpenAI GPT-4)

5. Result is returned to the app for display and storage

Key design choices include:

- Expo-managed workflow for fast iteration and easy device testing

- Server-side orchestration of STT and LLM for privacy, flexibility, and prompt management

- NativeBase UI kit for consistent, accessible components

- Custom floating, oval tab bar for a modern, differentiated UX

---

## Project Context & Compatibility

**Current package.json highlights:**

- Expo SDK 53 (April 2025) uses React Native 0.79.x and supports the New Architecture by default.

- All listed dependencies are compatible with Expo 53; NativeBase, React Navigation, and Reanimated are well-supported.

- For audio, expo-audio is recommended (expo-av is deprecated in SDK 53).

- Some third-party libraries may require patching or EAS prebuilds; see Appendix for details.

---

## Recommended Frontend Libraries

- **NativeBase** is preferred for its Expo support and theming flexibility.

- For custom UI (floating tab bar), use **Reanimated** and **react-native-gesture-handler**.

- All libraries are compatible with Expo SDK 53 and React Native 0.79.

---

## Audio Recording & Playback

- **Recording:** Use `expo-audio` (new in SDK 53) for cross-platform audio recording and playback.

- **Playback:** Also via `expo-audio`.

- **Caveats:**

  - Android may require additional permissions and testing for background/interrupt scenarios.

  - Fallback: If issues arise, consider a native module (e.g., react-native-audio-recorder-player) via EAS prebuild, but only if necessary.

- **UX:** Show clear recording state, max duration (e.g., 3 minutes), and error handling for permission denials.

---

## Speech-to-Text (STT) Options

- **Integration:** Audio is uploaded to backend, which calls Whisper API and returns transcript.

- **For MVP:** Use OpenAI Whisper API for simplicity and accuracy.

---

## LLM Integration for Interpretation

- **Provider:** OpenAI GPT-4 (or Claude as backup)

- **Flow:** Transcript sent to backend, which calls LLM with a prompt template.

- **Prompt Management:** Prompts live server-side for easy iteration and security.

- **Security:** API keys and prompt logic are never exposed to the client.

---

## Backend: Supabase (New primary backend)

Supabase will provide the backend-as-a-service for DreamTalk MVP. Responsibilities:

- **Auth:** Supabase Auth for email/password, OAuth (Apple, Google) to support app store sign-in requirements.

- **Database:** Postgres for relational data, with Row-Level Security (RLS) for per-user data privacy.

- **Storage:** Supabase Storage for audio files and any user-uploaded assets.

- **Edge Functions:** Server-side orchestration (Deno runtime) to call external STT/LLM providers securely and update the database.

### Why Supabase

- Full BaaS reduces time-to-market compared to building a custom backend.

- Postgres provides flexible querying for feeds, search, and analytics.

- Storage + signed upload URLs make secure audio handling straightforward.

- Edge Functions allow secure server-side API key use and reduce operational overhead.

### Core libraries & versions (suggested)

- `@supabase/supabase-js` v2.x — client for JS/TS usage in Expo.

- Use official Supabase Edge Functions (Deno) for server-side workflows.

- In Expo app, store only the Supabase anon/public key; sensitive operations that need service role keys happen in Edge Functions.

- Consider `@supabase/supabase-js` + `@tanstack/react-query` for caching and syncing in the mobile client.

### Architecture & Data Flow (detailed)

1. User taps Record → app records audio via expo-audio.

2. App requests a short-lived signed upload URL from an authenticated Supabase Edge Function (or directly via supabase-js if using uploadFromFile with anon key + RLS protection).

3. App uploads the audio to Supabase Storage into a protected bucket.

4. App calls an Edge Function to start processing (passing audio object id). Edge Function:

- Downloads audio from Supabase Storage.

- Calls the transcription provider (OpenAI Whisper API or Google Cloud Speech-to-Text) to obtain transcript.

- Persists transcript to Postgres (transcripts table), links to audio object and dream entry.

- Calls LLM (GPT) with the transcript + system prompt to generate the interpretation.

- Persists interpretation to Postgres (interpretations table) and updates dream status.

- Emits event / webhook or returns result to client.

5. Client polls or subscribes to realtime updates to receive the interpretation when ready.

### Sample database schema (MVP)

- **Status ENUM for dreams:** \[pending, processing, done, failed\]

### RLS & Security

- Enable Row-Level Security on all user-centric tables.

- Policies: allow authenticated users to insert/select rows where user_id = auth.uid(). Admin functions (cleanup, analytics) use service-role keys stored in a secure server environment (Edge Functions or a separate admin console).

- Storage: create a private bucket for audio and require signed URLs for uploading and downloading. Implement lifecycle rules for automatic cleanup.

### Edge Functions: responsibilities & sample flow

- **Function: process-audio**

  - Input: dream_id (and verified user context)

  - Steps: fetch audio from Storage → transcribe → store transcript → call LLM → store interpretation → notify client

- **Function: generate-signed-upload**

  - Input: filename, mime-type

  - Output: signed upload URL or upload token

### Integration with OpenAI (or chosen STT/LLM provider)

- Keep OpenAI API keys in Edge Function environment variables.

- Use chunked upload if file size exceeds provider limits; consider converting audio to 16k mono if required by the STT provider.

- Store minimal metadata about provider results (confidence, segments) in transcripts table for analytics.

### Offline / Ephemeral Mode

- Provide an option to skip uploads: users can record and receive on-device summary (using local speech-to-text if implemented later) or store locally until user opts-in.

### Operational & Monitoring

- Use Supabase logs + Edge Function logs for backend monitoring; forward critical errors to Sentry.

- Monitor storage usage and transcribe/interpret API costs.

### Dev / Testing notes for Expo

- supabase-js works in Expo-managed apps. Use environment variables handled at build time (EAS) or use runtime config with careful handling of keys.

- For local dev, run Supabase CLI or use a dedicated dev Supabase project. Edge Functions can be tested locally with the Supabase CLI.

### Cost & Scaling considerations

- Storage: audio retention policy and compression to control costs.

- Edge Functions: scale automatically, but keep per-request time short by offloading long-running operations to background jobs or break into steps (transcription then interpretation).

- Plan for batching or queueing if transcription costs or rate limits become a bottleneck.

### Example: Minimal Edge Function pseudocode (description)

- Validate authenticated user from request headers.

- Download file from Supabase Storage.

- POST file to transcription API and wait for transcript.

- Save transcript row in Postgres.

- Call LLM for interpretation (with a deterministic prompt template).

- Save interpretation row and update dream status.

- Return the interpretation or record an event for client to fetch.

---

## Data Storage & Privacy

- **Audio:** Stored in Supabase Storage, encrypted at rest, with signed URL access.

- **Transcripts/Interpretations:** Stored in Supabase Postgres, linked to user (if signed in) or device ID (if anonymous).

- **User Metadata:** Minimal PII; only email if user signs up.

- **Retention:** Audio and transcripts can be deleted by user; default retention policy (e.g., 30 days for audio).

- **Compliance:** GDPR/CCPA ready; users can request data deletion.

---

## API Contracts & Example Prompts

**API Example:**

- **POST /edge/generate-signed-upload**

  - Request: `{ "filename": "dream-2024-06-01.m4a", "mimeType": "audio/m4a" }`

  - Response: `{ "uploadUrl": "https://..." }`

- **POST /edge/process-audio**

  - Request: `{ "dreamId": "abc123" }`

  - Response: `{ "status": "processing" }`

- **Realtime subscription:** Client subscribes to dream status updates.

**Prompt Template Example:**

> "You are a dream interpretation expert. Given the following dream description, provide a concise, empathetic interpretation in plain language. Dream: {transcript}"

---

## Authentication & User Accounts

- **Strategy:** Anonymous mode by default; optional sign-in with email, Apple, or Google via Supabase Auth.

- **Token Handling:** JWT or session tokens stored securely (e.g., SecureStore).

- **Session Management:** Refresh tokens as needed; logout clears all local data.

---

## Networking, Uploads & Scalability

- **Audio Upload:** Use Supabase Storage with signed URLs for direct uploads.

- **Chunking:** Not required for <3min audio; add for longer recordings in future.

- **Retry Logic:** Automatic retries for failed uploads; user feedback on errors.

- **Scaling:** Supabase Edge Functions and Storage scale automatically; monitor quotas and costs.

---

## CI/CD, Builds & App Store Release

- **CI/CD:** Use GitHub Actions or similar for lint/test/build.

- **EAS Build:** Use EAS for production builds (iOS/Android).

- **App Store Packaging:**

  - iOS: App Store Connect, TestFlight, App Privacy details

  - Android: Play Console, privacy policy

- **Submission Checklist:**

  - App icons, splash, screenshots

  - Privacy policy

  - Accessibility review

  - Store listing copy

---

## Dev Environment & Local Testing

- **Setup:**

  - Windows 11 + Expo CLI

  - iPhone 11 for device testing (via Expo Go or dev-client)

- **Checklist:**

  - Test audio on both iOS and Android

  - Validate permissions (microphone, storage)

  - Check UI on various device sizes

  - Test offline/poor network scenarios

---

## Testing Strategy

- **Unit Tests:**

  - Core logic, form validation, UI components (Jest, react-test-renderer)

- **Integration Tests:**

  - Audio recording/upload, STT/LLM API calls (msw, supertest)

- **E2E Tests:**

  - User flows (Detox or Maestro for RN)

- **Test Cases:**

  - Record dream, handle errors, view history, sign in/out

---

## Monitoring, Logging & Analytics

- **Monitoring:** Sentry for crash/error reporting

- **Analytics:** Firebase Analytics for user events, Amplitude for advanced funnels (optional)

- **Logs/Metrics:**

  - Audio upload success/failure

  - STT/LLM latency and errors

  - User engagement (recordings, interpretations, shares)

---

## Security Considerations

- **API Keys:** Never stored in client; use Edge Function env vars.

- **Uploads:** Signed URLs, short TTL, validate file types.

- **PII:** Minimize; encrypt at rest and in transit.

- **Sanitization:** All user input sanitized server-side before LLM.

---

## Cost Estimates & Operating Model

**Cost Control:**

- Limit max recording length

- Batch LLM calls

- Auto-delete old audio

- Monitor API usage

---

## Infra Diagram & Responsibilities

**Components:**

- **Frontend (Expo RN app):** UI, audio recording, uploads, display

- **Backend (Supabase):** Auth, Storage, Edge Functions, Postgres

- **STT Service (OpenAI Whisper):** Transcription (via Edge Function)

- **LLM Service (OpenAI GPT-4):** Interpretation (via Edge Function)

- **Analytics/Monitoring:** Sentry, Firebase

**Diagram (textual):**

- User Device (Expo App)

  - ↔️ Supabase (Auth, Storage, Edge Functions, Postgres)

    - ↔️ STT Service (Whisper)

    - ↔️ LLM Service (GPT-4)

    - ↔️ Analytics/Monitoring

---

## Folder Structure & Developer Onboarding

**Recommended Repo Structure:**

- /app

  - /components

  - /screens

  - /navigation

  - /hooks

  - /assets

  - /theme

- /supabase

  - /edge-functions

  - /sql

  - /tests

- /tests

- app.json, package.json, README.md

**Onboarding Checklist:**

- Clone repo, install dependencies (`npm install`)

- Set up Expo CLI and EAS

- Configure .env for Supabase keys and endpoints

- Run on device (`npx expo start`)

- Test audio recording and upload

- Review code style and commit guidelines

---

## Appendix: package.json Compatibility Notes

- **Expo SDK 53:** All core dependencies are compatible; use `expo-audio` for recording.

- **NativeBase:** Fully compatible with Expo 53; install with `npm i native-base`.

- **react-native-reanimated:** Version \~3.17.4 is compatible with RN 0.79.

- **expo-router:** \~5.1.4 works with React Navigation 7.x.

- **Potential Issues:**

  - Some older libraries may require patching or EAS prebuilds.

  - Avoid deprecated packages (e.g., expo-av for audio).

- **Commands:**

  - `npx expo install` for Expo-managed dependencies.

  - Use EAS Build for production binaries.

- **Migrations:**

  - If upgrading SDK, check for breaking changes in Expo changelog.

  - Test all audio and animation features after dependency updates.

---

_If you want, I can also insert concrete SQL_ `CREATE TABLE` _statements, RLS policy examples, and a sample Edge Function code snippet (TypeScript/Deno) to this document—let me know if you want those added now._
