$(document).ready(function() {
    const $userList = $('#user-list');

    // Load the user table automatically on page load
    loadUsers();

    function loadUsers() {
        $userList.empty();
        
        // Pulling directly from the 'all-users' array
        const rawData = localStorage.getItem('all-users');
        const allUsers = rawData ? JSON.parse(rawData) : [];

        if (allUsers.length === 0) {
            $userList.append('<tr><td colspan="4" style="text-align:center; padding: 20px;">No accounts found.</td></tr>');
            return;
        }

        allUsers.forEach(user => {
            const username = user.username;
            const email = user.email || "No Email Provided";
            const fullName = user.name || "N/A";
            const dob = user.dob || "Not Provided";
            const gender = user.gender || "Not Provided";
            
            // Checking individual role keys
            const role = localStorage.getItem(`${username}_role`) || user.role || 'user';
            const isSelf = username === localStorage.getItem('currentUser');

            const row = `
                <tr>
                    <td>
                        <div class="user-info-wrapper">
                            <strong style="color: var(--clr-accent); border-bottom: 1px dashed #777;">${username}</strong>
                            <div class="user-tooltip">
                                <span class="tooltip-line"><span class="tooltip-label">Full Name:</span> ${fullName}</span>
                                <span class="tooltip-line"><span class="tooltip-label">DOB:</span> ${dob}</span>
                                <span class="tooltip-line"><span class="tooltip-label">Gender:</span> ${gender}</span>
                            </div>
                        </div>
                    </td>
                    <td>${email}</td>
                    <td><span style="color: ${role === 'admin' ? '#f39c12' : '#888'}; font-weight:bold;">${role.toUpperCase()}</span></td>
                    <td>
                        ${isSelf ? 
                            '<small style="opacity:0.5">Current Admin</small>' : 
                            `<button class="delete-btn" onclick="deleteFromLapcc('${username}')">Delete</button>`}
                    </td>
                </tr>
            `;
            $userList.append(row);
        });
    }
});

// Delete function remains the same to manage your 'all-users' array
window.deleteFromLapcc = function(username) {
    if (confirm(`Are you sure you want to permanently delete user: ${username}?`)) {
        let rawData = localStorage.getItem('all-users');
        let allUsers = JSON.parse(rawData);

        allUsers = allUsers.filter(u => u.username !== username);
        localStorage.setItem('all-users', JSON.stringify(allUsers));

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(username + "_")) {
                localStorage.removeItem(key);
            }
        });

        alert(`User ${username} removed.`);
        location.reload();
    }
};