# PermitPilot: 90-Second Demo

One story, told once: **a café owner in Taipei, then the same question in San Francisco.**
About 220 spoken words, at a calm pace. Read the "Say" lines out loud and time yourself.

## Script

| Time | Screen | Say |
|---|---|---|
| **0:00–0:12** | App open on Taipei, empty box | "Before you can open a café, you need permission from your city. Nobody tells you what that means until your application gets rejected. In Taipei, a small café needs five permits from four different offices." |
| **0:12–0:20** | Click the 咖啡廳 example | "This is PermitPilot. I describe my project the way I'd say it, here in Chinese: a 20-seat café in an old apartment building in Da'an." |
| **0:20–0:45** | Results appear. Scroll slowly: summary → red flag → permit cards. Tick one document checkbox. | "In seconds I get every permit I need, which office handles it, in English and Chinese, and the documents to bring. Most importantly, the red flags: my building is registered as residential, so I need a change of use first. That's the step that kills most projects, and now I know it before I sign a lease." |
| **0:45–1:05** | Scroll up. Click **San Francisco**, then the café example. | "Permits are a problem in every city. Here's the same café in San Francisco. Different departments, different rules, like the 30-day neighborhood notice. Same app, same code. A new city is just a new rules file." |
| **1:05–1:20** | Results on screen. Point at the agency names. | "The AI is grounded: it can only use permits and offices from that city's rules, so it can't invent an agency. And if the model is down, it still answers from the rules." |
| **1:20–1:30** | Back to top, logo visible | "There are 19,000 US cities, and almost all of them still review permits by hand. We start with residents, then sell the pre-check to City Hall. PermitPilot." |

## Before you record

- [ ] Real LLM key set on Vercel, so the badge says **AI answer**, not **Demo mode**. If you have no key, keep the
      Demo mode badge and drop the "if the model is down" line. Don't claim it's AI when it isn't.
- [ ] Run both café examples once to warm up the server (the first request is slower).
- [ ] Browser at 100% zoom, window about 1280 px wide, bookmarks bar hidden, other tabs closed.
- [ ] Turn off notifications (do not disturb).
- [ ] Do a full run-through with a timer. Over 90 seconds? Cut words, not features.

## Recording on Linux

- **Quickest:** GNOME's built-in recorder, `Ctrl + Shift + Alt + R`, records the whole screen. Press again to stop.
  It saves to `~/Videos/Screencasts`.
- **More control:** OBS Studio. Record a window, add your microphone, export to MP4.
- Record the voice and the screen together. Two or three takes is normal; keep the best one.

## Live demo fallback

If Wi-Fi or the AI fails on stage:
1. The example buttons still work in demo mode. Say "this is running on the rules alone" and keep going.
2. Have the recorded video open in another tab.
