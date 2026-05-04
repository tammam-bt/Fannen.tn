document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    const registerForm = document.getElementById('register-form');

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const roleInput = document.querySelector('input[name="role"]:checked');
            let role = 'user';
            if (roleInput) {
                role = roleInput.value;
            } else {
                const email = document.getElementById('email').value;
                if (email.includes('artisan')) role = 'artisan';
            }
            
            const authState = {
                isLoggedIn: true,
                role: role,
                userId: 'user-' + Math.floor(Math.random() * 1000)
            };
            
            localStorage.setItem('fannen_auth_state', JSON.stringify(authState));
            
            if (role === 'artisan') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = '../index.html';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const username = document.getElementById('username').value;
            const age = document.getElementById('age').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('reg-email').value;
            const roleInput = document.querySelector('input[name="role"]:checked');
            const role = roleInput ? roleInput.value : 'user';
            
            const userData = {
                fullname,
                username,
                age,
                phone,
                email,
                role
            };
            
            localStorage.setItem('fannen_user_profile', JSON.stringify(userData));
            
            const authState = {
                isLoggedIn: true,
                role: role,
                userId: 'user-' + Math.floor(Math.random() * 1000)
            };
            
            localStorage.setItem('fannen_auth_state', JSON.stringify(authState));
            
            if (role === 'artisan') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = '../index.html';
            }
        });
    }
});
