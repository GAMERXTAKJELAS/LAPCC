$(function() {
    const renderVideos = function() {
        const $feed = $('#video-feed');
        const data = localStorage.getItem('quicksolve_videos');
        const videos = data ? JSON.parse(data) : [];

        $feed.empty();

        if (videos.length === 0) {
            $feed.append('<div style="text-align:center; padding-top:50vh; color:#555;">No videos uploaded.</div>');
            return;
        }

        $.each(videos, function(i, vid) {
            // Check orientation from admin data
            const mode = vid.isVertical ? 'vertical-mode' : 'horizontal-mode';
            let mediaElement = '';

            const videoUrl = vid.url;

            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                let videoId = "";
                if (videoUrl.includes('shorts/')) {
                    videoId = videoUrl.split('shorts/')[1].split('?')[0];
                } else if (videoUrl.includes('v=')) {
                    videoId = videoUrl.split('v=')[1].split('&')[0];
                } else {
                    videoId = videoUrl.split('embed/')[1] || videoUrl.split('.be/')[1];
                }

                const cleanUrl = `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&autoplay=0`;
                mediaElement = `<iframe src="${cleanUrl}" frameborder="0" allowfullscreen></iframe>`;
            } else {
                mediaElement = `
                    <video controls class="raw-video-player" loop>
                        <source src="${videoUrl}" type="video/mp4">
                    </video>`;
            }

            const videoHTML = `
                <section class="video-snap-section" data-id="${i}">
                    <div class="video-wrapper-fixed ${mode}">
                        ${mediaElement}
                    </div>

                    <div class="interaction-bar">
                        <div class="action-item love-btn">
                            <div class="icon-circle">❤️</div>
                            <span class="like-count">${vid.likes || 0}</span>
                        </div>
                        <div class="action-item share-btn">
                            <div class="icon-circle">🔗</div>
                            <span>Share</span>
                        </div>
                    </div>
                    
                    <div class="video-overlay-info">
                        <div class="video-caption"><span class="user-handle">@Admin_LAPCC</span></div>
                        <p class="video-tip">${vid.caption}</p>
                    </div>
                </section>
            `;
            $feed.append(videoHTML);
        });
    };

    renderVideos();

    // Like Logic
    $(document).on('click', '.love-btn', function() {
        const $btn = $(this).find('.icon-circle');
        const $text = $(this).find('.like-count');
        const index = $(this).closest('.video-snap-section').data('id');
        let videos = JSON.parse(localStorage.getItem('quicksolve_videos'));
        
        if (!$btn.hasClass('liked')) {
            $btn.addClass('liked');
            videos[index].likes++;
        } else {
            $btn.removeClass('liked');
            videos[index].likes--;
        }

        $text.text(videos[index].likes);
        localStorage.setItem('quicksolve_videos', JSON.stringify(videos));
    });
});