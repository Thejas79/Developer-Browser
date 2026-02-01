/**
 * Developer Browser - New Tab Extension
 * A clean, developer-focused new tab page
 * No tracking, no ads, no external dependencies
 */

(function () {
    'use strict';

    // ===== DOM Elements =====
    const elements = {
        backgroundLayer: document.getElementById('backgroundLayer'),
        currentTime: document.getElementById('timeDisplay'),
        currentDate: document.getElementById('dateDisplay'),
        mainTitle: document.getElementById('mainTitle'),
        titleHint: document.getElementById('titleHint'),
        searchForm: document.getElementById('searchForm'),
        searchInput: document.getElementById('searchInput'),
        notepadToggle: document.getElementById('notepadToggle'),
        notepadModal: document.getElementById('notepadModal'),
        notepadClose: document.getElementById('notepadClose'),
        notepadText: document.getElementById('notepadText'),
        notepadStatus: document.getElementById('notepadStatus'),
        // To Do List elements
        todoToggle: document.getElementById('todoToggle'),
        todoModal: document.getElementById('todoModal'),
        todoClose: document.getElementById('todoClose'),
        todoInput: document.getElementById('todoInput'),
        todoAddBtn: document.getElementById('todoAddBtn'),
        todoList: document.getElementById('todoList'),
        todoCount: document.getElementById('todoCount'),
        todoClearBtn: document.getElementById('todoClearBtn')
    };

    // ===== Configuration =====
    const config = {
        backgroundInterval: 30000, // 30 seconds
        clockUpdateInterval: 1000, // 1 second
        notepadSaveDelay: 500, // 500ms debounce
        storageKeys: {
            title: 'developerBrowser_title',
            notes: 'developerBrowser_notes',
            backgroundIndex: 'developerBrowser_bgIndex',
            todos: 'developerBrowser_todos'
        }
    };

    // ===== Tech-Themed Background Gradients =====
    // Using CSS gradients instead of external images for privacy and performance
    const backgrounds = [
        // Deep Space Code
        'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 25%, #0f0f2d 50%, #1e1e4a 75%, #0a0a1f 100%)',
        // Cyber Circuit
        'linear-gradient(45deg, #0d0d0d 0%, #1a0a2e 20%, #0a1a1a 40%, #1a1a0a 60%, #0a0a1a 80%, #1a0d1a 100%)',
        // Matrix Green
        'linear-gradient(180deg, #0a0f0a 0%, #0d1a0d 30%, #051005 50%, #0a1f0a 70%, #050a05 100%)',
        // Neon Purple
        'linear-gradient(135deg, #0f0015 0%, #1a0a2e 25%, #0d0020 50%, #1a0a3a 75%, #0a0015 100%)',
        // Electric Blue
        'linear-gradient(45deg, #000a1a 0%, #001a3d 25%, #000d20 50%, #001a40 75%, #00081a 100%)',
        // Sunset Code
        'linear-gradient(135deg, #1a0a0a 0%, #2d1a1a 25%, #1a0d0d 50%, #3d1a1a 75%, #150808 100%)',
        // Ocean Deep
        'linear-gradient(180deg, #050a15 0%, #0a152a 30%, #05101f 50%, #0a1a30 70%, #03080f 100%)',
        // Midnight AI
        'linear-gradient(135deg, #08081a 0%, #151535 25%, #0a0a20 50%, #1a1a45 75%, #050510 100%)'
    ];

    // ===== Utility Functions =====

    /**
     * Debounce function for performance optimization
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Safe local storage access
     */
    const storage = {
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value !== null ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.warn('Storage get error:', e);
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Storage set error:', e);
                return false;
            }
        }
    };

    // ===== Clock & Date Functions =====

    function updateClock() {
        const now = new Date();

        // Format time: HH:MM:SS
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        elements.currentTime.textContent = `${hours}:${minutes}:${seconds}`;

        // Format date: Day, Month DD, YYYY
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        elements.currentDate.textContent = now.toLocaleDateString('en-US', options);
    }

    // ===== Background Functions =====

    let currentBackgroundIndex = 0;

    function setBackground(index) {
        currentBackgroundIndex = index % backgrounds.length;
        elements.backgroundLayer.style.background = backgrounds[currentBackgroundIndex];
        storage.set(config.storageKeys.backgroundIndex, currentBackgroundIndex);
    }

    function rotateBackground() {
        setBackground(currentBackgroundIndex + 1);
    }

    function initBackground() {
        const savedIndex = storage.get(config.storageKeys.backgroundIndex, 0);
        setBackground(savedIndex);
        setInterval(rotateBackground, config.backgroundInterval);
    }

    // ===== Title Edit Functions =====

    function initTitle() {
        const savedTitle = storage.get(config.storageKeys.title, 'DEVELOPER');
        elements.mainTitle.textContent = savedTitle;

        // Click to edit
        elements.mainTitle.addEventListener('click', startEditTitle);

        // Keyboard support
        elements.mainTitle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !elements.mainTitle.isContentEditable) {
                e.preventDefault();
                startEditTitle();
            } else if (e.key === 'Enter' && elements.mainTitle.isContentEditable) {
                e.preventDefault();
                endEditTitle();
            } else if (e.key === 'Escape' && elements.mainTitle.isContentEditable) {
                e.preventDefault();
                cancelEditTitle();
            }
        });

        // Blur to save
        elements.mainTitle.addEventListener('blur', endEditTitle);
    }

    let originalTitle = '';

    function startEditTitle() {
        if (elements.mainTitle.isContentEditable) return;

        originalTitle = elements.mainTitle.textContent;
        elements.mainTitle.contentEditable = 'true';
        elements.mainTitle.focus();
        elements.titleHint.textContent = 'Press Enter to save, Escape to cancel';
        elements.titleHint.classList.add('visible');

        // Select all text
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(elements.mainTitle);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function endEditTitle() {
        if (!elements.mainTitle.isContentEditable) return;

        elements.mainTitle.contentEditable = 'false';
        const newTitle = elements.mainTitle.textContent.trim() || 'DEVELOPER';
        elements.mainTitle.textContent = newTitle;
        storage.set(config.storageKeys.title, newTitle);
        elements.titleHint.textContent = 'Click to edit';
        elements.titleHint.classList.remove('visible');
    }

    function cancelEditTitle() {
        elements.mainTitle.contentEditable = 'false';
        elements.mainTitle.textContent = originalTitle;
        elements.titleHint.textContent = 'Click to edit';
        elements.titleHint.classList.remove('visible');
    }

    // ===== Search Functions =====

    function initSearch() {
        elements.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = elements.searchInput.value.trim();
            if (query) {
                // DuckDuckGo search
                const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                window.location.href = searchUrl;
            }
        });

        // Focus search on '/' key
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !isInputFocused()) {
                e.preventDefault();
                elements.searchInput.focus();
            }
        });
    }

    function isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable;
    }

    // ===== Notepad Functions =====

    function initNotepad() {
        // Load saved notes
        const savedNotes = storage.get(config.storageKeys.notes, '');
        elements.notepadText.value = savedNotes;

        // Toggle modal
        elements.notepadToggle.addEventListener('click', (e) => {
            e.preventDefault();
            openNotepad();
        });

        // Close modal
        elements.notepadClose.addEventListener('click', closeNotepad);

        // Close on backdrop click
        elements.notepadModal.addEventListener('click', (e) => {
            if (e.target === elements.notepadModal) {
                closeNotepad();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.notepadModal.classList.contains('active')) {
                closeNotepad();
            }
        });

        // Auto-save notes
        const debouncedSave = debounce(saveNotes, config.notepadSaveDelay);
        elements.notepadText.addEventListener('input', debouncedSave);
    }

    function openNotepad() {
        elements.notepadModal.classList.add('active');
        elements.notepadText.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeNotepad() {
        elements.notepadModal.classList.remove('active');
        document.body.style.overflow = '';
        saveNotes();
    }

    function saveNotes() {
        const notes = elements.notepadText.value;
        const saved = storage.set(config.storageKeys.notes, notes);
        elements.notepadStatus.textContent = saved ? 'Saved' : 'Save failed';

        // Visual feedback
        elements.notepadStatus.style.color = saved ? 'var(--accent-primary)' : '#ff6b6b';
    }

    // ===== Keyboard Shortcuts =====

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + N: Open notepad
            if (e.altKey && e.key === 'n') {
                e.preventDefault();
                openNotepad();
            }

            // Alt + T: Focus title for editing
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                elements.mainTitle.focus();
                startEditTitle();
            }

            // Alt + D: Open to do list
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                openTodo();
            }
        });
    }

    // ===== To Do List Functions =====

    let todos = [];

    function initTodo() {
        // Load saved todos
        todos = storage.get(config.storageKeys.todos, []);
        renderTodos();

        // Toggle modal
        elements.todoToggle.addEventListener('click', openTodo);

        // Close modal
        elements.todoClose.addEventListener('click', closeTodo);

        // Close on backdrop click
        elements.todoModal.addEventListener('click', (e) => {
            if (e.target === elements.todoModal) {
                closeTodo();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.todoModal.classList.contains('active')) {
                closeTodo();
            }
        });

        // Add task on button click
        elements.todoAddBtn.addEventListener('click', addTodo);

        // Add task on Enter
        elements.todoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTodo();
            }
        });

        // Clear completed
        elements.todoClearBtn.addEventListener('click', clearCompletedTodos);
    }

    function openTodo() {
        elements.todoModal.classList.add('active');
        elements.todoInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeTodo() {
        elements.todoModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function addTodo() {
        const text = elements.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        todos.unshift(todo);
        saveTodos();
        renderTodos();
        elements.todoInput.value = '';
    }

    function toggleTodo(id) {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    function clearCompletedTodos() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }

    function saveTodos() {
        storage.set(config.storageKeys.todos, todos);
    }

    function renderTodos() {
        elements.todoList.innerHTML = '';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item${todo.completed ? ' completed' : ''}`;
            li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="todo-delete" aria-label="Delete task">&times;</button>
      `;

            // Toggle completion
            li.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));

            // Delete task
            li.querySelector('.todo-delete').addEventListener('click', () => deleteTodo(todo.id));

            elements.todoList.appendChild(li);
        });

        // Update count
        const activeCount = todos.filter(t => !t.completed).length;
        const totalCount = todos.length;
        elements.todoCount.textContent = `${activeCount} of ${totalCount} task${totalCount !== 1 ? 's' : ''}`;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== Link Management =====

    const defaultLinks = [
        // Left Side
        { id: 'l1', label: 'Stack Overflow', url: 'https://stackoverflow.com', x: '18%', y: '15%' },
        { id: 'l2', label: 'Claude', url: 'https://claude.ai', x: '30%', y: '18%' },
        { id: 'l3', label: 'HackerRank', url: 'https://www.hackerrank.com', x: '12%', y: '32%' },
        { id: 'l4', label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org', x: '28%', y: '28%' },
        { id: 'l5', label: 'LeetCode', url: 'https://leetcode.com', x: '10%', y: '50%' },
        { id: 'l6', label: 'GitHub', url: 'https://github.com', x: '12%', y: '64%' },
        { id: 'l7', label: 'GitLab', url: 'https://gitlab.com', x: '18%', y: '74%' },
        { id: 'l8', label: 'Netlify', url: 'https://www.netlify.com', x: '26%', y: '56%' },
        { id: 'l9', label: 'Railway', url: 'https://railway.app', x: '36%', y: '80%' },
        { id: 'l10', label: 'Bitbucket', url: 'https://bitbucket.org', x: '10%', y: '82%' },
        { id: 'l11', label: 'Vercel', url: 'https://vercel.com', x: '25%', y: '88%' },

        // Right Side
        { id: 'r1', label: 'MDN Docs', url: 'https://developer.mozilla.org', x: '82%', y: '15%' },
        { id: 'r2', label: 'Docker Hub', url: 'https://hub.docker.com', x: '92%', y: '20%' },
        { id: 'r3', label: 'Firebase Studio', url: 'https://firebase.google.com', x: '78%', y: '25%' },
        { id: 'r4', label: 'Postman', url: 'https://www.postman.com', x: '90%', y: '32%' },
        { id: 'r5', label: 'CDN Fonts', url: 'https://fonts.google.com', x: '75%', y: '40%' },
        { id: 'r6', label: 'Image Color Picker', url: 'https://imagecolorpicker.com', x: '94%', y: '42%' },
        { id: 'r7', label: 'URL Encoder', url: 'https://www.urlencoder.org', x: '88%', y: '52%' },
        { id: 'r8', label: 'JSON Formatter', url: 'https://jsonformatter.org', x: '94%', y: '62%' },
        { id: 'r9', label: 'Color Palette', url: 'https://coolors.co', x: '72%', y: '66%' },
        { id: 'r10', label: 'CSS Gradient Generator', url: 'https://cssgradient.io', x: '90%', y: '72%' },
        { id: 'r11', label: 'Color Space', url: 'https://mycolor.space', x: '78%', y: '80%' },
        { id: 'r12', label: 'Atternity UI', url: 'https://ui.atternity.com', x: '85%', y: '88%' }
    ];

    let currentLinks = [];

    function initLinks() {
        // Load links from storage or use defaults
        currentLinks = storage.get('developerBrowser_links', defaultLinks);
        renderLinks();
        initCustomize();
    }

    function renderLinks() {
        const container = document.getElementById('threadLinksContainer');
        if (!container) return;

        container.innerHTML = '';

        currentLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'thread-link';
            a.textContent = link.label;
            a.style.setProperty('--x', link.x);
            a.style.setProperty('--y', link.y);
            container.appendChild(a);
        });
    }

    // ===== Customize Modal Functions =====

    function initCustomize() {
        const modal = document.getElementById('customizeModal');
        const toggleBtn = document.getElementById('customizeToggle');
        const closeBtn = document.getElementById('customizeClose');
        const saveBtn = document.getElementById('saveLinksBtn');
        const resetBtn = document.getElementById('resetLinksBtn');

        if (!modal || !toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            openCustomizeModal();
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        saveBtn.addEventListener('click', saveLinksChanges);
        resetBtn.addEventListener('click', resetLinksToDefault);
    }

    function openCustomizeModal() {
        const modal = document.getElementById('customizeModal');
        const grid = document.getElementById('linksEditorGrid');

        grid.innerHTML = '';

        currentLinks.forEach((link, index) => {
            const item = document.createElement('div');
            item.className = 'link-edit-item';

            const label = document.createElement('label');
            label.textContent = `Position ${index + 1}`;

            const inputs = document.createElement('div');
            inputs.className = 'link-edit-inputs';

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.className = 'name-input';
            nameInput.value = link.label;
            nameInput.placeholder = 'Name';

            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.className = 'url-input';
            urlInput.value = link.url;
            urlInput.placeholder = 'URL';

            inputs.appendChild(nameInput);
            inputs.appendChild(urlInput);

            item.appendChild(label);
            item.appendChild(inputs);
            grid.appendChild(item);
        });

        modal.classList.add('active');
    }

    function saveLinksChanges() {
        const grid = document.getElementById('linksEditorGrid');
        const items = grid.querySelectorAll('.link-edit-item');

        const newLinks = [];

        items.forEach((item, index) => {
            const nameInput = item.querySelector('.name-input');
            const urlInput = item.querySelector('.url-input');

            // Keep original ID and coordinates, update label and url
            newLinks.push({
                ...currentLinks[index],
                label: nameInput.value.trim() || currentLinks[index].label,
                url: urlInput.value.trim() || currentLinks[index].url
            });
        });

        currentLinks = newLinks;
        storage.set('developerBrowser_links', currentLinks);
        renderLinks();

        document.getElementById('customizeModal').classList.remove('active');
    }

    function resetLinksToDefault() {
        if (confirm('Are you sure you want to reset all links to default?')) {
            currentLinks = JSON.parse(JSON.stringify(defaultLinks)); // Deep copy
            storage.set('developerBrowser_links', currentLinks);
            renderLinks();
            openCustomizeModal(); // Refresh modal
        }
    }

    // ===== Initialization =====

    function init() {
        // Start clock immediately
        updateClock();
        setInterval(updateClock, config.clockUpdateInterval);

        // Initialize all features
        initBackground();
        initTitle();
        initSearch();
        initNotepad();
        initTodo();
        initLinks(); // Initialize links
        initKeyboardShortcuts();

        // Focus search on load
        setTimeout(() => {
            elements.searchInput.focus();
        }, 100);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
