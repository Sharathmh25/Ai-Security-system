document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginControlForm');
    const localLog = document.getElementById('loginValidationLog');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            const user = document.getElementById('username').value.trim();
            const pass = document.getElementById('password').value;

            if (!user || !pass) {
                e.preventDefault();
                if (localLog) {
                    localLog.textContent = "Identity Authorization Refused: Fields empty.";
                    localLog.style.display = 'block';
                }
            }
        });
    }
});