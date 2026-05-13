$(document).ready(function() {
    // Selectors
    const $modal = $('#email-modal');
    const $emailDisplay = $('#current-email');
    const $emailInput = $('#new-email-input');
    const $avatarImg = $('#user-avatar');
    const $userGreeting = $('.user-greeting');
    const $actionGroup = $('.action-group');

    // 1. Get current user session
    const currentUser = localStorage.getItem('currentUser');

    // Redirect if not logged in
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    function loadProfileData() {
        // Load User-Specific Email
        const savedEmail = localStorage.getItem(`${currentUser}_email`);
        $emailDisplay.text(savedEmail || `${currentUser}@email.com`);

        // Load User-Specific Avatar
        const savedPic = localStorage.getItem(`${currentUser}_avatar`);
        if (savedPic) {
            $avatarImg.attr('src', savedPic);
        } else {
            $avatarImg.attr('src', `https://i.pravatar.cc/150?u=${currentUser}`);
        }

        // Load User Name
        const savedName = localStorage.getItem(`${currentUser}_name`);
        const displayName = savedName || currentUser;
        $userGreeting.text(`HELLO, ${displayName.toUpperCase()}`);

        // --- ADMIN CHECK SECTION ---
        // This looks for the key you create in the console (e.g., TAKJELAS_role)
        const userRole = localStorage.getItem(`${currentUser}_role`);

        if (userRole === 'admin') {
            if ($('#admin-link').length === 0) { 
                const adminBtnHtml = `
                    <a href="admin.html" class="full-width-link" id="admin-link">
                        <button class="outline-btn" style="border-color: #f39c12; color: #f39c12; margin-top: 10px;">
                            ⭐ ADMIN PANEL
                        </button>
                    </a>
                `;
                $actionGroup.prepend(adminBtnHtml);
                
                if (!$('.admin-tag').length) {
                    $userGreeting.append(' <span class="admin-tag" style="font-size: 0.5em; vertical-align: middle; color: #f39c12;">[ADMIN]</span>');
                }
            }
        }
    }

    loadProfileData();

    // --- EMAIL MODAL LOGIC ---
    $('#open-modal').on('click', function() {
        $modal.addClass('active');
        $emailInput.val($emailDisplay.text());
    });

    $('#save-email').on('click', function() {
        const newEmail = $emailInput.val().trim();
        if (newEmail !== "") {
            $emailDisplay.text(newEmail);
            localStorage.setItem(`${currentUser}_email`, newEmail);
            $modal.removeClass('active');
        }
    });

    $('#close-modal').on('click', () => $modal.removeClass('active'));
    $modal.on('click', function(e) { if (e.target === this) $modal.removeClass('active'); });

    // --- LOGOUT ---
    $('.logout-link').on('click', function() {
        localStorage.removeItem('currentUser');
    });
});