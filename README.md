# pretty-debug 🎨
A tiny, cross-platform JavaScript debug console featuring custom color styles and automatic runtime environment tracking.

## Features
* 👤 **Automatic Environment Detection:**
  * Intelligently identifies if it is running inside Tampermonkey, Violentmonkey, Greasemonkey, Node.js, or directly in a Browser Console.
* 🌈 **CSS Colored Output:**
  * Leverages console substitution tokens (`%c`) to provide rich, visual logging tiers without cluttering your core logic lines.
* 🛡️ **Sandbox Safe:**
  * Free of global object pollutions—ideal for isolated userscript execution blocks or browser extension frames.
* ⚙️ **Highly Configurable:**
  * Easily toggle metadata tags, live system timestamps, or route messages to custom developer streams.

## Installation & Setup
### 1. Userscript Managers ([Greasemonkey](https://greasemonkey.en.softonic.com)|[Tampermonkey](https://www.tampermonkey.net)|[Violentmonkey](https://violentmonkey.github.io/))
 - Using a centralized mirror platform ensures your project instances automatically pull patches and updates without requiring manual branch pulls.
 - Simply add the mirrored GreasyFork CDN link to your userscript metadata header block:
```javascript
// @require      https://update.greasyfork.org/scripts/578789/pretty-debug.js
```
 - Initialization Configuration
Instantiate the debug instance at the top of your execution wrapper. You can configure custom settings or leave it empty to rely on our automatic environment discovery rules:
```javascript
const debug = new Debug( {
  name: 'myCoolUserscript', // All settings below are optional:
  version: '0.0.1',         // Defaults to auto-detected script or env version
  logChan: 'debug',         // Choose 'error', 'log', 'warn', etc. Fallback: 'debug' with 'info'
  showTag: true,            // Toggle switch for [myCoolUserScript v0.0.1] tag. Defaults to true.
  showTime: true,           // Toggle the live system timestamp bracket. Defaults to true.
  styles: {                 // Add custom and override default color palette styles
    halloween: 'color: #00FFFF; background: #000000; font-weight: bold;'
  }
} );
```

### 2. [Node.js](https://nodejs.org) Context
 - Because the library wraps its execution inside an environmental sandbox, simply requiring the file injects the `Debug` constructor directly into your global Node execution scope.

```javascript
require( './path/to/debug.js' );
const debug = new Debug( { name: 'myCoolBot', version: '0.0.1' } );
debug.success(
  '%cpretty-debug%c successfully initialized in Node.js context!',
  debug.style.rainbow,
  debug.style.reset
);
```

### 3. Browser Console Context
 - To run diagnostics or test features directly inside your browser developer tools (`F12`), paste this snippet into your Console tab to dynamically inject and instantiate the library instantly:

```javascript
fetch( 'https://raw.githubusercontent.com/Technical-13/pretty-debug/refs/heads/main/debug.js' )
  .then( ( res ) => { return res.text(); } )
  .then( ( code ) => {
    const script = document.createElement( 'script' );
    script.textContent = code;
    document.documentElement.appendChild( script );
    script.remove();
    window.debug = new Debug();
    debug.success( '%cpretty-debug%c successfully injected globally into this tab! Docs: https://github.com/Technical-13/pretty-debug', debug.style.rainbow, debug.style.reset );
  } );
```

> [!WARNING]
> **Security Configuration Note:** This execution snippet will fail to run inside highly privileged, built-in browser tabs. These special internal portal pages — including, but not limited to, Firefox's `about:newtab`, Google Chrome's `chrome://newtab`, and Microsoft Edge's `edge://newtab` — deploy strict Content Security Policies (`default-src 'none'`) that block all external network fetches and string code evaluation requests (`eval`) instantly. For a comprehensive technical reference detailing why modern browser engines prevent top-level scripts and tracking links from initializing across internal application sandboxes, see the official [MDN Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) and review the complete [Chrome for Developers: Content Security Policy](https://developer.chrome.com/docs/privacy-security/csp). To perform console diagnostic injections safely without encountering engine protection locks, navigate your active tab layout context onto a standard external web page or an unrestricted clean destination like [`about:blank`](https://enwp.org/About_URI_scheme).

