# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DreamTalk is a voice-first dream interpretation mobile app that redefines dream journaling through speech-to-text and AI-powered analysis. Built as a React Native Expo application using:
- **Expo SDK 53** with New Architecture enabled
- **Expo Router** for file-based routing with typed routes
- **TypeScript** with strict mode
- **React Native 0.79.5** with React 19
- **Jest** for testing

## Business Context & Strategic Goals

### Core Value Proposition
DreamTalk eliminates the friction of traditional dream journaling by enabling users to simply speak their dreams upon waking. The app transcribes voice recordings using OpenAI Whisper and provides instant AI-powered interpretations via GPT-4, making dream analysis accessible and effortless.

### Target Users & Key Personas
1. **Sophie (28, Young Professional)**: Tech-savvy urban dweller seeking convenient self-discovery tools
2. **Linda (54, Empty Nester)**: Values simplicity and accessibility, interested in mindfulness
3. **Alex (19, University Student)**: Digital native who enjoys sharing interesting content

### MVP Success Metrics
- 1,000+ downloads within 3 months
- 30%+ 7-day retention rate
- 500+ unique dream entries in Q1
- 4.5+ app store rating
- Privacy-first approach with GDPR compliance

## Essential Commands

### Development
```bash
# Start development server
npx expo start

# Platform-specific development
npx expo start --ios
npx expo start --android  
npx expo start --web

# Clear cache and start (useful for import/resolution issues)
npx expo start --clear
```

### Testing
```bash
# Run tests in watch mode
npm test

# Run tests once
npx jest
```

### Package Management
```bash
# Install Expo-compatible packages
npx expo install <package-name>

# Regular npm install for dev dependencies
npm install <package-name> --save-dev
```

## Architecture

### Routing Structure
- Uses **Expo Router** with file-based routing in the `app/` directory
- Main navigation: `app/(tabs)/` contains tabbed interface
- Root layout: `app/_layout.tsx` handles theme, fonts, and splash screen
- Tab layout: `app/(tabs)/_layout.tsx` configures bottom tabs
- Modal screens: `app/modal.tsx` for modal presentations

### Theming System
- **Adaptive theming** supporting light/dark modes automatically
- Theme colors defined in `constants/Colors.ts`
- Custom themed components in `components/Themed.tsx` that extend React Native's Text and View
- Theme detection via `components/useColorScheme.ts`
- Color scheme integration with React Navigation themes

### Component Organization
- Reusable components in `components/` directory
- Path aliases configured: `@/` maps to project root
- Themed components provide automatic dark/light mode support
- FontAwesome icons integrated via `@expo/vector-icons`

### Key Configuration
- **TypeScript paths**: `@/*` resolves to `./` (project root)
- **Fonts**: SpaceMono loaded via `expo-font`
- **Splash screen**: Controlled programmatically, hidden after fonts load
- **New Architecture**: Enabled in app.json for performance benefits

### Core Business Context

### Product Vision
DreamTalk is a **voice-first dream interpretation app** that eliminates the friction of traditional dream journaling. Users record their dreams by voice (max 3 minutes), receive AI-powered interpretations instantly, and build a personal dream journal without typing.

### Target Users & Key Personas
- **Sophie (25-35)**: Young professional seeking convenient self-discovery tools
- **Linda (50-65)**: Accessibility-focused user preferring voice over text
- **Alex (18-24)**: Social user who shares interesting interpretations with friends

### Success Metrics & Goals
- 1,000+ downloads within 3 months
- 30%+ 7-day retention rate
- 4.5+ average app store rating
- 500+ unique dream entries in Q1

### Design System Requirements
- **Soft Spring Palette**: Implement exact colors in `constants/Colors.ts`
  - #FFFFE3 (backgrounds), #E3FFF1 (accents), #E3E3FF (secondary), #FFE3F1 (buttons)
- **Floating Oval Tab Bar**: Custom component with rounded corners, gentle shadows
- **Accessibility**: Large text mode, high contrast, screen reader support

## Integration Architecture

### Supabase Backend (Primary)
- **Authentication**: Anonymous by default, optional email/Apple/Google sign-in
- **Storage**: Audio files with signed URLs, private buckets with lifecycle rules
- **Edge Functions**: Server-side STT/LLM orchestration for security
- **Database**: Postgres with RLS policies for user data isolation

