document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const offlineToggle = document.getElementById('offline-toggle');
    const reminderMasterToggle = document.getElementById('all-notifications-toggle');

    // 1. Theme Logic
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(savedTheme + '-theme');

    if (themeToggle) {
        themeToggle.checked = (savedTheme === 'dark');
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.classList.replace('light-theme', 'dark-theme');
                localStorage.setItem('app-theme', 'dark');
            } else {
                body.classList.replace('dark-theme', 'light-theme');
                localStorage.setItem('app-theme', 'light');
            }
        });
    }

    // 2. Offline Mode Logic (Fixed: 2 second delay then off)
    if (offlineToggle) {
        offlineToggle.addEventListener('change', () => {
            if (offlineToggle.checked) {
                setTimeout(() => {
                    alert("Coming Soon!");
                    offlineToggle.checked = false;
                }, 2000); // 2 second wait
            }
        });
    }

    // 3. Reminder Toggle Persistence
    if (reminderMasterToggle) {
        const masterStatus = localStorage.getItem('master-notifications') !== 'false';
        reminderMasterToggle.checked = masterStatus;
        reminderMasterToggle.addEventListener('change', () => {
            localStorage.setItem('master-notifications', reminderMasterToggle.checked);
        });
    }

    // 4. Rating Section Logic (Redirects to rate.html)
    const stars = document.querySelectorAll('.star');
    if (stars.length > 0) {
        const paint = (val) => {
            stars.forEach(s => s.style.color = s.dataset.value <= val ? '#ffcc00' : '#444');
        };
        
        paint(localStorage.getItem('userRating') || 0);
        
        stars.forEach(s => {
            s.addEventListener('click', () => {
                const ratingValue = s.dataset.value;
                localStorage.setItem('userRating', ratingValue);
                paint(ratingValue);
                
                // Switch to the full rate page
                window.location.href = "rate.html";
            });
        });
    }
});