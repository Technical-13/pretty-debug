// ==UserScript==
// @name         pretty-debug
// @namespace    https://github.com/Technical-13/pretty-debug
// @version      1.0.0
// @description  A tiny, cross-platform JavaScript debug console featuring custom color styles and automatic runtime environment tracking.
// @author       technical13 (https://greasyfork.org/en/users/216914-technical-13)
// @license      BSD-3-Clause
// @homepageURL  https://github.com/Technical-13/pretty-debug
// @supportURL   https://discord.me/MagentaRV
// @downloadURL  https://raw.githubusercontent.com/Technical-13/pretty-debug/refs/heads/main/debug.js
// @updateURL    https://raw.githubusercontent.com/Technical-13/pretty-debug/refs/heads/main/debug.js
// ==/UserScript==

( function( global ) {
  'use strict';

  /**
   * A tiny, cross-platform JavaScript debug console featuring custom color
   * styles and automatic runtime environment tracking.
   *
   * @description Universal console management engine for sandboxed scripts.
   * @example
   * const debug = new Debug( { name: 'aeAnalyzer', version: '1.0.0' } );
   * debug.success( 'Earning pipeline initialized perfectly.' );
   */
  class Debug {
    /**
     * Compiles dynamic substitution strings and handles channel routing passes.
     *
     * @private
     * @param {string} type The internal style lookup mapping level label string.
     * @param {string} message The core contextual string text message block.
     * @param {...*} args Extended trailing object payloads or references.
     * @returns {void}
     */
    _execute( type, message, ...args ) {
      const channel = typeof console[ this._chan ] === 'function' ? this._chan : typeof console.debug === 'function' ? 'debug' : 'info';
      let tagStr = '', timeStr = ''; const logParams = [];
      if ( this._showTag ) {
        tagStr = '%c[' + this._name + ' v' + this._version + ']';
        logParams.push( this._styles.tag );
      }      
      if ( this._showTime ) {
        timeStr = '%c[' + new Date().toISOString() + ']';
        logParams.push( this._styles.time );
      }      
      const formatStr = tagStr + timeStr + ( tagStr || timeStr ? ' ' : '' ) + '%c' + message;
      const baseStyle = this._styles[ type ] || this._styles.log;
      logParams.push( baseStyle );
      const mappedArgs = args.map( ( arg ) => { return arg === '🚯' ? baseStyle : arg; } );
      console[ channel ]( formatStr, ...logParams, ...mappedArgs );
    }

    /**
     * Determines and identifies the current active script host manager environment.
     *
     * @private
     * @returns {string} The computed environment host system indicator string.
     */
    _getEnv() {
      if ( typeof process !== 'undefined' && process.versions && process.versions.node ) { return 'Node.js'; }
      if ( typeof window !== 'undefined' && typeof document !== 'undefined' ) { return 'Browser Console'; }
      if ( globalThis.GM || globalThis.GM_info ) {
        const oldOrUnknown = globalThis.GM_info?.version ? 'Greasemonkey (Legacy)' : 'Unknown Handler';
        return globalThis.GM?.info?.scriptHandler || globalThis.GM_info?.scriptHandler || oldOrUnknown;
      }
      return 'Unknown';
    }

    /**
     * Dynamically pulls the core identity configuration branding title sequence.
     *
     * @private
     * @param {Object} config The custom operational initialization settings object.
     * @returns {string} The identified application branding identifier layout.
     */
    _getName( config ) { return config.name || globalThis.GM?.info?.script?.name || globalThis.GM_info?.script?.name || this._env; }

    /**
     * Evaluates available execution managers to find current code version metrics.
     *
     * @private
     * @param {Object} config The custom operational initialization settings object.
     * @returns {string} The parsed software release version sequence token string.
     */
    _getVersion( config ) {
      const envVer = this._env === 'Node.js' ? process.version.slice( 1 ) : ( globalThis.GM?.info?.version || globalThis.GM_info?.version || '0.0.0' );
      return config.version || globalThis.GM?.info?.script?.version || globalThis.GM_info?.script?.version || envVer;
    }

    /**
     * Instantiates an active individual configuration tracker profile model.
     *
     * @constructor
     * @param {Object} [config={}] The custom operational initialization settings.
     * @param {string} [config.logChan=''] Explicit channel routing token key.
     * @param {string} [config.name='App'] App branding identity label text.
     * @param {boolean} [config.showTag=true] Toggle switch for metadata bracket row.
     * @param {boolean} [config.showTime=true] Toggle switch for runtime timestamp logs.
     * @param {Object} [config.styles] Collection of custom theme design styling paths.
     * @param {string} [config.version='0.0.0'] Manual software layer version string.
     */
    constructor( config = {} ) {
      this._chan = config.logChan || '';
      this._env = this._getEnv();
      this._name = this._getName( config );
      this._showTag = config.showTag || true;
      this._showTime = config.showTime || true;
      this._styles = config.styles || {
        debug: 'color: #888888;',
        error: 'color: #FF3333; font-weight: bold;',
        fatal: 'color: #FFEE55; background: #880000; font-weight: bold; padding: 2px; border-radius: 2px;',
        info: 'color: #1188FF; font-weight: bold;',
        log: 'color: inherit;',
        network: 'color: #00FFFF; font-weight: bold; font-style: italic;',
        rainbow: 'background: linear-gradient(90deg, #FF0000, #FFA500, #FFFF00, #008000, #0000FF, #4B0082, #EE82EE); color: #000000; font-weight: bold; padding: 2px; border-radius: 2px;',
        reset: '🚯',
        success: 'color: #00FF66; font-weight: bold;',
        tag: 'color: #FF00FF; background: #000000; font-weight: bold; padding: 1px 4px; border-radius: 2px;',
        time: 'color: #FF0000; background: #333333; font-weight: bold; padding: 1px 4px; border-radius: 2px;',
        warn: 'color: #FFEE55; font-weight: bold;'
      };
      this._version = this._getVersion( config );
    }

    /**
     * Routes logs into the standard debug allocation channel stream.
     *
     * @public
     * @param {string} message The informational text to output.
     * @param {...*} args Interactive element payload extra extensions.
     * @returns {void}
     * @example
     * debug.console( 'Loop processing speed: %s ms', duration, metricObj );
     */
    console( message, ...args ) { this._execute( 'debug', message, ...args ); }

    /**
     * Routes high-priority tracking events to the dedicated failure stream error view.
     *
     * @public
     * @param {string} message The primary core structural break description string.
     * @param {...*} args Dynamic exception parameters or runtime trace objects.
     * @returns {void}
     * @example
     * debug.error( 'IndexedDB transaction locked. Event: %o', errorEvent );
     */
    error( message, ...args ) { this._execute( 'error', message, ...args ); }

    /**
     * Routes high-impact unrecoverable execution panics to the console stream.
     *
     * @public
     * @param {string} message The critical structural crash description text.
     * @param {...*} args Dynamic termination details or stack dump references.
     * @returns {void}
     * @example
     * debug.fatal( 'Critical engine shutdown. Core exception: %o', errorObject );
     */
    fatal( message, ...args ) { this._execute( 'fatal', message, ...args ); }

    /**
     * Initiates an expandable nested data stream group block inside the panel views.
     *
     * @public
     * @param {string} label The text title header to assign to the block group.
     * @returns {void}
     * @example
     * debug.group( 'Leaderboard Update Cycle' );
     */
    group( label ) { console.group( label ); }

    /**
     * Initiates a collapsed nested data stream group block inside the panel views.
     *
     * @public
     * @param {string} label The text title header to assign to the block group.
     * @returns {void}
     * @example
     * debug.groupCollapsed( 'Detailed Payload Metrics' );
     */
    groupCollapsed( label ) { console.groupCollapsed( label ); }

    /**
     * Terminates the current active nested tree logging indentation layer block.
     *
     * @public
     * @returns {void}
     * @example
     * debug.groupEnd();
     */
    groupEnd() { console.groupEnd(); }

    /**
     * Transmits standard status data updates into the targeted monitoring pipeline.
     *
     * @public
     * @param {string} message The core tracking metric event announcement context.
     * @param {...*} args Trailing informational variables or dataset items.
     * @returns {void}
     * @example
     * debug.info( 'Refreshing properties for user: %s', userName );
     */
    info( message, ...args ) { this._execute( 'info', message, ...args ); }

    /**
     * Passes a clean, unstyled tracking string packet directly through console pipelines.
     *
     * @public
     * @param {string} message The unformatted text data sequence to print.
     * @param {...*} args Raw elements, arrays, or text strings to capture.
     * @returns {void}
     * @example
     * debug.log( 'Raw buffer dump:', rawArrayPayload );
     */
    log( message, ...args ) { this._execute( 'log', message, ...args ); }

    /**
     * Transmits request transaction payloads into the targeted pipeline.
     *
     * @public
     * @param {string} message The network endpoint descriptor message text.
     * @param {...*} args Trailing payload headers, responses, or data models.
     * @returns {void}
     * @example
     * debug.network( 'Intercepted fetch response from path: %s', urlString );
     */
    network( message, ...args ) { this._execute( 'network', message, ...args ); }

    /**
     * Exposes the active design theme style configurations collection dictionary.
     *
     * @public
     * @returns {Object} The read-only color configuration styles asset map.
     */
    get style() { return this._styles; }

    /**
     * Generates a highlighted positive processing confirmation log line response.
     *
     * @public
     * @param {string} message The completed event indicator message context.
     * @param {...*} args Validation datasets, success maps, or runtime items.
     * @returns {void}
     * @example
     * debug.success( 'Map coordinates synced. Total items: %d', totalCount );
     */
    success( message, ...args ) { this._execute( 'success', message, ...args ); }

    /**
     * Starts a high-accuracy system stopwatch timer tracking a unique reference key token.
     *
     * @public
     * @param {string} label Identity reference key to associate with the timer tracking.
     * @returns {void}
     * @example
     * debug.time( 'dbFetchTransaction' );
     */
    time( label ) { console.time( label ); }

    /**
     * Concludes a stopwatch timer loop tracking run and outputs elapsed delta milliseconds.
     *
     * @public
     * @param {string} label Identity reference key of the timer loop tracker to end.
     * @returns {void}
     * @example
     * debug.timeEnd( 'dbFetchTransaction' );
     */
    timeEnd( label ) { console.timeEnd( label ); }

    /**
     * Prints the current value of an active system timer without stopping it.
     *
     * @public
     * @param {string} label Identity reference key of the running timer tracker.
     * @param {...*} [args] Optional data variables or tracking objects to print alongside the log.
     * @returns {void}
     * @example
     * debug.timeLog( 'leaderboardProcessing', 'Completed page 1 parsing check' );
     */
    timeLog( label, ...args ) { console.timeLog( label, ...args ); }

    /**
     * Outputs a complete interactive stack trace detailing the execution path.
     *
     * @public
     * @param {...*} [args] Optional message items or data payloads to label the trace.
     * @returns {void}
     * @example
     * debug.trace( 'Diagnostic checkpoint trace tracking location:' );
     */
    trace( ...args ) { console.trace( ...args ); }

    /**
     * Signals standard boundary alerts and validation timeouts without freezing tasks.
     *
     * @public
     * @param {string} message The active system notification alert tracking text.
     * @param {...*} args Network parameters, asset responses, or retry metrics.
     * @returns {void}
     * @example
     * debug.warn( 'Network delay detected on path: %s. Retry count: %d', endpointUrl, retries );
     */
    warn( message, ...args ) { this._execute( 'warn', message, ...args ); }
  }

  global.Debug = Debug;
  if ( typeof module !== 'undefined' && module.exports ) { module.exports = Debug; }
} )( this );
