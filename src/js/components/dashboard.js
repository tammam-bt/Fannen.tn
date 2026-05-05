document.addEventListener('DOMContentLoaded', () => {
    function getApiBase() {
        return window.location.pathname.toLowerCase().includes('/php/') ? '../api/' : 'api/';
    }

    // Protected Route Simulation via PHP API
    fetch(getApiBase() + 'auth_handler.php?action=check')
        .then(res => res.json())
        .then(authState => {
            if (!authState.isLoggedIn) {
                window.location.href = 'signin.php';
                return;
            }
            initDashboard(authState);
        })
        .catch(() => {
            window.location.href = 'signin.php';
        });

    function initDashboard(authState) {
        // Role-based Section Toggling
        const artisanSections = document.querySelectorAll('.role-artisan-only');
        const enthusiastSections = document.querySelectorAll('.role-enthusiast-only');

        if (authState.role === 'artisan') {
            enthusiastSections.forEach(el => el.classList.add('hidden-role'));
            artisanSections.forEach(el => el.classList.remove('hidden-role'));
        } else {
            // Enthusiast (user) view
            artisanSections.forEach(el => el.classList.add('hidden-role'));
            enthusiastSections.forEach(el => el.classList.remove('hidden-role'));

            // Update titles for Enthusiast
            const studioTitle = document.querySelector('.dashboard-header h1');
            const studioSubtitle = document.querySelector('.dashboard-header p');
            if (studioTitle) studioTitle.textContent = 'My Profile';
            if (studioSubtitle) studioSubtitle.textContent = 'Manage your account and view your activities.';
            
            // Rename sidebar link text from "Dashboard" to "Profile"
            const navDashboardText = document.getElementById('nav-dashboard-text');
            if (navDashboardText) navDashboardText.textContent = 'Profile';

            // Rename profile card heading
            const profileCardHeading = document.querySelector('.profile-card h2');
            if (profileCardHeading) profileCardHeading.textContent = 'Profile Details';
        }

        // Profile Management Logic
        const profileDisplay = document.getElementById('profile-display');
        const profileEditForm = document.getElementById('profile-edit-form');
        const btnEditProfile = document.getElementById('btn-edit-profile');
        
        let userData = {};

        function fetchAndRenderProfile() {
            fetch(getApiBase() + 'api_get_profile.php')
                .then(res => res.json())
                .then(data => {
                    userData = data;
                    renderProfileDisplay();
                })
                .catch(err => console.error("Error fetching profile:", err));
        }

        function renderProfileDisplay() {
            if (!profileDisplay) return;
            profileDisplay.innerHTML = `
                <div>
                    <p class="text-sm font-bold text-text-light" style="text-transform: uppercase;">Full Name</p>
                    <p style="font-weight: 500;">${userData.fullname || '--'}</p>
                </div>
                <div>
                    <p class="text-sm font-bold text-text-light" style="text-transform: uppercase;">Username</p>
                    <p style="font-weight: 500;">@${userData.username || '--'}</p>
                </div>
                <div>
                    <p class="text-sm font-bold text-text-light" style="text-transform: uppercase;">Age</p>
                    <p style="font-weight: 500;">${userData.age || '--'}</p>
                </div>
                <div>
                    <p class="text-sm font-bold text-text-light" style="text-transform: uppercase;">Phone</p>
                    <p style="font-weight: 500;">${userData.phone || '--'}</p>
                </div>
                <div>
                    <p class="text-sm font-bold text-text-light" style="text-transform: uppercase;">Email</p>
                    <p style="font-weight: 500;">${userData.email || '--'}</p>
                </div>
                <div>
                    <p class="text-sm font-bold text-text-light" style="text-transform: uppercase;">Role</p>
                    <p style="font-weight: 500; text-transform: capitalize;">${userData.role === 'user' ? 'enthusiast' : userData.role}</p>
                </div>
            `;
        }

        if (profileDisplay && profileEditForm && btnEditProfile) {
            fetchAndRenderProfile();

            let isEditMode = false;

            btnEditProfile.addEventListener('click', () => {
                if (!isEditMode) {
                    // Switch to edit mode
                    isEditMode = true;
                    btnEditProfile.textContent = 'Save Changes';
                    btnEditProfile.classList.remove('btn-outline');
                    btnEditProfile.classList.add('btn-primary');
                    btnEditProfile.style.backgroundColor = 'var(--color-terracotta)';
                    btnEditProfile.style.color = '#fff';

                    // Populate form
                    document.getElementById('edit-fullname').value = userData.fullname || '';
                    document.getElementById('edit-username').value = userData.username || '';
                    document.getElementById('edit-age').value = userData.age || '';
                    document.getElementById('edit-phone').value = userData.phone || '';
                    document.getElementById('edit-email').value = userData.email || '';

                    profileDisplay.style.display = 'none';
                    profileEditForm.style.display = 'block';
                } else {
                    // Save changes via API
                    const fullname = document.getElementById('edit-fullname').value;
                    const username = document.getElementById('edit-username').value;
                    const age = document.getElementById('edit-age').value;
                    const phone = document.getElementById('edit-phone').value;
                    const email = document.getElementById('edit-email').value;

                    const formData = new FormData();
                    formData.append('fullname', fullname);
                    formData.append('username', username);
                    formData.append('age', age);
                    formData.append('phone', phone);
                    formData.append('email', email);

                    fetch(getApiBase() + 'api_update_profile.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            userData.fullname = fullname;
                            userData.username = username;
                            userData.age = age;
                            userData.phone = phone;
                            userData.email = email;
                            
                            isEditMode = false;
                            btnEditProfile.textContent = 'Edit Profile';
                            btnEditProfile.classList.remove('btn-primary');
                            btnEditProfile.classList.add('btn-outline');
                            btnEditProfile.style.backgroundColor = 'transparent';
                            btnEditProfile.style.color = 'var(--color-charcoal)';

                            renderProfileDisplay();

                            profileEditForm.style.display = 'none';
                            profileDisplay.style.display = 'grid';
                        } else {
                            alert(data.error || 'Failed to update profile');
                        }
                    })
                    .catch(err => {
                        console.error('Error updating profile:', err);
                        alert('Network error. Please try again.');
                    });
                }
            });
        }

        // Drag and Drop Upload logic via PHP
        const uploadZone = document.getElementById('upload-zone');
        if (uploadZone && authState.role === 'artisan') {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadZone.addEventListener(eventName, preventDefaults, false);
            });

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            ['dragenter', 'dragover'].forEach(eventName => {
                uploadZone.addEventListener(eventName, highlight, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                uploadZone.addEventListener(eventName, unhighlight, false);
            });

            function highlight(e) {
                uploadZone.classList.add('highlight');
                uploadZone.style.borderColor = 'var(--color-terracotta)';
                uploadZone.style.background = 'rgba(216, 96, 59, 0.05)';
            }

            function unhighlight(e) {
                uploadZone.classList.remove('highlight');
                uploadZone.style.borderColor = 'var(--color-border)';
                uploadZone.style.background = 'transparent';
            }

            uploadZone.addEventListener('drop', handleDrop, false);

            function handleDrop(e) {
                let dt = e.dataTransfer;
                let files = dt.files;
                handleFiles(files);
            }

            function handleFiles(files) {
                if (files.length > 0) {
                    const file = files[0];
                    uploadArtwork(file);
                }
            }
            
            // Button fallback
            const selectBtn = document.getElementById('btn-select-files');
            if (selectBtn) {
                selectBtn.addEventListener('click', () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = e => {
                        handleFiles(e.target.files);
                    };
                    input.click();
                });
            }

            function uploadArtwork(file) {
                const title = prompt("Enter Artwork Title:");
                if (!title) return;
                
                const category = prompt("Enter Category (ceramics, textiles, jewelry, woodwork):", "ceramics");
                const description = prompt("Enter Description:");

                const formData = new FormData();
                formData.append('image', file);
                formData.append('title', title);
                formData.append('category', category || 'other');
                formData.append('description', description || '');

                uploadZone.style.opacity = '0.5';

                fetch(getApiBase() + 'api_upload_artwork.php', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    uploadZone.style.opacity = '1';
                    if (data.success) {
                        alert("Artwork uploaded successfully!");
                        loadPortfolio(); // Refresh table
                    } else {
                        alert("Upload failed: " + data.error);
                    }
                })
                .catch(err => {
                    uploadZone.style.opacity = '1';
                    console.error("Upload error:", err);
                    alert("Network error during upload.");
                });
            }
        }

        // Fetch and populate portfolio table
        const tableBody = document.getElementById('portfolio-table-body');
        
        function loadPortfolio() {
            if (!tableBody) return;
            fetch(getApiBase() + 'api_get_artworks.php?mine=1')
                .then(res => res.json())
                .then(data => {
                    tableBody.innerHTML = '';
                    if (data.length === 0) {
                        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No artworks in your portfolio yet.</td></tr>';
                        return;
                    }
                    data.forEach(artwork => {
                        const statusClass = artwork.status && artwork.status.toLowerCase() === 'published' ? 'published' : '';
                        const tr = document.createElement('tr');
                        tr.dataset.id = artwork.id;
                        tr.innerHTML = `
                            <td>
                                <div class="flex items-center gap-sm">
                                    <img src="${artwork.image}" alt="${artwork.title}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;">
                                    <span class="font-bold">${artwork.title}</span>
                                </div>
                            </td>
                            <td style="text-transform: capitalize;">${artwork.category}</td>
                            <td><span class="status-badge ${statusClass}">${artwork.status || 'Published'}</span></td>
                            <td><span class="text-text-light">${artwork.views || '0'}</span></td>
                            <td><span class="text-text-light">${artwork.dateAdded || 'Recently'}</span></td>
                            <td>
                                <div class="flex gap-sm text-text-light">
                                    <button class="btn-ghost btn-delete" aria-label="Delete" style="border:none; padding:4px; color: var(--color-charcoal);">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        `;
                        tableBody.appendChild(tr);
                    });
                })
                .catch(err => console.error('Error loading portfolio:', err));
        }

        if (authState.role === 'artisan') {
            loadPortfolio();
        }

        // Portfolio Table Interactions (Delete)
        const portfolioTable = document.getElementById('portfolio-table');
        if (portfolioTable) {
            portfolioTable.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-delete');
                if (!btn) return;
                
                const tr = btn.closest('tr');
                if (!tr) return;
                
                const artworkId = tr.dataset.id;
                const artworkTitle = tr.querySelector('.font-bold').textContent;
                
                e.preventDefault();
                const confirmDelete = confirm(`Are you sure you want to delete "${artworkTitle}"?`);
                if (confirmDelete) {
                    const formData = new FormData();
                    formData.append('artwork_id', artworkId);

                    fetch(getApiBase() + 'api_delete_artwork.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            tr.style.transition = "opacity 0.3s ease";
                            tr.style.opacity = '0';
                            setTimeout(() => {
                                tr.remove();
                                if(tableBody.children.length === 0) {
                                    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No artworks in your portfolio yet.</td></tr>';
                                }
                            }, 300);
                        } else {
                            alert("Failed to delete: " + data.error);
                        }
                    })
                    .catch(err => {
                        console.error('Delete error:', err);
                        alert("Network error.");
                    });
                }
            });
        }
    }
});
