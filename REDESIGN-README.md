# Éclorege Premium Storefront Redesign

## What changed
- Premium forest-green / warm-ivory / champagne visual direction.
- Separate static pages: `index.html`, `collection.html`, `story.html`, `faq.html`, and `product.html?id=1` through `product.html?id=5` for individual product detail pages.
- Product-focused crops created from the supplied product artwork and displayed in consistent image frames. These are crops of the supplied artwork, not newly photographed product packshots.
- Responsive navigation, persistent shopping bag, checkout modal, reveal-on-scroll and hover animations, plus reduced-motion support.
- Existing Google Apps Script backend retained in `backend/Code.gs`.

## Publish to GitHub Pages
1. Download and unzip this package.
2. Open the `eclorege_redesign` folder.
3. In your GitHub repository, choose **Add file → Upload files**.
4. Upload the *contents* of this folder to the repository root, allowing GitHub to replace the existing `index.html`, `styles.css`, and `app.js` and add the new HTML pages and `assets/products` folder.
5. Commit changes and wait for GitHub Pages to redeploy.

## Important: order integration
Open `app.js` and replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the deployed Apps Script `/exec` URL. Keep the Google Sheet private. The storefront cannot submit live orders until this URL and the backend's deployment settings are configured.

## Product imagery
The `assets/products` images are tighter product-focused crops from the supplied graphics. For the best final result, replace them with original high-resolution product-only photographs (bottle centered on a plain background) if you have them. Keep the same filenames to avoid changing code:
- `assets/products/acne-control-product.jpg`
- `assets/products/amber-product.jpg`
- `assets/products/booster-product.jpg`
- `assets/products/exosomes-product.jpg`
- `assets/products/hair-product.jpg`

Product six and seven are not listed until their official details and prices are confirmed.
