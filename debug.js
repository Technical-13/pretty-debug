// ==UserScript==
// @name         pretty-debug
// @namespace    https://github.com/Technical-13/pretty-debug
// @version      1.2.1
// @description  A tiny, cross-platform JavaScript debug console featuring custom color styles and automatic runtime environment tracking.
// @author       technical13 (https://greasyfork.org/en/users/216914-technical-13)
// @license      BSD-3-Clause
// @homepageURL  https://github.com/Technical-13/pretty-debug
// @supportURL   https://discord.me/MagentaRV
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
      const baseDarkStyle = this._validateStyle( type ) ? type : 'debug';
      const baseLightStyle = this._validateStyle( type + 'Light' ) ? type + 'Light' : 'debugLight';
      const baseStyle = this._styles[ this._isDark ? baseDarkStyle : baseLightStyle ];
      let tagStr = '', timeStr = ''; const logParams = [];
      if ( this._showTag ) {
        tagStr = '%c[' + this._name + ' v' + this._version + ']';
        logParams.push( this._styles[ this._isDark ?  'tag' : 'tagLight' ] );
      }
      if ( this._showTime ) {
        timeStr = '%c[' + new Date().toISOString() + ']';
        logParams.push( this._styles[ this._isDark ? 'time' : 'timeLight' ] );
      }
      const { [ type ]: icon } = this._chanIcons;
      const formatStr = ( icon ? icon + ' ' : '' ) + tagStr + timeStr + ( tagStr || timeStr ? ' ' : '' ) + '%c' + message;
      logParams.push( baseStyle );
      const mappedArgs = args.map( ( arg ) => { return arg === '🚯' ? baseStyle : ( this._validateStyle( arg ) ? this._styles[ arg ] : arg ); } );
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
     * Evaluates light/dark day/night data color scheme for environment.
     * @private
     * @returns {string} The parsed data theme ('Light' or 'Dark').
     */
    _hasDataTheme() {
      if ( typeof window !== 'undefined' && typeof window.matchMedia === 'function' ) {
        if ( window.matchMedia( '(prefers-color-scheme: light)' ).matches ) { return 'Light'; }
      }
      if ( typeof process !== 'undefined' && process.env ) {
        const colorScheme = process.env.COLORFGBG;
        if ( colorScheme ) {
          const parts = colorScheme.split( ';' );
          const bg = parseInt( parts[ 0 ], 10 );
          if ( !isNaN( bg ) && ( bg === 7 || bg >= 11 ) ) { return 'Light'; }
        }
      }
      return 'Dark';
    }

    /**
     * Verifies if the interface color scheme evaluation indicates an active dark mode.
     *
     * @private
     * @returns {boolean} A true value if dark theme states match; otherwise false.
     */
    _isDarkMode() { return this._hasDataTheme() === 'Dark' ? true : false; }

    /**
     * Verifies a style is defined in `this._styles`.
     *
     * @private
     * @param {string} name The style name to check for.
     * @returns {boolean} A true value if style exists; otherwise false.
     */
    _validateStyle( name ) { return this._styles[ name ] ? true : false; }

    /**
     * Instantiates an active individual configuration tracker profile model.
     *
     * @constructor
     * @param {Object} [config={}] The custom operational initialization settings.
     * @param {string} [config.logChan=''] Explicit channel routing token key.
     * @param {Object} [config.icons] Collection of custom prefix icons for channel types.
     * @param {string} [config.name='myCoolApp'] App branding identity label text.
     * @param {boolean} [config.showTag=true] Toggle switch for metadata bracket row.
     * @param {boolean} [config.showTime=true] Toggle switch for runtime timestamp logs.
     * @param {Object} [config.styles] Collection of custom theme design styling paths.
     * @param {string} [config.version='0.0.1'] Manual software layer version string.
     */
    constructor( config = {} ) {
      this._chan = config.logChan || '';
      this._chanIcons = config.icons || { error: '🚫', fatal: '❌', info: '🔷', log: '📜', network: '🌐', success: '✅', warn: '⚠️' };
      this._env = this._getEnv();
      this._isDark = this._isDarkMode() ?? true;
      this._name = this._getName( config );
      this._showTag = config.showTag ?? true;
      this._showTime = config.showTime ?? true;
      this._styles = config.styles || {
        get b() { return 'font-weight: bold; '; },
        bgColor( c ) { return 'background-color: ' + c + '; '; },
        common: 'margin: -3px 0px -4px 0px; padding: 3px 8px 4px 8px; display: inline-block; font-family: monospace; font-size: 11px; line-height: 15px; ',
        get debug() { return this.common + this.bgColor( '#1F1F1F' ) + 'color: #8C8C8C;' },
        get debugLight() { return this.common + this.bgColor( '#FFFFFF' ) + 'color: #5C5C5C;' },
        get error() { return this.common + this.bgColor( '#291A1A' ) + 'color: #FF8080; border-top: 1px solid #5C1F1F; border-bottom: 1px solid #5C1F1F;' },
        get errorLight() { return this.common + this.bgColor( '#FFF2F0' ) + 'color: #FF0000; border-top: 1px solid #FFCCC7; border-bottom: 1px solid #FFCCC7;' },
        get fatal() { return this.common + this.bgColor( '#880000' ) + this.b + 'color: #FFEE55; border-radius: 2px; line-height: 13px;' },
        get info() { return this.common + this.bgColor( '#1A2233' ) + 'color: #9ECBFF; border-top: 1px solid #26385C; border-bottom: 1px solid #26385C;' },
        get infoLight() { return this.common + this.bgColor( '#F0F4FF' ) + 'color: #1A3C73; border-top: 1px solid #D0E0FF; border-bottom: 1px solid #D0E0FF;' },
        get group() { return this.common + this.bgColor( '#1F1F1F' ) + this.b + 'color: #F3F3F3;' },
        get groupLight() { return this.common + this.bgColor( '#FFFFFF' ) + this.b + 'color: #000000;' },
        get log() { return this.common + this.bgColor( '#1F1F1F' ) + 'color: #E3E3E3;' },
        get logLight() { return this.common + this.bgColor( '#FFFFFF' ) + 'color: #1F1F1F;' },
        network: 'color: #00FFFF; font-weight: bold; font-style: italic;',
        rainbowBg: 'background: linear-gradient( 90deg, #FF0000, #FFA500, #FFFF00, #008000, #0000FF, #4B0082, #EE82EE ); ',
        rainbowBrdrCard: '1.5px 0px 0 #000000, -1.5px 0px 0 #000000, 0px 1.5px 0 #000000, 0px -1.5px 0 #000000',
        rainbowBrdrDiag: '1.06px 1.06px 0 #000000, -1.06px 1.06px 0 #000000, 1.06px -1.06px 0 #000000, -1.06px -1.06px 0 #000000',
        rainbowBrdrShal: '1.39px 0.57px 0 #000000, -1.39px 0.57px 0 #000000, 1.39px -0.57px 0 #000000, -1.39px -0.57px 0 #000000',
        rainbowBrdrStep: '0.57px 1.39px 0 #000000, -0.57px 1.39px 0 #000000, 0.57px -1.39px 0 #000000, -0.57px -1.39px 0 #000000',
        get rainbowBrdr() { return ' text-shadow: ' + this.rainbowBrdrCard + ', ' + this.rainbowBrdrDiag + ', ' + this.rainbowBrdrShal + ', ' + this.rainbowBrdrStep + '; ' },
        get rainbow() { return this.common + this.b + this.rainbowBg + this.rainbowBrdr + 'color: #FFFFFF; border-radius: 2px; line-height: 13px;' },
        reset: '🚯',
        success: 'color: #00FF66; font-weight: bold;',
        get tag() { return this.common + this.bgColor( '#000000' ) + this.b + 'color: #FF00FF; border-radius: 2px; line-height: 13px;' },
        get time() { return this.common + this.bgColor( '#1F1F1F' ) + 'color: #E3E3E3;' },
        get timeLight() { return this.common + this.bgColor( '#FFFFFF' ) + 'color: #1F1F1F;' },
        get trace() { return this.common + this.bgColor( '#1F1F1F' ) + 'color: #E3E3E3;' },
        get traceLight() { return this.common + this.bgColor( '#FFFFFF' ) + 'color: #1F1F1F;' },
        get warn() { return this.common + this.bgColor( '#332B1A' ) + 'color: #FFCC66; border-top: 1px solid #664F1F; border-bottom: 1px solid #664F1F;' },
        get warnLight() { return this.common + this.bgColor( '#FFFBE6' ) + 'color: #5C3C00; border-top: 1px solid #FFE58F; border-bottom: 1px solid #FFE58F;' }
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
     * Exposes a protected proxy wrapper around the active design theme style configurations dictionary.
     *
     * @public
     * @type {Proxy<Object>} A proxy trapping missing style property requests and defaulting to 'debug' layout.
     */
    get style() { return new Proxy( this._styles, { get: ( target, prop ) => { return target[ prop ] || target.debug; } } ); }

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
     * Generates a table in the Debug channel.
     *
     * @public
     * @param {Array|Object} data - The data to pass to the table
     * @param {Object} [options={}] - Optional parameters configuration object
     * @param {boolean} [options.collapsed=false] - Whether the group should start collapsed
     * @param {string[]} [options.columns=undefined] - Subsets of columns to display
     * @param {boolean} [options.grouped=false] - Whether the table should be grouped
     * @param {string} [options.label='Unnamed Table'] - A label for the console group
     * @return {void}
     * @example
     * const tyrone = { firstName: 'Tyrone', lastName: 'Jones', age: 47 };
     * const janet = { firstName: 'Janet', lastName: 'Jones', age: 36 };
     * const maria = { firstName: 'Maria', lastName: 'Jones', age: 19 };
     * debug.table( [ tyrone, janet, maria ], { columns: [ 'firstName', 'age' ], label: 'Jones Family:' } );
     */
    table( data, { collapsed, columns, grouped = false, label } = {} ) {
      if ( collapsed || label ) { grouped = true; }
      if ( grouped && typeof collapsed !== 'boolean' ) { collapsed = true; }
      const startLog = console.log;
      if ( grouped ) { console[ collapsed ? 'groupCollapsed' : 'group' ]( label || 'Unnamed Table' ); }
      console.log = console.debug;
      console.table( data, columns );
      if ( grouped ) { console.groupEnd(); }
      console.log = startLog;
    }

    /**
     * Exposes a [Name vVersion] tag for use in your script and logs.
     *
     * @public
     * @type {string} The raw string used for your tag with name and version.
     */
    get tag() { return '[' + this._name + ' v' + this._version + ']'; }

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
