import { UI, lang, t } from './language.js';

const $ = (selector) => document.querySelector(selector);

let pwaRegistration = null;
let deferredInstallPrompt = null;
let offlineReady = false;
let offlineBusy = false;
let offlineStarting = false;
let offlineStartupFailed = false;
let offlineRefreshQueued = false;

function offlineText(key, values = {}) {
  return Object.entries(values).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
    t(key),
  );
}
function setOfflineStatus(message) {
  $('#offline-status').textContent = message;
}
function updateOfflineControls() {
  const button = $('#offline-download');
  button.disabled = offlineBusy || offlineStarting || (!pwaRegistration && !offlineStartupFailed);
  button.textContent = offlineStartupFailed
    ? t('offlineRetry')
    : offlineReady
      ? t('offlineRemove')
      : t('offlineDownload');
  button.dataset.action = offlineStartupFailed ? 'retry' : offlineReady ? 'remove' : 'download';
}
function requestServiceWorker(type, onMessage = () => {}) {
  return new Promise((resolve, reject) => {
    const worker = pwaRegistration?.active;
    if (!worker || !('MessageChannel' in window)) {
      reject(new Error('service-worker-unavailable'));
      return;
    }
    const channel = new window.MessageChannel();
    const timeout = window.setTimeout(() => {
      channel.port1.close();
      reject(new Error('service-worker-timeout'));
    }, 180_000);
    channel.port1.onmessage = ({ data }) => {
      onMessage(data);
      if (['STATUS', 'COMPLETE', 'REMOVED', 'ERROR'].includes(data?.type)) {
        window.clearTimeout(timeout);
        channel.port1.close();
        if (data.type === 'ERROR') reject(new Error('service-worker-operation-failed'));
        else resolve(data);
      }
    };
    worker.postMessage({ type }, [channel.port2]);
  });
}
async function refreshOfflineStatus() {
  try {
    const status = await requestServiceWorker('OFFLINE_STATUS');
    offlineReady = status.ready;
    if (status.ready) setOfflineStatus(offlineText('offlineReady', { count: status.total - 1 }));
    else if (status.saved) {
      setOfflineStatus(offlineText('offlinePartial', { saved: status.saved, total: status.total }));
    } else setOfflineStatus(t('offlineDescription'));
    updateOfflineControls();
    return status;
  } catch {
    setOfflineStatus(t('offlineUnsupported'));
    return null;
  }
}
async function startOfflineDownload() {
  if (!pwaRegistration || offlineBusy) return;
  offlineBusy = true;
  offlineReady = false;
  const progress = $('#offline-progress');
  progress.hidden = false;
  progress.value = 0;
  updateOfflineControls();
  try {
    const result = await requestServiceWorker('DOWNLOAD_OFFLINE', (message) => {
      if (message.type !== 'PROGRESS') return;
      progress.max = message.total;
      progress.value = message.completed;
      setOfflineStatus(
        offlineText('offlineProgress', { done: message.completed, total: message.total }),
      );
    });
    offlineReady = result.ready;
    if (offlineReady) {
      setOfflineStatus(offlineText('offlineReady', { count: result.total - 1 }));
    } else {
      setOfflineStatus(t('offlineFailed'));
    }
  } catch {
    setOfflineStatus(t('offlineFailed'));
  } finally {
    offlineBusy = false;
    progress.hidden = true;
    updateOfflineControls();
    if (offlineRefreshQueued) {
      offlineRefreshQueued = false;
      refreshOfflineStatus();
    }
  }
}
async function removeOfflineDownload() {
  if (!pwaRegistration || offlineBusy) return;
  offlineBusy = true;
  updateOfflineControls();
  try {
    await requestServiceWorker('REMOVE_OFFLINE');
    offlineReady = false;
    setOfflineStatus(t('offlineRemoved'));
  } catch {
    setOfflineStatus(t('offlineFailed'));
  } finally {
    offlineBusy = false;
    updateOfflineControls();
    if (offlineRefreshQueued) {
      offlineRefreshQueued = false;
      refreshOfflineStatus();
    }
  }
}
function withTimeout(promise, timeoutMs, errorCode) {
  let timeout;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeout = window.setTimeout(() => reject(new Error(errorCode)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => window.clearTimeout(timeout));
}
function waitForActiveWorker(registration, timeoutMs) {
  if (registration.active) return Promise.resolve(registration);
  return new Promise((resolve, reject) => {
    let observedWorker = null;
    let pollTimer = null;
    const cleanup = () => {
      window.clearTimeout(timeout);
      window.clearInterval(pollTimer);
      registration.removeEventListener('updatefound', observe);
      observedWorker?.removeEventListener('statechange', observe);
    };
    const fail = (error) => {
      cleanup();
      reject(error);
    };
    const observe = () => {
      if (registration.active) {
        cleanup();
        resolve(registration);
        return;
      }
      const worker = registration.installing || registration.waiting;
      if (worker && worker !== observedWorker) {
        observedWorker?.removeEventListener('statechange', observe);
        observedWorker = worker;
        observedWorker.addEventListener('statechange', observe);
      }
      if (observedWorker?.state === 'redundant') {
        fail(new Error('service-worker-install-failed'));
      }
    };
    const timeout = window.setTimeout(
      () => fail(new Error('service-worker-install-timeout')),
      timeoutMs,
    );
    pollTimer = window.setInterval(observe, 50);
    registration.addEventListener('updatefound', observe);
    observe();
  });
}
async function initializeServiceWorker() {
  if (offlineStarting || !('serviceWorker' in navigator) || !window.isSecureContext) return;
  offlineStarting = true;
  offlineStartupFailed = false;
  setOfflineStatus(t('offlineChecking'));
  updateOfflineControls();
  // Keep the initial state check short enough that a failed or hung worker
  // cannot leave the controls stuck on "Checking" beyond the UI's retry window.
  const startupDeadline = window.performance.now() + 2_500;
  const remainingStartupTime = () => Math.max(1, startupDeadline - window.performance.now());
  try {
    const registration = await withTimeout(
      Promise.resolve().then(() => navigator.serviceWorker.register('./service-worker.js')),
      remainingStartupTime(),
      'service-worker-registration-timeout',
    );
    pwaRegistration = await waitForActiveWorker(registration, remainingStartupTime());
    await withTimeout(
      refreshOfflineStatus(),
      remainingStartupTime(),
      'service-worker-status-timeout',
    );
    if (isStandaloneApp() && !offlineReady) startOfflineDownload();
  } catch (error) {
    console.warn('Offline support could not be installed', error);
    pwaRegistration = null;
    offlineStartupFailed = true;
    setOfflineStatus(t('offlineStartupFailed'));
  } finally {
    offlineStarting = false;
    updateOfflineControls();
  }
}
function isStandaloneApp() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}
function showInstallHelp() {
  const userAgent = navigator.userAgent;
  const isAppleMobile =
    /iPhone|iPad|iPod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);
  let stepsKey = 'installHelpDesktopSteps';
  if (isAppleMobile) {
    if (/CriOS/i.test(userAgent)) stepsKey = 'installHelpIosChromeSteps';
    else if (/FxiOS/i.test(userAgent)) stepsKey = 'installHelpIosFirefoxSteps';
    else if (/EdgiOS|OPiOS|DuckDuckGo/i.test(userAgent)) stepsKey = 'installHelpIosOtherSteps';
    else stepsKey = 'installHelpIosSafariSteps';
  } else if (isAndroid) {
    if (/SamsungBrowser/i.test(userAgent)) stepsKey = 'installHelpAndroidSamsungSteps';
    else if (/Firefox|Fennec/i.test(userAgent)) stepsKey = 'installHelpAndroidFirefoxSteps';
    else if (/EdgA|OPR|Opera|Brave/i.test(userAgent) || navigator.brave) {
      stepsKey = 'installHelpAndroidOtherSteps';
    } else if (/Chrome/i.test(userAgent)) stepsKey = 'installHelpAndroidChromeSteps';
    else stepsKey = 'installHelpAndroidOtherSteps';
  }
  const steps = UI[lang][stepsKey];
  $('#install-help-steps').replaceChildren(
    ...steps.map((step) => {
      const item = document.createElement('li');
      item.textContent = step;
      return item;
    }),
  );
  $('#install-help-offline-note').textContent = t('installHelpOfflineNote');
  $('#install-dialog').showModal();
}
async function installApp() {
  if (!deferredInstallPrompt) {
    showInstallHelp();
    return;
  }
  const promptEvent = deferredInstallPrompt;
  deferredInstallPrompt = null;
  $('#install-app').disabled = true;
  try {
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === 'dismissed') $('#install-app').disabled = false;
  } catch {
    $('#install-app').disabled = false;
    showInstallHelp();
  }
}
$('#offline-download').addEventListener('click', () => {
  const action = $('#offline-download').dataset.action;
  if (action === 'retry') initializeServiceWorker();
  else if (action === 'remove') removeOfflineDownload();
  else startOfflineDownload();
});
$('#install-app').addEventListener('click', installApp);
$('#close-install-dialog').addEventListener('click', () => $('#install-dialog').close());
$('#install-dialog').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  $('#install-app').hidden = true;
  if (pwaRegistration) startOfflineDownload();
});

if ('serviceWorker' in navigator && window.isSecureContext) {
  initializeServiceWorker();
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type !== 'OFFLINE_CACHE_CHANGED') return;
    if (offlineBusy) offlineRefreshQueued = true;
    else refreshOfflineStatus();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && pwaRegistration) refreshOfflineStatus();
  });
} else {
  setOfflineStatus(t('offlineUnsupported'));
  updateOfflineControls();
}
if (isStandaloneApp()) $('#install-app').hidden = true;

export function updateOfflineLanguage() {
  if ($('#offline-download')) updateOfflineControls();
  if (pwaRegistration) refreshOfflineStatus();
}
