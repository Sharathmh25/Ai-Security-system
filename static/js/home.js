document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Surveillance Matrix Core Online. Establishing local graphics environment pipeline overlays.');
    
    // Abstract grid coordinate tracer simulation overlay
    const overlay = document.querySelector('.grid-overlay');
    if (overlay) {
        document.addEventListener('mousemove', (e) => {
            const currentX = (e.clientX / window.innerWidth) * 100;
            const currentY = (e.clientY / window.innerHeight) * 100;
            overlay.style.background = `radial-gradient(circle 280px at ${currentX}% ${currentY}%, rgba(6, 182, 212, 0.05) 0%, transparent 80%)`;
        });
    }
});