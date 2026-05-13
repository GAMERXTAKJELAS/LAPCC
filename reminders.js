document.addEventListener('DOMContentLoaded', () => {
    const reminderList = document.getElementById('reminderList');
    const addBtn = document.getElementById('addNewReminder');

    let reminders = JSON.parse(localStorage.getItem('laptop-reminders')) || [
        { id: 1, title: "Clean Fan Dust", active: true, days: 14, time: "10:00" },
        { id: 2, title: "Update Windows", active: false, days: 7, time: "09:00" }
    ];

    let currentlyOpenId = null; 

    function renderReminders() {
        if (!reminderList) return;

        reminderList.innerHTML = reminders.map(r => {
            const isOpen = r.id === currentlyOpenId;
            
            return `
            <div class="reminder-card ${isOpen ? 'open' : ''}">
                <div class="card-header" onclick="toggleAccordion(${r.id})">
                    <div class="bell-icon" onclick="toggleBell(event, ${r.id})">
                        <svg viewBox="0 0 24 24" width="24" height="24" 
                             fill="${r.active ? 'black' : 'none'}" 
                             stroke="black" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                    </div>
                    <div class="reminder-title">${r.title}</div>
                    <div class="delete-circle" onclick="deleteReminder(event, ${r.id})"></div>
                </div>
                
                <div class="edit-drawer">
                    <div class="edit-content">
                        <div class="setting-item">
                            <label>Every (Days)</label>
                            <input type="number" class="square-box" value="${r.days || 1}" 
                                   onchange="updateData(${r.id}, 'days', this.value)"
                                   onclick="event.stopPropagation()">
                        </div>
                        <div class="setting-item">
                            <label>Time</label>
                            <input type="time" class="time-input" value="${r.time || '12:00'}" 
                                   onchange="updateData(${r.id}, 'time', this.value)"
                                   onclick="event.stopPropagation()">
                        </div>
                    </div>
                </div>
            </div>
        `}).join('');
    }

    window.toggleAccordion = (id) => {
        currentlyOpenId = (currentlyOpenId === id) ? null : id;
        renderReminders();
    };

    window.toggleBell = (event, id) => {
        event.stopPropagation();
        const r = reminders.find(item => item.id === id);
        if (r) {
            r.active = !r.active;
            saveAndRefresh();
        }
    };

    window.deleteReminder = (event, id) => {
        event.stopPropagation();
        reminders = reminders.filter(r => r.id !== id);
        if (currentlyOpenId === id) currentlyOpenId = null;
        saveAndRefresh();
    };

    window.updateData = (id, key, val) => {
        const r = reminders.find(item => item.id === id);
        if (r) {
            r[key] = val;
            localStorage.setItem('laptop-reminders', JSON.stringify(reminders));
        }
    };

    function saveAndRefresh() {
        localStorage.setItem('laptop-reminders', JSON.stringify(reminders));
        renderReminders();
    }

    if (addBtn) {
        addBtn.onclick = () => {
            const title = prompt("Enter Maintenance Task:");
            if (title && title.trim()) {
                const newId = Date.now();
                reminders.push({ id: newId, title: title.trim(), active: false, days: 1, time: "12:00" });
                currentlyOpenId = newId; 
                saveAndRefresh();
            }
        };
    }

    renderReminders();
});