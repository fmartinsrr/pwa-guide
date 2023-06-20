// Checks for support
if ('serviceWorker' in navigator) {
  // Register the service worker file
  navigator.serviceWorker.register("./service-worker-1.js");
}

let deferredPrompt;
// Trigger is matches the criteria.
window.addEventListener('beforeinstallprompt', (e) => {
 // Prevent the mini-infobar from appearing on mobile
 e.preventDefault();
 // Stash the event so it can be triggered later.
 deferredPrompt = e;
 // Update UI notify the user they can install the PWA
 showInstallPromotion();
 // Optionally, send analytics event that PWA install promo was shown.
 console.log(`'beforeinstallprompt' event was fired.`);
});

window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
 });

 let buttonListener = async function triggerInstall() {
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
 };

function showInstallPromotion() {
  console.log(`show install promotion`);
  const button = document.getElementById('pwa-install-button');
  if (button) {
    button.classList.remove('hidden');
    button.addEventListener('click', buttonListener);
  }
 };

 function hideInstallPromotion() {
  console.log(`hide install promotion`);
  const button = document.getElementById('pwa-install-button');
  if (button) {
    button.classList.add('hidden');
    button.removeEventListener('click', buttonListener);
  }
};