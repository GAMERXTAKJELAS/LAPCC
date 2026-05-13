const questions = [
    "Battery drains quickly", "Random shutdowns", "Laptop feels very hot",
    "Loud fan noise", "Long boot time", "Apps freezing", "Screen flickering",
    "Brightness instability", "C: Drive is full", "Slow file transfer",
    "Wi-Fi keeps dropping", "Keys not working", "Audio crackling",
    "Blue Screen errors", "Too many startup apps", "Updates are old",
    "Erratic cursor", "Loose USB ports", "Pop-up ads", "Lag without charger"
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questionsContainer');
    
    // Inject questions
    questions.forEach((q, index) => {
        const html = `
            <div class="q-card">
                <p>${index + 1}. ${q}</p>
                <div class="scale-container">
                    <span>Healthy</span>
                    <div class="radio-group">
                        ${[1,2,3,4,5].map(num => `
                            <div class="radio-item">
                                <input type="radio" name="q${index}" value="${num}" required ${num === 3 ? 'checked' : ''}>
                                ${num}
                            </div>
                        `).join('')}
                    </div>
                    <span>Critical</span>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });

    // Handle Calculation
    document.getElementById('troubleshootForm').onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let total = 0;
        for(let value of formData.values()) {
            total += parseInt(value);
        }

        showResult(total);
    };
});

function showResult(score) {
    const modal = document.getElementById('resultModal');
    const title = document.getElementById('resultTitle');
    const desc = document.getElementById('resultDesc');

    modal.style.display = 'flex';
    title.innerText = `Device Score: ${score}/100`;

    if (score <= 40) {
        desc.innerText = "Your laptop is in great shape! Keep up the maintenance.";
    } else if (score <= 70) {
        desc.innerText = "Warning: Some optimizations needed. Clear your temp files and update drivers.";
    } else {
        desc.innerText = "Critical: High risk of hardware failure. Please visit a technician or check LAPCC guides.";
    }
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}