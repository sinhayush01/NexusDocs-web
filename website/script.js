// Collaborative Rich Text Editor - Main JavaScript

class CollaborativeEditor {
    constructor() {
        this.socket = null;
        this.editor = null;
        this.documentId = this.getDocumentId();
        this.userId = this.generateUserId();
        this.userName = this.generateUserName();
        this.connectedUsers = new Map();
        this.typingUsers = new Set();
        this.typingTimeout = null;
        this.autoSaveInterval = null;
        this.lastContent = '';
        
        this.init();
    }

    init() {
        this.initEditor();
        this.initToolbar();
        this.initSocket();
        this.initModals();
        this.initAutoSave();
        this.updateStats();
        this.setupEventListeners();
    }

    // Initialize the rich text editor
    initEditor() {
        this.editor = document.getElementById('editor');
        
        // Set initial content
        this.editor.innerHTML = '<p>Start writing your document here...</p>';
        
        // Focus on editor
        this.editor.focus();
        
        // Store initial content
        this.lastContent = this.editor.innerHTML;
    }

    // Initialize toolbar functionality
    initToolbar() {
        // Text formatting buttons
        document.getElementById('boldBtn').addEventListener('click', () => this.execCommand('bold'));
        document.getElementById('italicBtn').addEventListener('click', () => this.execCommand('italic'));
        document.getElementById('underlineBtn').addEventListener('click', () => this.execCommand('underline'));
        document.getElementById('strikeBtn').addEventListener('click', () => this.execCommand('strikethrough'));
        
        // Lists
        document.getElementById('orderedListBtn').addEventListener('click', () => this.execCommand('insertOrderedList'));
        document.getElementById('unorderedListBtn').addEventListener('click', () => this.execCommand('insertUnorderedList'));
        
        // Alignment
        document.getElementById('alignLeftBtn').addEventListener('click', () => this.execCommand('justifyLeft'));
        document.getElementById('alignCenterBtn').addEventListener('click', () => this.execCommand('justifyCenter'));
        document.getElementById('alignRightBtn').addEventListener('click', () => this.execCommand('justifyRight'));
        
        // Colors
        document.getElementById('textColor').addEventListener('change', (e) => this.execCommand('foreColor', e.target.value));
        document.getElementById('bgColor').addEventListener('change', (e) => this.execCommand('hiliteColor', e.target.value));
        
        // Headers
        document.getElementById('headerSelect').addEventListener('change', (e) => {
            const value = e.target.value;
            if (value) {
                this.execCommand('formatBlock', `<h${value}>`);
            } else {
                this.execCommand('formatBlock', '<p>');
            }
        });
        
        // Links and Images
        document.getElementById('linkBtn').addEventListener('click', () => this.showLinkModal());
        document.getElementById('imageBtn').addEventListener('click', () => this.showImageModal());
        
        // Clear formatting
        document.getElementById('clearFormatBtn').addEventListener('click', () => this.execCommand('removeFormat'));
        
        // Save and Share
        document.getElementById('saveBtn').addEventListener('click', () => this.saveDocument());
        document.getElementById('shareBtn').addEventListener('click', () => this.showShareModal());
    }

    // Execute document commands
    execCommand(command, value = null) {
        document.execCommand(command, false, value);
        this.editor.focus();
        this.onContentChange();
    }

    // Initialize Socket.io connection
    initSocket() {
        // For demo purposes, we'll simulate real-time collaboration
        // In a real implementation, you would connect to a Socket.io server
        this.simulateCollaboration();
        
        // Update connection status
        this.updateConnectionStatus('connected');
    }

    // Simulate real-time collaboration for demo
    simulateCollaboration() {
        // Simulate other users joining
        setTimeout(() => {
            this.addUser('user2', 'Alice');
            this.showNotification('Alice joined the document', 'info');
        }, 2000);

        setTimeout(() => {
            this.addUser('user3', 'Bob');
            this.showNotification('Bob joined the document', 'info');
        }, 4000);

        // Simulate typing indicators
        setInterval(() => {
            if (Math.random() > 0.7) {
                const users = Array.from(this.connectedUsers.keys()).filter(id => id !== this.userId);
                if (users.length > 0) {
                    const randomUser = users[Math.floor(Math.random() * users.length)];
                    this.showTypingIndicator(randomUser);
                    setTimeout(() => this.hideTypingIndicator(randomUser), 2000);
                }
            }
        }, 5000);
    }

