document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.getElementById('registrationControlForm');
    const logBox = document.getElementById('clientErrorLog');

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            const name = document.getElementById('username').value.trim();
            const mail = document.getElementById('email').value.trim();
            const key = document.getElementById('password').value;

            if (!name || !mail || !key) {
                e.preventDefault();
                displayLocalError("Array mapping fault: All parameter configurations must be declared.");
                return;
            }

            if (key.length < 8) {
                e.preventDefault();
                displayLocalError("Security Exception: Passkey length fails payload entropy validation standards (Min: 8).");
                return;
            }
        });
    }

    function displayLocalError(message) {
        if (logBox) {
            logBox.textContent = message;
            logBox.style.display = 'block';
            logBox.style.animation = 'none';
            logBox.offsetHeight; // Force DOM trigger recalculation element structure
            logBox.style.animation = 'cardShake 0.2s ease 2';
        }
    }
});