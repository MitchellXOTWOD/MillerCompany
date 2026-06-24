document.addEventListener('DOMContentLoaded', () => {
    // Mobile Hamburger Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Basic Contact Form Intercept (Handy placeholder until form processing endpoint is added)
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            // If you hook this up to Formspree, a custom API, or Mailchimp, 
            // you'll remove e.preventDefault() or alter this logic.
            const serviceSelect = document.getElementById('service').value;
            if(!serviceSelect) {
                e.preventDefault();
                alert('Please select a specific service type.');
            }
        });
    }
});

// --- Streamlined Flat-Array Gallery & Lightbox Integration ---
const galleryGrid = document.getElementById('dynamicGalleryGrid');
const lightbox = document.getElementById('galleryLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let galleryImages = []; // Global array holding rendered image elements for cycling

// Safely only execute if BOTH the grid and lightbox elements exist on the current page
if (galleryGrid && lightbox) {
    
    // Robust page routing that works with local files, clean URLs, and trailing slashes
    const currentPath = window.location.pathname.toLowerCase();
    let targetJsonFile = 'gallery.json'; // Global default fallback

    if (currentPath.includes('fencing')) {
        targetJsonFile = 'fencing-gallery.json';
    } else if (currentPath.includes('treeservice')) {
        targetJsonFile = 'tree-gallery.json';
    } else if (currentPath.includes('dirtwork')) {
        targetJsonFile = 'dirt-gallery.json';
    }

    console.log("Current Path detected:", currentPath);
    console.log("Targeting JSON file:", targetJsonFile);

    fetch(targetJsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network issues fetching gallery records');
            }
            return response.json();
        })
        .then(data => {
            // Process the flat array of strings
            data.forEach((imagePath, index) => {
                const itemWrapper = document.createElement('div');
                itemWrapper.classList.add('gallery-item');
                
                const imgElement = document.createElement('img');
                imgElement.src = imagePath;
                imgElement.alt = `MillerCompany Project Photo ${index + 1}`;

                imgElement.loading = 'lazy';
                
                itemWrapper.appendChild(imgElement);
                galleryGrid.appendChild(itemWrapper);
                
                // Keep tracking references for the slider system
                galleryImages.push(imgElement);
                
                // Open lightbox on click
                itemWrapper.addEventListener('click', () => {
                    currentIndex = index;
                    updateLightbox();
                    lightbox.classList.add('active');
                });
            });
        })
        .catch(err => console.error('Error importing project photos:', err));

    // Carousel Update Mechanics
    function updateLightbox() {
        if (galleryImages[currentIndex]) {
            lightboxImg.src = galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
        }
    }

    // Slider Navigation Elements (Safely contained inside our element checker conditional block)
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (galleryImages.length > 0) {
                currentIndex = (currentIndex + 1) % galleryImages.length;
                updateLightbox();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (galleryImages.length > 0) {
                currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                updateLightbox();
            }
        });
    }

    // Close Modals
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    }
    lightbox.addEventListener('click', () => lightbox.classList.remove('active'));
}