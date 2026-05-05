document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initImageFallbacks();
});

function isLevel2() {
    return window.location.pathname.toLowerCase().includes('/php/');
}

// Build the correct API base path depending on current page level
function getApiBase() {
    return isLevel2() ? '../api/' : 'api/';
}

function initNavbar() {
    // Check session via PHP API
    fetch(getApiBase() + 'auth_handler.php?action=check')
        .then(res => res.json())
        .then(authState => {
            updateNavLinks(authState);
        })
        .catch(() => {
            // If fetch fails, treat as logged out
            updateNavLinks({ isLoggedIn: false });
        });
}

function updateNavLinks(authState) {
    const nav = document.querySelector('.navbar-nav');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('a'));
    const loginLink = links.find(a => 
        a.textContent.includes('Login') || 
        a.textContent.includes('Connexion') || 
        a.textContent.includes('Profile') || 
        a.textContent.includes('Dashboard') ||
        a.href.includes('signin.php')
    );
    const joinLink = links.find(a => 
        a.textContent.includes('Join') || 
        a.textContent.includes('S\'inscrire') || 
        a.textContent.includes('Logout') ||
        a.href.includes('register.php')
    );

    if (authState.isLoggedIn) {
        if (loginLink) {
            loginLink.textContent = authState.role === 'artisan' ? 'Dashboard' : 'Profile';
            loginLink.href = isLevel2() ? 'dashboard.php' : 'php/dashboard.php';
        }
        
        if (joinLink) {
            joinLink.textContent = 'Logout';
            joinLink.classList.remove('btn-primary');
            joinLink.classList.add('btn-outline');
            joinLink.href = '#';
            
            joinLink.onclick = (e) => {
                e.preventDefault();
                fetch(getApiBase() + 'auth_handler.php?action=logout')
                    .then(() => {
                        window.location.href = isLevel2() ? '../index.php' : 'index.php';
                    });
            };
        }
    } else {
        if (loginLink && (loginLink.textContent === 'Profile' || loginLink.textContent === 'Dashboard')) {
            loginLink.textContent = 'Login';
            loginLink.href = isLevel2() ? 'signin.php' : 'php/signin.php';
        }
        if (joinLink && joinLink.textContent === 'Logout') {
            joinLink.textContent = 'Join Fannen';
            joinLink.classList.add('btn-primary');
            joinLink.classList.remove('btn-outline');
            joinLink.href = isLevel2() ? 'register.php' : 'php/register.php';
            joinLink.onclick = null;
        }
    }
}

function initImageFallbacks() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = isLevel2() ? '../../Resources/img/placeholder.jpg' : '../Resources/img/placeholder.jpg';
            this.onerror = null;
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
