$(document).ready(function() {
    const dbName = 'lapcc_computer_data';
    let compressedImage = ""; // Store the shrunk version here

    // 1. IMAGE COMPRESSOR FUNCTION
    function compressImage(file, callback) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Limit width to 800px
                const scaleSize = MAX_WIDTH / img.width;
                
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Export as low-quality JPEG to save massive space
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7); 
                callback(dataUrl);
            };
        };
    }

    // 2. Handle Image Selection
    $('#up-file').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            compressImage(file, function(lowResBase64) {
                compressedImage = lowResBase64;
                $('#img-preview').attr('src', compressedImage).show();
                $('.file-label span').text('Image Optimized!');
            });
        }
    });

    // 3. Load Hardware
    function loadHardware() {
        const items = JSON.parse(localStorage.getItem(dbName)) || [];
        const container = $('#tech-grid');
        container.empty();

        if (items.length === 0) {
            container.append('<p style="text-align:center; opacity:0.4; margin-top:40px;">No hardware listed yet.</p>');
            return;
        }

        items.forEach((item, index) => {
            const html = `
                <div class="tech-card">
                    <img src="${item.img}" class="comp-img-preview">
                    <div class="card-info">
                        <h3>${item.title}</h3>
                        <p>${item.short}</p>
                    </div>
                    <div class="delete-box" onclick="removeItem(${index})">
                        <i class="fa-solid fa-trash-can"></i>
                    </div>
                </div>
            `;
            container.append(html);
        });
    }

    // 4. Save to Database
    $('#tech-form').on('submit', function(e) {
        e.preventDefault();
        
        if (!compressedImage) {
            alert("Please wait for the image to finish optimizing!");
            return;
        }

        const newEntry = {
            img: compressedImage,
            title: $('#up-title').val().trim(),
            short: $('#up-short').val().trim(),
            long: $('#up-long').val().trim(),
            link: $('#up-link').val().trim(),
            id: Date.now()
        };

        try {
            const currentData = JSON.parse(localStorage.getItem(dbName)) || [];
            currentData.unshift(newEntry);
            localStorage.setItem(dbName, JSON.stringify(currentData));

            this.reset();
            compressedImage = ""; 
            $('#img-preview').hide();
            $('#upload-modal').hide();
            loadHardware();
        } catch (err) {
            alert("Database Full! Try deleting old items or using a smaller photo.");
        }
    });

    // 5. Modal & Delete
    $('#open-modal').on('click', () => $('#upload-modal').css('display', 'flex'));
    $('.close-modal').on('click', () => $('#upload-modal').hide());

    window.removeItem = function(index) {
        if(confirm("Delete this hardware entry?")) {
            let currentData = JSON.parse(localStorage.getItem(dbName)) || [];
            currentData.splice(index, 1);
            localStorage.setItem(dbName, JSON.stringify(currentData));
            loadHardware();
        }
    };

    loadHardware();
});