document.addEventListener('DOMContentLoaded', () => {
    function getApiBase() {
        return window.location.pathname.toLowerCase().includes('/php/') ? '../api/' : 'api/';
    }

    let currentUserId = null;
    let activeContactId = null;
    let pollingInterval = null;

    // Protected Route Simulation via PHP API
    fetch(getApiBase() + 'auth_handler.php?action=check')
        .then(res => res.json())
        .then(authState => {
            if (!authState.isLoggedIn) {
                window.location.href = 'signin.php';
                return;
            }
            currentUserId = authState.userId;
            initInbox();
        })
        .catch(() => {
            window.location.href = 'signin.php';
        });

    function initInbox() {
        const conversationListContainer = document.getElementById('conversation-list-container');
        const searchInput = document.getElementById('search-conversations-input');
        const chatMessagesContainer = document.getElementById('chat-messages-container');
        const chatInputForm = document.getElementById('chat-input-form');
        const chatMessageInput = document.getElementById('chat-message-input');
        const chatHeader = document.querySelector('.chat-header');

        let contacts = [];

        // Fetch contacts
        function loadContacts() {
            fetch(getApiBase() + 'api_get_contacts.php')
                .then(res => res.json())
                .then(data => {
                    contacts = data;
                    renderContacts(contacts);
                })
                .catch(err => console.error("Error loading contacts:", err));
        }

        // Render Contact List
        function renderContacts(dataToRender) {
            if (!conversationListContainer) return;
            
            if (dataToRender.length === 0) {
                conversationListContainer.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--color-text-light);">No conversations yet.</div>';
                return;
            }

            conversationListContainer.innerHTML = dataToRender.map(conv => {
                const partnerName = escapeHtml(conv.partnerName);
                const lastMessage = escapeHtml(conv.lastMessage);
                const timestamp = escapeHtml(conv.timestamp);
                const unreadCount = escapeHtml(conv.unreadCount);
                const unreadBadge = conv.unreadCount > 0 ? `<span class="badge" style="background: var(--color-terracotta); color: white;">${unreadCount}</span>` : '';
                const activeClass = conv.contactId === activeContactId ? 'active' : '';

                return `
                    <div class="conversation-item ${activeClass}" data-id="${escapeHtml(conv.contactId)}">
                        <div style="position: relative;">
                            <img src="${conv.avatar}" alt="${partnerName}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover;">
                            ${conv.unreadCount > 0 ? '<div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; background: var(--color-terracotta); border-radius: 50%; border: 2px solid white;"></div>' : ''}
                        </div>
                        <div class="conversation-details">
                            <div class="flex justify-between items-center" style="margin-bottom: 0.25rem;">
                                <span class="conversation-name">${partnerName}</span>
                                <span class="conversation-time">${timestamp}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="conversation-preview">${lastMessage}</span>
                                ${unreadBadge}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        loadContacts();

        // Handle Search
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = contacts.filter(c => 
                    c.partnerName.toLowerCase().includes(query) || 
                    c.lastMessage.toLowerCase().includes(query)
                );
                renderContacts(filtered);
            });
        }

        // Handle Conversation Selection
        if (conversationListContainer) {
            conversationListContainer.addEventListener('click', (e) => {
                const item = e.target.closest('.conversation-item');
                if (!item) return;

                activeContactId = parseInt(item.dataset.id);
                
                // Update active state in UI
                document.querySelectorAll('.conversation-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');

                // Update Header
                const contact = contacts.find(c => c.contactId === activeContactId);
                if (contact && chatHeader) {
                    const img = chatHeader.querySelector('img');
                    const subtitle = chatHeader.querySelector('.text-terracotta');
                    const title = chatHeader.querySelector('h2');
                    
                    if (img) img.src = contact.avatar;
                    if (subtitle) subtitle.textContent = 'Active Conversation';
                    if (title) title.textContent = contact.partnerName;
                    
                    // Mark as read in local state instantly
                    contact.unreadCount = 0;
                    renderContacts(contacts); // Re-render to clear badge
                }

                loadMessages();
                
                // Start polling for this conversation
                if (pollingInterval) clearInterval(pollingInterval);
                pollingInterval = setInterval(loadMessages, 3000);
            });
        }

        function loadMessages() {
            if (!activeContactId) return;

            fetch(getApiBase() + 'api_get_messages.php?contact_id=' + activeContactId)
                .then(res => res.json())
                .then(messages => {
                    renderMessages(messages);
                })
                .catch(err => console.error("Error loading messages:", err));
        }

        function renderMessages(messages) {
            if (!chatMessagesContainer) return;
            
            // Check if user is scrolled to bottom before rendering
            const isScrolledToBottom = chatMessagesContainer.scrollHeight - chatMessagesContainer.clientHeight <= chatMessagesContainer.scrollTop + 50;

            if (messages.length === 0) {
                chatMessagesContainer.innerHTML = '<div style="text-align: center; color: var(--color-text-light); margin-top: 2rem;">Say hello!</div>';
                return;
            }

            let html = '';
            let lastTime = '';

            messages.forEach(msg => {
                // Simplified time divider logic for demo
                if (msg.time !== lastTime) {
                    html += `
                        <div class="text-center" style="margin: 1.5rem 0;">
                            <span style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--color-text-lighter); letter-spacing: 0.05em;">Today, ${msg.time}</span>
                        </div>
                    `;
                    lastTime = msg.time;
                }

                if (msg.type === 'received') {
                    html += `
                        <div class="message-bubble message-received">
                            <p>${escapeHtml(msg.content)}</p>
                        </div>
                    `;
                } else {
                    const statusIcon = msg.status === 'read' ?
                        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #4CAF50;"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7M5 13l4 4L19 7" /></svg>' :
                        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>';

                    html += `
                        <div style="align-self: flex-end; display: flex; align-items: flex-end; gap: 0.5rem; max-width: 70%;">
                            <div class="message-bubble message-sent" style="max-width: 100%;">
                                <p>${escapeHtml(msg.content)}</p>
                            </div>
                            <span class="message-status" style="margin-bottom: 0.5rem;">${statusIcon}</span>
                        </div>
                    `;
                }
            });

            chatMessagesContainer.innerHTML = html;

            // Scroll to bottom if they were already at the bottom
            if (isScrolledToBottom || messages.length > 0) {
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            }
        }

        // Handle Sending Messages
        if (chatInputForm) {
            chatInputForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (!activeContactId) {
                    alert("Please select a conversation first.");
                    return;
                }
                
                const content = chatMessageInput.value.trim();
                if (!content) return;
                
                // Optimistic UI update
                const now = new Date();
                const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                const tempMsg = document.createElement('div');
                tempMsg.style.cssText = 'align-self: flex-end; display: flex; align-items: flex-end; gap: 0.5rem; max-width: 70%;';
                tempMsg.innerHTML = `
                    <div class="message-bubble message-sent" style="opacity: 0.7; max-width: 100%;">
                        <p>${escapeHtml(content)}</p>
                    </div>
                    <span class="message-status" style="margin-bottom: 0.5rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                `;
                chatMessagesContainer.appendChild(tempMsg);
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                
                chatMessageInput.value = '';

                // Send via API
                const formData = new FormData();
                formData.append('receiver_id', activeContactId);
                formData.append('content', content);

                fetch(getApiBase() + 'api_send_message.php', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        loadMessages(); // Refresh actual messages
                        loadContacts(); // Update last message in sidebar
                    } else {
                        alert("Failed to send message: " + data.error);
                        tempMsg.remove();
                        chatMessageInput.value = content;
                    }
                })
                .catch(err => {
                    console.error("Send error:", err);
                    alert("Network error.");
                    tempMsg.remove();
                    chatMessageInput.value = content;
                });
            });
        }
    }
});
