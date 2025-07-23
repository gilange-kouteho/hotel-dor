// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    

    // Reservation form functionality
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        const roomTypeSelect = document.getElementById('roomType');
        const adultsSelect = document.getElementById('adults');
        const childrenSelect = document.getElementById('children');
        const servicesCheckboxes = document.querySelectorAll('input[name="services"]');

        // Set minimum dates
        const today = new Date().toISOString().split('T')[0];
        if (checkinInput) checkinInput.min = today;

        // Update checkout minimum date when checkin changes
        if (checkinInput && checkoutInput) {
            checkinInput.addEventListener('change', function() {
                const checkinDate = new Date(this.value);
                checkinDate.setDate(checkinDate.getDate() + 1);
                checkoutInput.min = checkinDate.toISOString().split('T')[0];
                updateSummary();
            });
        }

        // Update summary when any field changes
        [checkinInput, checkoutInput, roomTypeSelect, adultsSelect, childrenSelect].forEach(element => {
            if (element) {
                element.addEventListener('change', updateSummary);
            }
        });

        servicesCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSummary);
        });

        function updateSummary() {
            const checkin = checkinInput?.value;
            const checkout = checkoutInput?.value;
            const roomType = roomTypeSelect?.value;
            const adults = adultsSelect?.value || '2';
            const children = childrenSelect?.value || '0';

            // Update dates
            const summaryDates = document.getElementById('summaryDates');
            if (summaryDates) {
                if (checkin && checkout) {
                    const checkinDate = new Date(checkin);
                    const checkoutDate = new Date(checkout);
                    summaryDates.textContent = `${checkinDate.toLocaleDateString('fr-FR')} - ${checkoutDate.toLocaleDateString('fr-FR')}`;
                    
                    // Calculate nights
                    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
                    const summaryNights = document.getElementById('summaryNights');
                    if (summaryNights) {
                        summaryNights.textContent = `${nights} nuit${nights > 1 ? 's' : ''}`;
                    }

                    // Calculate total
                    let roomPrice = 0;
                    if (roomType === 'standard') roomPrice = 80000;
                    else if (roomType === 'deluxe') roomPrice = 130000;
                    else if (roomType === 'suite') roomPrice = 230000;

                    const subtotal = roomPrice * nights;
                    const summarySubtotal = document.getElementById('summarySubtotal');
                    if (summarySubtotal) {
                        summarySubtotal.textContent = `${subtotal} FCFA`;
                    }

                    // Calculate services
                    let servicesTotal = 0;
                    servicesCheckboxes.forEach(checkbox => {
                        if (checkbox.checked) {
                            switch(checkbox.value) {
                                case 'breakfast':
                                    servicesTotal += 10000 * parseInt(adults) * nights;
                                    break;
                                case 'parking':
                                    servicesTotal += 13000 * nights;
                                    break;
                                case 'spa':
                                    servicesTotal += 20000 * parseInt(adults);
                                    break;
                                case 'airport':
                                    servicesTotal += 33000 * 2; // round trip
                                    break;
                            }
                        }
                    });

                    const summaryServices = document.getElementById('summaryServices');
                    if (summaryServices) {
                        summaryServices.textContent = `${servicesTotal} FCFA`;
                    }

                    const summaryTotal = document.getElementById('summaryTotal');
                    if (summaryTotal) {
                        summaryTotal.textContent = `${subtotal + servicesTotal} FCFA`;
                    }
                } else {
                    summaryDates.textContent = 'Non sélectionnées';
                }
            }

            // Update room type
            const summaryRoom = document.getElementById('summaryRoom');
            if (summaryRoom) {
                const roomTypes = {
                    'standard': 'Chambre Standard',
                    'deluxe': 'Chambre Deluxe',
                    'suite': 'Suite Prestige'
                };
                summaryRoom.textContent = roomTypes[roomType] || 'Non sélectionnée';
            }

            // Update guests
            const summaryGuests = document.getElementById('summaryGuests');
            if (summaryGuests) {
                let guestsText = `${adults} adulte${adults > 1 ? 's' : ''}`;
                if (children > 0) {
                    guestsText += `, ${children} enfant${children > 1 ? 's' : ''}`;
                }
                summaryGuests.textContent = guestsText;
            }
        }

        // Form submission
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = reservationForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '#D4AF37';
                }
            });

            if (!isValid) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            // Simulate form submission
            alert('Merci pour votre réservation ! Nous vous confirmerons par email dans les plus brefs délais.');
            reservationForm.reset();
            updateSummary();
        });
    }

    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '#D4AF37';
                }
            });

            if (!isValid) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            // Simulate form submission
            alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
            contactForm.reset();
        });
    }

    // Gallery filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;
    let visibleImages = [];

    if (lightbox) {
        // Open lightbox when clicking on gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Get all visible images
                visibleImages = Array.from(galleryItems).filter(img => 
                    img.style.display !== 'none' && img.style.opacity !== '0'
                );
                
                currentImageIndex = visibleImages.indexOf(this);
                showImage(currentImageIndex);
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Navigation
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function() {
                currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
                showImage(currentImageIndex);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', function() {
                currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
                showImage(currentImageIndex);
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
                    showImage(currentImageIndex);
                } else if (e.key === 'ArrowRight') {
                    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
                    showImage(currentImageIndex);
                }
            }
        });

        function showImage(index) {
            const item = visibleImages[index];
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');
            
            if (lightboxImage) {
                lightboxImage.src = img.src.replace('w=800', 'w=1200');
            }
            
            if (overlay && lightboxTitle && lightboxDescription) {
                const title = overlay.querySelector('h4');
                const description = overlay.querySelector('p');
                
                lightboxTitle.textContent = title ? title.textContent : '';
                lightboxDescription.textContent = description ? description.textContent : '';
            }
        }

        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .room-card, .service-card, .value-card, .team-member, .award-item').forEach(el => {
        observer.observe(el);
    });

    // Initialize summary on page load
    if (document.getElementById('summaryDates')) {
        updateSummary();
    }

    // Form validation styling
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else if (this.value.trim()) {
                this.style.borderColor = '#D4AF37';
            }
        });

        field.addEventListener('focus', function() {
            this.style.borderColor = '#D4AF37';
        });
    });

    // Email validation
    document.querySelectorAll('input[type="email"]').forEach(emailField => {
        emailField.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#dc3545';
            } else if (this.value) {
                this.style.borderColor = '#D4AF37';
            }
        });
    });

    // Phone validation
    document.querySelectorAll('input[type="tel"]').forEach(phoneField => {
        phoneField.addEventListener('blur', function() {
            const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
            if (this.value && !phoneRegex.test(this.value)) {
                this.style.borderColor = '#dc3545';
            } else if (this.value) {
                this.style.borderColor = '#D4AF37';
            }
        });
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

// Initialize tooltips (if needed)
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Cookie consent (if needed)
function initCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        const cookieBanner = document.createElement('div');
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <div class="cookie-content">
                <p>Ce site utilise des cookies pour améliorer votre expérience.</p>
                <button class="btn btn-primary btn-small" onclick="acceptCookies()">Accepter</button>
            </div>
        `;
        document.body.appendChild(cookieBanner);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    const cookieBanner = document.querySelector('.cookie-banner');
    if (cookieBanner) {
        cookieBanner.remove();
    }
}

// Performance monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// Service worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to register service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}