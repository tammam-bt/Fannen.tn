document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    const registerForm = document.getElementById('register-form');

    // Build the correct API base path depending on current page level
    function getApiBase() {
        return window.location.pathname.toLowerCase().includes('/php/') ? '../api/' : 'api/';
    }

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('auth-error');
            const submitBtn = document.getElementById('btn-submit-signin');
            
            if (errorDiv) errorDiv.style.display = 'none';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Signing in...';
            }

            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            fetch(getApiBase() + 'auth_handler.php?action=login', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json().then(data => ({ status: res.status, data: data })))
            .then(result => {
                if (result.status === 200 && result.data.success) {
                    if (result.data.role === 'artisan') {
                        window.location.href = 'dashboard.php';
                    } else {
                        window.location.href = '../index.php';
                    }
                } else {
                    if (errorDiv) {
                        errorDiv.textContent = result.data.error || 'Login failed';
                        errorDiv.style.display = 'block';
                    } else {
                        alert(result.data.error || 'Login failed');
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Sign In &rarr;';
                    }
                }
            })
            .catch(err => {
                console.error(err);
                if (errorDiv) {
                    errorDiv.textContent = 'A network error occurred. Please try again.';
                    errorDiv.style.display = 'block';
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Sign In &rarr;';
                }
            });
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
            const password = document.getElementById('reg-password').value;
            const roleInput = document.querySelector('input[name="role"]:checked');
            const role = roleInput ? roleInput.value : 'user';
            
            const errorDiv = document.getElementById('auth-error');
            const submitBtn = document.getElementById('btn-submit-register');
            
            if (errorDiv) errorDiv.style.display = 'none';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Registering...';
            }

            const formData = new FormData();
            formData.append('fullname', fullname);
            formData.append('username', username);
            formData.append('age', age);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);

            fetch(getApiBase() + 'auth_handler.php?action=register', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json().then(data => ({ status: res.status, data: data })))
            .then(result => {
                if (result.status === 200 && result.data.success) {
                    if (result.data.role === 'artisan') {
                        window.location.href = 'dashboard.php';
                    } else {
                        window.location.href = '../index.php';
                    }
                } else {
                    if (errorDiv) {
                        errorDiv.textContent = result.data.error || 'Registration failed';
                        errorDiv.style.display = 'block';
                    } else {
                        alert(result.data.error || 'Registration failed');
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Register &rarr;';
                    }
                }
            })
            .catch(err => {
                console.error(err);
                if (errorDiv) {
                    errorDiv.textContent = 'A network error occurred. Please try again.';
                    errorDiv.style.display = 'block';
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Register &rarr;';
                }
            });
        });
    }
});
