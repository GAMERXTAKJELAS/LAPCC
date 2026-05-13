$(document).ready(function() {
    // Sync Theme on Load
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    $('body').removeClass('dark-theme light-theme').addClass(savedTheme + '-theme');

    $('#signup-form').on('submit', function(e) {
        e.preventDefault();

        // Get Input Data
        const newUser = {
            name: $('#reg-name').val(),
            username: $('#reg-username').val().trim(),
            email: $('#reg-email').val().trim(),
            dob: $('#reg-dob').val(),
            gender: $('#reg-gender').val(),
            password: $('#reg-password').val(),
            avatar: "avatar.jpg" // Default image
        };

        const confirmPass = $('#reg-confirm').val();

        // Validation
        if (newUser.password !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        // Get existing users array or create a new one
        let users = JSON.parse(localStorage.getItem('all-users')) || [];

        // Check if username already exists
        if (users.some(u => u.username === newUser.username)) {
            alert("Username already exists! Try another one.");
            return;
        }

        // Add to list and save
        users.push(newUser);
        localStorage.setItem('all-users', JSON.stringify(users));

        alert("Account created for " + newUser.name + "! Please sign in.");
        window.location.href = 'signin.html';
    });
});