### OpenAI Integration (Via Edge Functions)
- **Whisper API**: Speech-to-text transcription (server-side only)
- **GPT-4**: Dream interpretation with managed prompts
- **Security**: API keys never exposed to client, stored in Edge Function env vars

### Core Data Flow
1. Record audio → Upload to Supabase Storage
2. Edge Function processes: Audio → Whisper → Transcript → GPT-4 → Interpretation
3. Results stored in Postgres, client receives notification

## Technical Constraints & Strategic Decisions

### MVP Scope Boundaries
- **In Scope**: Voice recording, transcription, AI interpretation, basic sharing
- **Out of Scope**: Manual dream dictionaries, web version, advanced analytics
- **Future**: Premium features, social elements, dream pattern analysis

### Performance & Cost Management
- 3-minute max recording length (cost control)
- Audio retention policy: 90 days default
- Batch processing for efficiency
- Monitor OpenAI API usage and implement rate limiting

### Privacy-First Architecture
- GDPR compliant with explicit consent
- Anonymous mode (no cloud storage)
- User-initiated data deletion
- Minimal PII collection

## Development Guidelines

### Core User Flows to Test
1. **First-time recording**: Permissions → Record → Transcribe → Interpret → Save
2. **Error handling**: Permission denied, network failures, API errors
3. **Accessibility**: Large text, screen reader, high contrast modes
4. **Cross-platform**: Audio recording on both iOS and Android

### Required Components
- Custom floating tab bar with Reanimated animations
- Voice recorder with waveform visualization
- Themed Text/View components supporting dark/light modes
- Error boundaries for API call failures

### Security Implementation Checklist
- [ ] All API keys server-side only
- [ ] Signed upload URLs with short TTL
- [ ] Input sanitization before LLM calls
- [ ] RLS policies on all user data tables
- [ ] Secure storage for auth tokens (SecureStore)

### Testing Requirements
- Audio recording functionality on physical devices
- Permission handling edge cases
- Network interruption scenarios
- Theme switching and accessibility features
- Cross-platform UI consistency

### Git Workflow & Development Rules
- Always commit and push changes after completing development tasks
- Use MCP tools and specialized agents proactively for complex features
- Test on physical devices for audio functionality
- Run linting and type checking before commits
- Follow Conventional Commits standard for all commit messages

### Commit Message Standards
Use Conventional Commits format: `type(scope): description`

**Types:**
- `feat`: New feature implementation
- `fix`: Bug fixes and corrections
- `ui`: UI/UX improvements and styling changes
- `refactor`: Code refactoring without feature changes
- `docs`: Documentation updates
- `config`: Configuration and setup changes
- `deps`: Dependency updates and package management
- `test`: Test additions or modifications
- `perf`: Performance improvements

**Examples:**
```bash
feat(library): add dream symbol search and filtering
fix(tabbar): resolve CTA button alignment issues
ui(colors): update Soft Spring color palette
refactor(components): extract reusable DreamCard component
config(supabase): setup authentication and database schema
```

## Development Notes
- Always use `npx expo install` for Expo SDK packages to ensure compatibility
- Theme-aware components should use the `useThemeColor` hook from `components/Themed.tsx`
- Tab icons use FontAwesome icons via the `TabBarIcon` component
- Client-only rendering handled by `useClientOnlyValue` hook for web compatibility
- Use `expo-audio` (not expo-av) for recording in SDK 53
- Implement error boundaries around all API-dependent components

## Core Feature Requirements

### Voice Recording Architecture
- **Maximum Duration**: 3 minutes per recording (UX and cost constraint)
- **Audio Library**: Use `expo-audio` (expo-av is deprecated in SDK 53)
- **Upload Strategy**: Direct upload to Supabase Storage via signed URLs
- **Error Handling**: Permission denials, failed uploads, network issues

### Speech-to-Text Integration
- **Provider**: OpenAI Whisper API (server-side processing only)
- **Flow**: Audio → Supabase Storage → Edge Function → Whisper API → Postgres
- **Security**: API keys stored in Edge Function environment variables
- **Fallback**: Error states when transcription fails

### AI Dream Interpretation
- **LLM Provider**: OpenAI GPT-4 (Claude as backup option)
- **Prompt Management**: Server-side templates for easy iteration
- **Processing**: Edge Function orchestrates STT → LLM → storage pipeline
- **Response Format**: Concise, empathetic interpretations in plain language

