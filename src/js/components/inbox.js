document.addEventListener('DOMContentLoaded', () => {
    // Protected Route Simulation
    const authStateStr = localStorage.getItem('fannen_auth_state');
    const authState = authStateStr ? JSON.parse(authStateStr) : { isLoggedIn: false, role: 'user' };

    if (!authState.isLoggedIn || authState.role !== 'artisan') {
        window.location.href = 'auth.html';
        return;
    }

    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-message-input');
    const chatContainer = document.getElementById('chat-messages-container');
    
    // Load sent messages from localStorage
    const sentMessages = JSON.parse(localStorage.getItem('fannen_sent_messages') || '[]');
    sentMessages.forEach(msg => {
        appendMessage(msg.content, 'sent');
    });

    if (chatForm && chatInput && chatContainer) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const messageText = chatInput.value.trim();
            if (!messageText) return;
            
            // Append message to UI
            appendMessage(messageText, 'sent');
            
            // Save to localStorage
            sentMessages.push({
                id: 'msg-' + Date.now(),
                content: messageText,
                status: 'unread',
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('fannen_sent_messages', JSON.stringify(sentMessages));
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
    }

    function appendMessage(text, type) {
        if (!chatContainer) return;
        
        const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const html = `
            <div class="message-bubble message-${type}">
                <p>${text}</p>
                <div class="text-right" style="font-size: 0.7rem; margin-top: 0.25rem; ${type === 'sent' ? 'color: rgba(255,255,255,0.8);' : 'color: var(--color-text-lighter);'}">
                    ${timeStr} ${type === 'sent' ? '&check;&check;' : ''}
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', html);
    }

    // 1. Switch between conversations
    const conversationItems = document.querySelectorAll('.conversation-item');
    conversationItems.forEach(item => {
        item.addEventListener('click', () => {
            conversationItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Mock clear and switch
            const chatHeaderTitle = document.querySelector('.chat-header h2');
            const chatHeaderAvatar = document.querySelector('.chat-header img');
            const authorName = item.querySelector('.font-bold').textContent;
            
            chatHeaderTitle.textContent = "Chat with " + authorName;
            chatHeaderAvatar.src = item.querySelector('img').src;
            
            chatContainer.innerHTML = `
                <div class="text-center" style="margin-bottom: 2rem;">
                    <span style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--color-text-lighter); letter-spacing: 0.05em; border-bottom: 1px solid var(--color-border); padding-bottom: 0.25rem;">Just now</span>
                </div>
                <div class="message-bubble message-received">
                    <p>Mock message history loaded for ${authorName}.</p>
                    <div class="text-right text-text-lighter" style="font-size: 0.7rem; margin-top: 0.25rem;">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            `;
        });
    });

    // 2 & 3. Info and More Buttons
    const infoBtn = document.querySelector('button[aria-label="Info"]');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            alert("Information:\nUser is highly interested in ceramics.\nJoined: Oct 2023");
        });
    }

    const moreBtn = document.querySelector('button[aria-label="More"]');
    if (moreBtn) {
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let popup = document.getElementById('more-popup-mock');
            if (!popup) {
                popup = document.createElement('div');
                popup.id = 'more-popup-mock';
                popup.style.cssText = `
                    position: absolute; right: 2rem; top: 5rem; background: white; border: 1px solid var(--color-border);
                    border-radius: var(--radius-sm); box-shadow: var(--shadow-sm); z-index: 100;
                    display: flex; flex-direction: column; padding: 0.5rem; gap: 0.5rem;
                `;
                popup.innerHTML = `
                    <button class="btn-ghost" style="text-align: left; padding: 0.25rem 0.5rem;">Archive Chat</button>
                    <button class="btn-ghost" style="text-align: left; padding: 0.25rem 0.5rem; color: red;">Delete Chat</button>
                `;
                document.body.appendChild(popup);
                
                document.addEventListener('click', () => popup.style.display = 'none');
            }
            popup.style.display = popup.style.display === 'none' ? 'flex' : 'none';
        });
    }

    // 5. Attachment Button
    const attachBtn = document.getElementById('btn-attach');
    if (attachBtn) {
        attachBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
                if(e.target.files.length > 0) {
                    appendMessage(`[Attachment: ${e.target.files[0].name}]`, 'sent');
                }
            };
            input.click();
        });
    }
});
