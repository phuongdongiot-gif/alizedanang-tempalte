document.addEventListener('DOMContentLoaded', () => {
    // Elegant language transition
    const langLinks = document.querySelectorAll('.lang-switcher-link');
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Create a subtle overlay or just fade out the body
            document.body.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
            document.body.style.opacity = '0';
            document.body.style.transform = 'scale(0.99)';
            
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    });

    // Fade in effect on initial load for language transition smoothness
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.99)';
    document.body.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'scale(1)';
    }, 50);
});
