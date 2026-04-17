/**
 * Custom Date Picker - Mobile-friendly date picker with proper positioning
 * Ensures date picker appears below the input on mobile devices
 */
(function() {
    'use strict';

    var DATEPicker = {
        init: function() {
            this.upgradeDateInputs();
        },

        upgradeDateInputs: function() {
            var dateInputs = document.querySelectorAll('input[type="date"].filter-select');
            var self = this;

            dateInputs.forEach(function(input) {
                if (input.dataset.datepickerInitialized) return;
                input.dataset.datepickerInitialized = 'true';

                // Hide native picker - make read-only and prevent input
                input.readOnly = true;
                input.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var wrapper = input.closest('.custom-datepicker-wrapper');
                    var picker = wrapper.querySelector('.custom-datepicker');
                    self.showPicker(input, picker);
                });

                // Create wrapper
                var wrapper = document.createElement('div');
                wrapper.className = 'custom-datepicker-wrapper';
                wrapper.style.position = 'relative';
                wrapper.style.display = 'inline-block';
                wrapper.style.width = '100%';

                // Clone input to preserve styles, replace with wrapper
                var clone = input.cloneNode(true);
                clone.readOnly = true;
                clone.style.pointerEvents = 'auto';
                
                // Insert wrapper before original input
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
                
                // Create custom picker
                var picker = self.createPicker(input);
                wrapper.appendChild(picker);

                // Event listeners
                self.attachHandlers(input, picker, wrapper);
            });
        },

        createPicker: function(input) {
            var picker = document.createElement('div');
            picker.className = 'custom-datepicker';
            picker.style.display = 'none';
            picker.style.position = 'fixed';
            picker.style.zIndex = '1050';
            picker.style.background = 'var(--bg-dark)';
            picker.style.border = '1px solid var(--border-glow)';
            picker.style.borderRadius = '8px';
            picker.style.padding = '12px';
            picker.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
            picker.style.minWidth = '280px';
            picker.style.maxWidth = '320px';

            // Header
            var header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.marginBottom = '12px';

            var prevBtn = document.createElement('button');
            prevBtn.type = 'button';
            prevBtn.textContent = '‹';
            prevBtn.style.cssText = 'background:transparent;border:none;color:var(--accent);font-size:1.5rem;cursor:pointer;padding:4px 12px;';
            prevBtn.onclick = function(e) { 
                e.stopPropagation();
                DATEPicker.navigateMonth(input, picker, -1); 
            };

            var monthLabel = document.createElement('span');
            monthLabel.className = 'month-label';
            monthLabel.style.color = 'var(--text-primary)';
            monthLabel.style.fontWeight = '600';

            var nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.textContent = '›';
            nextBtn.style.cssText = 'background:transparent;border:none;color:var(--accent);font-size:1.5rem;cursor:pointer;padding:4px 12px;';
            nextBtn.onclick = function(e) { 
                e.stopPropagation();
                DATEPicker.navigateMonth(input, picker, 1); 
            };

            header.appendChild(prevBtn);
            header.appendChild(monthLabel);
            header.appendChild(nextBtn);
            picker.appendChild(header);

            // Days grid
            var grid = document.createElement('div');
            grid.className = 'days-grid';
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
            grid.style.gap = '2px';
            picker.appendChild(grid);

            // Day names header
            var dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            dayNames.forEach(function(day) {
                var dayHeader = document.createElement('div');
                dayHeader.textContent = day;
                dayHeader.style.cssText = 'text-align:center;font-size:0.7rem;color:var(--text-secondary);font-weight:600;';
                grid.appendChild(dayHeader);
            });

            return picker;
        },

        attachHandlers: function(input, picker, wrapper) {
            var self = this;

            // Close on outside click
            document.addEventListener('click', function(e) {
                if (!wrapper.contains(e.target) && !e.target.classList.contains('custom-datepicker')) {
                    picker.style.display = 'none';
                }
            });

            // Update display on value change
            input.addEventListener('change', function() {
                self.updatePickerDisplay(input, picker);
            });
        },

        showPicker: function(input, picker) {
            var currentDate = input.value ? new Date(input.value) : new Date();
            this.renderDays(picker, currentDate);
            
            // Position picker below the input field
            this.positionPicker(input, picker);
            
            picker.style.display = 'block';
        },

        positionPicker: function(input, picker) {
            var rect = input.getBoundingClientRect();
            var pickerHeight = 320; // approximate picker height
            var spaceBelow = window.innerHeight - rect.bottom;
            var spaceAbove = rect.top;
            
            // Check mobile
            var isMobile = window.innerWidth <= 480;
            
            if (isMobile) {
                // On mobile, show below input but ensure it stays in viewport
                if (spaceBelow > pickerHeight + 10) {
                    picker.style.top = (rect.bottom + 4) + 'px';
                    picker.style.bottom = 'auto';
                } else if (spaceAbove > pickerHeight + 10) {
                    picker.style.top = 'auto';
                    picker.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
                } else {
                    // Neither fit well, show below anyway
                    picker.style.top = (rect.bottom + 4) + 'px';
                    picker.style.bottom = 'auto';
                }
                picker.style.left = rect.left + 'px';
                picker.style.right = 'auto';
                picker.style.maxWidth = 'calc(100vw - 20px)';
            } else {
                // Desktop - position below input
                picker.style.top = (rect.bottom + 4) + 'px';
                picker.style.bottom = 'auto';
                picker.style.left = rect.left + 'px';
                picker.style.right = 'auto';
                picker.style.maxWidth = '320px';
            }
            
            // Handle horizontal overflow
            var pickerRect = picker.getBoundingClientRect();
            if (pickerRect.right > window.innerWidth - 10) {
                picker.style.left = (window.innerWidth - pickerRect.width - 10) + 'px';
            }
            if (pickerRect.left < 10) {
                picker.style.left = '10px';
            }
        },

        renderDays: function(picker, currentDate) {
            var grid = picker.querySelector('.days-grid');
            var monthLabel = picker.querySelector('.month-label');
            var self = this;
            var input = picker.closest('.custom-datepicker-wrapper').querySelector('input');

            // Clear existing days (keep header row - 7 items)
            while (grid.children.length > 7) {
                grid.removeChild(grid.lastChild);
            }

            // Update header
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                            'July', 'August', 'September', 'October', 'November', 'December'];
            monthLabel.textContent = monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();

            // Get first day of month
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth();
            var firstDay = new Date(year, month, 1).getDay();
            var daysInMonth = new Date(year, month + 1, 0).getDate();

            // Empty cells for days before first
            for (var i = 0; i < firstDay; i++) {
                var empty = document.createElement('div');
                grid.appendChild(empty);
            }

            // Day cells
            var selectedDate = input.value;
            var selectedDay = selectedDate ? new Date(selectedDate).getDate() : null;

            for (var day = 1; day <= daysInMonth; day++) {
                var cell = document.createElement('button');
                cell.type = 'button';
                cell.textContent = day;
                cell.style.cssText = 'background:transparent;border:none;color:var(--text-primary);padding:6px;font-size:0.85rem;cursor:pointer;border-radius:4px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;';

                if (day === selectedDay && currentDate.getDate() === day) {
                    cell.style.background = 'var(--accent)';
                    cell.style.color = '#000';
                }

                cell.addEventListener('click', function(d) {
                    return function(e) {
                        e.stopPropagation();
                        var inp = picker.closest('.custom-datepicker-wrapper').querySelector('input');
                        var newDate = new Date(year, month, d);
                        var dateStr = newDate.toISOString().split('T')[0];
                        inp.value = dateStr;
                        picker.style.display = 'none';
                        inp.dispatchEvent(new Event('change'));
                    };
                }(day));

                grid.appendChild(cell);
            }
        },

        navigateMonth: function(input, picker, delta) {
            var currentDate = input.value ? new Date(input.value) : new Date();
            currentDate.setMonth(currentDate.getMonth() + delta);
            this.renderDays(picker, currentDate);
        },

        updatePickerDisplay: function(input, picker) {
            if (input.value) {
                var currentDate = new Date(input.value);
                this.renderDays(picker, currentDate);
            }
        }
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            DATEPicker.init();
        });
    } else {
        DATEPicker.init();
    }

    window.ManagerDatePicker = DATEPicker;
})();