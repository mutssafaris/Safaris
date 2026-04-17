/**
 * Custom Select Enhancement - Converts native selects to custom dropdowns
 * Apply consistent styling across all manager pages
 */
(function() {
    'use strict';

    function upgradeSelect(select) {
        // Skip if not a select element
        if (!select || select.tagName !== 'SELECT') return;
        
        // Skip if already upgraded or hidden, or no options
        if (select.dataset.customSelectInitialized) return;
        if (select.options.length === 0) return;
        
        select.dataset.customSelectInitialized = 'true';

        var id = select.id || ('custom-' + Math.random().toString(36).substr(2, 9));
        var selectedIndex = select.selectedIndex >= 0 ? select.selectedIndex : 0;
        var selectedOption = select.options[selectedIndex];
        
        if (!selectedOption) return;
        
        var options = [];

        for (var i = 0; i < select.options.length; i++) {
            options.push({
                value: select.options[i].value,
                text: select.options[i].textContent
            });
        }

        // Build custom-select HTML
        var wrapper = document.createElement('div');
        wrapper.className = 'custom-select';
        wrapper.id = id + '-wrapper';
        
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = id;
        hiddenInput.value = selectedOption ? selectedOption.value : '';
        if (select.name) hiddenInput.name = select.name;

        var trigger = document.createElement('div');
        trigger.className = 'select-trigger';
        trigger.innerHTML = '<span>' + (selectedOption ? selectedOption.textContent : '') + '</span>';

        var dropdownList = document.createElement('ul');
        dropdownList.className = 'dropdown-list';

        for (var j = 0; j < options.length; j++) {
            var item = document.createElement('li');
            item.className = 'dropdown-item' + ((selectedOption && options[j].value === selectedOption.value) ? ' selected' : '');
            item.dataset.value = options[j].value;
            item.textContent = options[j].text;
            dropdownList.appendChild(item);
        }

        wrapper.appendChild(hiddenInput);
        wrapper.appendChild(trigger);
        wrapper.appendChild(dropdownList);

        // Replace original select
        select.parentNode.insertBefore(wrapper, select);
        select.style.display = 'none';

        // Attach event handlers
        attachHandlers(wrapper, select);
    }

    function attachHandlers(wrapper, originalSelect) {
        var trigger = wrapper.querySelector('.select-trigger');
        var dropdownList = wrapper.querySelector('.dropdown-list');
        var items = wrapper.querySelectorAll('.dropdown-item');
        var hiddenInput = wrapper.querySelector('input[type="hidden"]');
        var span = trigger.querySelector('span');

        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllDropdowns(wrapper);
            wrapper.classList.toggle('open');
        });

        items.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                var value = item.dataset.value;
                var text = item.textContent;
                
                // Update visual
                span.textContent = text;
                items.forEach(function(i) { i.classList.remove('selected'); });
                item.classList.add('selected');
                
                // Update hidden input
                hiddenInput.value = value;
                
                // Update original select and trigger change event
                originalSelect.value = value;
                originalSelect.dispatchEvent(new Event('change'));
                
                wrapper.classList.remove('open');
            });
        });

        document.addEventListener('click', function() {
            wrapper.classList.remove('open');
        });
    }

    function closeAllDropdowns(exclude) {
        var allSelects = document.querySelectorAll('.custom-select');
        allSelects.forEach(function(s) {
            if (s !== exclude) s.classList.remove('open');
        });
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', upgradeAllSelects);
        } else {
            upgradeAllSelects();
        }
    }

    function upgradeAllSelects() {
        var selects = document.querySelectorAll('.filter-select, select.form-control');
        selects.forEach(function(select) {
            upgradeSelect(select);
        });
    }

    // Auto-init
    init();

    // Expose for manual re-init if needed
    window.CustomSelectUpgrade = {
        upgrade: upgradeAllSelects
    };
})();