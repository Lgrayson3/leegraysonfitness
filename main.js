/* ==========================================================================
   Grayson Mobile Recovery - Interactions & Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFAQ();
    initScrollReveal();
    initFormHandler();
});

/**
 * 1. Mobile Menu and Sticky Navbar Scroll Behavior
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Menu
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            
            // Toggle hamburger icon rotation/animation if needed
            const spans = menuToggle.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}

/**
 * 2. FAQ Accordion with smooth transitions
 */
function initFAQ() {
    const faqButtons = document.querySelectorAll('.faq-question-btn');

    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentItem = btn.closest('.faq-item');
            const currentAnswer = currentItem.querySelector('.faq-answer');
            const isActive = currentItem.classList.contains('active');

            // Close all other FAQ items for a clean experience
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current FAQ item
            if (isActive) {
                currentItem.classList.remove('active');
                currentAnswer.style.maxHeight = null;
                btn.setAttribute('aria-expanded', 'false');
            } else {
                currentItem.classList.add('active');
                // Calculate actual content height for smooth CSS transition
                currentAnswer.style.maxHeight = currentAnswer.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/**
 * 3. Scroll Reveal animations via IntersectionObserver
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.12, // Trigger when 12% of the element is visible
            rootMargin: '0px 0px -40px 0px' // Trigger slightly before entering screen
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, observerOptions);

        reveals.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('active'));
    }
}

/**
 * 4. Consultation Form Handling with interactive success overlay
 */
function initFormHandler() {
    const form = document.getElementById('consultation-form');
    const successOverlay = document.getElementById('success-overlay');

    if (form && successOverlay) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple client-side check
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Gather values for feedback or future API posting
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const zip = formData.get('zip');
            const services = [];
            form.querySelectorAll('input[name="services"]:checked').forEach(cb => {
                services.push(cb.value);
            });

            // Update success message header with user name
            const firstName = name.split(' ')[0];
            const successTitle = successOverlay.querySelector('h3');
            if (successTitle) {
                successTitle.textContent = `Thank you, ${firstName}!`;
            }

            // Show beautiful success overlay
            successOverlay.classList.add('show');

            // Reset form for next possible interaction
            form.reset();
        });
        
        // Allow resetting overlay by clicking outside or clicking a close button
        const resetSuccessBtn = document.getElementById('reset-success');
        if (resetSuccessBtn) {
            resetSuccessBtn.addEventListener('click', () => {
                successOverlay.classList.remove('show');
            });
        }
    }
}
