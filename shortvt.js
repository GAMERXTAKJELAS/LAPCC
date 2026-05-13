/* shortvt.js */
$(document).ready(function() {
    const storageKey = 'quicksolve_videos';
    let base64Video = "";
    let currentMode = 'file';

    function loadAdminDashboard() {
        const videos = JSON.parse(localStorage.getItem(storageKey)) || [];
        const container = $('#video-list-admin');
        container.empty();

        videos.forEach((vid, index) => {
            container.append(`
                <div class="video-item-card">
                    <div class="vid-title-admin">${vid.caption}</div>
                    <div class="stats-row">
                        <div class="stat-item"><span>Likes</span><strong>${vid.likes || 0}</strong></div>
                        <div class="stat-item"><span>Shares</span><strong>${vid.shares || 0}</strong></div>
                    </div>
                    <button class="delete-btn-small" onclick="deleteVideo(${index})">DELETE</button>
                </div>
            `);
        });
    }

    // Modal Interaction (Instant Show/Hide)
    $('#open-upload-modal').click(() => $('#upload-modal').css('display', 'flex'));
    $('.close-modal').click(() => $('#upload-modal').hide());

    $('.mode-tab').click(function() {
        $('.mode-tab').removeClass('active');
        $(this).addClass('active');
        currentMode = $(this).data('mode');
        $('.mode-content').hide();
        $(`#${currentMode}-section`).show();
    });

    $('#vid-file').on('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => { base64Video = event.target.result; };
        reader.readAsDataURL(file);
    });

    $('#btn-save-video').click(function() {
        const caption = $('#vid-caption').val().trim();
        let finalUrl = (currentMode === 'file') ? base64Video : $('#vid-url').val().trim();

        if (!caption || !finalUrl) return alert("Missing data");

        const videos = JSON.parse(localStorage.getItem(storageKey)) || [];
        videos.push({
            url: finalUrl,
            caption: caption,
            likes: 0,
            shares: 0
        });

        localStorage.setItem(storageKey, JSON.stringify(videos));
        location.reload(); // Refresh is the most reliable way to sync data
    });

    window.deleteVideo = function(index) {
        if (confirm("Remove video?")) {
            let videos = JSON.parse(localStorage.getItem(storageKey)) || [];
            videos.splice(index, 1);
            localStorage.setItem(storageKey, JSON.stringify(videos));
            loadAdminDashboard();
        }
    };

    loadAdminDashboard();
});