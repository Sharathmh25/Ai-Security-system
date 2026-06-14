document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorBlock = document.getElementById('errorBlock');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            const user = document.getElementById('username').value.trim();
            const pass = document.getElementById('password').value;
            
            if (!user || !pass) {
                e.preventDefault();
                renderLocalValidationFault("Identity fields cannot proceed empty validation configurations.");
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            const user = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('password').value;
            const confirm = document.getElementById('confirm_password').value;
            
            if (!user || !email || !pass) {
                e.preventDefault();
                renderLocalValidationFault("Core network identity mapping elements are incomplete.");
                return;
            }

            if (pass.length < 6) {
                e.preventDefault();
                renderLocalValidationFault("Passkey security standard breakdown: Minimum length is 6 tokens.");
                return;
            }

            if (confirm && pass !== confirm) {
                e.preventDefault();
                renderLocalValidationFault("Credential mismatch: Passkeys do not correspond with duplicate entries.");
                return;
            }
        });
    }

    function renderLocalValidationFault(message) {
        if (errorBlock) {
            errorBlock.textContent = message;
            errorBlock.style.display = 'block';
            errorBlock.animate([
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 120, iterations: 2 });
        }
    }
});