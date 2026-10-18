# FIRE in India — Strategy Selector & Interactive Web Widget

A lightweight, high-performance, mobile-first interactive Strategy Selector application built specifically for the subscribers of the **FIRE in India** YouTube channel (`@FIREinIndia`).

---

## 🌟 Key Features

1. **30-Second Guided Quiz (Find My Strategy):**
   - **Step 1: Capital** (`₹10k–50k`, `₹50k–1L`, `₹1L–5L`, `₹5L+`)
   - **Step 2: Screen Time** (`Daily EOD 10-15 mins`, `Weekly/Weekend 1 hr`, `Monthly/Hands-off`)
   - **Step 3: Asset Preference** (`Safe ETFs & Gold`, `Direct Stocks`, `Options & Cash Flow`, `Open to All`)
   - **Result:** Pinpoints the top 1 to 3 best-matched strategies, complete with personalized Persona badges and rationale.

2. **Browse All 39 Strategies (Searchable Directory):**
   - Real-time search across strategy names, technical indicators, and buy rules (e.g. searching *"SST"*, *"Turtle"*, *"Shop"*, *"SMA"*).
   - Instant filter pills for Capital tiers, Asset classes, Frequencies, and Free vs Premium access.

3. **Complete Strategy Cards:**
   - Strategy name, Capital & Frequency tags, and Profit Target.
   - Expandable **"View Buy & Sell Rules"** accordion.
   - Direct `▶ Watch Tutorial` button (YouTube) and `📄 Free Sheet` or `💎 Get Strategy Sheet` button.

4. **1-Click Embed Snippet:**
   - Embed modal with pre-configured `<iframe>` code to embed anywhere on Odoo, WordPress, or blogs.

---

## 📁 File Structure

```
FIRE Strategy Selector/
├── index.html            # Main Single Page Application
├── style.css             # Modern Fintech Dark Theme & Glassmorphism styles
├── data.js               # Structured dataset containing all 39 strategies
├── app.js                # Quiz logic, matching algorithm, search & filter engine
├── embed-example.html    # Demo page showing the widget embedded in an iframe
├── README.md             # Guide & deployment instructions
└── tests/
    ├── verify_data.ps1   # Automated dataset verification
    └── verify_app.ps1    # End-to-end DOM & link validator
```

---

## 🚀 How to Run Locally

You can run this instantly on any browser:
1. Double-click `index.html` to open it in Chrome, Edge, or Firefox.
2. Or preview `embed-example.html` to see how it renders inside an iframe.

---

## 🌐 How to Host & Deploy (Free & Instant)

### Option A: GitHub Pages (Recommended)
1. Push this folder to a GitHub repository (e.g., `strategy-selector`).
2. Go to **Settings > Pages** and set source to `main` branch.
3. Your live link will be: `https://yourusername.github.io/strategy-selector/`.

### Option B: Tiiny.host or Netlify Drop (Instant Drag-and-Drop)
1. Zip the contents of `FIRE Strategy Selector`.
2. Drag and drop onto [tiiny.host](https://tiiny.host) or [app.netlify.com/drop](https://app.netlify.com/drop).
3. You get an instant public URL (e.g., `https://fire-strategy.tiiny.site`).

---

## 💻 How to Embed on Your Odoo Website (`fireinindia2021.odoo.com`)

1. Open your Odoo website editor on your target page (e.g., `/strategy-finder` or `/shop`).
2. Drag the **Embed Code / HTML** block into your layout.
3. Paste the following snippet (replace `YOUR_HOSTED_URL` with your live link):

```html
<iframe 
  src="YOUR_HOSTED_URL" 
  width="100%" 
  height="820" 
  frameborder="0" 
  style="border: none; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4);" 
  title="FIRE in India Strategy Selector"
  loading="lazy">
</iframe>
```

---

## 📺 How to Use in Your YouTube Videos

Add this to your video description and pin it in the comments:
> 🎯 **Confused about which strategy is best for you?**  
> Use our free 30-Second Strategy Finder to get your personalized recommendation:  
> 👉 [YOUR_WIDGET_LINK]