## Usage API
 - Once initialized, call your specific logging levels directly from your application logic. Every method supports [console string substitution](https://developer.mozilla.org/en-US/docs/Web/API/console#using_string_substitutions) tokens and infinite trailing arguments:
 - If you need to style a specific string slice mid-sentence, pass public `debug.style` properties into your arguments array. Use `debug.style.reset` to smoothly restore your text colors right back to the method's native brand theme!

### `debug.tag`
 - The public `debug.tag` getter property returns the formatted application metadata tag string.

```javascript
const appTag = debug.tag;
```

### Advanced Styling: `debug.style`
 - The public `debug.style` getter property returns your active theme dictionary as a read-only proxy validated object that defaults to `debug.style.debug` if the specified style is `undefined`.
 - To style specific pieces of text *inside* a log sentence, insert multiple `%c` substitution markers into your message string, and pass your chosen styles sequentially inside the trailing variables array:

```javascript
debug.info( 'Task status: %cRUNNING%c. Stand by for server sync...', debug.style.warn, debug.style.reset);
```

#### Available Default Theme Styles
 - Theme variations automatically adapt on initialization to look clean in dark/light environments when light theme channel counterparts exist.
* ⚙️ `debug.style.debug` — **Standard Console Channel** <img src="previews/debug.svg" height="28" align="right" />
  <!--* ⚙️ `debug.style.debugLight` — **Standard Console Channel** (light mode) <img src="previews/debugLight.svg" height="28" align="right" />-->
  * *Appearance:* Flat, muted medium-gray text resting over an inverted theme-adaptive background plate designed for low-priority diagnostics.
* 🚫 `debug.style.error` — **Standard Error Line**<img src="previews/error.svg" height="28" align="right" />
  <!--* 🚫 `debug.style.errorLight` — **Standard Error Line** (light mode) <img src="previews/errorLight.svg" height="28" align="right" />-->
  * *Appearance:* High-visibility crimson red font resting over an adaptive, high-contrast tinted red background panel with distinct line borders.
* ❌ `debug.style.fatal` — **Critical System Panic** <img src="previews/fatal.svg" height="28" align="right" />
  * *Appearance:* Thick pale yellow font face isolated over a solid blood-red background bar.
* 🔷 `debug.style.info` — **Informational Messages** <img src="previews/info.svg" height="28" align="right" />
  <!--* 🔷 `debug.style.infoLight` — **Informational Messages** (light mode) <img src="previews/infoLight.svg" height="28" align="right" />-->
  * *Appearance:* High-contrast corporate blue-spectrum font resting over a tinted blue background panel with matching borders.
* 📜 `debug.style.log` — **Raw Baseline Text** <img src="previews/log.svg" height="28" align="right" />
  <!--* 📜 `debug.style.logLight` — **Raw Baseline Text** (light mode) <img src="previews/logLight.svg" height="28" align="right" />-->
  * *Appearance:* Completely clean font properties that inherit browser text colors natively over an inverted theme-adaptive background plate.
* 🌐 `debug.style.network` — **Interceptor Telemetry** <img src="previews/network.svg" height="28" align="right" />
  * *Appearance:* Slanted, italicized electric cyan font face.
* 🌈 `debug.style.rainbow` — **1990's Throwback Spectrum** <img src="previews/rainbow.svg" height="28" align="right" />
  * *Appearance:* High-contrast black font face set on a solid horizontal linear color wave.
* 🚯 `debug.style.reset` — **Dynamic Brand Restore Token**
  * *Appearance:* Evaluates dynamically on the fly to match your wrapper's primary theme.
  * *Usage:* Restores mid-sentence strings safely back to your level colors instead of stripping them down to browser defaults.
* ✅ `debug.style.success` — **Confirmation Milestones** <img src="previews/success.svg" height="28" align="right" />
  * *Appearance:* Bright, crisp neon emerald green text.
* 🏷️ `debug.style.tag` — **`[myAppName v#.#.#]` Banner** <img src="previews/tag.svg" height="28" align="right" />
  * *Appearance:* Bold magenta text resting over a flat pitch-black background plate.
* ⏱️ `debug.style.time` — **Timestamp Tag** <img src="previews/time.svg" height="28" align="right" />
  <!--* ⏱️ `debug.style.timeLight` — **Timestamp Tag** (light mode) <img src="previews/timeLight.svg" height="28" align="right" />-->
  * *Appearance:* Muted theme-matching text tracking system hours resting over an inverted theme-adaptive background panel.
* ⚠️ `debug.style.warn` — **Standard System Warning** <img src="previews/warn.svg" height="28" align="right" />
  <!--* ⚠️ `debug.style.warnLight` — **Standard System Warning** (light mode) <img src="previews/warnLight.svg" height="28" align="right" />-->
  * *Appearance:* Thick, high-contrast goldenrod yellow font resting over a tinted amber-gold background panel with distinct line borders.

### `debug.console( message, ...args )`
 - Routes logs into your standard target channel stream (defaulting to low-priority diagnostic streams).
```javascript
debug.console( 'Loop processing speed: %s ms', duration, metricObj );
```

### `debug.error( message, ...args )`
 - Routes high-priority tracking events to describe standard operational failures and data exceptions.
```javascript
debug.error( 'IndexedDB transaction locked. Event details: %o', errorEvent );
```

### `debug.fatal( message, ...args )`
 - Routes high-impact, unrecoverable execution panics and core system shutdowns.
```javascript
debug.fatal( 'Critical engine shutdown. Core exception stack: %o', errorObject );
```

### [`debug.group( label )`](https://developer.mozilla.org/en-US/docs/Web/API/console#using_groups_in_the_console)
 - Initiates an expandable nested logging indentation layer block.
```javascript
debug.group( 'Leaderboard Update Cycle' );
```

### [`debug.groupCollapsed( label )`](https://developer.mozilla.org/en-US/docs/Web/API/console#using_groups_in_the_console)
 - Initiates a collapsed nested logging indentation layer block.
```javascript
debug.groupCollapsed( 'Detailed Payload Metrics' );
```

### [`debug.groupEnd()`](https://developer.mozilla.org/en-US/docs/Web/API/console#using_groups_in_the_console)
 - Terminates the current active nested indentation layer block.
```javascript
debug.groupEnd();
```

### `debug.info( message, ...args )`
 - Transmits standard status data updates and transaction tracking announcements.
```javascript
debug.info( 'Refreshing connection properties for user: %s', userName );
```

### `debug.log( message, ...args )`
 - Passes a clean, unstyled tracking string packet directly through console text pipelines.
```javascript
debug.log( 'Plain text data sequence buffer dump:', rawArrayPayload );
```

### `debug.network( message, ...args )`
 - Dedicated style for tracking request payloads, API endpoints, HTTP traffic, and interceptor status.
```javascript
debug.network( 'Intercepted fetch response from path: %s', urlString, responseHeaders );
```

### `debug.success( message, ...args )`
 - Generates a highlighted positive processing confirmation or milestone completion marker.
```javascript
debug.success( 'Local database established. Total records synced: %d', totalCount );
```

### [`debug.table( data, [ options ] )`](https://developer.mozilla.org/en-US/docs/Web/API/console/table_static)
 - Generates an optimized structured data table inside the DevTools **Debug/Verbose channel**.
 - Parameters:
   * **`data`** `(Array|Object)` — The tabular dataset or collection object to evaluate.
   * **`options`** `(Object)` *Optional* — Configuration object properties:
   * `label` `(String)` — A header text string. Setting this automatically triggers `grouped: true`.
   * `collapsed` `(Boolean)` — Starts the container in a closed state. Defaults to `true` if grouping is inferred.
   * `columns` `(String[])` — An array of specific property keys to display as column headers.
   * `grouped` `(Boolean)` — Forces a container layout block wrap even without a custom text label.

```javascript
// Example: Outputting subset user columns inside an expanded report block
debug.table( userArray, { 
  label: 'Active System Administrators', 
  columns: [ 'firstName', 'clearanceLevel' ], 
  collapsed: false 
} );
```

### [`debug.time( label )`](https://developer.mozilla.org/en-US/docs/Web/API/console#timers)
 - Starts a high-accuracy system stopwatch timer tracking a unique reference key token.
```javascript
debug.time( 'leaderboardProcessing' );
```

### [`debug.timeEnd( label )`](https://developer.mozilla.org/en-US/docs/Web/API/console#timers)
 - Concludes a stopwatch timer loop tracking run and outputs elapsed delta milliseconds.
```javascript
debug.timeEnd( 'leaderboardProcessing' );
```

### [`debug.timeLog( label, ...args )`](https://developer.mozilla.org/en-US/docs/Web/API/console#timers)
 - Prints the current split value of an active running timer without stopping it.
```javascript
debug.timeLog( 'leaderboardProcessing', 'Completed page 1 parsing check' );
```

### [`debug.trace( ...args )`](https://developer.mozilla.org/en-US/docs/Web/API/console#stack_traces)
 - Outputs a complete interactive stack trace detailing the function execution chain history.
```javascript
debug.trace( 'Diagnostic checkpoint trace tracking location:' );
```

### `debug.warn( message, ...args )`
 - Signals system boundary alerts, asset bypass warnings, and soft timeouts without halting execution.
```javascript
debug.warn( 'Asset file loaded with alternative placeholder fallback parameters.' );
```

## License
Distributed under the BSD 3-Clause License. See [`LICENSE`](LICENSE) for more information.
