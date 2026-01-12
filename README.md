# 👶 New Parent Micro-Habits Tracker

A local-first, privacy-focused habit tracker designed specifically for new parents. Build sustainable micro-habits during one of life's most challenging and rewarding transitions.

## ✨ Features

### 📅 Today View
- One-tap habit completion for the current day
- Progress bar showing daily completion
- Optional notes for each habit
- Clean, intuitive interface designed for sleep-deprived parents

### ✏️ Habit Management
- Add, edit, and delete custom habits
- Pre-loaded with 5 essential new parent habits
- Toggle habits active/inactive without deleting
- Custom icons (emojis) and descriptions

### 🔥 Streaks
- Track current and best streaks
- "On-track day" metric (customizable threshold)
- 7-day visual history
- 30-day completion rates per habit
- Encouragement messages to keep you motivated

### 📊 Weekly Recap
- Beautiful visual summary of the last 7 days
- Shareable recap text (copy to clipboard)
- Personalized insights based on your progress
- Calendar view with completion status

### ⚙️ Settings
- Export/import data as JSON for backup
- Reset all data (with confirmation)
- Customize "on-track" threshold
- Privacy-first: all data stays on your device

## 🔒 Privacy

**100% Local-First.** All your data is stored in your browser's local storage. Nothing is sent to any server. Your habits and progress are completely private and under your control.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd new-parent-microhabits
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

The app will be built and ready for deployment in the `.next` folder.

## 📦 Deployment

This app is designed to be deployed on Vercel with zero configuration:

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/new-parent-microhabits)

### Other Deployment Options
- **Netlify**: Works out of the box
- **Cloudflare Pages**: Supports Next.js
- **Self-hosted**: Use `npm run build && npm run start`

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **State**: React Hooks + Local Storage
- **Icons**: Emoji (no icon library needed!)

## 📱 Features Breakdown

### Default Habits for New Parents
1. **5-min self-care** 🧘 - Take 5 minutes for yourself today
2. **Drink water** 💧 - Stay hydrated throughout the day
3. **Connect with partner** 💬 - Check in with your partner
4. **Sleep when baby sleeps** 😴 - Rest during nap time
5. **Ask for help** 🤝 - Reach out when you need support

### "On-Track Day" Logic
A day is considered "on track" when you complete at least N habits (default: 4 out of 5). This threshold is customizable in Settings. The streak counter tracks consecutive on-track days.

## 🗺️ Roadmap

Future enhancements could include:
- [ ] Custom themes (light/dark mode toggle)
- [ ] Habit scheduling (specific days of week)
- [ ] Reminder notifications (optional)
- [ ] Visual charts and graphs
- [ ] Export recap as image
- [ ] Multi-device sync (optional, privacy-preserving)
- [ ] Habit templates for different parenting stages

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome! Please open an issue to discuss any changes.

## 📄 License

MIT License - feel free to use this project for your own needs.

## 💝 Acknowledgments

Built with ❤️ for all the amazing parents out there doing their best every day.

---

**Remember**: You're doing an incredible job. Every small habit counts. Be kind to yourself. 💛