    // Initialize modals
    initModals() {
        // Link modal
        document.getElementById('insertLink').addEventListener('click', () => this.insertLink());
        document.getElementById('cancelLink').addEventListener('click', () => this.hideModal('linkModal'));
        
        // Image modal
        document.getElementById('insertImage').addEventListener('click', () => this.insertImage());
        document.getElementById('cancelImage').addEventListener('click', () => this.hideModal('imageModal'));
        
        // Share modal
        document.getElementById('copyUrl').addEventListener('click', () => this.copyShareUrl());
        document.getElementById('closeShare').addEventListener('click', () => this.hideModal('shareModal'));
        
        // Close modals when clicking outside
        document.querySelectorAll('[id$="Modal"]').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    // Show link modal
    showLinkModal() {
        document.getElementById('linkModal').classList.remove('hidden');
        document.getElementById('linkUrl').focus();
    }

    // Show image modal
    showImageModal() {
        document.getElementById('imageModal').classList.remove('hidden');
        document.getElementById('imageUrl').focus();
    }

    // Show share modal
    showShareModal() {
        const shareUrl = window.location.href;
        document.getElementById('shareUrl').value = shareUrl;
        document.getElementById('shareModal').classList.remove('hidden');
    }

    // Hide modal
    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // Insert link
    insertLink() {
        const url = document.getElementById('linkUrl').value.trim();
        const text = document.getElementById('linkText').value.trim();
        
        if (url) {
            const linkText = text || url;
            const linkHtml = `<a href="${url}" target="_blank">${linkText}</a>`;
            this.insertHTML(linkHtml);
            this.hideModal('linkModal');
            this.clearModalInputs('linkModal');
        }
    }

    // Insert image
    insertImage() {
        const url = document.getElementById('imageUrl').value.trim();
        const file = document.getElementById('imageFile').files[0];
        
        if (url) {
            const imgHtml = `<img src="${url}" alt="Inserted image" style="max-width: 100%; height: auto;">`;
            this.insertHTML(imgHtml);
            this.hideModal('imageModal');
            this.clearModalInputs('imageModal');
        } else if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgHtml = `<img src="${e.target.result}" alt="Uploaded image" style="max-width: 100%; height: auto;">`;
                this.insertHTML(imgHtml);
                this.hideModal('imageModal');
                this.clearModalInputs('imageModal');
            };
            reader.readAsDataURL(file);
        }
    }

    // Insert HTML at cursor position
    insertHTML(html) {
        document.execCommand('insertHTML', false, html);
        this.editor.focus();
        this.onContentChange();
    }

    // Clear modal inputs
    clearModalInputs(modalId) {
        const modal = document.getElementById(modalId);
        modal.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        modal.querySelectorAll('input[type="file"]').forEach(input => {
            input.value = '';
        });
    }

    // Copy share URL
    copyShareUrl() {
        const shareUrl = document.getElementById('shareUrl');
        shareUrl.select();
        document.execCommand('copy');
        this.showNotification('Link copied to clipboard!', 'success');
    }

    // Setup event listeners
    setupEventListeners() {
        // Editor content change
        this.editor.addEventListener('input', () => this.onContentChange());
        this.editor.addEventListener('keyup', () => this.onContentChange());
        
        // Document title change
        document.getElementById('documentTitle').addEventListener('input', (e) => {
            this.updateDocumentTitle(e.target.value);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveDocument();
                        break;
                    case 'b':
                        e.preventDefault();
                        this.execCommand('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.execCommand('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        this.execCommand('underline');
                        break;
                }
            }
        });
    }

    // Handle content changes
    onContentChange() {
        const currentContent = this.editor.innerHTML;
        
        // Update stats
        this.updateStats();
        
        // Show typing indicator
        this.showTypingIndicator(this.userId);
        
        // Clear typing timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
        
        // Set typing timeout
        this.typingTimeout = setTimeout(() => {
            this.hideTypingIndicator(this.userId);
        }, 1000);
        
        // Emit content change (in real implementation)
        if (currentContent !== this.lastContent) {
            this.lastContent = currentContent;
            // this.socket.emit('content-change', { content: currentContent, userId: this.userId });
        }
    }

    // Update document statistics
    updateStats() {
        const text = this.editor.innerText || this.editor.textContent;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lineCount = text.split('\n').length;
        
        document.getElementById('charCount').textContent = `Characters: ${charCount}`;
        document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
        document.getElementById('lineCount').textContent = `Lines: ${lineCount}`;
    }

    // Update document title
    updateDocumentTitle(title) {
        document.title = title || 'Collaborative Rich Text Editor';
    }

    // Initialize auto-save
    initAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, 30000); // Auto-save every 30 seconds
    }

    // Auto-save document
    autoSave() {
        const content = this.editor.innerHTML;
        const title = document.getElementById('documentTitle').value;
        
        // Save to localStorage for demo
        localStorage.setItem('collaborative-editor-content', content);
        localStorage.setItem('collaborative-editor-title', title);
        
        // In real implementation, save to server
        // this.socket.emit('auto-save', { content, title });
    }

    // Save document
    saveDocument() {
        this.autoSave();
        this.showNotification('Document saved successfully!', 'success');
    }

    // Add user to connected users
    addUser(userId, userName) {
        this.connectedUsers.set(userId, userName);
        this.updateConnectedUsers();
        this.updateOnlineUsers();
    }

    // Remove user from connected users
    removeUser(userId) {
        this.connectedUsers.delete(userId);
        this.updateConnectedUsers();
        this.updateOnlineUsers();
    }

    // Update connected users display
    updateConnectedUsers() {
        const container = document.getElementById('connectedUsers');
        const usersHtml = Array.from(this.connectedUsers.entries()).map(([id, name]) => {
            const isCurrentUser = id === this.userId;
            return `
                <div class="connected-user">
                    <div class="status-dot"></div>
                    <span>${name}${isCurrentUser ? ' (You)' : ''}</span>
                </div>
            `;
        }).join('');
        
        container.innerHTML = `
            <span class="text-sm text-gray-600">Collaborators:</span>
            ${usersHtml}
        `;
    }

    // Update online users count
    updateOnlineUsers() {
        const count = this.connectedUsers.size + 1; // +1 for current user
        document.getElementById('onlineUsers').textContent = `${count} online`;
    }

    // Show typing indicator
    showTypingIndicator(userId) {
        if (userId === this.userId) return;
        
        this.typingUsers.add(userId);
        this.updateTypingIndicator();
    }

    // Hide typing indicator
    hideTypingIndicator(userId) {
        this.typingUsers.delete(userId);
        this.updateTypingIndicator();
    }

    // Update typing indicator display
    updateTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        const usersSpan = document.getElementById('typingUsers');
        
        if (this.typingUsers.size > 0) {
            const userNames = Array.from(this.typingUsers).map(id => 
                this.connectedUsers.get(id) || `User ${id.slice(-4)}`
            );
            usersSpan.textContent = userNames.join(', ');
            indicator.classList.remove('hidden');
        } else {
            indicator.classList.add('hidden');
        }
    }

    // Update connection status
    updateConnectionStatus(status) {
        const statusDot = document.getElementById('connectionStatus');
        const statusText = document.getElementById('connectionText');
        
        statusDot.className = `w-2 h-2 rounded-full connection-dot ${status}`;
        
        switch (status) {
            case 'connected':
                statusText.textContent = 'Connected';
                statusText.className = 'text-sm text-green-600';
                break;
            case 'disconnected':
                statusText.textContent = 'Disconnected';
                statusText.className = 'text-sm text-red-600';
                break;
            case 'connecting':
                statusText.textContent = 'Connecting...';
                statusText.className = 'text-sm text-yellow-600';
                break;
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-${this.getNotificationIcon(type)} text-${this.getNotificationColor(type)}-500"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notifications.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Get notification icon
    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    // Get notification color
    getNotificationColor(type) {
        switch (type) {
            case 'success': return 'green';
            case 'error': return 'red';
            case 'warning': return 'yellow';
            default: return 'blue';
        }
    }

    // Generate document ID
    getDocumentId() {
        let id = localStorage.getItem('document-id');
        if (!id) {
            id = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('document-id', id);
        }
        return id;
    }

    // Generate user ID
    generateUserId() {
        let id = localStorage.getItem('user-id');
        if (!id) {
            id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('user-id', id);
        }
        return id;
    }

    // Generate user name
    generateUserName() {
        const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
        return names[Math.floor(Math.random() * names.length)];
    }

    // Load saved content
    loadSavedContent() {
        const savedContent = localStorage.getItem('collaborative-editor-content');
        const savedTitle = localStorage.getItem('collaborative-editor-title');
        
        if (savedContent) {
            this.editor.innerHTML = savedContent;
            this.lastContent = savedContent;
        }
        
        if (savedTitle) {
            document.getElementById('documentTitle').value = savedTitle;
            this.updateDocumentTitle(savedTitle);
        }
    }
}

// Initialize the editor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const editor = new CollaborativeEditor();
    
    // Load saved content
    editor.loadSavedContent();
    
    // Make editor globally accessible for debugging
    window.collaborativeEditor = editor;
    
    // Show welcome notification
    setTimeout(() => {
        editor.showNotification('Welcome to the Collaborative Rich Text Editor! Start typing to see real-time collaboration in action.', 'info');
    }, 1000);
}); 