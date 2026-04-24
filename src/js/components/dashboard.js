document.addEventListener('DOMContentLoaded', () => {
    // Protected Route Simulation
    const authStateStr = localStorage.getItem('fannen_auth_state');
    const authState = authStateStr ? JSON.parse(authStateStr) : { isLoggedIn: false, role: 'user' };

    if (!authState.isLoggedIn || authState.role !== 'artisan') {
        window.location.href = 'auth.html';
        return; // Stop execution
    }

    // Drag and Drop Upload UI Mock
    const uploadZone = document.getElementById('upload-zone');
    if (uploadZone) {
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
                const fileName = files[0].name;
                alert(`Mock Upload: File "${fileName}" received. In Phase 3, this will be uploaded to the server.`);
            }
        }
        
        // Button fallback
        const selectBtn = document.getElementById('btn-select-files');
        if (selectBtn) {
            selectBtn.addEventListener('click', () => {
                // Create invisible file input to trigger dialog
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = e => {
                    handleFiles(e.target.files);
                };
                input.click();
            });
        }
    }

    // Portfolio Table Interactions (Edit/Delete)
    const portfolioTable = document.getElementById('portfolio-table');
    if (portfolioTable) {
        portfolioTable.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-ghost');
            if (!btn) return;
            
            const tr = btn.closest('tr');
            if (!tr) return;
            
            const artworkTitle = tr.querySelector('.font-bold').textContent;
            
            if (btn.getAttribute('aria-label') === 'Edit') {
                e.preventDefault();
                alert(`Mock: Opening edit form for "${artworkTitle}"`);
            } else if (btn.getAttribute('aria-label') === 'Delete') {
                e.preventDefault();
                const confirmDelete = confirm(`Are you sure you want to delete "${artworkTitle}"?`);
                if (confirmDelete) {
                    tr.style.transition = "opacity 0.3s ease";
                    tr.style.opacity = '0';
                    setTimeout(() => {
                        tr.remove();
                    }, 300);
                }
            }
        });
    }
});
