// Custom JavaScript for Pixel Alchemy

document.addEventListener("DOMContentLoaded", function () {
    console.log("Pixel Alchemy loaded");

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    if (lightbox) {
        // Event delegation for all images (dynamic and static)
        document.querySelector('.gallery').addEventListener('click', function (e) {
            const container = e.target.closest('.image-container');
            if (container) {
                const img = container.querySelector('img');
                // Get caption from overlay text
                const overlayText = container.querySelector('.text');
                const caption = overlayText ? overlayText.innerText : '';

                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                lightboxCaption.innerText = caption;
            }
        });

        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                lightbox.style.display = 'none';
            });
        }

        // Close on click outside
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === "Escape" && lightbox.style.display === "block") {
                lightbox.style.display = "none";
            }
        });
    }

    // Column Slider Logic
    const columnSliderDesktop = document.getElementById('columnSliderDesktop');
    const columnSliderMobile = document.getElementById('columnSliderMobile');
    const columnValueDesktop = document.getElementById('columnValueDesktop');
    const columnValueMobile = document.getElementById('columnValueMobile');
    const gallery = document.querySelector('.gallery');

    function updateSliderFill(slider) {
        const val = slider.value;
        const min = slider.min ? slider.min : 1;
        const max = slider.max ? slider.max : 5;
        const percentage = ((val - min) / (max - min)) * 100;
        slider.style.backgroundSize = `${percentage}% 100%`;
    }

    function updateColumns(val) {
        if (gallery) {
            gallery.style.setProperty('--column-count', val);
        }

        // Sync desktop
        if (columnSliderDesktop) {
            columnSliderDesktop.value = val;
            if (columnValueDesktop) columnValueDesktop.textContent = val;
            updateSliderFill(columnSliderDesktop);
        }

        // Sync mobile
        if (columnSliderMobile) {
            columnSliderMobile.value = val;
            if (columnValueMobile) columnValueMobile.textContent = val;
            updateSliderFill(columnSliderMobile);
        }
    }

    // Initialize Sliders
    if (columnSliderDesktop) updateSliderFill(columnSliderDesktop);
    if (columnSliderMobile) updateSliderFill(columnSliderMobile);

    if (columnSliderDesktop) {
        columnSliderDesktop.addEventListener('input', function () {
            updateColumns(this.value);
        });
    }

    if (columnSliderMobile) {
        columnSliderMobile.addEventListener('input', function () {
            updateColumns(this.value);
        });
    }

    // Dynamic Gallery Loading
    const JSON_URL = 'https://gist.githubusercontent.com/luffytaroOnePiece/084d6afb96a512e7bcee9bb99db06db2/raw/srikar.json';

    // State for filters
    let currentOrientation = 'all';
    let currentLocation = 'all';
    let currentYear = 'all';

    fetch(JSON_URL)
        .then(response => response.json())
        .then(data => {
            console.log('JSON Data fetched:', data);
            const allImages = [];
            const locations = new Set();
            const years = new Set();

            // Flatten the JSON structure
            // Sort years descending to maintain order (newest first)
            const sortedYearsKeys = Object.keys(data).sort((a, b) => b - a);

            for (const year of sortedYearsKeys) {
                years.add(year);
                // Get locations in the order they appear in the JSON (for string keys)
                const locationKeys = Object.keys(data[year]);

                for (const location of locationKeys) {
                    if (Array.isArray(data[year][location])) {
                        locations.add(location);
                        data[year][location].forEach(imgData => {
                            allImages.push({
                                ...imgData,
                                location: location,
                                year: year
                            });
                        });
                    }
                }
            }

            console.log(`Found ${allImages.length} images to load.`);

            // Populate Location Dropdowns
            const locationMenuDesktop = document.getElementById('locationMenuDesktop');
            const locationMenuMobile = document.getElementById('locationMenuMobile');

            // 'All Locations' is already in the HTML, so we don't need to add it again.

            locations.forEach(loc => {
                const li = document.createElement('li');
                li.innerHTML = `<a class="dropdown-item" href="#" data-location="${loc}">${loc}</a>`;

                if (locationMenuDesktop) locationMenuDesktop.appendChild(li.cloneNode(true));
                if (locationMenuMobile) locationMenuMobile.appendChild(li);
            });

            // Populate Year Dropdowns
            const yearMenuDesktop = document.getElementById('yearMenuDesktop');
            const yearMenuMobile = document.getElementById('yearMenuMobile');

            // Sort years descending (newest first)
            const sortedYears = Array.from(years).sort((a, b) => b - a);

            sortedYears.forEach(yr => {
                const li = document.createElement('li');
                li.innerHTML = `<a class="dropdown-item" href="#" data-year="${yr}">${yr}</a>`;

                if (yearMenuDesktop) yearMenuDesktop.appendChild(li.cloneNode(true));
                if (yearMenuMobile) yearMenuMobile.appendChild(li);
            });

            // Add click listeners to new dropdown items
            setupFilterListeners();

            // Set Random Hero Background
            if (allImages.length > 0) {
                const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
                const heroSection = document.querySelector('.hero-section');
                if (heroSection) {
                    // Create a new image object to preload the background
                    const bgImg = new Image();
                    bgImg.src = randomImage.imageLink;
                    bgImg.onload = function () {
                        heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${randomImage.imageLink}')`;
                        heroSection.style.backgroundSize = 'cover';
                        heroSection.style.backgroundPosition = 'center';
                        heroSection.style.backgroundRepeat = 'no-repeat';
                    };
                }
            }

            // Load images
            allImages.forEach(imgData => {
                const img = new Image();
                img.src = imgData.imageLink;

                img.onload = function () {
                    console.log('Image loaded:', imgData.imageLink);
                    const isVertical = this.naturalHeight > this.naturalWidth;
                    const orientation = isVertical ? 'vertical' : 'horizontal';

                    const container = document.createElement('div');
                    container.className = 'image-container fade-out'; // Start hidden
                    container.setAttribute('data-orientation', orientation);
                    container.setAttribute('data-location', imgData.location);
                    container.setAttribute('data-year', imgData.year);

                    container.innerHTML = `
                        <img src="${imgData.imageLink}" alt="${imgData.location} - ${imgData.season}" loading="lazy">
                        <div class="overlay">
                            <div class="text">
                                <strong>${imgData.location}</strong><br>
                                <small>${imgData.season} • ${imgData.shotOn}</small>
                            </div>
                        </div>
                    `;

                    gallery.appendChild(container);

                    // Trigger reflow and fade in
                    void container.offsetWidth;
                    container.classList.remove('fade-out');

                    // Re-apply filters in case they were changed while loading
                    // applyFilters(); // Optional: might cause flashing if called too often
                };

                img.onerror = function () {
                    console.error('Failed to load image:', imgData.imageLink);
                    // If the container was created and appended only on load,
                    // there's no container to remove here if the image fails to load.
                    // If the intent was to remove a placeholder, that placeholder
                    // would need to be created outside this onload.
                    // As per the instruction, the container is now created inside onload.
                };
            });
        })
        .catch(error => console.error('Error loading gallery:', error));

    // Unified Filter Logic
    const filterButtons = document.querySelectorAll('[data-filter]');

    function applyFilters() {
        console.log('Applying filters:', { currentOrientation, currentLocation, currentYear });
        const images = document.querySelectorAll('.image-container');

        images.forEach(img => {
            const imgOrientation = img.getAttribute('data-orientation');
            const imgLocation = img.getAttribute('data-location');
            const imgYear = img.getAttribute('data-year');

            const matchOrientation = currentOrientation === 'all' || imgOrientation === currentOrientation;
            const matchLocation = currentLocation === 'all' || imgLocation === currentLocation;
            const matchYear = currentYear === 'all' || imgYear === currentYear;

            // console.log(`Image ${img.querySelector('img').src}:`, { matchOrientation, matchLocation, matchYear });

            if (!matchOrientation || !matchLocation || !matchYear) {
                img.classList.add('fade-out');
                setTimeout(() => {
                    img.classList.add('hidden');
                    img.classList.remove('fade-out');
                }, 400);
            } else {
                if (img.classList.contains('hidden')) {
                    img.classList.remove('hidden');
                    void img.offsetWidth;
                    img.classList.add('fade-out');
                    requestAnimationFrame(() => {
                        img.classList.remove('fade-out');
                    });
                } else {
                    img.classList.remove('fade-out');
                }
            }
        });
    }

    function setupFilterListeners() {
        // Location Listeners
        const locationItems = document.querySelectorAll('.dropdown-item[data-location]');
        const locationBtnDesktop = document.getElementById('locationDropdownDesktop');
        const locationBtnMobile = document.getElementById('locationDropdownMobile');

        locationItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const loc = this.getAttribute('data-location');
                currentLocation = loc;

                // Update UI text
                const text = loc === 'all' ? 'All Locations' : loc;
                if (locationBtnDesktop) locationBtnDesktop.querySelector('span').textContent = text;
                if (locationBtnMobile) locationBtnMobile.querySelector('span').textContent = text;

                // Update active state
                locationItems.forEach(i => i.classList.remove('active'));
                document.querySelectorAll(`.dropdown-item[data-location="${loc}"]`).forEach(i => i.classList.add('active'));

                // applyFilters(); // Removed auto-apply
            });
        });

        // Year Listeners
        const yearItems = document.querySelectorAll('.dropdown-item[data-year]');
        const yearBtnDesktop = document.getElementById('yearDropdownDesktop');
        const yearBtnMobile = document.getElementById('yearDropdownMobile');

        yearItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const yr = this.getAttribute('data-year');
                currentYear = yr;

                // Update UI text
                const text = yr === 'all' ? 'All Years' : yr;
                if (yearBtnDesktop) yearBtnDesktop.querySelector('span').textContent = text;
                if (yearBtnMobile) yearBtnMobile.querySelector('span').textContent = text;

                // Update active state
                yearItems.forEach(i => i.classList.remove('active'));
                document.querySelectorAll(`.dropdown-item[data-year="${yr}"]`).forEach(i => i.classList.add('active'));

                console.log('Year selected:', yr);
                // applyFilters(); // Removed auto-apply
            });
        });

        // Apply Button Listeners
        const applyBtnDesktop = document.getElementById('applyFiltersDesktop');
        const applyBtnMobile = document.getElementById('applyFiltersMobile');

        if (applyBtnDesktop) {
            applyBtnDesktop.addEventListener('click', function () {
                console.log('Apply button clicked (Desktop)');
                applyFilters();
            });
        }

        if (applyBtnMobile) {
            applyBtnMobile.addEventListener('click', function () {
                console.log('Apply button clicked (Mobile)');
                applyFilters();

                // Auto-close menu
                const navbarNav = document.getElementById('navbarNav');
                if (navbarNav && navbarNav.classList.contains('show')) {
                    // Check if bootstrap is defined
                    if (typeof bootstrap !== 'undefined') {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarNav) || new bootstrap.Collapse(navbarNav);
                        bsCollapse.hide();
                    } else {
                        // Fallback if bootstrap object isn't available (unlikely given index.html)
                        navbarNav.classList.remove('show');
                    }
                }
            });
        }
    }

    // Event Listeners for Orientation Filters
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Update both desktop and mobile buttons
            const filter = this.getAttribute('data-filter');
            document.querySelectorAll(`[data-filter="${filter}"]`).forEach(btn => btn.classList.add('active'));

            currentOrientation = filter;
            console.log('Orientation selected:', filter);
            applyFilters(); // Keep auto-apply for orientation buttons as they are instant toggles
        });
    });


    // Prevent Image Downloading
    document.addEventListener('contextmenu', function (e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    document.addEventListener('dragstart', function (e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // Map Initialization
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        // Default view (India)
        const map = L.map('map', {
            attributionControl: false
        }).setView([20.5937, 78.9629], 5);

        // Tile Layers
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        });

        const normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        const terrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        });

        // Add default layer
        satelliteLayer.addTo(map);

        // Map View Toggle Logic
        const viewButtons = document.querySelectorAll('[data-map-view]');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                // Update active state
                viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Switch Layer
                const view = this.getAttribute('data-map-view');
                map.removeLayer(satelliteLayer);
                map.removeLayer(normalLayer);
                map.removeLayer(terrainLayer);

                if (view === 'satellite') {
                    satelliteLayer.addTo(map);
                } else if (view === 'normal') {
                    normalLayer.addTo(map);
                } else if (view === 'terrain') {
                    terrainLayer.addTo(map);
                }
            });
        });

        // Layer Group for Markers
        const markersLayer = L.layerGroup().addTo(map);

        function loadMarkers(listType) {
            markersLayer.clearLayers();

            const listId = listType === 'detailed' ? 'detailed-locations' : 'original-locations';
            const listContainer = document.getElementById(listId);

            if (!listContainer) {
                console.error(`Location list not found: ${listId}`);
                return;
            }

            const locations = listContainer.querySelectorAll('.location-item');
            const bounds = [];

            locations.forEach(loc => {
                const text = loc.textContent.trim();
                const name = loc.getAttribute('data-name');

                // Parse format: "13.6807° N, 79.3509° E"
                const parts = text.split(',');
                if (parts.length === 2) {
                    let latStr = parts[0].trim();
                    let lngStr = parts[1].trim();

                    // Remove degree symbol and direction
                    const latVal = parseFloat(latStr.replace('°', '').replace('N', '').replace('S', '').trim());
                    const lngVal = parseFloat(lngStr.replace('°', '').replace('E', '').replace('W', '').trim());

                    // Handle South and West negative values
                    const lat = latStr.includes('S') ? -latVal : latVal;
                    const lng = lngStr.includes('W') ? -lngVal : lngVal;

                    if (!isNaN(lat) && !isNaN(lng)) {
                        const marker = L.marker([lat, lng])
                            .bindPopup(`<b>${name}</b><br>${text}`)
                            .bindTooltip(name, {
                                permanent: true,
                                direction: 'bottom',
                                className: 'map-label'
                            });
                        markersLayer.addLayer(marker);
                        bounds.push([lat, lng]);
                    }
                }
            });

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }

        // Initial Load
        loadMarkers('original');

        // Toggle Event Listeners
        const toggleButtons = document.querySelectorAll('[data-map-list]');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                toggleButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const type = this.getAttribute('data-map-list');
                loadMarkers(type);
            });
        });
    }
});

