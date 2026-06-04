/* ==========================================================================
   Grayson Private Training - Interactions & Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupFAQ();
    setupScrollReveal();
    setupFormTabs();
    setupServiceTabs();
    setupFormHandler();
});

function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('.nav-menu');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open);
            const spans = toggle.querySelectorAll('span');
            if (open) {
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

    links.forEach(l => {
        l.addEventListener('click', () => {
            if (menu.classList.contains('open')) {
                menu.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}

function setupFAQ() {
    const faqButtons = document.querySelectorAll('.faq-question-btn');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const active = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(i => {
                if (i !== item && i.classList.contains('active')) {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            if (active) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => obs.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('active'));
    }
}

function setupFormTabs() {
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

function setupServiceTabs() {
    const tabs = document.querySelectorAll('.service-tab-btn');
    const panels = document.querySelectorAll('.service-tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('aria-controls');
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            panels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(target);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

function setupFormHandler() {
    const forms = document.querySelectorAll('form');
    const successOverlay = document.getElementById('success-overlay');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn ? submitBtn.textContent : 'Submit';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            const data = new FormData(form);
            const url = form.getAttribute('action') || 'https://api.web3forms.com/submit';

            fetch(url, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            })
            .then(async (response) => {
                if (response.ok) {
                    const nameField = form.querySelector('[id$="name"]');
                    let nameVal = '';
                    if (nameField) {
                        nameVal = nameField.value.split(' ')[0];
                    }
                    const title = successOverlay ? successOverlay.querySelector('h3') : null;
                    if (title && nameVal) {
                        title.textContent = `Thank you, ${nameVal}!`;
                    } else if (title) {
                        title.textContent = `Submission Successful!`;
                    }
                    form.reset();
                    if (successOverlay) {
                        successOverlay.classList.add('show');
                    }
                } else {
                    const errJson = await response.json();
                    alert(errJson.message || 'Error submitting form.');
                }
            })
            .catch(error => {
                alert('Connection error. Please check your network.');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        });
    });

    const resetBtn = document.getElementById('reset-success');
    if (resetBtn && successOverlay) {
        resetBtn.addEventListener('click', () => {
            successOverlay.classList.remove('show');
        });
    }
}