/* ==========================================================================
   Grayson Mobile Recovery - Interactions & Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFAQ();
    initScrollReveal();
    initFormTabs();
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
 * 3.5. Form Tab Switching in post-rehab.html
 */
function initFormTabs() {
    const tabProvider = document.getElementById('tab-provider');
    const tabPatient = document.getElementById('tab-patient');
    const panelProvider = document.getElementById('form-provider-panel');
    const panelPatient = document.getElementById('form-patient-panel');

    if (tabProvider && tabPatient && panelProvider && panelPatient) {
        tabProvider.addEventListener('click', () => {
            tabProvider.classList.add('active');
            tabProvider.setAttribute('aria-selected', 'true');
            tabPatient.classList.remove('active');
            tabPatient.setAttribute('aria-selected', 'false');
            
            panelProvider.style.display = 'block';
            panelPatient.style.display = 'none';
        });

        tabPatient.addEventListener('click', () => {
            tabPatient.classList.add('active');
            tabPatient.setAttribute('aria-selected', 'true');
            tabProvider.classList.remove('active');
            tabProvider.setAttribute('aria-selected', 'false');
            
            panelPatient.style.display = 'block';
            panelProvider.style.display = 'none';
        });
    }
}

/**
 * 4. General Form Handling with Web3Forms & Success Overlays
 */
function initFormHandler() {
    const forms = document.querySelectorAll('form');
    const successOverlay = document.getElementById('success-overlay');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple HTML5 validation check
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const submitBtn = form.querySelector('.btn-submit');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            const formData = new FormData(form);
            const action = form.getAttribute('action') || 'https://api.web3forms.com/submit';

            // Post form data via fetch
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(async (response) => {
                if (response.ok) {
                    // Update overlay text if necessary
                    const nameInput = form.querySelector('[id$="name"]'); // matches client-name, provider-name, name
                    let displayName = '';
                    if (nameInput) {
                        displayName = nameInput.value.split(' ')[0];
                    }
                    
                    const successTitle = successOverlay.querySelector('h3');
                    if (successTitle && displayName) {
                        successTitle.textContent = `Thank you, ${displayName}!`;
                    } else if (successTitle) {
                        successTitle.textContent = `Submission Successful!`;
                    }

                    // Reset form fields
                    form.reset();

                    // Show success overlay modal
                    if (successOverlay) {
                        successOverlay.classList.add('show');
                    }
                } else {
                    const data = await response.json();
                    alert(data.message || 'There was an error submitting the form. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                alert('Connection error. Please check your network and try again.');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            });
        });
    });

    // Close success overlay listener
    const resetSuccessBtn = document.getElementById('reset-success');
    if (resetSuccessBtn && successOverlay) {
        resetSuccessBtn.addEventListener('click', () => {
            successOverlay.classList.remove('show');
        });
    }
}
