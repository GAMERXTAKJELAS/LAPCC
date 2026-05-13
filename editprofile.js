$(document).ready(function() {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // User-specific keys
    const NAME_KEY = `${currentUser}_name`;
    const DOB_KEY = `${currentUser}_dob`;
    const GENDER_KEY = `${currentUser}_gender`;
    const AVATAR_KEY = `${currentUser}_avatar`;

    function init() {
        $('#input-name').val(localStorage.getItem(NAME_KEY) || "");
        $('#input-dob').val(localStorage.getItem(DOB_KEY) || "");
        $('#input-gender').val(localStorage.getItem(GENDER_KEY) || "Male");
        
        const savedAvatar = localStorage.getItem(AVATAR_KEY);
        if(savedAvatar) {
            $('#edit-preview').attr('src', savedAvatar);
        } else {
            $('#edit-preview').attr('src', `https://i.pravatar.cc/150?u=${currentUser}`);
        }
    }

    $('#trigger-upload').on('click', () => $('#profile-upload').click());

    $('#profile-upload').on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                $('#edit-preview').attr('src', e.target.result);
                localStorage.setItem(AVATAR_KEY, e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $('#save-profile').on('click', function() {
        const newName = $('#input-name').val().trim();
        if(newName === "") return alert("Name is required");

        localStorage.setItem(NAME_KEY, newName);
        localStorage.setItem(DOB_KEY, $('#input-dob').val());
        localStorage.setItem(GENDER_KEY, $('#input-gender').val());

        alert("Profile Updated!");
        window.location.href = "profile.html";
    });
    
    init();
});