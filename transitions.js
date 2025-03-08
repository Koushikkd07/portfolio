document.addEventListener('DOMContentLoaded', () => {
    // Initialize page transition
    document.body.classList.add('page-transition');

    // Handle link clicks for page transitions
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', e => {
            // Only handle internal links
            const href = link.getAttribute('href');
            if (href.startsWith('#') || href.startsWith('http')) return;

            e.preventDefault();
            const target = href;

            // Add exit animation
            document.body.classList.add('page-exit');

            // Create loading indicator
            const loader = document.createElement('div');
            loader.className = 'page-loader';
            document.body.appendChild(loader);

            // Navigate to new page after animation
            setTimeout(() => {
                window.location.href = target;
            }, 400);
        });
    });

    // Handle section visibility
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Handle mobile menu transitions
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                menuBtn.classList.remove('open');
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('open');
                navLinks.classList.remove('active');
            });
        });
    }
}); 