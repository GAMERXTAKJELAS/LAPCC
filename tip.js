$(document).ready(function() {
    const STORAGE_KEY = 'lapcc_tips';
    let tips = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let encodedMedia = ""; 
    let currentMode = "file";

    // 1. Handle Mode Switching
    $('.mode-tab').on('click', function() {
        $('.mode-tab').removeClass('active');
        $(this).addClass('active');
        currentMode = $(this).data('mode');
        if (currentMode === 'file') {
            $('#file-section').show(); $('#link-section').hide();
        } else {
            $('#file-section').hide(); $('#link-section').show();
        }
    });

    // 2. Handle File Reading
    $('#tip-file').on('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            encodedMedia = event.target.result;
            const preview = file.type.startsWith('image/') ? 
                `<img src="${encodedMedia}" class="p-img">` : 
                `<video src="${encodedMedia}" class="p-img" muted></video>`;
            $('#file-preview-container').html(preview);
        };
        reader.readAsDataURL(file);
    });

    // 3. Save Logic
    $('#save-tip').on('click', function() {
        const title = $('#tip-title').val().trim();
        const caption = $('#tip-caption').val().trim();
        if (!title || !caption) return alert("Fill in Title and Caption");

        let finalMedia = "";
        let finalType = "";

        if (currentMode === 'file') {
            if (!encodedMedia) return alert("Select a file");
            finalMedia = encodedMedia;
            finalType = document.getElementById('tip-file').files[0].type.startsWith('video') ? 'video' : 'image';
        } else {
            finalMedia = $('#tip-url').val().trim();
            if (!finalMedia) return alert("Paste a link");
            finalType = 'link';
        }

        const newTip = { id: Date.now(), title, caption, media: finalMedia, type: finalType, active: true };
        tips.push(newTip);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tips));
            renderTips();
            closeModal();
        } catch(e) { alert("Storage full! Use smaller images."); }
    });

    // 4. Render Admin Management Cards
    function renderTips() {
        const $container = $('#tips-container');
        $container.empty();

        tips.forEach((tip, index) => {
            // Logic for the small thumbnail in the list
            let previewHtml = "";
            if(tip.type === 'video') previewHtml = `<video src="${tip.media}" muted></video>`;
            else if(tip.type === 'link') previewHtml = `<img src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100">`;
            else previewHtml = `<img src="${tip.media}">`;

            const icon = tip.type === 'video' ? '🎥' : (tip.type === 'image' ? '🖼️' : '🔗');
            
            $container.append(`
                <div class="tip-manage-box">
                    <div class="tip-media-preview">${previewHtml}</div>
                    <div class="tip-content-info">
                        <h4>${icon} ${tip.title}</h4>
                        <p>${tip.caption}</p>
                    </div>
                    <div class="tip-controls">
                        <label class="switch">
                            <input type="checkbox" ${tip.active ? 'checked' : ''} onchange="toggleTip(${index})">
                            <span class="slider"></span>
                        </label>
                        <button class="del-btn" onclick="deleteTip(${index})">🗑</button>
                    </div>
                </div>
            `);
        });
    }

    function closeModal() {
        $('#upload-modal').hide();
        $('#tip-title, #tip-caption, #tip-url, #tip-file').val('');
        $('#file-preview-container').empty();
        encodedMedia = "";
    }

    $('#open-upload-modal').click(() => $('#upload-modal').css('display', 'flex'));
    $('#close-modal').click(closeModal);

    window.deleteTip = (i) => { if(confirm("Delete this tip?")) { tips.splice(i,1); localStorage.setItem(STORAGE_KEY, JSON.stringify(tips)); renderTips(); } };
    window.toggleTip = (i) => { tips[i].active = !tips[i].active; localStorage.setItem(STORAGE_KEY, JSON.stringify(tips)); renderTips(); };

    renderTips();
});