## Design System Requirements

### Soft Spring Color Palette
- **Primary Background**: #FFFFE3 (soft cream)
- **Accent Green**: #E3FFF1 (mint highlight)
- **Secondary Purple**: #E3E3FF (lavender tabs)
- **Button Pink**: #FFE3F1 (active states)

### Floating Tab Bar Implementation
- **Style**: Oval-shaped, floating design (not attached to edges)
- **Position**: Centered horizontally, elevated above bottom safe area
- **Navigation**: 3-4 main sections (Record, Journal, Settings, About)
- **Animation**: Use react-native-reanimated for smooth transitions

### Accessibility Requirements
- Large text mode toggle in settings
- High contrast mode for readability
- VoiceOver/TalkBack support for screen readers
- Minimum 44pt touch targets for all interactive elements

## Backend Architecture (Supabase)

### Authentication Strategy
- **Default Mode**: Anonymous usage (no account required)
- **Optional Sign-in**: Email, Apple ID, Google Sign-In via Supabase Auth
- **Data Isolation**: Row-Level Security (RLS) policies ensure user data privacy
- **Session Management**: JWT tokens with automatic refresh

### Database Schema Key Points
- **Dreams Table**: Links audio, transcript, interpretation, timestamps
- **Users Table**: Minimal PII, preferences, settings
- **Audio Objects**: References to Supabase Storage files
- **Status Tracking**: [pending, processing, done, failed] for dream entries

### Edge Functions Responsibilities
1. **process-audio**: Handles STT → LLM → storage pipeline
2. **generate-signed-upload**: Provides secure upload URLs for audio files
3. **user-data-deletion**: GDPR compliance for data removal requests

### Storage & Privacy
- **Audio Retention**: 90-day default policy, user-configurable
- **Encryption**: At-rest and in-transit encryption via Supabase
- **Signed URLs**: Short-lived access tokens for audio files
- **GDPR Compliance**: User-initiated data deletion capabilities

## Development Constraints & Decisions

### MVP Scope Boundaries (What NOT to Build)
- No manual dream dictionary or human interpreters
- No web or tablet versions (mobile-only strategy)
- No advanced analytics or deep personalization
- No in-app purchases (waitlist validation only)

### Technical Constraints
- **Platform Support**: iOS and Android only (React Native)
- **Offline Mode**: Limited - requires network for AI processing
- **File Size Limits**: Audio files capped at ~18MB (3 min @ reasonable bitrate)
- **API Rate Limits**: Implement queuing for high-volume transcription requests

### Cost Management Strategies
- Limit recording duration to control Whisper API costs
- Implement audio compression before upload
- Auto-delete expired audio files via Storage lifecycle policies
- Monitor API usage and implement user-friendly error messages

## Integration Testing Requirements

### Core User Flows to Test
1. **Complete Dream Journey**: Record → Transcribe → Interpret → Save
2. **Permission Handling**: Microphone access, storage permissions
3. **Network Scenarios**: Poor connectivity, offline usage, retry logic
4. **Error States**: Failed uploads, API timeouts, storage full
5. **Authentication Flows**: Anonymous usage, sign-in/out, data sync

### Device-Specific Testing
- **iOS**: Test on iPhone 11 and newer (different screen sizes)
- **Android**: Test permissions model, background processing limitations
- **Audio Quality**: Validate recording quality across different devices

## Security & Privacy Implementation

### Data Protection Requirements
- Never store OpenAI API keys in client code
- Implement request sanitization before LLM calls
- Use signed URLs with short TTL for all file operations
- Encrypt sensitive user preferences in local storage

### GDPR Compliance Checklist
- Explicit consent for server-side audio storage
- User-initiated data deletion (complete removal)
- Privacy policy integration with app store requirements
- Data portability (export user's dream entries)

## Performance & Scalability Considerations

### Client-Side Optimization
- Lazy load dream history for better initial load times
- Implement audio recording with proper memory management
- Cache frequently accessed user preferences locally
- Use React Native's New Architecture for improved performance

### Backend Scalability
- Edge Functions auto-scale but keep processing time under 60 seconds
- Implement request queuing for high-volume transcription
- Use Postgres indexes on user_id and created_at columns
- Monitor Supabase quotas and implement graceful degradation