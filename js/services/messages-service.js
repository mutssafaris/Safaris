/* Messages Service — Muts Safaris */
(function (window) {
    'use strict';

    var API_READY = false;

    var mockConversations = [
        {
            id: 'conv-1',
            type: 'support',
            participants: [{ name: 'Muts Support', avatar: 'S', role: 'Agent' }],
            lastMessage: 'Your booking for Maasai Mara is confirmed!',
            timestamp: '2023-10-25T14:30:00Z',
            unreadCount: 1,
            messages: [
                { id: 'm1', sender: 'system', text: 'Welcome to Muts Safaris Support.', time: '2023-10-25T10:00:00Z' },
                { id: 'm2', sender: 'agent', text: 'Hello! I am Sarah. How can I help you with your upcoming trip?', time: '2023-10-25T10:05:00Z' },
                { id: 'm3', sender: 'user', text: 'Hi Sarah, I wanted to check the status of my Maasai Mara booking.', time: '2023-10-25T14:25:00Z' },
                { id: 'm4', sender: 'agent', text: 'Your booking for Maasai Mara is confirmed!', time: '2023-10-25T14:30:00Z' }
            ]
        },
        {
            id: 'conv-2',
            type: 'direct',
            participants: [{ name: 'David Kimani', avatar: 'DK', role: 'Guide' }],
            lastMessage: 'See you at the airport at 8 AM.',
            timestamp: '2023-10-24T09:15:00Z',
            unreadCount: 0,
            messages: [
                { id: 'm5', sender: 'agent', text: 'Jambo! I will be your guide for the Amboseli tour.', time: '2023-10-24T09:00:00Z' },
                { id: 'm6', sender: 'user', text: 'Great, looking forward to it. Where should we meet?', time: '2023-10-24T09:10:00Z' },
                { id: 'm7', sender: 'agent', text: 'See you at the airport at 8 AM.', time: '2023-10-24T09:15:00Z' }
            ]
        },
        {
            id: 'conv-3',
            type: 'notification',
            participants: [{ name: 'System Alert', avatar: '!', role: 'Bot' }],
            lastMessage: 'Security alert: New login detected.',
            timestamp: '2023-10-20T18:00:00Z',
            unreadCount: 0,
            messages: [
                { id: 'm8', sender: 'system', text: 'Security alert: New login detected from Nairobi, KE.', time: '2023-10-20T18:00:00Z' }
            ]
        }
    ];

    var MessagesService = {
        getConversations: function (type) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                var endpoint = '/messages';
                if (type && type !== 'all') endpoint += '?type=' + type;
                return this.fetchFromAPI(endpoint);
            }
            return new Promise(function(resolve) {
                setTimeout(function() {
                    if (!type || type === 'all') resolve(mockConversations);
                    else resolve(mockConversations.filter(function(c) { return c.type === type; }));
                }, 300);
            });
        },

        getConversation: function (id) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/messages/' + id);
            }
            return new Promise(function(resolve) {
                setTimeout(function() {
                    var conv = mockConversations.find(function(c) { return c.id === id; });
                    resolve(conv ? JSON.parse(JSON.stringify(conv)) : null);
                }, 200);
            });
        },

        sendMessage: function (conversationId, text) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/messages/' + conversationId, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text })
                });
            }
            return new Promise(function(resolve) {
                setTimeout(function() {
                    var conv = mockConversations.find(function(c) { return c.id === conversationId; });
                    if (conv) {
                        var newMessage = {
                            id: 'm' + Date.now(),
                            sender: 'user',
                            text: text,
                            time: new Date().toISOString()
                        };
                        conv.messages.push(newMessage);
                        conv.lastMessage = text;
                        conv.timestamp = newMessage.time;
                        resolve(newMessage);
                    } else {
                        resolve(null);
                    }
                }, 100);
            });
        },

        markAsRead: function (conversationId) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/messages/' + conversationId + '/read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            var conv = mockConversations.find(function(c) { return c.id === conversationId; });
            if (conv) conv.unreadCount = 0;
            return Promise.resolve(true);
        },

        fetchFromAPI: function (endpoint, options) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            var url = endpoint.indexOf('http') === 0 ? endpoint : baseURL + endpoint;
            var timeout = (window.MutsAPIConfig && window.MutsAPIConfig.getTimeout) 
                ? window.MutsAPIConfig.getTimeout() 
                : 30000;
            
            var fetchPromise = fetch(url, options).then(function (response) {
                if (!response.ok) throw new Error('API error: ' + response.status);
                return response.json();
            }).catch(function (err) {
                console.warn('[MessagesService] API unavailable, using mock data:', err.message);
                return mockConversations;
            });
            
            var timeoutPromise = new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error('Request timeout')); }, timeout);
            });
            
            return Promise.race([fetchPromise, timeoutPromise]).catch(function() {
                return mockConversations;
            });
        },

        enableAPI: function () {
            API_READY = true;
            console.log('[MessagesService] API mode enabled');
        },

        disableAPI: function () {
            API_READY = false;
            console.log('[MessagesService] API mode disabled');
        },

        isAPILive: function () {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    window.MutsMessagesService = MessagesService;
})(window);

// ES6 module export (for bundlers)
export default window.messagesService || window.messagesService;
