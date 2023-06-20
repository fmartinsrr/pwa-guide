# PWA Script

Used on this script:

[Node.js](https://nodejs.org/en)

[Vite.js](https://vitejs.dev)

[Lighthouse for Chrome](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)

[Google Chrome](https://www.google.com/intl/pt-PT/chrome/)

Any text editor ([VS Code](https://code.visualstudio.com) for example)

## Start a project or open an existing project

Notes, if you had used `npx create-react-app photobook-app` you will have already a service worker through the [`workbox`](https://developer.chrome.com/docs/workbox/) library.

This [Workbox](https://developer.chrome.com/docs/workbox/) library is a collection of JavaScript libraries for Progressive Web Apps, it has already most of the code we will study today, but the goal of this talk is to show you the bare bones of the PWA and hopefully give you the simplier vision below so much abstractions we have these days.

Because sometimes understanding the basic can be more powerfull\helpful to unlock concepts in our minds than gathering one more tool\library to include in ours projects.

### 1. Terminal

```bash
npm create vite@latest pwa_demo_app -- --template react
cd pwa_demo_app
npm install
npm run dev
```



### 2. Google Chrome

Open the project url.

```
http://localhost:5173
```

Open the Chrome DevTools.

Select Application tab.

Select Manifest section.

	- show the errors.

Select Service Workers section.

	- show there is nothing there.

Select Lighthouse.

 - show it is not ready for PWA.

   

## Manifest file - Make it installable

### 1. VS Code

Copy to public:

	- logo192.png
	- logo512.png

Create a new file on the public folder named `manifest.json`.

- Add the following structure to it:

  ```json
  {
    "short_name": "PWA",
    "name": "Progressive Web App",
    "icons": [
      {
        "src": "logo192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "logo512.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ],
    "id": "com.example.app",
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff"
  }
  ```

- Add on the index.html from the root folder:

  ```html
  	...
  	<link rel="manifest" href="/manifest.json" />
  </head>
  ```

### 2. Google Chrome

Open the project url.

```
http://localhost:5173
```

Open the Chrome DevTools.

Select Application tab.

Select Manifest section.

 - show there is NO errors.

Select Lighthouse.

 - show it is not ready for PWA.



## Optimizations

### 1 .VS Code

Copy to public:

 - favicon.ico
 - logo512-maskable.png
 - logo180-iOS.png

Update the `manifest.json` file to:

```json
{
  "short_name": "PWA",
  "name": "Progressive Web App",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "32x32",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    },
    {
    	"src": "logo512-maskable.png",
    	"type": "image/png",
    	"sizes": "512x512",
    	"purpose": "maskable"
 		}
  ],
  "id": "com.example.app",
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

You can use https://maskable.app to show how they could look in Android.

Set the theme color (iOS related) on the `index.html`

```html
	...	
	<meta name="theme-color" content="#000000" />
</head>
```

Add the iOS related icon on the `index.html`

```html
	...
	<link rel="apple-touch-icon" href="/logo180-iOS.png">
</head>
```

Notice: this iOS logo can't have alpha channel.



Create a new `.js` file on the `root` of the project, it can be any name. It will be used to receive all service worker events. In our case it will be named `sw.js`.

For now it will be empty.

We could place the code to initialize the servce worker on the files we already have but to better understanding and separate concepts let's create another `.js` file on the `root` directory named `pwa-handler.js`.

On the `/pwa-handler.js` add the following code:

```javascript
// Checks for support
if ('serviceWorker' in navigator) {
  // Register the service worker file
  navigator.serviceWorker.register("./sw.js");
}
```

Now on the `index.html` file include this `pwa-handler.js`:

```html
	...	
	<script src="/pwa-handler.js"></script>
</body>
```

### 2. Google Chrome

Open the project url.

```
http://localhost:5173
```

Open the Chrome DevTools.

Select Application tab.

Select Manifest section.

 - show the maskable icon.

Select Service Workers section.

 - show there is NO errors.

Select Lighthouse.

 - show it IS ready for PWA.

### 3. VS Code - Update the service worker file

Include the following on the `sw.js`:

```javascript
// This code executes in its own worker or thread
self.addEventListener("install", event => {
	console.log("Service worker installed");
});

self.addEventListener("activate", event => {
	console.log("Service worker activated");
});
 
// We don't need to call the fetch.
// By design, without any return the service worker will fallback to the default behaviour.
self.addEventListener("fetch", event => {
	console.log("Service worker fetch");
});
```

### 4. Google Chrome

Open the project url.

```
http://localhost:5173
```

Open the Chrome DevTools.

Select Console tab.

 - show the logs.

Select Application tab.

	- click skipwaiting

Select Console tab.

 - show the logs.

   

### 5 . Install the App

Show the state of the count was kept.



## PWA - Install button

### 1. Unistall the App if installed.

### 2. VS Code

We will include some extra code to easily show the behaviour, and it is not required. 

The goal is to give ideias how to handle the PWA events.

 - Edit the `src/App.css` and include the following:

   ```css
   .hidden {
     visibility: hidden;
   }
   ```

 - Edit the `src/App.jsx` and include the following:

   ```javascript
   <button id="pwa-install-button" className="hidden">Install App</button>
   
   //db moview project:
   <button id="pwa-install-button" className="button hidden">Install App</button>

 - Edit the `pwa-handler.js` and include the following:

   ```javascript
   // Check for support
   if ('serviceWorker' in navigator) {
     // Register the service worker file
     navigator.serviceWorker.register("./sw.js");
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
   ```

### 3. Google Chrome

Open the project url.

```
http://localhost:5173
```

Open the Chrome DevTools.

Select Console tab.

	- show the logs

Click on the install

- show the popup
- cancel the install
  - show the logs

Click to install again

 - install the app from the popup.
   - show the logs.



## PWA - Offline page

If your application doesn't make sense to work without internet conectivity you can serve an offline page whenever you are offline.

### 1. VS Code

Create a new `.html` file on the root of the project `offline.html`, and include the following:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <link rel="stylesheet" href="/offline.css">
    <meta name="theme-color" content="#000000" />
  </head>
  <body>
    <div id="root">
      <div>
        <h1>Offline</h1>
        <div className="card">
          <button className="mt-2" onClick="window.location.reload();">
            Reload Page
          </button>
        </div>
      </div>
    </div>
  </body>
</html>
```

 Create a new `.css` file on the public folder `offline.css`, and include the following:

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  button {
    background-color: #f9f9f9;
  }
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}

.mt-2 {
  margin-top: 2em;
}
```

 - Notes about the place we left the offline `.css`: Since we are using the Vite.js it will build the .css files from the src folder and will include aditional Vit.js dependencies. Since we just want to cache the basic required files we place the .css on the public where it will not built.

Now lets update the service worker file `sw.js`:

```javascript
// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 1;

// By including the favicon we will prevent an error for this asset.
const PRE_CACHED_RESOURCES = [
  "favicon.ico",
	"offline.html",
	"offline.css"
];

const CACHE_NAME = "offline_v1";


// This code executes in its own worker or thread
self.addEventListener("install", event => {
	console.log("Service worker installed");
  async function preCacheResources() {
    // Open the app's cache.
    const cache = await caches.open(CACHE_NAME);
    // Cache the new static resources.
    // Use the DevTools to check the cache.
    cache.addAll(PRE_CACHED_RESOURCES);
  }

  // Asks the browser to wait for the task in the promise to resolve (fulfilled or failed)
  // before terminating the service worker process.
  event.waitUntil(preCacheResources());
});


// Use this event to clean up outdated caches.
self.addEventListener("activate", event => {
	console.log("Service worker activated");
  async function deleteOldCaches() {
    // List all caches by their names.
    const names = await caches.keys();
    await Promise.all(names.map(name => {
      if (name !== CACHE_NAME) {
        // If a cache's name is the current name, delete it.
        return caches.delete(name);
      }
    }));
  }

  // Asks the browser to wait for the task in the promise to resolve (fulfilled or failed)
  // before terminating the service worker process.
  event.waitUntil(deleteOldCaches());
});


self.addEventListener("fetch", event => {
	console.log("Service worker fetch - Serving offline page");
  async function navigateOrDisplayOfflinePage() {
    try {
      // Try to load the page from the network.
      const networkResponse = await fetch(event.request);
      return networkResponse;
    } catch (error) {
      // The network call failed, the device is offline.
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match("offline.html");
      return cachedResponse;
    }
  }

  // Only call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === 'navigate') {
    event.respondWith(navigateOrDisplayOfflinePage());
  }
});


self.addEventListener("fetch", event => {
  console.log("Service worker fetch - Cache strategy - Cache first");
  async function serveCacheThenFetch() {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    return cachedResponse || await fetch(event.request);
  }
	
  const url = new URL(event.request.url);
  // For any resource we will try to return cached before fetch.
  if (event.request.mode !== 'navigate' && url.host !== 'api.themoviedb.org') {
    event.respondWith(serveCacheThenFetch());
  }
});


self.addEventListener("fetch", event => {
  console.log("Service worker fetch - Serving custom response");
	async function requestOrReturnEmptyResponse() {
    try {
      // Try to perform the request from the network.
      const networkResponse = await fetch(event.request);
      return networkResponse;
    } catch (error) {
			const emptyResponse = new Response(JSON.stringify({}), {
        	headers: {'Content-Type': 'application/json'},
	        status: 599
  	    });
      return emptyResponse;
    }
  }
  
  const url = new URL(event.request.url);
  if (event.request.method === 'GET' && url.host === 'api.themoviedb.org') {
    event.respondWith(requestOrReturnEmptyResponse());
  }
});

```



### 4. Google Chrome

Open the project url.

```
http://localhost:5173
```

Open the Chrome DevTools.

Select Application tab.

 - click skipWaiting

Select Cache Storage tab.

	- show the cached files

Select Service Workers tab.

- check the offline option

- reload the page

- uncheck the offline option

- reload the page

  

- Stop the server in the terminal

  - reload the page

- Start the server in the terminal

  - reload the page



## PWA - Stale while revalidating



### 1. VS Code

Edit the `sw.js` to:

```javascript
// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 2;

// By including the favicon we will prevent an error for this asset.
const PRE_CACHED_RESOURCES = [
  "favicon.ico",
	"offline.html",
	"offline.css"
];

const CACHE_NAME = "offline_v2";

// This code executes in its own worker or thread
self.addEventListener("install", event => {
	console.log("Service worker installed");
  async function preCacheResources() {
    // Open the app's cache.
    const cache = await caches.open(CACHE_NAME);
    // Cache the new static resources.
    // Use the DevTools to check the cache.
    cache.addAll(PRE_CACHED_RESOURCES);
  }

  // Asks the browser to wait for the task in the promise to resolve (fulfilled or failed)
  // before terminating the service worker process.
  event.waitUntil(preCacheResources());
});


// Use this event to clean up outdated caches.
self.addEventListener("activate", event => {
	console.log("Service worker activated");
  async function deleteOldCaches() {
    // List all caches by their names.
    const names = await caches.keys();
    await Promise.all(names.map(name => {
      if (name !== CACHE_NAME) {
        // If a cache's name is the current name, delete it.
        return caches.delete(name);
      }
    }));
  }

  // Asks the browser to wait for the task in the promise to resolve (fulfilled or failed)
  // before terminating the service worker process.
  event.waitUntil(deleteOldCaches());
});


self.addEventListener("fetch", event => {
	console.log("Service worker fetch - Serve response, or cache, or offline page");
  async function navigateOrDisplayOfflinePage() {
    const cache = await caches.open(CACHE_NAME);
    try {
      // Try to load the page from the network.
      const networkResponse = await fetch(event.request);
      
			// It's important to create a clone of the request before caching it.
      // This is because the original request object can only be consumed once.
      // Once it is used by the browser or service worker, it becomes unusable.
      const responseClone = networkResponse.clone();
      cache.put(event.request, responseClone);
      
      return networkResponse;
    } catch (error) {
      // The network call failed, the device is offline.
      const cachedResponse = await cache.match(event.request);
      // Return an already cached resource or show the offline page.
      return cachedResponse || await cache.match("offline.html");
    }
  }

  // Only call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === 'navigate') {
    event.respondWith(navigateOrDisplayOfflinePage());
  }
});


self.addEventListener("fetch", event => {
  console.log("Service worker fetch - Cache strategy - Cache first");
  async function fetchAndCacheOrReturnCache() {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    try {
      const networkResponse = await fetch(event.request);
			
			// It's important to create a clone of the request before caching it.
      // This is because the original request object can only be consumed once.
      // Once it is used by the browser or service worker, it becomes unusable.
      const responseClone = networkResponse.clone();
      cache.put(event.request, responseClone);
      
      // Option 1: Prioritize cached response over network.
      // return cachedResponse || networkResponse;
      
      // Option 2: allays return the fetched response.
      return networkResponse;
    }
    catch (error) {
	    return cachedResponse;  
    }
  }
	
  const url = new URL(event.request.url);
  // For any resource we will try to return cached before fetch.
  if (event.request.mode !== 'navigate' && url.host !== 'api.themoviedb.org') {
    event.respondWith(fetchAndCacheOrReturnCache());
  }
});


self.addEventListener("fetch", event => {
  console.log("Service worker fetch - Serving custom response");
	async function requestOrReturnEmptyResponse() {
    try {
      // Try to perform the request from the network.
      const networkResponse = await fetch(event.request);
      return networkResponse;
    } catch (error) {
			const emptyResponse = new Response(JSON.stringify({}), {
        	headers: {'Content-Type': 'application/json'},
	        status: 599
  	    });
      return emptyResponse;
    }
  }
  
  const url = new URL(event.request.url);
  if (event.request.method === 'GET' && url.host === 'api.themoviedb.org') {
    event.respondWith(requestOrReturnEmptyResponse());
  }
});
```



## Other :: Caching strategies

1. Cache first - Network last

   ```javascript
   self.addEventListener("fetch", event => {
   	console.log("Service worker fetch");
     
   	event.respondWith((async () => {
   		const cachedResponse = await caches.match(event.request);
   		return cachedResponse || await fetch(event.request);
   	})());
   });
   ```

2. Network first - Cache last

   ```javascript
   self.addEventListener("fetch", event => {
   	console.log("Service worker fetch");
     
   	event.respondWith((async () => {
   		try {
   			const fetchedResponse = await fetch(event.request);
         return fetchedResponse;
       } catch (error) {
         console.log("Failed to fetch resource.");
         const cachedResponse = await caches.match(event.request);
         return cachedResponse;
   		}
   	})());
   });
   ```

3. State while revalidate

   ```javascript
   self.addEventListener("fetch", event => {
   	console.log("Service worker fetch");
     
   	event.respondWith((async () => {
       const cachedResponse = await caches.match(event.request);
       
   		try {
   			const fetchedResponse = await fetch(event.request);
         const responseClone = fetchedResponse.clone();
         
         // We could use a specific group instead.
         const cache = await caches.open(url.searchParams.get('name'));
         cache.put(event.request, responseClone);
         
   			// Prioritize cached response over network.
         return cachedResponse || fetchedResponse;
       } catch (error) {
         console.log("Failed to fetch resource.");
         return cachedResponse;
   		}
   	})());
   });
   ```

4. Network only

   We could just not have any fetch event. Or if we have we could just not use `event.respondWith`. Or we could just call the fetch anyway.

   ```javascript
   self.addEventListener("fetch", event => {
   	console.log("Service worker fetch");
   	event.respondWith(
   		fetch(event.request)
    	);
   });
   ```

   

5. Cache only

   ```javascript
   self.addEventListener("fetch", event => {
   	console.log("Service worker fetch");
   	event.respondWith((async () => {
   		return await caches.match(event.request);
   	})());
   });
   ```

   