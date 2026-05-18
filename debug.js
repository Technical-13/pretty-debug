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
      logParams.push( this._styles[ type ] );
      console[ channel ]( formatStr, ...logParams, ...args );
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
     * Uses environment name as a fallback if not provided and it can't be detected.
     *
     * @private
     * @param {Object} config The custom operational initialization settings object.
     * @returns {string} The identified application branding identifier layout.
     */
    _getName( config ) { return config.name || globalThis.GM?.info?.script?.name || globalThis.GM_info?.script?.name || this._env; }

    /**
     * Evaluates available execution managers to find current code version metrics.
     * Uses environment version as a fallback if not provided and it can't be detected.
     *
     * @private
     * @param {Object} config The custom operational initialization settings object.
     * @returns {string} The parsed software release version sequence token string.
     */
    _getVersion( config ) {
      const envVer = this._env === 'Node.js' ? process.version.slice( 1 ) : ( globalThis.GM?.info?.version || globalThis.GM_info?.version || '0.0.1' );
      return config.version || globalThis.GM?.info?.script?.version || globalThis.GM_info?.script?.version || envVer;
    }

    /**
     * Instantiates an active individual configuration tracker profile model.
     *
     * @constructor
     * @param {Object} [config={}] The custom operational initialization settings.
     * @param {string} [config.logChan=''] Explicit channel routing token key console.(debug|info|warn|error|log).
     * @param {string} [config.name='myCoolApp'] App branding identity label text.
     * @param {boolean} [config.showTag=true] Toggle switch for [myCoolApp v0.0.1] tag.
     * @param {boolean} [config.showTime=true] Toggle switch for runtime timestamp logs.
     * @param {Object} [config.styles] Collection of custom theme design styling paths.
     * @param {string} [config.version='0.0.1'] Manual software layer version string.
     */
    constructor( config = {} ) {
      this._chan = config.logChan || '';
      this._env = this._getEnv();
      this._name = this._getName( config );
      this._showTag = config.showTag || true;
      this._showTime = config.showTime || true;
      this._styles = config.styles || {
        error: 'color: #FF3333; font-weight: bold;',
        fatal: 'color: #FFEE55; background: #880000; font-weight: bold; padding: 2px; border-radius: 2px;',
        info: 'color: #00E6FF; font-weight: bold;',
        log: 'color: inherit;',
        network: 'color: #00FFFF; font-weight: bold; font-style: italic;',
        perf: 'color: #FFA500; font-weight: bold; font-family: monospace;',
        success: 'color: #00FF66; font-weight: bold;',
        tag: 'color: #FFFFFF; background: #333333; font-weight: bold; padding: 1px 4px; border-radius: 2px;',
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
     * Outputs execution speed benchmarks and frame calculation metrics.
     *
     * @public
     * @param {string} message The performance metric measurement summary text.
     * @param {...*} args Trailing duration digits, benchmarks, or memory maps.
     * @returns {void}
     * @example
     * debug.perf( 'Leaderboard array processing completed in %d ms', delta );
     */
    perf( message, ...args ) { this._execute( 'perf', message, ...args ); }

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

  global.Debug = Debug;
} )( this );
