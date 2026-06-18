document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // MOBILE MENU DRAWER
    // ==========================================================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        menuIcon.classList.toggle('hidden', isOpen);
        closeIcon.classList.toggle('hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ==========================================================================
    // STICKY HEADER ON SCROLL
    // ==========================================================================
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page loads scrolled

    // ==========================================================================
    // TYPING ANIMATION (HERO)
    // ==========================================================================
    const typingText = document.getElementById('typing-text');
    const roles = ['Android Developer', 'Mobile Engineer', 'Kotlin Enthusiast', 'Compose Builder'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Deleting text
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up when deleting
        } else {
            // Typing text
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle states
        if (!isDeleting && charIndex === currentRole.length) {
            // Text fully typed, pause before deleting
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            // Text fully deleted, move to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    };

    if (typingText) {
        typeEffect();
    }

    // ==========================================================================
    // SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once it has revealed, we can unobserve it
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly from screen bottom
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================================================
    // ACTIVE NAVIGATION LINKS HIGHLIGHTING
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.35, // Trigger when 35% of the section is visible
        rootMargin: '-10% 0px -40% 0px' // Adjust bounds for top and bottom of screen
    });

    sections.forEach(section => {
        activeSectionObserver.observe(section);
    });

    // ==========================================================================
    // CONTACT FORM INTERACTION
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.querySelector('.btn-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Set loading state on submit button
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = `
                <span>Đang gửi...</span>
                <div class="spinner" style="
                    width: 16px; 
                    height: 16px; 
                    border: 2px solid rgba(255,255,255,0.3); 
                    border-top-color: #ffffff; 
                    border-radius: 50%; 
                    animation: spin 0.8s linear infinite;
                    margin-left: 0.5rem;
                    display: inline-block;
                "></div>
            `;

            // Inject CSS spinner animation keyframe if it doesn't exist
            if (!document.getElementById('spinner-styles')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'spinner-styles';
                styleSheet.innerText = '@keyframes spin { to { transform: rotate(360deg); } }';
                document.head.appendChild(styleSheet);
            }

            // Simulate form submission delay
            setTimeout(() => {
                // Hide Form and show success message
                contactForm.style.display = 'none';
                formSuccess.classList.remove('hidden');
                
                // Scroll to success message smoothly
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        });
    }
});
