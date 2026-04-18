/**
 * Rich Text Editor - Muts Safaris
 * A lightweight WYSIWYG editor for blog posts
 * 
 * Usage:
 *   new MutsEditor(elementId, options)
 *   
 * Options:
 *   placeholder: Placeholder text
 *   onChange: Callback on content change
 *   minHeight: Minimum height
 *   maxHeight: Maximum height (scrollable)
 */
(function() {
    'use strict';

    var MutsEditor = function(elementId, options) {
        options = options || {};
        
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.error('[Editor] Element not found:', elementId);
            return;
        }
        
        this.placeholder = options.placeholder || 'Start writing your content...';
        this.minHeight = options.minHeight || 300;
        this.maxHeight = options.maxHeight || 600;
        this.onChange = options.onChange || null;
        
        this.init();
    };

    MutsEditor.prototype.init = function() {
        // Create editor wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'mut-editor';
        
        // Create toolbar
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'mut-editor-toolbar';
        
        // Toolbar buttons
        var toolbarGroups = [
            { group: 'format', buttons: [
                { icon: 'B', command: 'bold', title: 'Bold (Ctrl+B)' },
                { icon: 'I', command: 'italic', title: 'Italic (Ctrl+I)' },
                { icon: 'U', command: 'underline', title: 'Underline (Ctrl+U)' },
                { icon: 'S', command: 'strikeThrough', title: 'Strikethrough' }
            ]},
            { group: 'blocks', buttons: [
                { icon: 'H1', command: 'formatBlock', value: 'h1', title: 'Heading 1' },
                { icon: 'H2', command: 'formatBlock', value: 'h2', title: 'Heading 2' },
                { icon: 'P', command: 'formatBlock', value: 'p', title: 'Paragraph' },
                { icon: 'blockquote', command: 'formatBlock', value: 'blockquote', title: 'Quote' }
            ]},
            { group: 'lists', buttons: [
                { icon: '•', command: 'insertUnorderedList', title: 'Bullet List' },
                { icon: '1.', command: 'insertOrderedList', title: 'Numbered List' }
            ]},
            { group: 'insert', buttons: [
                { icon: '🔗', command: 'createLink', title: 'Insert Link' },
                { icon: '🖼', command: 'insertImage', title: 'Insert Image' },
                { icon: 'hr', command: 'insertHorizontalRule', title: 'Horizontal Line' }
            ]}
        ];
        
        toolbarGroups.forEach(function(group) {
            var groupEl = document.createElement('span');
            groupEl.className = 'mut-editor-group';
            
            group.buttons.forEach(function(btn) {
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'mut-editor-btn';
                button.title = btn.title;
                button.innerHTML = btn.icon;
                button.dataset.command = btn.command;
                if (btn.value) button.dataset.value = btn.value;
                
                button.addEventListener('click', this.handleCommand.bind(this, btn.command, btn.value));
                groupEl.appendChild(button);
            }.bind(this));
            
            this.toolbar.appendChild(groupEl);
        }.bind(this));
        
        // Create editor content area
        this.content = document.createElement('div');
        this.content.className = 'mut-editor-content';
        this.content.contentEditable = true;
        this.content.spellcheck = true;
        this.content.style.minHeight = this.minHeight + 'px';
        this.content.style.marginTop = '8px';
        if (this.maxHeight) {
            this.content.style.maxHeight = this.maxHeight + 'px';
            this.content.style.overflowY = 'auto';
        }
        
        // Set placeholder (default if not provided)
        if (!this.placeholder) {
            this.placeholder = 'Start writing your content here. Use the toolbar above to format your text...';
        }
        this.content.dataset.placeholder = this.placeholder;
        
        // Build wrapper
        this.wrapper.appendChild(this.toolbar);
        this.wrapper.appendChild(this.content);
        
        // Replace textarea with editor
        this.element.style.display = 'none';
        this.element.parentNode.insertBefore(this.wrapper, this.element);
        
        // Event listeners
        this.addEventListeners();
        
        // Sync initial content
        if (this.element.value) {
            this.content.innerHTML = this.element.value;
        }
        
        console.log('[Editor] Initialized');
    };

    MutsEditor.prototype.handleCommand = function(command, value, e) {
        e.preventDefault();
        
        if (command === 'createLink') {
            var url = prompt('Enter URL:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
        } else if (command === 'insertImage') {
            var url = prompt('Enter image URL:');
            if (url) {
                document.execCommand('insertImage', false, url);
            }
        } else if (command === 'formatBlock' && value) {
            document.execCommand(command, false, '<' + value + '>');
        } else {
            document.execCommand(command, false, value || null);
        }
        
        this.content.focus();
        this.triggerChange();
    };

    MutsEditor.prototype.addEventListeners = function() {
        // Input events
        this.content.addEventListener('input', function() {
            this.updatePlaceholder();
            this.triggerChange();
        }.bind(this));
        
        // Keyboard shortcuts
        this.content.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        document.execCommand('bold', false, null);
                        break;
                    case 'i':
                        e.preventDefault();
                        document.execCommand('italic', false, null);
                        break;
                    case 'u':
                        e.preventDefault();
                        document.execCommand('underline', false, null);
                        break;
                }
            }
        }.bind(this));
        
        // Placeholder on empty
        this.updatePlaceholder();
    };

    MutsEditor.prototype.updatePlaceholder = function() {
        if (this.content.textContent.trim() === '') {
            this.content.classList.add('mut-editor-empty');
        } else {
            this.content.classList.remove('mut-editor-empty');
        }
    };

    MutsEditor.prototype.getContent = function() {
        return this.content.innerHTML;
    };

    MutsEditor.prototype.getText = function() {
        return this.content.textContent;
    };

    MutsEditor.prototype.setContent = function(html) {
        this.content.innerHTML = html;
        this.updatePlaceholder();
    };

    MutsEditor.prototype.clear = function() {
        this.content.innerHTML = '';
        this.updatePlaceholder();
    };

    MutsEditor.prototype.triggerChange = function() {
        // Update hidden textarea
        this.element.value = this.getContent();
        
        // Trigger change event
        if (this.onChange) {
            this.onChange(this.getContent(), this.getText());
        }
        
        // Dispatch custom event
        this.element.dispatchEvent(new Event('editor-change'));
    };

    MutsEditor.prototype.isEmpty = function() {
        return this.content.textContent.trim() === '';
    };

    // Initialize any editors on page
    function initEditors() {
        document.querySelectorAll('[data-editor]').forEach(function(el) {
            var options = {};
            if (el.dataset.placeholder) options.placeholder = el.dataset.placeholder;
            if (el.dataset.minHeight) options.minHeight = parseInt(el.dataset.minHeight);
            if (el.dataset.maxHeight) options.maxHeight = parseInt(el.dataset.maxHeight);
            new MutsEditor(el.id, options);
        });
    }

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEditors);
    } else {
        initEditors();
    }

    // Expose globally
    window.MutsEditor = MutsEditor;

})();