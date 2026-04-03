document.addEventListener('DOMContentLoaded', () => {
    // Views
    const homeView = document.getElementById('home-view');
    const exploreView = document.getElementById('explore-view');
    const detailsView = document.getElementById('details-view');
    const b2bView = document.getElementById('b2b-view');
    const profileView = document.getElementById('profile-view');
    const adminView = document.getElementById('admin-view');
    const partnerDashboardView = document.getElementById('partner-dashboard-view');
    const compactFooter = document.getElementById('main-footer');
    
    // Components
    const listContainer = document.getElementById('facilities-list');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('error-msg');
    const logoHome = document.getElementById('logo-home');
    
    // Auth Modal
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('open-login-btn');
    const closeLoginBtn = document.getElementById('close-login-btn');
    const partnerModal = document.getElementById('partner-modal');
    const openPartnerBtn = document.getElementById('open-partner-modal');
    const reviewModal = document.getElementById('review-modal');
    const reviewForm = document.getElementById('review-form');

    let facilitiesData = [];
    let brandsData = [
        {
            name: 'Nike Vaporfly 3',
            category_name: 'Koşu Ayakkabısı',
            city: 'Dünya Geneli',
            cover_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop',
            sporpuan_score: 9.4,
            facility_score: 9.5, trainers_score: 9.2, experience_score: 9.0, safety_score: 9.6, value_score: 8.5,
            description: 'Profesyonel maraton koşucuları için özel olarak tasarlanmış, ultra hafif ve enerji geri dönüşümlü elit koşu ayakkabısı.',
            total_reviews: 450
        },
        {
            name: 'Under Armour Project Rock',
            category_name: 'Antrenman Ekipmanı',
            city: 'Türkiye',
            cover_image_url: 'https://images.unsplash.com/photo-1584735174965-48c48d4eff6a?w=800&fit=crop',
            sporpuan_score: 8.7,
            facility_score: 8.8, trainers_score: 8.5, experience_score: 8.9, safety_score: 9.0, value_score: 8.0,
            description: 'Ağırlık antrenmanlarında maksimum stabilite sağlayan dayanıklı ve konforlu salon ayakkabısı.',
            total_reviews: 210
        },
        {
            name: 'Garmin Fenix 7 Pro',
            category_name: 'Akıllı Saat',
            city: 'Global',
            cover_image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&fit=crop',
            sporpuan_score: 9.6,
            facility_score: 9.8, trainers_score: 9.5, experience_score: 9.7, safety_score: 9.9, value_score: 8.8,
            description: 'Tüm spor branşlarını ölçebilen, solar şarj destekli premium doğa ve spor saati.',
            total_reviews: 890
        }
    ];

    let eventsData = [
        {
            name: 'Bisiklet Festivali Bursa',
            category_name: 'Festival',
            city: 'Bursa',
            cover_image_url: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=800&fit=crop',
            sporpuan_score: 8.7,
            facility_score: 8.0, trainers_score: 10.0, experience_score: 8.5, safety_score: 9.0, value_score: 8.5,
            description: 'Uludağ\'ın muhteşem manzarası eşliğinde her yaştan katılımcıya açık büyük bisiklet turu ve festivali.',
            total_reviews: 124,
            address: 'Uludağ Milli Parkı Girişi',
            operating_hours: '25 Nisan 2026'
        },
        {
            name: 'İstanbul Yarı Maratonu',
            category_name: 'Maraton',
            city: 'İstanbul',
            cover_image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&fit=crop',
            sporpuan_score: 9.2,
            facility_score: 9.0, trainers_score: 9.5, experience_score: 8.8, safety_score: 9.5, value_score: 9.0,
            description: 'Tarihi yarımadada gerçekleşen ve binlerce profesyonel/amatör koşucuyu bir araya getiren uluslararası yarı maraton yarışması.',
            total_reviews: 540,
            address: 'Yenikapı Etkinlik Alanı',
            operating_hours: '15 Mayıs 2026'
        },
        {
            name: 'Antalya IronMan 70.3',
            category_name: 'Triatlon',
            city: 'Antalya',
            cover_image_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&fit=crop',
            sporpuan_score: 9.5,
            facility_score: 9.6, trainers_score: 9.7, experience_score: 9.2, safety_score: 9.8, value_score: 9.0,
            description: 'Yüzme, bisiklet ve koşu etaplarından oluşan, dünyanın en prestijli dayanıklılık yarışlarından birinin Türkiye ayağı.',
            total_reviews: 320,
            address: 'Belek Kadriye Sahili',
            operating_hours: '03 Kasım 2026'
        }
    ];

    let currentFilter = 'Facility';

    async function initializeApp() {
        loader.style.display = 'block';
        try {
            const BASE_URL = 'http://localhost:8001'; 
            const response = await fetch(`${BASE_URL}/api-proxy/apps/6985f22c3c8f22b3fb4a56dd/entities/Facility`, {
                headers: {
                    'api_key': '4872e004cafc4b86a092e1d48b466f84',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            
            const data = await response.json();
            facilitiesData = data;
            
            if (data.length === 0) {
                errorMsg.style.display = 'block';
                errorMsg.innerHTML = "Tesis bulunamadı.";
            } else {
                renderFacilities(facilitiesData);
            }
        } catch (error) {
            console.warn('API Error, using fallback data:', error);
            facilitiesData = [
                {
                    id: 'f1', name: 'Bursa Spor Merkezi', category_name: 'Spor Salonu', city: 'Bursa',
                    cover_image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop',
                    sporpuan_score: 8.5, facility_score: 8.8, trainers_score: 8.2, experience_score: 8.0, safety_score: 9.0, value_score: 7.8,
                    description: 'Modern ekipmanlarla donatılmış, geniş kapasiteli profesyonel spor merkezi.',
                    total_reviews: 47, address: 'Nilüfer, Bursa'
                },
                {
                    id: 'f2', name: 'Kadıköy Basketbol Sahası', category_name: 'Açık Saha', city: 'İstanbul',
                    cover_image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&fit=crop',
                    sporpuan_score: 7.8, facility_score: 7.5, trainers_score: 8.0, experience_score: 8.2, safety_score: 7.0, value_score: 8.5,
                    description: 'Kadıköy sahilinde yer alan, ücretsiz erişimli açık hava basketbol sahası.',
                    total_reviews: 120, address: 'Caferağa, Kadıköy'
                },
                {
                    id: 'f3', name: 'Ankara Olimpik Yüzme Havuzu', category_name: 'Yüzme Havuzu', city: 'Ankara',
                    cover_image_url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&fit=crop',
                    sporpuan_score: 9.2, facility_score: 9.5, trainers_score: 9.0, experience_score: 8.8, safety_score: 9.6, value_score: 8.2,
                    description: 'Olimpik standartlarda 50m havuz, profesyonel yüzme eğitmenleri ve modern soyunma odaları.',
                    total_reviews: 230, address: 'Eryaman, Ankara'
                },
                {
                    id: 'f4', name: 'İzmir Tenis Akademisi', category_name: 'Tenis Kortu', city: 'İzmir',
                    cover_image_url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&fit=crop',
                    sporpuan_score: 8.8, facility_score: 9.0, trainers_score: 9.2, experience_score: 8.5, safety_score: 8.8, value_score: 8.0,
                    description: 'Profesyonel antrenörler eşliğinde, 8 adet hard court ve 4 adet toprak kort.',
                    total_reviews: 95, address: 'Bornova, İzmir'
                },
                {
                    id: 'f5', name: 'Antalya Outdoor Yaşam', category_name: 'Outdoor', city: 'Antalya',
                    cover_image_url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&fit=crop',
                    sporpuan_score: 9.0, facility_score: 8.5, trainers_score: 9.5, experience_score: 9.4, safety_score: 8.8, value_score: 8.2,
                    description: 'Doğa yürüyüşleri, tırmanış ve kamp aktiviteleri için ekipman desteği ve rehberlik hizmeti.',
                    total_reviews: 62, address: 'Konyaaltı, Antalya'
                },
                {
                    id: 'f6', name: 'Trabzon Fitness Center', category_name: 'Fitness', city: 'Trabzon',
                    cover_image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&fit=crop',
                    sporpuan_score: 8.1, facility_score: 8.2, trainers_score: 7.8, experience_score: 8.0, safety_score: 8.5, value_score: 8.3,
                    description: 'Şehir merkezinde, uygun fiyatlı ve 24 saat açık modern fitness salonu.',
                    total_reviews: 65, address: 'Ortahisar, Trabzon'
                }
            ];
            renderFacilities(facilitiesData);
        } finally {
            loader.style.display = 'none';
            errorMsg.style.display = 'none';
        }
    }

    // --- EXPLORE FILTERS LOGIC ---
    const filters = {
        search: '',
        categories: [],
        city: 'all',
        minScore: 0,
        sort: 'score'
    };

    function initFilterListeners() {
        const sidebarSearch = document.getElementById('sidebar-search-input');
        const citySelect = document.getElementById('filter-city');
        const scorePills = document.querySelectorAll('.score-pill');
        const sortSelect = document.getElementById('sort-results');
        const resetBtn = document.getElementById('reset-filters');
        const typePills = document.querySelectorAll('.type-pill');

        if (sidebarSearch) {
            sidebarSearch.addEventListener('input', (e) => {
                filters.search = e.target.value.toLowerCase();
                applyFilters();
            });
        }

        // Type Switch (Tesisler / Markalar / Etkinlikler)
        if (typePills && typePills.length > 0) {
            typePills.forEach(pill => {
                pill.addEventListener('click', () => {
                    typePills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    const type = pill.dataset.type;
                currentFilter = type;
                
                // Clear search and categories on type change
                filters.categories = [];
                updateCategoryFilters(type);
                applyFilters();
                });
            });
        }

        // Delegate change event for dynamic checkboxes
        const categoryContainer = document.getElementById('filter-categories');
        if (categoryContainer) {
            categoryContainer.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    const checkboxes = categoryContainer.querySelectorAll('input[type="checkbox"]');
                    filters.categories = Array.from(checkboxes)
                        .filter(i => i.checked)
                        .map(i => i.value);
                    applyFilters();
                }
            });
        }

        if (citySelect) {
            citySelect.addEventListener('change', (e) => {
                filters.city = e.target.value;
                applyFilters();
            });
        }

        if (scorePills && scorePills.length > 0) {
            scorePills.forEach(pill => {
                pill.addEventListener('click', () => {
                    scorePills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    filters.minScore = parseFloat(pill.dataset.min);
                    applyFilters();
                });
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                filters.sort = e.target.value;
                applyFilters();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                filters.search = '';
                filters.categories = [];
                filters.city = 'all';
                filters.minScore = 0;
                filters.sort = 'score';

                // Reset UI
                if (sidebarSearch) sidebarSearch.value = '';
                const checkboxes = categoryContainer.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => cb.checked = false);
                if (citySelect) citySelect.value = 'all';
                scorePills.forEach(p => p.classList.remove('active'));
                scorePills[scorePills.length - 1].classList.add('active'); // "Hepsi"
                if (sortSelect) sortSelect.value = 'score';

                applyFilters();
            });
        }

        // Initialize with default type
        updateCategoryFilters('Facility');
        // initPanoramicHero removed to ensure immediate visibility
        document.querySelectorAll('.hero-content-inner > *').forEach(ch => ch.style.opacity = '1');
        // initReviewCarousel is called at the end of the file

    }

    function initPanoramicHero() {
        const heroContent = document.querySelector('.hero-content-inner');
        if (!heroContent) return;

        // Simple staggered entry for hero elements
        const children = heroContent.children;
        Array.from(children).forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
            
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
    }

    // initReviewCarousel removed (duplicate)



    function updateCategoryFilters(type) {
        const container = document.getElementById('filter-categories');
        const label = document.getElementById('category-label');
        if (!container || !label) return;

        let categories = [];
        if (type === 'Facility') {
            label.textContent = 'Tesis Tipi';
            categories = ['Spor Salonu', 'Açık Saha', 'Yüzme Havuzu', 'Tenis Kortu', 'Outdoor', 'Fitness'];
        } else if (type === 'Brand') {
            label.textContent = 'Marka Kategorisi';
            categories = ['Koşu Ayakkabısı', 'Antrenman Ekipmanı', 'Akıllı Saat'];
        } else if (type === 'Event') {
            label.textContent = 'Etkinlik Tipi';
            categories = ['Festival', 'Maraton', 'Triatlon'];
        }

        container.innerHTML = categories.map(cat => `
            <label class="filter-opt">
                <input type="checkbox" value="${cat}"> ${cat}
            </label>
        `).join('');
    }

    function applyFilters() {
        let sourceData = facilitiesData;
        if (currentFilter === 'Brand') sourceData = brandsData;
        if (currentFilter === 'Event') sourceData = eventsData;

        if (!sourceData) return;

        let filtered = [...sourceData];

        // Search
        if (filters.search) {
            filtered = filtered.filter(f => 
                f.name.toLowerCase().includes(filters.search) || 
                (f.category_name && f.category_name.toLowerCase().includes(filters.search))
            );
        }

        // Categories
        if (filters.categories.length > 0) {
            filtered = filtered.filter(f => filters.categories.includes(f.category_name));
        }

        // City
        if (filters.city !== 'all') {
            filtered = filtered.filter(f => f.city === filters.city);
        }

        // Score
        if (filters.minScore > 0) {
            filtered = filtered.filter(f => (f.sporpuan_score) >= filters.minScore);
        }

        // Sort
        if (filters.sort === 'score') {
            filtered.sort((a, b) => (b.sporpuan_score || 0) - (a.sporpuan_score || 0));
        } else if (filters.sort === 'reviews') {
            filtered.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
        } else if (filters.sort === 'newest') {
            filtered.reverse();
        }

        renderFacilities(filtered);
        
        // Update results count
        const countSpan = document.getElementById('results-count');
        if (countSpan) countSpan.textContent = filtered.length;
    }

    // Tabs filtering logic
    const tabs = document.querySelectorAll('.hero-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            currentFilter = filter;
            
            if (filter === 'Facility') {
                renderFacilities(facilitiesData);
            } else if (filter === 'Brand') {
                renderFacilities(brandsData);
            } else if (filter === 'Event') {
                renderFacilities(eventsData);
            }
        });
    });

    function showHome() {
        document.body.classList.remove('modal-open');
        homeView.style.display = 'block';
        document.body.classList.add('is-home');
        if (exploreView) exploreView.style.display = 'none';
        detailsView.style.display = 'none';
        if (b2bView) b2bView.style.display = 'none';
        if (profileView) profileView.style.display = 'none';
        if (compactFooter) compactFooter.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function showExplore() {
        document.body.classList.remove('modal-open');
        homeView.style.display = 'none';
        document.body.classList.remove('is-home');
        if (exploreView) exploreView.style.display = 'block';
        if (profileView) profileView.style.display = 'none';
        detailsView.style.display = 'none';
        if (b2bView) b2bView.style.display = 'none';
        if (compactFooter) compactFooter.style.display = 'block';
        window.scrollTo(0, 0);
        applyFilters(); 
    }

    function showDetailsLayout(facility) {
        document.body.classList.remove('modal-open');
        homeView.style.display = 'none';
        document.body.classList.remove('is-home');
        if (exploreView) exploreView.style.display = 'none';
        if (b2bView) b2bView.style.display = 'none';
        detailsView.style.display = 'block';
        if (profileView) profileView.style.display = 'none';
        if (compactFooter) compactFooter.style.display = 'block';
        window.scrollTo(0, 0);
        buildDetailsPage(facility);
    }

    // Math Utils
    function getCircleDash(score, maxScore = 10, radius = 36) {
        const circumference = 2 * Math.PI * radius;
        const fill = (score / maxScore) * circumference;
        return `${fill} ${circumference}`;
    }

    function getScoreColorClass(score) {
        if (!score) return 'orange';
        const s = parseFloat(score);
        if (s >= 7) return 'green';
        if (s >= 5) return 'blue';
        return 'orange';
    }

    // Get dynamic criteria labels based on category
    function getCriteriaLabels() {
        if (currentFilter === 'Brand') {
            return ['Malzeme Kalitesi', 'Dayanıklılık', 'Performans', 'Konfor', 'Fiyat/Değer'];
        } else if (currentFilter === 'Event') {
            return ['Organizasyon', 'Atmosfer', 'Zaman Yönetimi', 'Katılımcılar', 'Fiyat/Eğlence'];
        }
        return ['Tesis', 'Eğitmenler', 'Deneyim', 'Güvenlik', 'Fiyat/Performans'];
    }

    // Render Home List (3-Column Grid Layout)
    function renderFacilities(facilities) {
        listContainer.innerHTML = '';
        listContainer.classList.add('grid-layout'); 
        
        facilities.forEach((facility, index) => {
            const imageUrl = facility.cover_image_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&fit=crop';
            
            const normalTotalScore = (facility.sporpuan_score || 0).toFixed(1);
            const dashArray = getCircleDash(normalTotalScore, 10, 26); 
            const strokeColor = getScoreColorClass(normalTotalScore); 

            const item = document.createElement('div');
            item.className = 'grid-card animate-in';
            item.style.animationDelay = `${index * 0.1}s`;
            item.onclick = () => showDetailsLayout(facility);

            const reviewsCount = facility.total_reviews || Math.floor(Math.random() * 200) + 20;
            const recommendPerc = normalTotalScore >= 8.0 ? '100' : '33'; 

            let metaIconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
            if (currentFilter === 'Brand') {
                metaIconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`;
            } else if (currentFilter === 'Event') {
                metaIconHtml = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
            }

            item.innerHTML = `
                <div class="gc-header" style="background-image: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%), url('${imageUrl}');">
                    <div class="gc-top">
                        <span class="gc-type">${facility.category_name || 'Spor Tesisi'}</span>
                        <button class="gc-fav" title="Favorilere Ekle">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                    </div>
                    <div class="gc-bottom">
                        <div class="gc-title-wrap">
                            <h3 class="gc-title">${facility.name}</h3>
                            <span class="gc-verified" title="Onaylı">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#60a5fa"><circle cx="12" cy="12" r="12"/><path d="M12 5l2.25 5H20l-4.5 3.5L17 19l-5-3.5L7 19l1.5-5.5L4 10h5.75L12 5z" fill="#fff" transform="scale(0.6) translate(8,8)"/></svg>
                            </span>
                        </div>
                        <div class="gc-location">
                            ${metaIconHtml}
                            ${facility.city || 'Bursa'}
                        </div>
                    </div>
                </div>
                
                <div class="gc-footer">
                    <div class="gc-score-circle">
                        <svg class="circle-svg" viewBox="0 0 60 60">
                            <circle class="circle-bg" cx="30" cy="30" r="26" stroke-width="4"></circle>
                            <circle class="circle-bar ${strokeColor}" cx="30" cy="30" r="26" stroke-width="4" stroke-dasharray="${dashArray}"></circle>
                        </svg>
                        <span class="gc-score-val">${normalTotalScore}</span>
                    </div>
                    
                    <div class="gc-score-info">
                        <strong>Sporpuan Skoru</strong>
                        <div class="gc-stats">
                            <span class="gc-reviews">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                ${reviewsCount} yorumlar
                            </span>
                            <span class="gc-recommend">%${recommendPerc} tavsiye</span>
                        </div>
                    </div>
                </div>
            `;
            listContainer.appendChild(item);
        });
    }

    // Build Details Full Page
    function buildDetailsPage(facility) {
        const imageUrl = facility.cover_image_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&fit=crop';
        const total = (facility.sporpuan_score || 0).toFixed(1);
        
        const labels = getCriteriaLabels();
        
        const scores = [
            { label: labels[0], val: (facility.facility_score || 0).toFixed(1) },
            { label: labels[1], val: (facility.trainers_score || 0).toFixed(1) },
            { label: labels[2], val: (facility.experience_score || 0).toFixed(1) },
            { label: labels[3], val: (facility.safety_score || 0).toFixed(1) },
            { label: labels[4], val: (facility.value_score || 0).toFixed(1) }
        ];

        let rightBarsHtml = '';
        scores.forEach(s => {
            const perc = (s.val / 10) * 100;
            const cls = getScoreColorClass(s.val);
            rightBarsHtml += `
                <div class="sb-bar-row">
                    <span class="sb-bar-lbl">${s.label}</span>
                    <div class="sb-bar-track">
                        <div class="sb-bar-fill ${cls === 'blue' ? 'blue' : 'green'}" style="width: ${perc}%"></div>
                    </div>
                    <span class="sb-bar-val">${s.val}</span>
                </div>
            `;
        });

        let reviewHtml = '';
        scores.forEach(s => {
            const perc = (s.val / 10) * 100;
            let cls = 'green';
            if(s.val < 5) cls = 'red';
            else if(s.val < 7) cls = 'orange';

            const singleDigitVal = parseFloat(s.val);

            reviewHtml += `
                <div class="r-mini-score">
                    <div class="r-mini-lbl">${s.label} <strong>${singleDigitVal}</strong></div>
                    <div class="r-mini-track">
                        <div class="r-mini-fill ${cls}" style="width: ${perc}%"></div>
                    </div>
                </div>
            `;
        });

        let tagHtml = `<span class="dp-tag">Spor Tesisi</span>`;
        if(currentFilter === 'Brand') tagHtml = `<span class="dp-tag" style="background:var(--sporpuan-orange); color:#fff;">Spor Markası</span>`;
        if(currentFilter === 'Event') tagHtml = `<span class="dp-tag" style="background:#8b5cf6; color:#fff;">Spor Etkinliği</span>`;

        let typeDetailsHtml = '';
        if(currentFilter === 'Brand') {
            typeDetailsHtml = `<div class="dp-meta-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>Kategori: ${facility.category_name}</div>`;
        } else if(currentFilter === 'Event') {
            typeDetailsHtml = `<div class="dp-meta-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>📅 ${facility.operating_hours || 'Tarih belirtilmedi'}</div>`;
        } else {
            typeDetailsHtml = `<div class="dp-meta-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${facility.operating_hours || 'Açık'}</div>`;
        }

        let typeSpecificSection = '';
        if (currentFilter === 'Brand') {
            const brandSpecs = [
                { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>', label: 'Kategori', value: facility.category_name || 'Spor Ekipmanı' },
                { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>', label: 'Ağırlık', value: facility.name.includes('Vaporfly') ? '198g' : facility.name.includes('Garmin') ? '79g' : '340g' },
                { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>', label: 'Garanti', value: '2 Yıl' },
                { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>', label: 'Fiyat Aralığı', value: facility.name.includes('Garmin') ? '₺25.000 - ₺30.000' : facility.name.includes('Vaporfly') ? '₺9.000 - ₺12.000' : '₺5.000 - ₺7.500' }
            ];
            typeSpecificSection = `
                <div class="dp-type-section animate-in" style="background:#fff; border:1px solid var(--border-color); border-radius:16px; padding:1.8rem; margin-bottom:1.5rem;">
                    <h3 style="font-size:1.1rem; font-weight:800; color:var(--sporpuan-navy); margin-bottom:1.2rem; display:flex; align-items:center; gap:0.5rem;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> Ürün Bilgileri</h3>
                    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:1rem;">
                        ${brandSpecs.map(spec => `<div style="background:#f8fafc; border:1px solid var(--border-color); border-radius:12px; padding:1rem;"><div style="font-size:0.8rem; color:var(--text-muted); font-weight:600; margin-bottom:0.3rem;">${spec.icon} ${spec.label}</div><div style="font-size:1rem; color:var(--sporpuan-navy); font-weight:700;">${spec.value}</div></div>`).join('')}
                    </div>
                </div>`;
        } else if (currentFilter === 'Event') {
            const eventInfoItems = [
                { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>', label: 'Tarih', value: facility.operating_hours || 'Belirtilmedi' },
                { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>', label: 'Konum', value: (facility.city || '') + (facility.address ? ' — ' + facility.address : '') },
                { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>', label: 'Katılımcı', value: (facility.total_reviews || 0) > 200 ? '5.000+' : '1.000+' }
            ];
            typeSpecificSection = `
                <div class="dp-type-section animate-in" style="background:#fff; border:1px solid var(--border-color); border-radius:16px; padding:1.8rem; margin-bottom:1.5rem;">
                    <h3 style="font-size:1.1rem; font-weight:800; color:var(--sporpuan-navy); margin-bottom:1.2rem; display:flex; align-items:center; gap:0.5rem;"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon> Etkinlik Detayları</h3>
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem;">
                        ${eventInfoItems.map(item => `<div style="background:#f8fafc; border:1px solid var(--border-color); border-radius:12px; padding:1rem; text-align:center;"><div style="font-size:1.5rem; margin-bottom:0.3rem;">${item.icon}</div><div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:0.2rem;">${item.label}</div><div style="font-size:0.9rem; color:var(--sporpuan-navy); font-weight:700;">${item.value}</div></div>`).join('')}
                    </div>
                </div>`;
        }

        detailsView.innerHTML = `
            <div class="details-page-wrapper animate-in">
                <div class="dp-banner" style="background-image: url('${imageUrl}');">
                    <div class="dp-banner-overlay"></div>
                    <div class="dp-banner-content">
                        <div>
                            <div class="dp-tags">${tagHtml}<span class="dp-tag primary">Onaylı</span></div>
                            <h1 class="dp-title">${facility.name}</h1>
                            <div class="dp-meta-row">
                                <div class="dp-meta-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${facility.city || 'Belirtilmedi'} ${facility.address ? '— ' + facility.address : ''}</div>
                                ${typeDetailsHtml}
                                <div class="dp-meta-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>${facility.total_reviews || 1} Değerlendirme</div>
                            </div>
                        </div>
                        <div class="dp-banner-score"><div class="val">${total}</div><div class="lbl">Sporpuan Skoru</div></div>
                    </div>
                </div>
                <div class="dp-body">
                    <div class="dp-left">
                        ${typeSpecificSection}
                        <div class="dp-tabs-wrap">
                            <div class="dp-tab active"><svg style="vertical-align:middle; margin-right:5px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>Değerlendirmeler (${facility.total_reviews || 1})</div>
                            <button class="dp-borderline-btn" id="action-review-btn">Değerlendir</button>
                        </div>
                        <div class="review-item">
                            <div class="review-header">
                                <div class="r-user"><div class="r-avatar">C</div><div class="r-name-wrap"><span class="r-name">Can Ö****</span><span class="r-date">16 Feb 2026</span></div></div>
                                <div class="r-actions"><div class="r-score-circle">${total}</div></div>
                            </div>
                            <p class="review-text">${facility.description || 'Tesis genel olarak iyi durumda.'}</p>
                            <div class="review-bars-inline">${reviewHtml}</div>
                        </div>
                    </div>
                    <div class="dp-right">
                        <div class="dp-sidebar-card">
                            <div class="dp-sidebar-val">${total}</div>
                            <div class="dp-sidebar-lbl">SPORPUAN SKORU</div>
                            <div class="dp-sidebar-charts">${rightBarsHtml}</div>
                        </div>
                    </div>
                </div>
            </div>`;

        document.getElementById('action-review-btn').onclick = () => {
            openModal(reviewModal);
            reviewForm.dataset.facilityId = facility.id;
        };
    }

    // Modal Events
    const loggedOutUI = document.getElementById('user-logged-out');
    const loggedInUI = document.getElementById('user-logged-in');
    const avatarName = document.getElementById('avatar-name');
    const avatarImg = document.getElementById('avatar-img');


    function openModal(modal) {
        document.querySelectorAll('.modal-overlay.active, .modal.active').forEach(m => m.classList.remove('active'));
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
    function closeModal(modal) { modal.classList.remove('active'); document.body.classList.remove('modal-open'); }
    window.closeModal = closeModal;

    let isLoggedIn = false;
    const profileDropdown = document.getElementById('user-profile-dropdown');
    
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoggedIn) profileDropdown.classList.toggle('active');
        else openModal(loginModal);
    });

    document.addEventListener('click', (e) => {
        if (profileDropdown && !loginBtn.contains(e.target)) profileDropdown.classList.remove('active');
    });

    closeLoginBtn.addEventListener('click', () => closeModal(loginModal));
    window.addEventListener('click', (e) => { 
        if (e.target === loginModal) closeModal(loginModal); 
        const pModal = document.getElementById('partner-modal');
        if (pModal && e.target === pModal) closeModal(pModal);
        if (e.target === reviewModal) closeModal(reviewModal);
    });

    // SPA Routing
    logoHome.addEventListener('click', () => showHome());


    const ftB2B = document.getElementById('footer-b2b-link');
    if (ftB2B) ftB2B.onclick = (e) => { e.preventDefault(); showB2B(); };

    const ftExplore = document.getElementById('footer-explore-link');
    if (ftExplore) ftExplore.onclick = (e) => { e.preventDefault(); showExplore(); };

    // --- B2B / B2C Navigation ---
    const topBannerCta = document.getElementById('top-banner-cta');
    let isB2BMode = false;

    function showB2B() {
        document.body.classList.remove('modal-open');
        document.body.classList.remove('is-home');
        isB2BMode = true;
        homeView.style.display = 'none';
        if (exploreView) exploreView.style.display = 'none';
        if (detailsView) detailsView.style.display = 'none';
        if (profileView) profileView.style.display = 'none';
        if (b2bView) b2bView.style.display = 'block';
        if (compactFooter) compactFooter.style.display = 'none';
        window.scrollTo(0, 0);
    }

    function showB2C() {
        isB2BMode = false;
        if (b2bView) b2bView.style.display = 'none';
        showHome();
    }

    if (topBannerCta) topBannerCta.onclick = (e) => {
        e.preventDefault();
        if (isB2BMode) showB2C(); else showB2B();
    };

    // --- Search ---
    const searchInput = document.querySelector('.search-input-wrapper input');
    const searchBtn = document.querySelector('.search-btn');

    function handleSearch() {
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
        if (homeView.style.display !== 'none') showExplore();
        if (!query) { renderFacilities(facilitiesData); return; }
        const filtered = facilitiesData.filter(f => f.name.toLowerCase().includes(query));
        renderFacilities(filtered);
    }

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSearch(); });

    // --- Toast ---
    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠'}</span><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
    window.showToast = showToast;

    // --- Review Carousel ---
    function initReviewCarousel() {
        const carousel = document.querySelector('.recent-reviews-container');
        if (!carousel) return;
        const reviews = Array.from(carousel.children);
        reviews.forEach(review => carousel.appendChild(review.cloneNode(true)));
        let scrollAmount = 0;
        function step() {
            scrollAmount += 1;
            if (scrollAmount >= carousel.scrollWidth / 2) scrollAmount = 0;
            carousel.scrollLeft = scrollAmount;
            requestAnimationFrame(step);
        }
        step();
    }

    // --- Partner Modal Triggers ---
    document.addEventListener('click', (e) => {
        if (e.target.closest('.open-partner-modal') || e.target.closest('.tb-link')) {
            e.preventDefault();
            const pModal = document.getElementById('partner-modal');
            if (pModal) openModal(pModal);
        }
    });

    const b2bLinks = document.querySelectorAll('.open-partner-modal');
    b2bLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pModal = document.getElementById('partner-modal');
            if (pModal) openModal(pModal);
        });
    });

    if (openPartnerBtn) {
        openPartnerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(partnerModal);
        });
    }

    // --- Auth Tabs Switching ---
    function initAuthTabs() {
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const parent = tab.closest('.modal-content');
                const targetId = tab.getAttribute('data-target');
                
                // Toggle active class on tabs
                parent.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Toggle forms
                parent.querySelectorAll('.auth-form-wrapper').forEach(wrapper => {
                    wrapper.classList.remove('active');
                    wrapper.style.display = 'none';
                });
                
                const targetWrapper = document.getElementById(targetId);
                if (targetWrapper) {
                    targetWrapper.classList.add('active');
                    targetWrapper.style.display = 'block';
                }
            });
        });
    }

    initAuthTabs();
    initReviewCarousel();
    initializeApp();
    initFilterListeners();

    // ==================== DYNAMIC TOP BANNER ROTATION ====================
    function initDynamicBanner() {
        const bannerText = document.getElementById('top-banner-text');
        if (!bannerText) return;

        const messages = [
            '👉 Markanızı büyütmek ve müşteri yorumları toplamak için <span class="tb-link">buraya tıklayın &rarr;</span>',
            '👉 Hizmetlerinizi büyütün, kullanıcı yorumlarını artırın &rarr; <span class="tb-link">şimdi başlayın</span>',
            '👉 Spor markanızı ve deneyimlerinizi büyütmek için <span class="tb-link">buraya tıklayın &rarr;</span>'
        ];

        let msgIndex = 0;

        function rotateBanner() {
            bannerText.style.opacity = '0';
            setTimeout(() => {
                msgIndex = (msgIndex + 1) % messages.length;
                bannerText.innerHTML = messages[msgIndex];
                bannerText.style.opacity = '1';
            }, 400); // Wait for fade out
        }

        setInterval(rotateBanner, 6000); // Change every 6 seconds
    }


    // ==================== B2B HERO SLIDER ====================
    let b2bSlideIndex = 0;
    const b2bSlides = document.querySelectorAll('.b2b-hero-slide');
    
    function cycleB2BSlider() {
        if (!b2bSlides || b2bSlides.length === 0) return;
        
        b2bSlides.forEach(slide => slide.classList.remove('active'));
        b2bSlideIndex++;
        if (b2bSlideIndex >= b2bSlides.length) b2bSlideIndex = 0;
        b2bSlides[b2bSlideIndex].classList.add('active');
    }

    if (b2bSlides && b2bSlides.length > 1) {
        setInterval(cycleB2BSlider, 5000); // 5 saniyede bir değişim
    }

    // ==================== B2B NEWSLETTER ACTIVATION ====================
    const b2bNewsBtn = document.getElementById('b2b-newsletter-btn');
    const b2bNewsEmail = document.getElementById('b2b-newsletter-email');
    const b2bNewsSuccess = document.getElementById('b2b-newsletter-success');

    if (b2bNewsBtn) {
        b2bNewsBtn.addEventListener('click', () => {
            const email = b2bNewsEmail.value;
            if (email && email.includes('@')) {
                b2bNewsSuccess.style.display = 'block';
                b2bNewsEmail.value = '';
                setTimeout(() => {
                    b2bNewsSuccess.style.display = 'none';
                }, 5000);
            } else {
                alert('Lütfen geçerli bir e-posta adresi giriniz.');
            }
        });
    // ==================== CENTRAL USER STATE & UX LOGIC ====================

    const userData = {
        name: '', email: '', phone: '', city: 'Bursa',
        reviews: [
            { name: 'Bursa Spor Merkezi', cat: 'Spor Salonu', comment: '"Harika bir tesis, temizlik on numara."', score: 8.5, date: '16 Şub 2026', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fit=crop' },
            { name: 'Nike Vaporfly 3', cat: 'Koşu Ayakkabısı', comment: '"Hızlanmak isteyenler için tek tercih."', score: 9.4, date: '02 Şub 2026', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&fit=crop' },
            { name: 'Ankara Olimpik Yüzme', cat: 'Yüzme Havuzu', comment: '"Olimpik standartlarda harika havuz."', score: 9.2, date: '18 Oca 2026', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&fit=crop' }
        ],
        favorites: [
            { name: 'Bursa Spor Merkezi', city: 'Bursa', score: 8.5, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&fit=crop' },
            { name: 'Ankara Olimpik Yüzme Havuzu', city: 'Ankara', score: 9.2, img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&fit=crop' },
            { name: 'İzmir Tenis Akademisi', city: 'İzmir', score: 8.8, img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&fit=crop' },
            { name: 'Antalya Outdoor Yaşam', city: 'Antalya', score: 9.0, img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&fit=crop' }
        ]
    };

    // ==================== CENTRALIZED USER REGISTRY ====================
    const registeredUsers = [
        { name: 'Selman Utku', email: 'selman@sporpuan.com', role: 'admin', date: '15 Oca 2026', org: '—' },
        { name: 'Mert Kılıç', email: 'mert@gmail.com', role: 'user', date: '20 Oca 2026', org: '—' },
        { name: 'Leyla Karaca', email: 'leyla@gmail.com', role: 'user', date: '25 Oca 2026', org: '—' },
        { name: 'Can Tuncer', email: 'can@outlook.com', role: 'user', date: '02 Şub 2026', org: '—' },
        { name: 'Selin Öztürk', email: 'selin@hotmail.com', role: 'user', date: '10 Şub 2026', org: '—' },
        { name: 'Ahmet Yılmaz', email: 'ahmet@gmail.com', role: 'user', date: '14 Şub 2026', org: '—' },
        { name: 'Zeynep Demir', email: 'zeynep@gmail.com', role: 'user', date: '28 Şub 2026', org: '—' }
    ];

    function getTodayStr() {
        const d = new Date();
        const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
        return `${d.getDate().toString().padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    function renderAdminTable() {
        const tbody = document.getElementById('admin-user-table-body');
        if (!tbody) return;

        const users = registeredUsers;
        const partners = users.filter(u => u.role === 'partner');
        const admins = users.filter(u => u.role === 'admin');

        tbody.innerHTML = users.map(u => {
            const roleClass = u.role === 'admin' ? 'background:#fef2f2;color:#ef4444;' :
                              u.role === 'partner' ? 'background:#f0fdf4;color:#10b981;' :
                              'background:#eff6ff;color:#3b82f6;';
            const roleLabel = u.role === 'admin' ? 'Admin' :
                              u.role === 'partner' ? 'Tesis Yöneticisi' : 'Üye';
            return `<tr>
                <td style="display:flex;align-items:center;gap:0.8rem;">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0f172a&color=fff&size=36&bold=true" style="width:36px;height:36px;border-radius:50%;">
                    <span style="font-weight:700;">${u.name}</span>
                </td>
                <td>${u.email}</td>
                <td><span style="padding:4px 10px;border-radius:8px;font-size:0.8rem;font-weight:700;${roleClass}">${roleLabel}</span></td>
                <td>${u.date}</td>
                <td>${u.org || '—'}</td>
                <td><button style="background:none;border:1px solid #e2e8f0;padding:6px 12px;border-radius:8px;font-weight:600;cursor:pointer;font-size:0.8rem;">Düzenle</button></td>
            </tr>`;
        }).join('');

        // Update stats
        const totalEl = document.getElementById('adm-total-users');
        const partnerEl = document.getElementById('adm-total-partners');
        if (totalEl) totalEl.innerText = users.length;
        if (partnerEl) partnerEl.innerText = partners.length;

        // Update filter counts
        const filterBtns = document.querySelectorAll('.ac-filters .filter-btn');
        if (filterBtns.length >= 3) {
            filterBtns[0].innerText = `Tümü (${users.length})`;
            filterBtns[1].innerText = `Adminler (${admins.length})`;
            filterBtns[2].innerText = `Tesis Yöneticileri (${partners.length})`;
        }
    }

    // ==================== SUCCESS POPUP OVERLAY ====================
    function showSuccessOverlay(title, message, type = 'user') {
        let overlay = document.getElementById('success-overlay');
        if (overlay) overlay.remove();

        const icon = type === 'partner'
            ? '<svg viewBox="0 0 24 24" style="width:48px;height:48px;stroke:#10b981;fill:none;stroke-width:2;"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/></svg>'
            : '<svg viewBox="0 0 24 24" style="width:48px;height:48px;stroke:#10b981;fill:none;stroke-width:2;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

        overlay = document.createElement('div');
        overlay.id = 'success-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10001;animation:fadeIn 0.3s ease;';
        overlay.innerHTML = `
            <div style="background:#fff;border-radius:24px;padding:3rem;max-width:440px;width:90%;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.25);animation:fadeIn 0.4s ease;">
                <div style="width:80px;height:80px;border-radius:50%;background:#f0fdf4;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">${icon}</div>
                <h2 style="font-size:1.6rem;color:var(--sporpuan-navy,#0f172a);margin-bottom:0.5rem;">${title}</h2>
                <p style="color:#64748b;font-size:1rem;line-height:1.6;margin-bottom:2rem;">${message}</p>
                <button id="success-overlay-close" style="background:var(--sporpuan-navy,#0f172a);color:#fff;border:none;padding:1rem 2.5rem;border-radius:14px;font-size:1rem;font-weight:700;cursor:pointer;transition:0.3s;">Tamam</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#success-overlay-close').onclick = () => {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s';
            setTimeout(() => overlay.remove(), 300);
        };
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.querySelector('#success-overlay-close').click();
        });
    }

    function simulateLoginFull(name, email) {
        isLoggedIn = true;
        userData.name = name;
        userData.email = email;

        // Header UI
        loggedOutUI.style.display = 'none';
        loggedInUI.style.display = 'flex';
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=fff&bold=true`;
        avatarName.innerText = name;
        avatarImg.src = avatarUrl;

        // Dropdown sync
        const updAvatar = document.getElementById('upd-avatar-img');
        const updName = document.getElementById('upd-name');
        const updEmail = document.getElementById('upd-email');
        const updReviews = document.getElementById('upd-reviews');
        const updFavs = document.getElementById('upd-favs');
        const updScore = document.getElementById('upd-score');

        if (updAvatar) updAvatar.src = avatarUrl;
        if (updName) updName.innerText = name;
        if (updEmail) updEmail.innerText = email;
        if (updReviews) updReviews.innerText = userData.reviews.length;
        if (updFavs) updFavs.innerText = userData.favorites.length;
        if (updScore) {
            const avg = userData.reviews.length > 0
                ? (userData.reviews.reduce((s, r) => s + r.score, 0) / userData.reviews.length).toFixed(1)
                : '—';
            updScore.innerText = avg;
        }
    }


    function simulateLogout() {
        isLoggedIn = false;
        userData.name = '';
        userData.email = '';
        loggedInUI.style.display = 'none';
        loggedOutUI.style.display = 'flex';
        if (profileDropdown) profileDropdown.classList.remove('active');
        showHome();
        showToast('Başarıyla çıkış yapıldı.');
    }

    // --- Profile View ---
    function showView(viewId) {
        document.body.classList.remove('modal-open', 'is-home');
        const views = [homeView, exploreView, detailsView, profileView, adminView, b2bView, partnerDashboardView];
        views.forEach(v => { if (v) v.style.display = 'none'; });
        
        const targetView = document.getElementById(viewId);
        if (targetView) targetView.style.display = 'block';
        
        if (compactFooter) {
            compactFooter.style.display = (viewId === 'home-view') ? 'none' : 'block';
        }
        window.scrollTo(0, 0);
    }

    function handleAuthSuccess(name, email, role, org = '—') {
        // Add to registry if not already there
        const exists = registeredUsers.find(u => u.email === email);
        if (!exists) {
            registeredUsers.push({ name, email, role, date: getTodayStr(), org });
            renderAdminTable();
        }

        // Login
        simulateLoginFull(name, email, role);
        userData.role = role;
        userData.org = org;

        // Redirect based on role
        if (role === 'partner') {
            showView('partner-dashboard-view');
            renderPartnerDashboard();
        } else if (role === 'admin') {
            showView('admin-view');
        } else {
            showView('profile-view');
            renderProfileData();
        }
    }

    function renderPartnerDashboard() {
        const el = (id) => document.getElementById(id);
        if (el('pd-company-name')) el('pd-company-name').innerText = userData.org;
        if (el('pdf-company')) el('pdf-company').innerText = userData.org;
        if (el('pdf-email')) el('pdf-email').innerText = userData.email;
        if (el('pdf-phone')) el('pdf-phone').innerText = userData.phone || '0538 XXX XX XX';
        
        // Populate stats if empty
        if (el('pds-score')) el('pds-score').innerText = '0.0';
        if (el('pds-total')) el('pds-total').innerText = '0';
        if (el('pds-approved')) el('pds-approved').innerText = '0';
        if (el('pds-favs')) el('pds-favs').innerText = '0';
    }

    function renderProfileData() {
        const el = (id) => document.getElementById(id);
        const avgScore = userData.reviews.length > 0
            ? (userData.reviews.reduce((s, r) => s + r.score, 0) / userData.reviews.length).toFixed(1) : '0.0';

        if (el('prof-name')) el('prof-name').innerText = userData.name || 'Kullanıcı';
        if (el('prof-fname')) el('prof-fname').innerText = (userData.name || 'Kullanıcı').split(' ')[0];
        if (el('prof-email')) el('prof-email').innerText = userData.email || 'email@sporpuan.com';
        if (el('prof-avatar-img')) el('prof-avatar-img').src = avatarImg.src;
        if (el('stat-total-reviews')) el('stat-total-reviews').innerText = userData.reviews.length;
        if (el('stat-avg-score')) el('stat-avg-score').innerText = avgScore;
        if (el('stat-favs-count')) el('stat-favs-count').innerText = userData.favorites.length;
        if (el('stat-rank')) el('stat-rank').innerText = '#' + Math.max(1, 10 - userData.reviews.length);

        // Badges
        const badges = el('prof-badges');
        if (badges) {
            let badgeHtml = '<span style="display:inline-block;padding:4px 10px;background:#eff6ff;color:#3b82f6;border-radius:8px;font-size:0.75rem;font-weight:700;margin:2px;">🏆 Sporpuan Üyesi</span>';
            if (userData.reviews.length >= 3) badgeHtml += '<span style="display:inline-block;padding:4px 10px;background:#f0fdf4;color:#10b981;border-radius:8px;font-size:0.75rem;font-weight:700;margin:2px;">⭐ Aktif Yorumcu</span>';
            badges.innerHTML = badgeHtml;
        }

        // Overview mini reviews
        const compactList = el('prof-reviews-list-compact');
        if (compactList) {
            compactList.innerHTML = userData.reviews.slice(0, 3).map(r => `
                <div class="prof-review-card">
                    <div class="prc-info">
                        <h4>${r.name}</h4>
                        <div class="prc-cat">${r.cat}</div>
                        <div class="prc-comment">${r.comment}</div>
                        <div class="prc-date">${r.date}</div>
                    </div>
                    <div class="prc-score">${r.score}</div>
                </div>
            `).join('');
        }

        // Full reviews
        const fullList = el('prof-full-reviews-list');
        if (fullList) {
            fullList.innerHTML = userData.reviews.map(r => `
                <div class="prof-review-card">
                    <div class="prc-info">
                        <h4>${r.name}</h4>
                        <div class="prc-cat">${r.cat}</div>
                        <div class="prc-comment">${r.comment}</div>
                        <div class="prc-date">${r.date}</div>
                    </div>
                    <div class="prc-score">${r.score}</div>
                </div>
            `).join('');
        }

        // Favorites
        const favGrid = el('prof-favorites-grid');
        if (favGrid) {
            favGrid.innerHTML = userData.favorites.map(f => `
                <div class="prof-fav-card">
                    <div class="pfc-img" style="background-image:url('${f.img}')">
                        <div class="pfc-score">${f.score}</div>
                    </div>
                    <div class="pfc-body">
                        <h4>${f.name}</h4>
                        <p>${f.city}</p>
                    </div>
                </div>
            `).join('');
        }

        // Settings pre-fill
        if (el('set-name')) el('set-name').value = userData.name;
        if (el('set-email')) el('set-email').value = userData.email;
        if (el('set-phone')) el('set-phone').value = userData.phone;
        if (el('set-city')) el('set-city').value = userData.city;
    }

    // --- Profile Sidebar Tab Switching ---
    const psNavItems = document.querySelectorAll('.ps-nav-item:not(.logout)');
    const profSects = document.querySelectorAll('.prof-sect');
    psNavItems.forEach(item => {
        item.addEventListener('click', () => {
            psNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const target = item.dataset.view;
            profSects.forEach(sect => sect.classList.remove('active'));
            const targetSect = document.getElementById(`prof-${target}-sect`);
            if (targetSect) targetSect.classList.add('active');
        });
    });

    // --- Header Dropdown Buttons ---
    const updProfileBtn = document.getElementById('upd-profile-btn');
    const updFavsBtn = document.getElementById('upd-favs-btn');
    const updReviewsBtn = document.getElementById('upd-reviews-btn');
    const updSettingsBtn = document.getElementById('upd-settings-btn');
    const updLogoutBtn = document.getElementById('upd-logout-btn');

    if (updProfileBtn) updProfileBtn.onclick = () => { if(profileDropdown) profileDropdown.classList.remove('active'); showProfile(); };
    if (updFavsBtn) updFavsBtn.onclick = () => {
        if(profileDropdown) profileDropdown.classList.remove('active');
        showProfile();
        setTimeout(() => {
            const favNav = document.querySelector('.ps-nav-item[data-view="favorites"]');
            if (favNav) favNav.click();
        }, 100);
    };
    if (updReviewsBtn) updReviewsBtn.onclick = () => {
        if(profileDropdown) profileDropdown.classList.remove('active');
        showProfile();
        setTimeout(() => {
            const revNav = document.querySelector('.ps-nav-item[data-view="reviews"]');
            if (revNav) revNav.click();
        }, 100);
    };
    if (updSettingsBtn) updSettingsBtn.onclick = () => {
        if(profileDropdown) profileDropdown.classList.remove('active');
        showProfile();
        setTimeout(() => {
            const setNav = document.querySelector('.ps-nav-item[data-view="settings"]');
            if (setNav) setNav.click();
        }, 100);
    };
    if (updLogoutBtn) updLogoutBtn.onclick = () => simulateLogout();

    // Profile sidebar logout
    const profLogoutBtn = document.getElementById('prof-logout-btn');
    if (profLogoutBtn) profLogoutBtn.onclick = () => simulateLogout();

    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('set-name').value;
            const newEmail = document.getElementById('set-email').value;
            const newPhone = document.getElementById('set-phone').value;
            const newCity = document.getElementById('set-city').value;
            if (newName) { userData.name = newName; simulateLoginFull(newName, newEmail || userData.email, userData.role); }
            if (newEmail) userData.email = newEmail;
            if (newPhone) userData.phone = newPhone;
            if (newCity) userData.city = newCity;
            renderProfileData();
            showToast('Profil bilgileriniz güncellendi!');
        });
    }

    // --- Form Handlers ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const role = email.includes('admin') ? 'admin' : 'user';
            const name = role === 'admin' ? 'Admin' : 'Kullanıcı';
            
            closeModal(loginModal);
            handleAuthSuccess(name, email, role);
            showToast('Giriş başarılı!');
        });
    }

    const regForm = document.getElementById('register-form');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            
            closeModal(loginModal);
            handleAuthSuccess(name, email, 'user');

            setTimeout(() => {
                showSuccessOverlay(
                    'Kayıt Başarılı! 🎉',
                    `Hoş geldin ${name}! Hesabın başarıyla oluşturuldu. Profiline yönlendiriliyorsun.`
                );
            }, 500);
        });
    }

    const partnerRegForm = document.getElementById('partner-register-form');
    if (partnerRegForm) {
        partnerRegForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = partnerRegForm.querySelectorAll('input');
            const org = inputs[0]?.value || 'Kurum';
            const name = inputs[1]?.value || 'Partner';
            const email = inputs[2]?.value || '';
            
            const pModal = document.getElementById('partner-modal');
            if (pModal) closeModal(pModal);

            handleAuthSuccess(name, email, 'partner', org);

            setTimeout(() => {
                showSuccessOverlay(
                    'Partner Kaydı Başarılı! 🏢',
                    `${org} adlı organizasyonunuz sisteme kaydedildi. Dashboard'unuza yönlendiriliyorsun.`,
                    'partner'
                );
            }, 500);
        });
    }

    const partnerLoginForm = document.getElementById('partner-login-form');
    if (partnerLoginForm) {
        partnerLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = partnerLoginForm.querySelector('input[type="email"]')?.value || 'partner@sporpuan.com';
            const pModal = document.getElementById('partner-modal');
            if (pModal) closeModal(pModal);
            
            handleAuthSuccess('Partner', email, 'partner', 'Partner Firma');
            showToast('Partner girişi başarılı!');
        });
    }

    // Replace simulateLoginFull to handle roles in UI if needed
    const originalSimulateLogin = simulateLoginFull;
    simulateLoginFull = function(name, email, role = 'user') {
        originalSimulateLogin(name, email);
        // Header badge for partners/admins
        const avatarWrap = loggedInUI.querySelector('.avatar-wrapper');
        if (avatarWrap) {
            let badge = avatarWrap.querySelector('.role-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'role-badge';
                badge.style.cssText = 'position:absolute;bottom:-2px;right:-2px;width:12px;height:12px;border:2px solid #fff;border-radius:50%;';
                avatarWrap.appendChild(badge);
            }
            badge.style.backgroundColor = (role === 'admin') ? '#ef4444' : (role === 'partner') ? '#10b981' : '#3b82f6';
        }
    };

    // Render admin table on load
    renderAdminTable();

    // --- Original UI Toggles (Adjusted to showView) ---
    function showProfile() {
        if (!isLoggedIn) { openModal(loginModal); return; }
        showView('profile-view');
        renderProfileData();
    }
    window.showProfile = showProfile;

    function showHome() {
        showView('home-view');
        document.body.classList.add('is-home');
    }
    window.showHome = showHome;

    function showExplore() {
        showView('explore-view');
    }
    window.showExplore = showExplore;



    // --- Review Modal Stepper & Stars ---
    const rmNextBtn = document.querySelector('.next-step-btn');
    const rmPrevBtn = document.querySelector('.prev-step-btn');
    const rmStep1 = document.querySelector('.review-step-1');
    const rmStep2 = document.querySelector('.review-step-2');

    if (rmNextBtn) {
        rmNextBtn.onclick = () => {
            if (rmStep1 && rmStep2) {
                rmStep1.classList.remove('active'); rmStep1.style.display = 'none';
                rmStep2.classList.add('active'); rmStep2.style.display = 'block';
            }
        };
    }
    if (rmPrevBtn) {
        rmPrevBtn.onclick = () => {
            if (rmStep1 && rmStep2) {
                rmStep2.classList.remove('active'); rmStep2.style.display = 'none';
                rmStep1.classList.add('active'); rmStep1.style.display = 'block';
            }
        };
    }

    const starUnits = document.querySelectorAll('.star-unit');
    starUnits.forEach(star => {
        star.addEventListener('click', () => {
            const row = star.closest('.rr-stars');
            const val = parseInt(star.dataset.val);
            row.querySelectorAll('.star-unit').forEach(s => {
                if (parseInt(s.dataset.val) <= val) s.classList.add('active');
                else s.classList.remove('active');
            });
            updateCalculatedScore();
        });
    });

    function updateCalculatedScore() {
        const rows = document.querySelectorAll('.rr-stars');
        let total = 0, count = 0;
        rows.forEach(row => {
            const active = row.querySelectorAll('.star-unit.active');
            if (active.length > 0) { total += active.length; count++; }
        });
        const avg = count > 0 ? (total / count).toFixed(1) : '0.0';
        const scoreDisplay = document.getElementById('rm-calc-score');
        if (scoreDisplay) scoreDisplay.innerText = avg;
    }

    function resetReviewModal() {
        if (!rmStep1 || !rmStep2) return;
        rmStep1.classList.add('active'); rmStep1.style.display = 'block';
        rmStep2.classList.remove('active'); rmStep2.style.display = 'none';
        starUnits.forEach(s => s.classList.remove('active'));
        updateCalculatedScore();
        const sentimentDefault = document.querySelector('input[name="sentiment"][value="3"]');
        if (sentimentDefault) sentimentDefault.checked = true;
        if (reviewForm) { const ta = reviewForm.querySelector('textarea'); if (ta) ta.value = ''; }
    }

    // Sentiment Emoji
    document.querySelectorAll('input[name="sentiment"]').forEach(input => {
        input.addEventListener('change', () => showToast('Hissiyatınız kaydedildi.'));
    });

    // Review submit
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Değerlendirmeniz başarıyla yayınlandı!');
            closeModal(reviewModal);
        });
    }

    // Extend openModal for resets
    const originalOpenModal = openModal;
    window.openModal = function(modal) {
        if (modal && modal.id === 'review-modal') resetReviewModal();
        originalOpenModal(modal);
    };

    // Auth Tab Indicator
    function updateAuthIndicator(tab) {
        const parent = tab.closest('.auth-tabs');
        if (!parent) return;
        const indicator = parent.querySelector('.auth-tab-indicator');
        if (indicator) {
            indicator.style.width = `${tab.offsetWidth}px`;
            indicator.style.left = `${tab.offsetLeft}px`;
        }
    }
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => updateAuthIndicator(tab));
    });
    // --- Initialize Everything ---
    initAuthTabs();
    initReviewCarousel();
    initFilterListeners();
    initDynamicBanner();
    initializeApp();
    renderAdminTable();
    showHome();
}
});
