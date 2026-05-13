$(document).ready(function() {
    
    // 1. Theme Sync
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    $('body').removeClass('light-theme dark-theme').addClass(savedTheme + '-theme');

    // 2. Load Data from the New Admin Key
    function loadCareTips() {
        const STORAGE_KEY = 'lapcc_tips'; // Must match your Admin JS
        const tips = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        const $container = $('#tips-list');
        const $emptyMsg = $('#empty-msg');

        // Clear existing cards
        $container.find('.care-card').remove();

        // Filter to show only active tips
        const activeTips = tips.filter(t => t.active === true);

        if (activeTips.length > 0) {
            $emptyMsg.hide();

            activeTips.forEach((tip) => {
                const cardHtml = `
                    <div class="care-card">
                        <div class="care-img">
                            ${renderMediaPreview(tip)}
                        </div>
                        <div class="care-text">
                            <h3>${tip.title}</h3>
                            <p>${tip.caption}</p>
                        </div>
                    </div>
                `;
                $container.append(cardHtml);
            });
        } else {
            $emptyMsg.show();
        }
    }

    // Helper to handle the different media types from admin
    function renderMediaPreview(tip) {
        if (tip.type === 'video') {
            return `<video src="${tip.media}" muted loop autoplay style="width:100%; height:100%; object-fit:cover;"></video>`;
        } else if (tip.type === 'link') {
            // If it's a YouTube link, we show a placeholder or embed
            if (tip.media.includes('youtube.com') || tip.media.includes('youtu.be')) {
                const videoId = tip.media.split('v=')[1] || tip.media.split('/').pop();
                return `<img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video tip">`;
            }
            return `<img src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400" alt="Web Tip">`;
        } else {
            // Default: Image
            return `<img src="${tip.media}" alt="${tip.title}">`;
        }
    }

    loadCareTips();
});