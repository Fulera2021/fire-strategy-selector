# FIRE in India — Festive 20% Discount Announcement Widget

This folder contains the complete, self-contained **Festive Season 20% Discount** page and embed snippet for your Odoo website (`fireinindia2021.odoo.com`).

---

## 📁 Files Included

1. **`festival-offer.html`**
   - Self-contained luxury festive promotion page (no external CSS or JS frameworks needed).
   - Features:
     - 🪔 Animated golden glowing Diyas (pure SVG, ultra-sharp on retina & mobile).
     - ✨ Lightweight 60 FPS gold particle canvas sparkles.
     - 🏷️ Big **20% OFF** bold festive badge.
     - 📋 **1-Click Copy Coupon Code** (`FESTIVE20`) with instant visual confirmation.
     - ⏰ **Dynamic Countdown Timer** (adds urgency; auto-adjusts).
     - 💎 Feature highlights (39+ systems, Google Sheet calculators, lifetime access).
     - 🛒 High-converting CTA button linking directly to your Odoo Strategy Store: `https://fireinindia2021.odoo.com/shop`.
     - 📱 100% mobile-friendly and responsive.

2. **`odoo-embed-snippet.html`**
   - The clean `<iframe ...>` code snippet to paste into your Odoo Website Editor.

---

## 🚀 How to Put it Live on Your Odoo Website

### Step 1: Push to GitHub
Run git push (already done if committed). Once pushed to `main`, GitHub Pages automatically serves it at:
```
https://fulera2021.github.io/fire-strategy-selector/Odoo/festival-offer.html
```

### Step 2: Embed into Odoo
1. Open your Odoo website editor (`fireinindia2021.odoo.com`).
2. Create a new page (e.g. `/festive-offer` or `/diwali-offer`) or edit an existing banner block.
3. Drag the **Embed Code / HTML** block into your page.
4. Paste the snippet from `odoo-embed-snippet.html`:
```html
<div style="width: 100%; max-width: 980px; margin: 0 auto; padding: 10px 0;">
  <iframe 
    src="https://fulera2021.github.io/fire-strategy-selector/Odoo/festival-offer.html" 
    width="100%" 
    height="960" 
    frameborder="0" 
    style="border: none; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6); display: block;" 
    title="FIRE in India — Festive Special 20% Discount"
    loading="lazy">
  </iframe>
</div>
```
5. Click **Save**.
