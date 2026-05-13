document.addEventListener('DOMContentLoaded', () => {
    const categories = ['ui', 'perf', 'feat', 'overall'];
    let selections = { ui: 0, perf: 0, feat: 0, overall: 0 };

    // Set up star clicks for each category
    document.querySelectorAll('.star-group').forEach(group => {
        const cat = group.dataset.category;
        const stars = group.querySelectorAll('.big-star');

        stars.forEach(star => {
            star.onclick = () => {
                const val = parseInt(star.dataset.value);
                selections[cat] = val;

                // Visual update: remove 'selected' from all in this group
                stars.forEach(s => s.classList.remove('selected'));
                // Add 'selected' to the one clicked
                star.classList.add('selected');
            };
        });
    });

    // Handle Form Submit
    document.getElementById('ratingForm').onsubmit = (e) => {
        e.preventDefault();
        
        // Check if all categories were rated
        if (Object.values(selections).includes(0)) {
            alert("Please rate all categories before submitting!");
            return;
        }

        // Save to LocalStorage
        localStorage.setItem('last_rating_submission', JSON.stringify({
            data: selections,
            date: new Date().toLocaleDateString()
        }));

        alert("Thank you! Your feedback has been sent.");
        window.location.href = "settings.html";
    };
});