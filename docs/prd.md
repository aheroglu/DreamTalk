# PRD — DreamTalk: Voice-First Dream Interpretation (MVP)

### TL;DR

DreamTalk is a mobile-first app that lets users record their dreams by voice, transcribes them using speech-to-text, and delivers AI-powered interpretations instantly. The MVP targets users seeking a more natural, effortless way to capture and understand their dreams, offering a refreshing, accessible experience with a modern, pastel design. The core value is frictionless dream journaling and interpretation—no typing required.

---

## Purpose & Problem Statement

Most dream interpretation apps require users to type out their dreams, which is tedious, unnatural, and often leads to incomplete or skipped entries—especially when users are groggy or in a hurry. This text-first approach creates friction and limits accessibility for users who prefer or need hands-free interaction. DreamTalk addresses this gap by enabling users to simply speak their dreams, leveraging speech-to-text and AI to provide instant, meaningful interpretations. The opportunity is to redefine dream journaling as a seamless, voice-first experience that is inclusive, engaging, and easy for all ages.

---

## Goals

### Business Goals

- Achieve 1,000+ downloads within the first 3 months post-launch.

- Reach a 30%+ 7-day retention rate among new users.

- Collect at least 500 unique dream entries in the first quarter.

- Maintain a 4.5+ average rating on the App Store and Play Store.

- Validate willingness to pay for premium features (waitlist signups or in-app interest).

### User Goals

- Effortlessly record dreams by voice without typing.

- Receive instant, insightful AI interpretations of their dreams.

- Save and revisit past dream entries and interpretations.

- Share dream interpretations easily with friends or on social media.

- Enjoy a calming, accessible, and visually appealing app experience.

### Non-Goals

- No manual dream dictionary or human interpreter integration in MVP.

- No advanced analytics or deep personalization in the initial release.

- No web or tablet version for MVP—mobile only (iOS and Android).

---

## Target Users & Personas

### Primary Persona: Sophie, 28, Young Professional

- Demographics: Female, 25–35, urban, tech-savvy, interested in wellness and self-discovery.

- Motivations: Wants to understand her dreams, prefers convenience, values privacy.

- Needs: Quick, easy way to capture dreams upon waking, insightful interpretations, beautiful and calming UI.

### Secondary Persona: Linda, 54, Empty Nester

- Demographics: Female, 50–65, moderate tech comfort, interested in mindfulness and journaling.

- Motivations: Enjoys reflecting on dreams, seeks meaning, values simplicity and accessibility.

- Needs: Large, readable text, clear navigation, minimal setup, voice-first for ease.

### Additional Persona: Alex, 19, University Student

- Demographics: Any gender, 18–24, digital native, shares content with friends.

- Motivations: Curious about dream meanings, likes sharing interesting results, expects modern design.

- Needs: Fast onboarding, easy sharing, fun and engaging experience.

---

## User Stories

### Sophie (Young Professional)

- As a user, I want to record my dream by speaking, so that I don’t have to type when I’m tired.

- As a user, I want to receive an AI-generated interpretation, so that I can quickly understand my dream’s meaning.

- As a user, I want to save my dream entries, so that I can revisit them later.

- As a user, I want to share an interpretation, so that I can discuss it with friends.

### Linda (Empty Nester)

- As a user, I want large, readable text and simple navigation, so that I can use the app comfortably.

- As a user, I want to access my dream history, so that I can reflect on patterns over time.

- As a user, I want to use the app without creating an account, so that I can get started quickly.

### Alex (University Student)

- As a user, I want to edit the transcript if the speech-to-text makes a mistake, so that my dream is accurately captured.

- As a user, I want to share dream interpretations on social media, so that I can engage my friends.

- As a user, I want a visually appealing, modern interface, so that using the app feels enjoyable.

---

## Scope: MVP Features

### Core Features (High Priority)

- Voice recording of dreams (speech-to-text)

- AI-powered dream interpretation (text output)

- Save and view past dream entries

- Edit transcript before interpretation

- Share interpretation (copy, share sheet)

- Floating, oval-shaped tab bar navigation

- Soft Spring pastel visual design

### Supporting Features (Medium Priority)

- Anonymous usage (no account required)

- Optional sign-up (email, Apple/Google SSO)

- Basic settings (language, privacy, notifications)

- Accessibility: large text, high-contrast mode

### Out of Scope (for MVP)

- Manual dream dictionary

- Web/tablet version

- In-app purchases or subscriptions (beyond waitlist/interest)

---

## Functional Requirements

### Voice Recording & Transcription (High)

- Users can tap a prominent button to start/stop recording.

- App requests microphone permission on first use.

- Audio is recorded (max 3 minutes), then uploaded to backend for STT.

- Transcript is displayed for user review and editing.

- Error handling for failed recordings or permissions.

