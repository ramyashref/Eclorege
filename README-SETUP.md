# Éclorege Mesotherapy — GitHub Pages + Google Sheets + WhatsApp

This package includes:
- `index.html`, `styles.css`, `app.js`, and `assets/` for the English storefront.
- `backend/Code.gs` for saving orders to Google Sheets and sending an internal WhatsApp Business notification.
- `README-SETUP.md` for setup.

## Before going live

The Apps Script backend and Meta WhatsApp API require setup in your own Google and Meta accounts. No access tokens are included in this repository. Do not commit credentials or customer data to GitHub.

## 1. Create the private order spreadsheet

1. Open [Google Apps Script](https://script.google.com/) and create a new project.
2. Copy `backend/Code.gs` into the script editor, replacing the starter code.
3. Select `setup` from the function dropdown and click **Run**.
4. Approve the requested Google permissions.
5. Open **Execution log** to get the generated spreadsheet URL.
6. Keep that spreadsheet private. Share it only with people who should see customer details.

The script stores the spreadsheet ID in Script Properties automatically.

## 2. Configure WhatsApp Business notifications

This integration uses the official WhatsApp Cloud API. It sends a notification to your own business/admin WhatsApp number when a new order is saved. It does not automatically message the customer.

In Meta for Developers, set up a WhatsApp Business Platform app and obtain:
- WhatsApp access token
- Phone Number ID for the business number that sends messages
- The admin WhatsApp number that should receive alerts, in international format

Create and get approval for a Utility message template named `new_order_alert` in English (`en_US`) with this body, preserving the five numbered placeholders:

`New Éclorege order received. Order: {{1}}. Customer: {{2}}. Phone: {{3}}. Delivery area: {{4}}. Total: {{5}}. Open the private order sheet for the full delivery address and item details.`

In Apps Script, open **Project Settings → Script Properties** and add these properties:

| Property | Value |
|---|---|
| `WHATSAPP_TOKEN` | Your Meta access token |
| `WHATSAPP_PHONE_NUMBER_ID` | Sender Phone Number ID from Meta |
| `WHATSAPP_NOTIFY_TO` | Your admin WhatsApp number, digits with country code |
| `WHATSAPP_TEMPLATE_NAME` | `new_order_alert` |
| `WHATSAPP_TEMPLATE_LANGUAGE` | `en_US` |
| `WHATSAPP_GRAPH_VERSION` | Current Graph API version supported by your Meta app |

Never put these values in `app.js`, `index.html`, or any public GitHub file.

If WhatsApp is not configured or the API fails, the order remains in Google Sheets. Check Apps Script **Executions** for notification errors.

## 3. Deploy Apps Script as a Web App

1. Click **Deploy → New deployment**.
2. Select **Web app**.
3. Set **Execute as** to **Me**.
4. Set access to **Anyone** so storefront visitors can submit orders.
5. Deploy, authorize if prompted, and copy the deployed URL ending in `/exec`.

Anyone-accessible endpoints can be abused. The script includes input validation, server-side price/shipping calculation, a honeypot field, a short per-phone repeat limit, and a lock while writing rows. For a high-traffic or paid-ad store, add a CAPTCHA/rate-limiting gateway before going live and monitor Apps Script quotas.

## 4. Connect GitHub Pages to Apps Script

In `app.js`, replace:

`PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`

with the deployed `/exec` URL. Do not paste the WhatsApp token here.

Upload the site files to the root of your GitHub repository, including the `assets` directory. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, and save.

## 5. Order rules

The backend, not the browser, determines prices:
- Product 1: EGP 400
- Product 2: EGP 450
- Product 3: EGP 750
- Product 4: EGP 450
- Product 5: EGP 550
- Products 6 and 7 are not purchasable until names/prices are configured.
- Shipping: EGP 100 within Greater Cairo, EGP 150 outside Greater Cairo.
- Free shipping when product subtotal is EGP 5,000 or more.
- Payment: Cash on Delivery.

## 6. Privacy and customer data

- Keep the Google Sheet private and enable two-step verification on the Google account.
- Collect only information needed to fulfill the order.
- Do not put customer names, phone numbers, addresses, tokens, or logs in the GitHub repository.
- Restrict access to Apps Script and the sheet to trusted administrators.
- Use a clear privacy notice on the storefront and define a retention/deletion policy for old orders.
- WhatsApp notifications include order ID, customer name, phone, delivery area, and total. The full address and item details remain in the private spreadsheet.
- Test with your own details before accepting customer orders.

## 7. Test checklist

- Submit a test order using your own contact details.
- Verify the order row and totals in the private Google Sheet.
- Verify the WhatsApp notification reaches the configured admin number.
- Test Greater Cairo shipping, outside Greater Cairo shipping, and free shipping at EGP 5,000+.
- Confirm products 6 and 7 cannot be purchased while their prices are unset.
- Delete the test row after verifying the integration.
