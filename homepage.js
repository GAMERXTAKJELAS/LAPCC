$(document).ready(function() {
    const HARDWARE_KEY = 'lapcc_computer_data';
    const TIPS_KEY = 'lapcc_tips';

    // 1. Theme Sync
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    $('body').removeClass('light-theme dark-theme').addClass(savedTheme + '-theme');

    // 2. Load Hardware News
    function loadHardware() {
        const items = JSON.parse(localStorage.getItem(HARDWARE_KEY)) || [];
        const $grid = $('#news-container');
        $grid.empty();

        if (items.length === 0) {
            $grid.append('<p style="text-align:center; grid-column: 1/-1; opacity:0.5;">No news updates yet.</p>');
            return;
        }

        items.forEach(item => {
            const card = $(`
                <div class="card-sliding">
                    <div class="image-part"><img src="${item.img}"></div>
                    <div class="text-part">
                        <h3>${item.title}</h3>
                        <p>${item.short}</p>
                    </div>
                </div>
            `);
            card.click(() => openModal(item));
            $grid.append(card);
        });
    }

    // 3. Sync Random Tip (Text Only)
    function syncHomeTip() {
        const tips = JSON.parse(localStorage.getItem(TIPS_KEY)) || [];
        const activeTips = tips.filter(t => t.active === true);
        
        if (activeTips.length > 0) {
            const tip = activeTips[Math.floor(Math.random() * activeTips.length)];
            $('#tip-title-home').text(tip.title);
            $('#daily-tip-text').text(tip.caption);
        } else {
            $('#tip-title-home').text("Pro Tip");
            $('#daily-tip-text').text("Keep your laptop on a flat surface to ensure proper cooling airflow.");
        }
    }

    // 4. Modal Logic
    function openModal(item) {
        $('#pop-name').text(item.title);
        $('#pop-full-desc').text(item.long);
        $('#pop-img-main').attr('src', item.img);
        $('#pop-link').attr('href', item.link || '#');
        $('#laptop-modal').fadeIn(200).css('display', 'flex');
    }

    // 5. Search Logic
    $('#home-search').on('input', function() {
        const q = $(this).val().toLowerCase();
        $('.card-sliding').each(function() {
            $(this).toggle($(this).text().toLowerCase().includes(q));
        });
    });

    // 6. Image Magnify logic
    $(document).on('mousemove', '.zoom-wrapper', function(e) {
        const img = $(this).find('img');
        const dim = this.getBoundingClientRect();
        const x = ((e.clientX - dim.left) / dim.width) * 100;
        const y = ((e.clientY - dim.top) / dim.height) * 100;
        img.css('transform-origin', `${x}% ${y}%`);
        img.css('transform', 'scale(2.5)');
    }).on('mouseleave', '.zoom-wrapper', function() {
        $(this).find('img').css('transform', 'scale(1)');
    });

    loadHardware();
    syncHomeTip();
});