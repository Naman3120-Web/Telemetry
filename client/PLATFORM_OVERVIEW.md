# TELEMETRY - Platform Overview

**Tagline:** Train like a fleet. Focus like a captain.

Multiplayer gamified Pomodoro with decentralized WebRTC, XP/achievement system, and live study rooms.

**Features:** Real-time P2P presence sync • Live video rooms • XP/levels/badges • Leaderboards • Mini-games • Premium space theme

---

## 🗂️ 4 Core Pages

**1. HOME** - Welcome, registration, leaderboard, platform stats (90% success rate, active users)

**2. FOCUS SESSION** - 25-min Pomodoro timer, solo mode, lo-fi audio, avg focus tracking, XP earned

**3. ROOM** - Multiplayer study with live WebRTC video/audio, browse rooms, timer sync, P2P mesh network

**4. RELAX** - Meditation, mind games, mini-games (Roulette, Speed, Streaks, Crew Quests)

---

## 🎮 Gamification

**XP:** 25-100 per session (crew +25%, streak +15%, weekend +50%)  
**Levels:** 1,000 XP = 1 level (cap: 100)  
**Badges:** Common (blue) • Rare (purple) • Epic (gold) • Legendary (red)  
**Leaderboards:** Personal, Crew, Friends, Global

---

## 💾 Tech Stack

**Frontend:** React 18 + Vite, Poppins font, CSS glassmorphism, Context API  
**Backend:** Node.js + Express, PostgreSQL, Socket.io  
**Real-time:** WebRTC P2P mesh, PeerJS, 20ms heartbeat  
**Design:** Black (#0a0a0a), White, Gray (#9ca3af), Red (#dc2626), starfield animation

---

## 📊 Key Data Models

- **User:** id, username, level, xp, streak, sessions
- **Session:** duration, xp_earned, task_name, focus_quality
- **Room:** name, host_id, participants, is_active, privacy
- **Achievement:** user_id, name, tier, unlock_date

---

## 🎨 Design

**Colors:** Black (#0a0a0a) • White (#ffffff) • Gray (#9ca3af) • Red (#dc2626) • Hover (#b91c1c)  
**Effects:** Starfield animation • Glassmorphism cards • 0.3s smooth transitions • Radial gradient highlights

---

## 📋 Survey Topics (8 Categories)

**1. Demographics:** Age, study level, focus area  
**2. Pain Points:** Current tools, distractions, motivation  
**3. Features:** Multiplayer, video, gamification, leaderboards  
**4. Technical:** Privacy, video recording, bandwidth, devices  
**5. Usage:** Session length (25/45/90min), solo vs group, frequency  
**6. Gamification:** XP appeal, badges, leaderboard stakes, cosmetics  
**7. Relax:** Meditation, mini-games, ambient sound  
**8. Monetization:** Premium willingness, ads, subscription

---

## 📈 Success Metrics

**Engagement:** DAU, session completion %, avg sessions/week, Day 7/30 return, crew formation rate  
**Platform:** P2P connection success %, avg latency, uptime, NPS  
**Gamification:** XP redemption, achievement unlock, leaderboard engagement, mini-game participation  
**Social:** Avg crew size, rooms/day, video adoption %, invite acceptance

---

## 🚀 MVP & Roadmap

**Phase 1 (MVP):** HOME registration • FOCUS SESSION timer • ROOM multiplayer • RELAX mini-games • Basic XP • Simple leaderboard

**Phase 2:** Crew management • Advanced achievements • Video/voice • Mobile • Messaging • Analytics

---

## 💡 7 Unique Selling Points

1. **Decentralized Real-time Sync** - WebRTC P2P mesh, no bottleneck
2. **Deep Gamification** - Meaningful progression beyond timers
3. **Social Accountability** - Live presence + video creates commitment
4. **Premium Aesthetic** - Modern space theme
5. **Privacy-First** - P2P video, no server recording
6. **Mini-Games** - Engagement booster during breaks
7. **Flexible Modes** - Solo/crew, public/private rooms

**Status:** MVP Development | **Launch:** Q2 2026