### AI Interpretation (High)

- User submits transcript for interpretation.

- Transcript sent to backend LLM (e.g., OpenAI GPT-4).

- AI returns a concise, readable interpretation.

- Interpretation is displayed in-app and saved with the entry.

### Dream Journal (High)

- Entries (audio, transcript, interpretation, timestamp) are saved locally and/or in the cloud (if signed in).

- Users can view a list of past dreams, sorted by date.

- Tapping an entry shows full details and sharing options.

### Sharing (Medium)

- Users can copy interpretation text or share via OS share sheet.

- Privacy warning shown before sharing.

### Navigation & UI (High)

- Floating, oval tab bar with 3–4 main sections (Record, Journal, Settings, About).

- Responsive layout, safe-area aware, accessible hit targets.

### Settings & Accessibility (Medium)

- Toggle for large text mode.

- Option to clear data or export entries.

- Language selection (if multi-language support enabled).

---

## User Experience and Design Principles

- **Soft Spring Palette:**

  - #FFFFE3 (backgrounds, surfaces)

  - #E3FFF1 (accents, highlights)

  - #E3E3FF (secondary, tabs)

  - #FFE3F1 (buttons, active states)

- **Pastel, soft-modern look:** Rounded corners, gentle shadows, minimal clutter.

- **Floating oval tab bar:** Centered, away from edges, with clear icons and labels.

- **Accessibility:** Large tap targets, readable fonts, high-contrast mode, voiceover support.

- **First-time user:** Minimal onboarding, clear permission requests, instant access to recording.

---

## Entry Point & First-Time User Experience

- User downloads app from App Store/Play Store.

- On first launch, a brief welcome screen explains the app’s purpose.

- App requests microphone permission with clear rationale.

- Optional: onboarding carousel (max 3 screens) showing how to record, review, and interpret dreams.

- User lands on the Record screen, ready to start.

---

## Core Experience Flow

1. **Open App:**

- User sees calming home screen with “Record Dream” button.

2. **Start Recording:**

- User taps button, recording begins (visual feedback: waveform, timer).

- Option to pause/resume or cancel.

3. **Stop Recording:**

- User taps stop; audio is processed and transcribed.

- Loading indicator shown.

4. **Review Transcript:**

- Transcript appears; user can edit text if needed.

- Option to re-record or proceed.

5. **Get Interpretation:**

- User taps “Interpret”; transcript sent to backend.

- AI-generated interpretation appears within seconds.

6. **Save Entry:**

- User can save, edit, or delete the entry.

7. **Share/Export:**

- User can copy or share interpretation.

8. **View Journal:**

- User accesses past entries via tab bar.

- Entries are listed with date, snippet, and icon.

9. **Settings:**

- User can adjust text size, clear data, or sign in.

---

## Advanced Features & Edge Cases

- **Power-user:**

  - Edit transcript before interpretation.

  - Export all entries as text.

- **Edge Cases:**

  - Failed transcription: show error, allow retry.

  - Long recording: enforce 3-minute max, warn user.

  - Network outage: queue uploads, retry later.

  - Low battery: warn if recording may be interrupted.

  - Permission denied: show clear instructions to enable mic.

---

## UI/UX Specs: Floating Tab Bar & Visual System

_To be detailed in design documentation and Figma assets._

---

## Narrative / Example User Journey

Sophie wakes up from a vivid dream, her mind still foggy. She reaches for her phone and opens DreamTalk. The app’s soft, pastel interface greets her with a gentle prompt: “Record your dream.” She taps the floating button and begins speaking, recounting her dream in her own words. The app transcribes her voice instantly, letting her review and correct any errors. With a single tap, she requests an interpretation. Within moments, DreamTalk’s AI offers a thoughtful, easy-to-read explanation of her dream’s possible meaning. Sophie saves the entry, feeling a sense of clarity and curiosity. Later, she shares the interpretation with a friend, sparking a meaningful conversation. DreamTalk has made dream journaling effortless, insightful, and even a little magical—helping Sophie start her day with reflection and connection.

---

## Integration Points (updated)

This project will use Supabase as the primary backend provider for the MVP. Supabase will handle:

- Authentication (email/password, OAuth providers such as Apple/Google) via Supabase Auth.

- Primary relational data storage using Postgres (user profiles, dream entries, transcripts, interpretations, settings).

- File storage via Supabase Storage (audio files, optional image attachments) with bucket policies and signed uploads.

- Server-side business logic and orchestration via Supabase Edge Functions (Deno) for secure calls to third-party AI/STT providers (OpenAI Whisper / GPT), webhook processing, and background tasks.

Integration responsibilities:

- Mobile app (Expo) will use the official supabase-js client (v2) and the recommended Expo helpers to authenticate users and to request signed upload URLs for audio files. Short-lived signed URLs (or direct signed uploads) will be used to upload audio from the device to Supabase Storage.

