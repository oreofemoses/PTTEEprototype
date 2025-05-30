document.addEventListener('DOMContentLoaded', () => {
    const showcaseGrid = document.querySelector('.showcase-grid');
    const imageCount = 125;
    const transparentGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const modalOverlay = document.getElementById('modalOverlay');
    const modalImg = document.getElementById('modalImg');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const requestForm = document.getElementById('requestForm');

    // New elements for help modal
    const helpIcon = document.querySelector('.help-icon');
    const helpModalOverlay = document.querySelector('.help-modal-overlay');
    const helpModalCloseBtn = helpModalOverlay.querySelector('.modal-close');

    // New elements for scrolling interaction
    const heroSection = document.querySelector('.hero-section');
    const navCtaButton = document.querySelector('.nav-cta-button');
    const funDetails = document.querySelector('.fun-details');
    const heroCtaButton = document.querySelector('.hero-cta-button'); // Get the hero button

    // Custom Design Form Modal Elements
    const customDesignModal = document.getElementById('customDesignModal');
    const customDesignModalClose = document.getElementById('customDesignModalClose');
    const customDesignForm = document.getElementById('customDesignForm');

    function randomDeg() {
        return (Math.random() * 10 - 5).toFixed(2) + 'deg';
    }

    function createDesignCard(imageNumber) {
        const card = document.createElement('div');
        card.className = 'design-card';
        card.style.setProperty('--card-rotate', randomDeg());

        const img = document.createElement('img');
        // Use thumbnail for lazy loading
        img.setAttribute('data-src', `thumb/${imageNumber}.jpg`);
        img.alt = `T-Shirt Design ${imageNumber}`;
        img.loading = 'lazy';
        img.src = transparentGif;

        card.appendChild(img);
        
        // Store full image path on the card
        card.setAttribute('data-full-src', `prototype/${imageNumber}.jpg`);

        card.addEventListener('click', () => {
            // Open modal with large image
            const largeImgSrc = card.getAttribute('data-full-src');
            modalImg.src = largeImgSrc;
            modalOverlay.classList.add('active');
            
            // Set the value of the hidden design input
            const designInput = document.getElementById('designInput');
            designInput.value = card.getAttribute('data-full-src');
        });
        return card;
    }

    // Add all cards (from 1 up to imageCount)
    for (let i = 1; i <= imageCount; i++) {
        const card = createDesignCard(i);
        showcaseGrid.appendChild(card);
    }

    // Scroll-in animation using Intersection Observer
    const observer = new window.IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const allCards = document.querySelectorAll('.design-card');
    allCards.forEach(card => {
        observer.observe(card);
    });

    // Focus/blur effect on hover
    allCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            allCards.forEach(c => {
                if (c === card) {
                    c.classList.add('focused');
                } else {
                    c.classList.add('blurred');
                }
            });
            showcaseGrid.classList.add('blur-bg-active');
        });
        card.addEventListener('mouseleave', () => {
            allCards.forEach(c => {
                c.classList.remove('focused', 'blurred');
            });
            showcaseGrid.classList.remove('blur-bg-active');
        });
    });

    // Intersection Observer for lazy loading images (thumbnails)
    const lazyImgObserver = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.src === transparentGif) {
                     const dataSrc = img.getAttribute('data-src');
                     if (dataSrc) {
                         img.src = dataSrc;
                     }
                }
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    // Observe only images within design cards
    document.querySelectorAll('.design-card img').forEach(img => {
        lazyImgObserver.observe(img);
    });

    // Modal close logic
    function closeModal() {
        modalOverlay.classList.remove('active');
        modalImg.src = ''; // Clear modal image src on close
    }
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (modalOverlay.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
            closeModal();
        }
    });

    // Handle form submission for requestForm
    requestForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const form = e.target;
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json' // Important for Formspree AJAX
                }
            });

            if (response.ok) {
                alert('Your request has been submitted successfully!');
                closeModal(); // Close the request modal
                form.reset(); // Reset form fields
            } else {
                const data = await response.json();
                if (data.errors) {
                    alert('Submission failed: ' + data.errors.map(error => error.message).join(', '));
                } else {
                    alert('There was an issue with your submission. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error submitting request form:', error);
            alert('Network error. Please check your connection and try again.');
        }
    });

    // New Help Modal logic
    function openHelpModal() {
        helpModalOverlay.classList.add('active');
    }

    function closeHelpModal() {
        helpModalOverlay.classList.remove('active');
    }

    helpIcon.addEventListener('click', openHelpModal);

    helpModalCloseBtn.addEventListener('click', closeHelpModal);

    helpModalOverlay.addEventListener('click', (e) => {
        if (e.target === helpModalOverlay) closeHelpModal();
    });

    document.addEventListener('keydown', (e) => {
        if (helpModalOverlay.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
            closeHelpModal();
        }
    });

    // Scrolling interaction logic
    window.addEventListener('scroll', () => {
        if (heroSection && navCtaButton && heroCtaButton) {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            // Show navbar button and hide hero button when hero is scrolled mostly out of view
            if (heroBottom <= 100) { // Adjusted threshold
                navCtaButton.classList.add('visible');
                heroCtaButton.style.visibility = 'hidden'; // Hide hero button
                heroCtaButton.style.opacity = '0'; // Fade out hero button
            } else {
                navCtaButton.classList.remove('visible');
                heroCtaButton.style.visibility = 'visible'; // Show hero button
                heroCtaButton.style.opacity = '1'; // Fade in hero button
            }
        }
    });

    // Intersection Observer to reveal fun details when visible
    if (funDetails) {
        const funDetailsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    funDetails.classList.add('visible');
                    funDetailsObserver.unobserve(funDetails); // Stop observing once visible
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        funDetailsObserver.observe(funDetails);
    }

    // Function to open custom design modal
    function openCustomDesignModal() {
        customDesignModal.classList.add('active');
    }

    // Function to close custom design modal
    function closeCustomDesignModal() {
        customDesignModal.classList.remove('active');
    }

    // Add click event listeners to both CTA buttons
    navCtaButton.addEventListener('click', openCustomDesignModal);
    heroCtaButton.addEventListener('click', openCustomDesignModal);

    // Close modal when clicking the close button
    customDesignModalClose.addEventListener('click', closeCustomDesignModal);

    // Close modal when clicking outside
    customDesignModal.addEventListener('click', (e) => {
        if (e.target === customDesignModal) closeCustomDesignModal();
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (customDesignModal.classList.contains('active') && (e.key === 'Escape' || e.key === 'Esc')) {
            closeCustomDesignModal();
        }
    });

    // Handle form submission
    customDesignForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const form = e.target;
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json' // Important for Formspree AJAX
                }
            });

            if (response.ok) {
                alert('Your custom design request has been submitted successfully!');
                closeCustomDesignModal();
                form.reset(); // Reset form fields
            } else {
                const data = await response.json();
                if (data.errors) {
                    alert('Submission failed: ' + data.errors.map(error => error.message).join(', '));
                } else {
                    alert('There was an issue with your submission. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error submitting custom design form:', error);
            alert('Network error. Please check your connection and try again.');
        }
    });
}); 
