const CONSENT_KEY = 'repzena-analytics-consent';
const CONFIG_URL = './data/analytics-config.json';
const CONSENT_ACCEPTED = 'accepted';
const CONSENT_REJECTED = 'rejected';

const panel = document.querySelector('#privacy-panel');
const acceptButton = document.querySelector('#analytics-accept');
const rejectButton = document.querySelector('#analytics-reject');
const settingsButton = document.querySelector('#privacy-settings');

let measurementId = null;
let scriptLoading = false;
let configured = false;
let consent = readConsent();

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function saveConsent(value) {
  consent = value;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Keep the choice for this page view when browser storage is unavailable.
  }
}

function showPrivacyPanel() {
  panel.hidden = false;
}

function hidePrivacyPanel() {
  panel.hidden = true;
}

function setAnalyticsDisabled(disabled) {
  if (measurementId) window[`ga-disable-${measurementId}`] = disabled;
}

function removeAnalyticsCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
}

function trackPageView(event) {
  if (consent !== CONSENT_ACCEPTED || !configured || typeof window.gtag !== 'function') return;
  const { path, title } = event.detail || {};
  window.gtag('event', 'page_view', {
    page_location: new URL(path || location.href, location.origin).href,
    page_title: title || document.title,
  });
}

async function loadAnalytics() {
  if (consent !== CONSENT_ACCEPTED || scriptLoading || configured) return;
  scriptLoading = true;
  try {
    const response = await fetch(CONFIG_URL, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Analytics configuration unavailable (${response.status})`);
    const config = await response.json();
    if (consent !== CONSENT_ACCEPTED) {
      scriptLoading = false;
      return;
    }
    if (!/^G-[A-Z0-9]+$/.test(config.measurementId || '')) {
      throw new Error('Analytics measurement ID is invalid');
    }
    measurementId = config.measurementId;
    setAnalyticsDisabled(false);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onload = () => {
      scriptLoading = false;
      if (consent !== CONSENT_ACCEPTED) return;
      configured = true;
      trackPageView({ detail: { path: location.href, title: document.title } });
    };
    script.onerror = () => {
      scriptLoading = false;
      console.warn('Google Analytics could not be loaded');
    };
    document.head.append(script);
  } catch (error) {
    scriptLoading = false;
    console.warn('Google Analytics could not be configured', error);
  }
}

acceptButton.addEventListener('click', () => {
  saveConsent(CONSENT_ACCEPTED);
  hidePrivacyPanel();
  loadAnalytics();
});

rejectButton.addEventListener('click', () => {
  saveConsent(CONSENT_REJECTED);
  setAnalyticsDisabled(true);
  removeAnalyticsCookies();
  hidePrivacyPanel();
});

settingsButton.addEventListener('click', showPrivacyPanel);
window.addEventListener('repzena:pageview', trackPageView);

if (consent === CONSENT_ACCEPTED) loadAnalytics();
else if (consent === CONSENT_REJECTED) hidePrivacyPanel();
else showPrivacyPanel();
