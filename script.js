document.addEventListener('DOMContentLoaded', () => {
    const showcaseGrid = document.querySelector('.showcase-grid');
<<<<<<< HEAD
    const imageCount = 125;
=======
    const imageCount = 20;
>>>>>>> 198c7f09ca58671cfab1094ea8963482d2b92e24
    const transparentGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    const modalOverlay = document.getElementById('modalOverlay');
    const modalImg = document.getElementById('modalImg');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const requestForm = document.getElementById('requestForm');

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
}); 
