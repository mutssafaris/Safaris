/* Mock Data Indicator - Muts Safaris */
/* Subtle indicator when app is using mock/demo data */
(function () {
    var MOCK_INDICATOR_KEY = 'muts_mock_mode';
    var mockMode = false;
    var listeners = [];

    function setMockMode(isMock) {
        var wasMock = mockMode;
        mockMode = isMock;
        localStorage.setItem(MOCK_INDICATOR_KEY, isMock ? 'true' : 'false');
        
        if (wasMock !== isMock) {
            notifyListeners(isMock);
        }
    }

    function isMockMode() {
        if (mockMode) return true;
        var stored = localStorage.getItem(MOCK_INDICATOR_KEY);
        return stored === 'true';
    }

    function notifyListeners(isMock) {
        listeners.forEach(function (fn) {
            try { fn(isMock); } catch (e) {}
        });
    }

    function onMockModeChange(callback) {
        if (typeof callback === 'function') {
            listeners.push(callback);
        }
    }

    function getIndicatorText() {
        return isMockMode() ? 'Demo Mode' : '';
    }

    function getIndicatorTooltip() {
        if (isMockMode()) {
            return 'Showing demo data. Some features may differ from live.';
        }
        return '';
    }

    function createIndicatorElement() {
        if (isMockMode()) {
            var indicator = document.createElement('div');
            indicator.id = 'mock-indicator';
            indicator.className = 'mock-indicator';
            indicator.innerHTML = '<span class="mock-dot"></span><span class="mock-text">Demo</span>';
            indicator.setAttribute('title', getIndicatorTooltip());
            return indicator;
        }
        return null;
    }

    function init() {
        if (isMockMode()) {
            var indicator = createIndicatorElement();
            if (indicator) {
                document.body.appendChild(indicator);
            }
        }
    }

    window.MutsMockIndicator = {
        setMockMode: setMockMode,
        isMockMode: isMockMode,
        onMockModeChange: onMockModeChange,
        getIndicatorText: getIndicatorText,
        getIndicatorTooltip: getIndicatorTooltip,
        createIndicatorElement: createIndicatorElement,
        init: init
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
