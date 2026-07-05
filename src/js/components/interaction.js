document.addEventListener('DOMContentLoaded', () => {
    
    function getApiBase() {
        return window.location.pathname.toLowerCase().includes('/php/') ? '../api/' : 'api/';
    }

    // Get Artwork ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const artworkId = urlParams.get('id');

    // Only run on artwork detail page
    const isDetail = document.querySelector('.artwork-detail-page');
    if (!isDetail) return;
    
    let currentArtwork = null;

    if (!artworkId) {
        document.querySelector('.artwork-detail-layout').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
                <h2>Artwork not found</h2>
                <a href="../index.php" class="btn btn-primary" style="margin-top: 1rem;">Back to Gallery</a>
            </div>
        `;
        return;
    }

    // Fetch Artwork Data from API
    fetch(getApiBase() + 'api_get_artwork.php?id=' + artworkId)
        .then(res => {
            if (!res.ok) throw new Error("Artwork not found");
            return res.json();
        })
        .then(art => {
            currentArtwork = art;
            renderArtworkDetails(art);
        })
        .catch(err => {
            console.error(err);
            document.querySelector('.artwork-detail-layout').innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
                    <h2>Artwork not found</h2>
                    <a href="../index.php" class="btn btn-primary" style="margin-top: 1rem;">Back to Gallery</a>
                </div>
            `;
        });

    function renderArtworkDetails(art) {
        // Update document title
        document.title = `${art.title} - Fannen.tn`;

        // Update image
        const img = document.querySelector('.artwork-left img');
        if (img) {
            img.src = art.image;
            img.alt = art.title;
        }

        // Update artisan info
        const artisanAvatar = document.querySelector('.artisan-avatar-lg');
        const artisanName = document.querySelector('.artisan-info .font-bold');
        if (artisanAvatar) {
            artisanAvatar.src = art.artisanImage ? art.artisanImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(art.artisanName)}&background=D8603B&color=fff&size=100`;
        }
        if (artisanName) artisanName.textContent = art.artisanName;

        // Update artwork info
        const badge = document.querySelector('.artwork-info-card .badge');
        const title = document.querySelector('.artwork-info-card h1');
        const descContainer = document.querySelector('.artwork-description');
        
        if (badge) badge.textContent = art.category.charAt(0).toUpperCase() + art.category.slice(1);
        if (title) title.textContent = art.title;
        if (descContainer) {
            // Split description into paragraphs if it has newlines, or just one p
            const paragraphs = art.description.split('\n').filter(p => p.trim() !== '');
            if (paragraphs.length > 0) {
                descContainer.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
            } else {
                descContainer.innerHTML = `<p>${escapeHtml(art.description)}</p>`;
            }
        }

        // Render kudos badges with real counts and active state from the API
        const kudosItems = document.querySelectorAll('.kudos-badge-item');
        kudosItems.forEach(item => {
            const badgeType = item.dataset.badgeType;
            if (!badgeType) return;
            const count = art.kudos && art.kudos.badges ? (art.kudos.badges[badgeType] || 0) : 0;
            const isActive = art.kudos && art.kudos.myBadges ? art.kudos.myBadges.includes(badgeType) : false;
            item.querySelector('span').textContent = count;
            setKudosBadgeState(item, isActive);
        });

        // Follow button
        const followBtn = document.getElementById('btn-follow');
        if (followBtn) {
            followBtn.dataset.artisanId = art.artisanId;
            setFollowButtonState(followBtn, art.isFollowing);
        }

        // Save button
        const saveBtn = document.getElementById('btn-save-artwork');
        if (saveBtn) {
            setSaveButtonState(saveBtn, art.isSaved);
        }
    }

    // Modal Logic
    const btnInquiry = document.getElementById('btn-inquiry-open');
    let modal = null;

    if (btnInquiry) {
        btnInquiry.addEventListener('click', () => {
            // Check session first
            fetch(getApiBase() + 'auth_handler.php?action=check')
                .then(res => res.json())
                .then(authState => {
                    if (!authState.isLoggedIn) {
                        alert("You must be logged in to send an inquiry.");
                        window.location.href = 'signin.php';
                        return;
                    }
                    if (authState.userId == currentArtwork.artisanId) {
                        alert("You cannot send an inquiry for your own artwork.");
                        return;
                    }
                    openInquiryModal();
                })
                .catch(() => {
                    alert("Please log in first.");
                    window.location.href = 'signin.php';
                });
        });
    }

    function openInquiryModal() {
        if (!modal) {
            // Create modal elements
            modal = document.createElement('div');
            modal.className = 'modal-overlay';
            
            const modalContent = `
                <div class="modal-content">
                    <button class="modal-close" id="btn-inquiry-close" aria-label="Close modal">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    
                    <div class="modal-header">
                        <div class="modal-icon">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h2 class="font-heading" style="font-size: 1.5rem; margin-bottom: 0.5rem;">Inquire about this piece</h2>
                        <p class="text-sm">Connect directly with the artisan. They usually respond within 24 hours.</p>
                    </div>

                    <form id="inquiry-form" class="modal-body">
                        <div style="background: var(--color-bg); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center;">
                            <img id="modal-art-img" src="${currentArtwork ? escapeHtml(currentArtwork.image) : ''}" alt="Artwork Thumbnail" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);">
                            <div>
                                <div class="font-bold text-sm" id="modal-art-title">${currentArtwork ? escapeHtml(currentArtwork.title) : ''}</div>
                                <div class="text-xs text-text-light" id="modal-art-artisan">by ${currentArtwork ? escapeHtml(currentArtwork.artisanName) : ''}</div>
                            </div>
                        </div>

                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label for="message" class="form-label">Your Message *</label>
                            <textarea id="message" name="message" class="form-control" rows="4" placeholder="Hello, I'm interested in this piece. Could you tell me more about..." required></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%;">Send Inquiry</button>
                    </form>
                </div>
            `;
            
            modal.innerHTML = modalContent;
            document.body.appendChild(modal);

            // Add events
            const closeBtn = modal.querySelector('#btn-inquiry-close');
            closeBtn.addEventListener('click', closeInquiryModal);
            
            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeInquiryModal();
            });

            // Form Submit (API Send)
            const form = modal.querySelector('#inquiry-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const msgContent = form.querySelector('#message').value.trim();
                if (!msgContent) return;

                // Send via API
                fetch(getApiBase() + 'api_send_message.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        receiver_id: currentArtwork.artisanId,
                        content: `[Inquiry regarding ${currentArtwork.title}]\n\n${msgContent}`
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Success state
                        const card = modal.querySelector('.modal-content');
                        card.innerHTML = `
                            <div style="text-align: center; padding: 2rem;">
                                <div class="modal-icon" style="margin: 0 auto 1.5rem; background: var(--color-sand); color: var(--color-terracotta);">
                                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h2 class="font-heading" style="font-size: 1.5rem; margin-bottom: 0.5rem;">Message Sent!</h2>
                                <p class="text-sm" style="margin-bottom: 2rem;">${escapeHtml(currentArtwork.artisanName)} will review your inquiry and get back to you soon.</p>
                                <a href="inbox.php" class="btn btn-primary">Go to Inbox</a>
                                <button class="btn btn-ghost" onclick="document.querySelector('.modal-overlay').remove(); modal=null;" style="display: block; margin: 1rem auto 0;">Continue Browsing</button>
                            </div>
                        `;
                    } else {
                        alert("Failed to send message: " + data.error);
                    }
                })
                .catch(err => {
                    console.error("Send error:", err);
                    alert("Network error.");
                });
            });
        }
        
        // Show modal with slight delay for animation
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }, 10);
    }

    function closeInquiryModal() {
        if (modal) {
            modal.classList.remove('visible');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300); // Wait for transition
        }
    }

    // Follow Button Logic
    const followBtn = document.getElementById('btn-follow');
    if (followBtn) {
        followBtn.addEventListener('click', () => toggleFollow(followBtn));
    }

    // Save Button Logic
    const saveBtn = document.getElementById('btn-save-artwork');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => toggleSave(saveBtn));
    }

    // Kudos Logic
    const kudosItems = document.querySelectorAll('.kudos-badge-item');
    kudosItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => toggleKudosBadge(item));
    });

    async function requireAuth() {
        let auth = window.fannenAuth;
        if (!auth) {
            try {
                const res = await fetch(getApiBase() + 'auth_handler.php?action=check');
                auth = await res.json();
                window.fannenAuth = auth;
            } catch {
                auth = { isLoggedIn: false };
                window.fannenAuth = auth;
            }
        }
        if (!auth.isLoggedIn) {
            alert('Please sign in to use this feature.');
            window.location.href = 'signin.php';
            return false;
        }
        return true;
    }

    async function toggleFollow(btn) {
        if (!await requireAuth()) return;
        const artisanId = btn.dataset.artisanId;
        if (!artisanId) return;
        const wasFollowing = btn.dataset.following === 'true';

        setFollowButtonState(btn, !wasFollowing);

        try {
            const res = await fetch(getApiBase() + 'api_follow.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `artisan_id=${encodeURIComponent(artisanId)}`
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setFollowButtonState(btn, wasFollowing);
                alert(data.error || 'Failed to update follow');
                return;
            }
            setFollowButtonState(btn, data.isFollowing);
        } catch (err) {
            console.error('Follow error:', err);
            setFollowButtonState(btn, wasFollowing);
            alert('Network error');
        }
    }

    function setFollowButtonState(btn, isFollowing) {
        btn.dataset.following = isFollowing ? 'true' : 'false';
        btn.textContent = isFollowing ? 'Following' : 'Follow';
        if (isFollowing) {
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        }
    }

    async function toggleSave(btn) {
        if (!await requireAuth()) return;
        if (!currentArtwork) return;
        const wasSaved = btn.dataset.saved === 'true';

        setSaveButtonState(btn, !wasSaved);

        try {
            const res = await fetch(getApiBase() + 'api_save_artwork.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `artwork_id=${encodeURIComponent(currentArtwork.id)}`
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setSaveButtonState(btn, wasSaved);
                alert(data.error || 'Failed to update save');
                return;
            }
            setSaveButtonState(btn, data.isSaved);
        } catch (err) {
            console.error('Save error:', err);
            setSaveButtonState(btn, wasSaved);
            alert('Network error');
        }
    }

    function setSaveButtonState(btn, isSaved) {
        btn.dataset.saved = isSaved ? 'true' : 'false';
        const text = btn.querySelector('#btn-save-text');
        if (text) text.textContent = isSaved ? 'Saved' : 'Save for Later';
        if (isSaved) {
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        }
    }

    async function toggleKudosBadge(item) {
        if (!await requireAuth()) return;
        const badgeType = item.dataset.badgeType;
        if (!badgeType || !currentArtwork) return;
        const countSpan = item.querySelector('span');
        const wasActive = item.classList.contains('active');
        const currentCount = parseInt(countSpan.textContent) || 0;

        setKudosBadgeState(item, !wasActive);
        countSpan.textContent = Math.max(0, currentCount + (wasActive ? -1 : 1));

        try {
            const res = await fetch(getApiBase() + 'api_kudos.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `artwork_id=${encodeURIComponent(currentArtwork.id)}&badge_type=${encodeURIComponent(badgeType)}`
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setKudosBadgeState(item, wasActive);
                countSpan.textContent = currentCount;
                alert(data.error || 'Failed to update kudos');
                return;
            }
            countSpan.textContent = data.badgeCount;
            setKudosBadgeState(item, data.isActive);
        } catch (err) {
            console.error('Kudos badge error:', err);
            setKudosBadgeState(item, wasActive);
            countSpan.textContent = currentCount;
            alert('Network error');
        }
    }

    function setKudosBadgeState(item, isActive) {
        if (isActive) {
            item.classList.add('active');
            item.style.color = '#fff';
            item.style.background = 'var(--color-terracotta)';
            item.style.borderColor = 'var(--color-terracotta)';
        } else {
            item.classList.remove('active');
            item.style.color = '';
            item.style.background = '';
            item.style.borderColor = '';
        }
    }
});
