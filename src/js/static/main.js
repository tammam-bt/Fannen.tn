document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initImageFallbacks();
});

function isLevel2() {
    return window.location.pathname.toLowerCase().includes('/html/');
}

// Escapes HTML special characters before inserting untrusted text into the DOM
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function initNavbar() {
    const authStateStr = localStorage.getItem('fannen_auth_state');
    const authState = authStateStr ? JSON.parse(authStateStr) : { isLoggedIn: false };

    const nav = document.querySelector('.navbar-nav');
    if (!nav) return;

    // Find links by href or text to be more robust
    const links = Array.from(nav.querySelectorAll('a'));
    const loginLink = links.find(a => 
        a.textContent.includes('Login') || 
        a.textContent.includes('Connexion') || 
        a.textContent.includes('Profile') || 
        a.textContent.includes('Dashboard') ||
        a.href.includes('signin.html')
    );
    const joinLink = links.find(a => 
        a.textContent.includes('Join') || 
        a.textContent.includes('S\'inscrire') || 
        a.textContent.includes('Logout') ||
        a.href.includes('register.html')
    );

    if (authState.isLoggedIn) {
        if (loginLink) {
            loginLink.textContent = authState.role === 'artisan' ? 'Dashboard' : 'Profile';
            loginLink.href = isLevel2() ? 'dashboard.html' : 'html/dashboard.html';
        }
        
        if (joinLink) {
            joinLink.textContent = 'Logout';
            joinLink.classList.remove('btn-primary');
            joinLink.classList.add('btn-outline');
            joinLink.href = '#';
            
            // Remove existing listener if any and add new one
            joinLink.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('fannen_auth_state');
                window.location.href = isLevel2() ? '../index.html' : 'index.html';
            };
        }
    } else {
        // Ensure links are correct for logged out state if they were previously modified
        if (loginLink && (loginLink.textContent === 'Profile' || loginLink.textContent === 'Dashboard')) {
            loginLink.textContent = 'Login';
            loginLink.href = isLevel2() ? 'signin.html' : 'html/signin.html';
        }
        if (joinLink && joinLink.textContent === 'Logout') {
            joinLink.textContent = 'Join Fannen';
            joinLink.classList.add('btn-primary');
            joinLink.classList.remove('btn-outline');
            joinLink.href = isLevel2() ? 'register.html' : 'html/register.html';
            joinLink.onclick = null;
        }
    }
}

function initImageFallbacks() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = isLevel2() ? '../../Resources/img/placeholder.svg' : '../Resources/img/placeholder.svg';
            this.onerror = null; // Prevent infinite loops
        });
    });
}

// Notifications Popup Mock
const notifBtns = document.querySelectorAll('button[aria-label="Notifications"]');
    
notifBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        let popup = document.getElementById('notifications-popup-mock');
        
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'notifications-popup-mock';
            popup.style.cssText = `
                position: absolute; top: 4rem; right: 2rem; width: 300px; background: white; 
                border: 1px solid var(--color-border); border-radius: var(--radius-md); 
                box-shadow: var(--shadow-md); z-index: 1000; display: flex; flex-direction: column;
            `;
            
            popup.innerHTML = `
                <div style="padding: 1rem; border-bottom: 1px solid var(--color-border); font-weight: bold; color: var(--color-terracotta);">Notifications</div>
                <div style="padding: 1rem; border-bottom: 1px solid var(--color-border); font-size: 0.875rem;">
                    <div style="margin-bottom: 0.25rem;"><strong>Ahmed</strong> sent you an inquiry.</div>
                    <div style="color: var(--color-text-lighter); font-size: 0.75rem;">2 hours ago</div>
                </div>
                <div style="padding: 1rem; border-bottom: 1px solid var(--color-border); font-size: 0.875rem;">
                    <div style="margin-bottom: 0.25rem;">Your artwork <strong>Cerulean Oasis Vase</strong> received a new kudos.</div>
                    <div style="color: var(--color-text-lighter); font-size: 0.75rem;">Yesterday</div>
                </div>
                <div style="padding: 0.5rem; text-align: center;">
                    <a href="#" style="font-size: 0.75rem; color: var(--color-terracotta); text-decoration: underline;">View all</a>
                </div>
            `;
            
            // Need to append it to something relative, or just absolute on body
            document.body.appendChild(popup);
            
            document.addEventListener('click', () => {
                if (popup.style.display === 'flex') {
                    popup.style.display = 'none';
                }
            });
            
            popup.addEventListener('click', (ev) => ev.stopPropagation());
        }
        
        popup.style.display = popup.style.display === 'none' ? 'flex' : 'none';
    });
});
