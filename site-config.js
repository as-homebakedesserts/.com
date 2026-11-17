/* Site configuration. This is the only file you need to edit to go live. */

// Published Google Sheet CSV. Leave blank to use the bundled menu-images.csv sample.
window.MENU_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6NYlCgQzuWa36GTBcqv1HvSVjoJ-0NGgwU2brgpoKUOa-d6KM2UmcZoY3EZOAhnr0nsxlEEAlnDXN/pub?output=csv';

// Currency for the menu card prices. Must match CAFE_ORDER.currency below.
window.MENU_CURRENCY = 'INR';

// Apps Script Web App URL. Deploy payment-backend/Code.gs as a Web App first.
// Leave this placeholder until you have the deployment URL ending in /exec.
window.CAFE_ORDER = {
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbyo3eUSPxpfAof8c_dOKlZST3I2LK8wI9CwVA59zsZIBppQdjca_ZMuwV8RC43zBKV68w/exec',

  // WhatsApp click-to-chat number: digits only, with country code and no "+".
  whatsappNumber: '917338888957',

  // Public payment details used to build the on-page UPI link and QR.
  upiId: 'anjumt01@ptyes',
  payeeName: 'A&S Home Bake Desserts',

  currency: 'INR',
  locale: 'en-IN',

  // Guard rails
  maxQtyPerLine: 20,
  maxLines: 30,

  // Add ?demo=1 to the URL to test the order form without submitting.
  demoMode: false
};