- Edge Functions will perform audio processing workflows: fetch the uploaded audio, send to chosen STT provider (Whisper or other), persist transcript to Postgres, call LLM to produce interpretation, and persist the interpretation. The Edge Function will return a compact response to the client or push a realtime update via Postgres/Realtime if needed.

Security and operational notes:

- API keys for OpenAI (or other AI) will only be stored in Supabase Edge Function environment variables, never in the mobile client.

- Use Row-Level Security (RLS) and policies on the Postgres tables to ensure users can only access their own rows.

- Configure storage bucket policies to restrict public access and require signed URLs for downloads.

---

## Data Storage & Privacy (updated)

Supabase will be the canonical store for user data and audio assets.

- Audio: Stored in Supabase Storage buckets. By default, set private access; clients upload via signed URLs. Retention policy: configurable (MVP default: retain 90 days unless user chooses to delete).

- Transcripts & Interpretations: Stored as JSON/strings in Postgres tables with timestamps and references to audio file objects.

- User Accounts: Auth handled by Supabase Auth. Profiles stored in a `users` table with minimal PII.

GDPR / Privacy considerations:

- Provide an in-app privacy setting to delete user data (audio/transcripts/interps) which triggers deletion from both storage and database.

- Store explicit consent timestamp for any user who permits server-side storage of audio.

- Offer anonymous/ephemeral mode where audio and transcriptions are only kept locally on-device and never uploaded—app will disable cloud interpretation in this mode.

---

## Technical Considerations (updated)

- Use `@supabase/supabase-js` (v2) in the Expo app for authentication flows and Postgres queries. For Expo-managed workflows, use the Supabase JS client directly with secure environment handling for mobile.

- Use Supabase Storage for audio files with presigned upload flows. The mobile client requests a signed upload URL or direct upload token from an authenticated Edge Function when needed.

- Use Supabase Edge Functions to implement the server-side transcription and interpretation pipeline. Edge functions will:

  - Validate the user and audio file access.

  - Download audio from Supabase Storage.

  - Call the transcription provider (e.g., OpenAI Whisper or Google Speech). Optionally use OpenAI’s audio-to-text endpoints.

  - Persist transcript and call the LLM to get the interpretation.

  - Write results back to Postgres and optionally emit a notification/event for the client.

- Implement RLS and least-privilege access for all tables and storage.

---

## Tracking & Monitoring (updated)

- Use Supabase logs and Edge Function logs for server-side troubleshooting.

- Continue to use Firebase Analytics (or Amplitude) for client-side analytics; augment with Supabase-based server events for key back-end milestones (audio upload complete, transcript created, interpretation ready).

---

## Success Metrics (minor update)

- Track percent of recordings that successfully upload to Supabase Storage and receive a transcript within expected SLA.

- Track deletion requests completed (for privacy compliance) and average retention time for audio files.

---

## Roadmap & Milestones

### Project Estimate

- Medium: 2–4 weeks for MVP (solo or small team)

### Team Size & Composition

- Small Team: 1–2 people (Product/Design/Engineering combined)

### Suggested Phases

**Phase 1: Design & Architecture (3 days)**

- Deliverables: Figma wireframes, color palette, component spec (Owner: Product/Design)

- Dependencies: None

**Phase 2: Supabase Backend Setup (1–2 weeks)**

- Provision Supabase project and storage buckets.

- Create core Postgres schema: users, dreams, audio_objects, transcripts, interpretations, settings.

- Implement RLS policies and basic seed data.

- Implement Edge Functions for audio processing, transcription orchestration, and LLM calls.

- Integrate supabase-js client with Expo app and test signed upload flows.

**Phase 3: Core App Development (10 days)**

- Deliverables: Recording, STT integration, AI backend, journal, tab bar, onboarding (Owner: Engineering)

- Dependencies: Figma assets, API keys

**Phase 4: Polish & Accessibility (3 days)**

- Deliverables: Accessibility, large text, error handling, QA (Owner: Engineering)

- Dependencies: Core app complete

**Phase 5: Beta & Launch Prep (3 days)**

- Deliverables: TestFlight/Play Store beta, analytics, crash reporting, privacy review (Owner: Product/Engineering)

- Dependencies: App store accounts

---

## Appendix: Design Assets & Links

- Figma file: [To be created — Soft Spring palette, 8–10 screens, component library](https://www.figma.com/)

- Icon set: [To be sourced — line-based, matching palette](https://www.figma.com/)

- Fonts: [Google Fonts — e.g., Inter, Nunito, or similar](https://fonts.google.com/)

- Documentation: [GitHub repo, Notion, or Google Drive folder for team access](https://github.com/)

- API keys: [Secure vault or .env file, not in repo](https://github.com/)

---
