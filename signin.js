$(document).ready(function() {
    // Theme Sync
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    $('body').removeClass('dark-theme light-theme').addClass(savedTheme + '-theme');

    $('#login-form').on('submit', function(e) {
        e.preventDefault();

        const inputUser = $('#login-username').val().trim();
        const inputPass = $('#login-password').val();

        // Get the big list of all accounts
        const users = JSON.parse(localStorage.getItem('all-users')) || [];

        // Find the specific account
        const userMatch = users.find(u => 
            (u.username === inputUser || u.email === inputUser) && u.password === inputPass
        );

        if (userMatch) {
            // Save the "Session" - this tells the Profile page WHO is logged in
            localStorage.setItem('currentUser', userMatch.username);
            
            alert("Login Successful! Welcome back.");
            window.location.href = 'profile.html';
        } else {
            alert("Invalid credentials! Check your username/password.");
        }
    });
});

// UI Buttons
function showSignIn() {
    $('#auth-selection').addClass('hidden');
    $('#signin-form-card').removeClass('hidden');
}
function showSelection() {
    $('#auth-selection').removeClass('hidden');
    $('#signin-form-card').addClass('hidden');
}