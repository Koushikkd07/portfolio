// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    mirror: false,
    offset: 50
});

// Time-based Greeting
function setGreeting() {
    const greetingMessage = document.querySelector('.greeting-message');
    const sideCharacter = document.querySelector('.side-character-container');
    if (!greetingMessage || !sideCharacter) return;

    const hour = new Date().getHours();
    let greeting;
    let emoji;

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning";
        emoji = "🌅";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
        emoji = "☀️";
    } else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening";
        emoji = "🌆";
    } else {
        greeting = "Good Night";
        emoji = "🌙";
    }

    greetingMessage.textContent = `${greeting} ${emoji}`;
    
    // Add animation class after a short delay
    setTimeout(() => {
        sideCharacter.classList.add('active');
        
        // Show speech bubble with typing effect
        const speechBubble = document.querySelector('.speech-bubble');
        if (speechBubble) {
            speechBubble.style.opacity = '1';
            speechBubble.style.transform = 'translateY(0)';
            
            // Hide after 5 seconds
            setTimeout(() => {
                speechBubble.style.opacity = '0';
                speechBubble.style.transform = 'translateY(20px)';
            }, 5000);
        }
    }, 1000);
}

// Call setGreeting when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setGreeting();
    
    // Create particles
    createParticles();
    
    // Start typing animation
    if (document.querySelector('.dynamic-text')) {
        setTimeout(type, 1000);
    }
    
    // Initialize stats counter
    initStatsCounter();
});

// Handle character visibility on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const sideCharacter = document.querySelector('.side-character-container');
    if (!sideCharacter) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollTop) {
        // Scrolling down
        sideCharacter.style.transition = 'left 0.3s ease-out';
        sideCharacter.classList.remove('active');
    } else {
        // Scrolling up
        sideCharacter.style.transition = 'left 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        sideCharacter.classList.add('active');
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);

// Menu Functionality
const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const closeMenu = document.querySelector('.close-menu');
const openMenuBtn = document.querySelector('.open-menu');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

function toggleMenu() {
    if (menuOverlay) {
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
    }
    if (menuBtn && navLinks) {
        menuBtn.classList.toggle('open');
        navLinks.classList.toggle('active');
    }
}

// Add event listeners for menu
if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
if (openMenuBtn) openMenuBtn.addEventListener('click', toggleMenu);
if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (
        (menuOverlay && e.target === menuOverlay) ||
        (menuBtn && navLinks && !menuBtn.contains(e.target) && !navLinks.contains(e.target))
    ) {
        if (menuOverlay && menuOverlay.classList.contains('active')) toggleMenu();
        if (navLinks && navLinks.classList.contains('active')) toggleMenu();
    }
});

// Enhanced Typing Animation
const words = ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Creative Thinker'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 150;
const erasingDelay = 80;
const newWordDelay = 2000;

function type() {
    const dynamicText = document.querySelector('.dynamic-text');
    if (!dynamicText) return;

    const current = wordIndex % words.length;
    const fullWord = words[current];

    if (isDeleting) {
        dynamicText.textContent = fullWord.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = erasingDelay;
    } else {
        dynamicText.textContent = fullWord.substring(0, charIndex + 1);
        charIndex++;
        
        // Randomize typing speed slightly for more natural effect
        typingDelay = 150 + Math.random() * 50;
    }

    if (!isDeleting && charIndex === fullWord.length) {
        // Pause at end of word
        typingDelay = newWordDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        wordIndex++;
        isDeleting = false;
        typingDelay = 500;
    }

    setTimeout(type, typingDelay);
}

// Enhanced Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    if (stats.length === 0) return;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));
                
                // Animate counter with easing
                let count = 0;
                const duration = 2000; // 2 seconds
                const frameDuration = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameDuration);
                
                const counter = setInterval(() => {
                    count++;
                    const progress = count / totalFrames;
                    // Use easeOutQuad for smoother animation
                    const currentCount = Math.ceil(progress < 1 
                        ? target * (1 - Math.pow(1 - progress, 2)) 
                        : target);
                    
                    stat.textContent = currentCount;
                    
                    if (count === totalFrames) {
                        stat.textContent = target + '+';
                        clearInterval(counter);
                    }
                }, frameDuration);
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Enhanced Particles Effect
function createParticles() {
    const particles = document.querySelector('.particles');
    if (!particles) return;
    
    // Clear existing particles
    particles.innerHTML = '';
    
    // Create initial set of particles
    for (let i = 0; i < 50; i++) {
        createParticle();
    }
    
    // Continue creating particles at intervals
    setInterval(createParticle, 200);
}

function createParticle() {
    const particles = document.querySelector('.particles');
    if (!particles) return;

    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Randomize particle properties
    const size = Math.random() * 5 + 3;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const opacity = Math.random() * 0.5 + 0.3;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;
    
    // Apply styles
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = opacity;
    particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
    
    // Add color variation
    const hue = Math.random() * 60 + 220; // Blue to purple range
    particle.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;
    
    particles.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        if (particle.parentNode === particles) {
            particle.remove();
        }
    }, (duration + delay) * 1000);
}

// Form Validation with enhanced feedback
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form fields
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        
        // Basic validation
        let isValid = true;
        
        if (!nameField.value.trim()) {
            showError(nameField, 'Please enter your name');
            isValid = false;
        } else {
            clearError(nameField);
        }
        
        if (!emailField.value.trim()) {
            showError(emailField, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(emailField.value)) {
            showError(emailField, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(emailField);
        }
        
        if (!messageField.value.trim()) {
            showError(messageField, 'Please enter your message');
            isValid = false;
        } else {
            clearError(messageField);
        }
        
        if (isValid) {
            // Show success message
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.backgroundColor = '#10b981';
                
                // Reset form
                contactForm.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
            }, 1500);
        }
    });
}

// Helper functions for form validation
function showError(field, message) {
    // Clear any existing error
    clearError(field);
    
    // Add error class to parent
    const formGroup = field.parentElement;
    formGroup.classList.add('error');
    
    // Create and append error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
    
    // Highlight field
    field.style.borderColor = '#ef4444';
}

function clearError(field) {
    const formGroup = field.parentElement;
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    field.style.borderColor = '';
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 