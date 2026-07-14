# Cloud Bros Clubs ☁️

A full-featured web app for sky enthusiasts. Chat on spun clouds, train with masters, spill secrets, scan the global radar, start peer-to-peer video calls, and experience the MM protocol.

## ✨ Features

- **Onboarding**: Set your handle, region, and role (Pilot or Rookie)
- **Spun Chat**: Real-time chat with simulated bros and persistent message history
- **Global Radar**: Interactive radar showing 150+ bros worldwide with profile modals
- **Live Spins**: Local webcam feed + peer-to-peer WebRTC video calling
- **Video Calls**: Real encrypted peer-to-peer video calls with mute/video-off/hangup controls
- **Secrets**: Anonymous confessions to the Masters with master replies
- **Masters**: Detailed master profiles with call & chat buttons
- **Profile**: Stats dashboard with spin level, slam count, MM progress
- **Admin Panel**: Pin messages, broadcast announcements, ban users, view stats
  - Login as any name containing "admin" to unlock the admin toggle
- **Persistent Storage**: All messages, secrets, and profile data saved across sessions
- **Toast Notifications**: Real-time feedback for all actions

## 🛠️ Tech Stack

- **Vanilla HTML, CSS, JavaScript** — No frameworks, no build step
- **Tailwind CSS** (CDN) — Utility-first styling
- **WebRTC** — Peer-to-peer encrypted video calls
- **BroadcastChannel API** — Same-origin signaling for video calls
- **Storage API** — Persistent data with SDK + localStorage fallback
- **Modular Architecture** — `storage.js`, `state.js`, `videoCall.js`, `ui.js`, `main.js`

## 🚀 Deployment

This app is pure static HTML/JS/CSS — deploy anywhere.

### Deploy to Vercel

1. Push this code to a GitHub repository
2. Go to [Vercel](https://vercel.com) → **Add New** → **Project**
3. Import your GitHub repository
4. Click **Deploy** — no build settings needed!

### Deploy to GitHub Pages

1. Push to GitHub → **Settings** → **Pages**
2. Select branch `main`, folder `/ (root)`
3. Click **Save** — live in ~1 minute

### Deploy to Netlify

1. Drag & drop the project folder onto [Netlify Drop](https://app.netlify.com/drop)
2. Done!

## 🔑 Admin Access

To access the admin panel:
1. Sign up with a name containing "admin" (e.g., "AdminBro", "CloudAdmin")
2. An **ADMIN** button appears in the header
3. Click it to toggle the admin panel in the Profile tab
4. Pin messages, broadcast announcements, delete secrets, ban users

## 📹 Video Calls

- Click any master or live streamer → **START VIDEO CALL**
- Uses WebRTC for encrypted peer-to-peer connection
- Requires camera & microphone permission
- Works best when deployed (iframe sandboxes may block camera)
- Mute, video-off, and hangup controls included

## 🏠 Local Development

Open `index.html` in any browser. No server or build step required.

## 📁 File Structure

```
├── index.html          # App shell + modals
├── main.js             # Bootstrap + event wiring
├── state.js            # Centralized state + persistence
├── storage.js          # Storage abstraction (SDK + localStorage)
├── videoCall.js        # WebRTC peer-to-peer calling
├── ui.js               # All DOM rendering functions
├── mockData.js         # Seed data: users, messages, secrets, masters
├── styles.css          # Custom styles + animations
└── locales/en.json     # i18n source strings
```
