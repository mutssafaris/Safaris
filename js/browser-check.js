/**
 * Browser Compatibility Check - Muts Safaris
 * Detects outdated browsers and provides fallbacks
 */
(function(window) {
    'use strict';

    var BrowserCheck = {
        /**
         * Minimum supported browser versions
         */
        minimumVersions: {
            chrome: 80,
            firefox: 75,
            safari: 13,
            edge: 80,
            opera: 67,
            samsung: 12
        },

        /**
         * Check if current browser is supported
         * @returns {object} { supported: boolean, browser: string, version: number, message: string }
         */
        check: function() {
            var ua = navigator.userAgent;
            var info = this._detectBrowser(ua);
            
            var minVersion = this.minimumVersions[info.browser];
            var supported = minVersion ? info.version >= minVersion : true;

            return {
                supported: supported,
                browser: info.browser,
                version: info.version,
                isOutdated: !supported,
                message: supported ? null : this._getUpgradeMessage(info)
            };
        },

        /**
         * Show warning banner for outdated browsers
         */
        showWarningIfNeeded: function() {
            var result = this.check();
            
            if (result.isOutdated) {
                var banner = document.createElement('div');
                banner.id = 'browser-warning';
                banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff6b6b;color:#fff;padding:12px;text-align:center;z-index:999999;font-weight:bold;';
                banner.innerHTML = result.message + ' <a href="https://browsehappy.com/" style="color:#fff;text-decoration:underline;">Update Browser</a>';
                document.body.insertBefore(banner, document.body.firstChild);
            }
        },

        /**
         * Detect browser from User Agent
         * @private
         */
        _detectBrowser: function(ua) {
            var browsers = [
                { name: 'chrome', regex: /Chrome\/(\d+)/ },
                { name: 'firefox', regex: /Firefox\/(\d+)/ },
                { name: 'safari', regex: /Version\/(\d+).*Safari/ },
                { name: 'edge', regex: /Edg\/(\d+)/ },
                { name: 'opera', regex: /OPR\/(\d+)/ },
                { name: 'samsung', regex: /SamsungBrowser\/(\d+)/ }
            ];

            for (var i = 0; i < browsers.length; i++) {
                var match = ua.match(browsers[i].regex);
                if (match) {
                    return { browser: browsers[i].name, version: parseInt(match[1], original: match[0] };
                }
            }

            return { browser: 'unknown', version: 0 };
        },

        /**
         * Get upgrade message
         * @private
         */
        _getUpgradeMessage: function(info) {
            var messages = {
                chrome: 'Chrome ' + this.minimumVersions.chrome + '+ required. You are using Chrome ' + info.version + '.',
                firefox: 'Firefox ' + this.minimumVersions.firefox + '+ required. You are using Firefox ' + info.version + '.',
                safari: 'Safari ' + this.minimumVersions.safari + '+ required. You are using Safari ' + info.version + '.',
                edge: 'Edge ' + this.minimumVersions.edge + '+ required. You are using Edge ' + info.version + '.',
                opera: 'Opera ' + this.minimumVersions.opera + '+ required. You are using Opera ' + info.version + '.',
                samsung: 'Samsung Browser ' + this.minimumVersions.samsung + '+ required.'
            };
            return messages[info.browser] || 'Please update your browser for the best experience.';
        }
    };

    window.BrowserCheck = BrowserCheck;
})(window);
