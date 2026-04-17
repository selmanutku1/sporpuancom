/* dashboard.js – Sporpuan Admin Panel – Fully Active */

document.addEventListener('DOMContentLoaded', async () => {

    // ─── CSS inject for content-type buttons & notification items ───────────
    const style = document.createElement('style');
    style.textContent = `
        .content-type-btn { flex:1; padding:0.6rem 0.4rem; border:2px solid #e2e8f0; border-radius:10px; background:#fff; cursor:pointer; font-weight:600; font-size:0.85rem; font-family:inherit; transition:.15s; }
        .content-type-btn.active, .content-type-btn:hover { border-color:#0f172a; background:#0f172a; color:#fff; }
        .notif-item { display:flex; gap:0.75rem; padding:1rem 1.5rem; border-bottom:1px solid #f8fafc; align-items:flex-start; cursor:pointer; transition:.15s; }
        .notif-item:hover { background:#f8fafc; }
        .notif-item.unread { background:#eff6ff; }
        .notif-dot { width:8px; height:8px; border-radius:50%; background:#3b82f6; flex-shrink:0; margin-top:6px; }
        .notif-item.read .notif-dot { background:#e2e8f0; }
        .notif-body strong { font-size:0.85rem; color:#0f172a; display:block; }
        .notif-body span { font-size:0.78rem; color:#64748b; }
        .toast-dash { position:fixed; bottom:2rem; right:2rem; background:#0f172a; color:#fff; padding:0.9rem 1.5rem; border-radius:12px; font-size:0.9rem; font-weight:600; z-index:2000; box-shadow:0 10px 30px rgba(0,0,0,.2); animation:fadeInUp .3s ease; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .badge.danger { background:#fef2f2; color:#dc2626; }
    `;
    document.head.appendChild(style);

    // ─── Notifications Data ────────────────────────────────────────────────
    let notifications = [
        { id: 1, title: 'Yeni Yorum Bekliyor', body: 'Ahmet Y. Bursa Spor Merkezi için yorum bıraktı.', read: false, time: '5 dk önce' },
        { id: 2, title: 'Yeni Kullanıcı Kaydı', body: 'Selin K. platforma kayıt oldu.', read: false, time: '23 dk önce' },
        { id: 3, title: 'Şikayet Raporu', body: 'İzmir Tenis Akademisi hakkında şikayet iletildi.', read: false, time: '1 sa önce' },
        { id: 4, title: 'Tesis Güncellendi', body: 'Ankara Olimpik Havuzu bilgileri güncellendi.', read: true, time: 'Dün' },
    ];

    function renderNotifications(target) {
        const list = notifications.map(n => `
            <div class="notif-item ${n.read ? 'read' : 'unread'}" onclick="readNotif(${n.id})">
                <div class="notif-dot"></div>
                <div class="notif-body">
                    <strong>${n.title}</strong>
                    <span>${n.body}</span>
                    <span style="color:#94a3b8; font-size:0.72rem; margin-top:2px; display:block;">${n.time}</span>
                </div>
            </div>
        `).join('');
        const el = document.getElementById(target);
        if (el) el.innerHTML = list || '<div style="padding:2rem; text-align:center; color:#94a3b8;">Bildirim yok</div>';
    }

    renderNotifications('notif-list');
    renderNotifications('notif-tab-list');

    function updateNotifBadge() {
        const unread = notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notif-badge');
        const indicator = document.getElementById('notif-indicator');
        if (badge) badge.textContent = unread;
        if (indicator) indicator.style.display = unread > 0 ? 'block' : 'none';
    }
    updateNotifBadge();

    window.readNotif = (id) => {
        const n = notifications.find(x => x.id === id);
        if (n) n.read = true;
        renderNotifications('notif-list');
        renderNotifications('notif-tab-list');
        updateNotifBadge();
    };

    window.markAllRead = () => {
        notifications.forEach(n => n.read = true);
        renderNotifications('notif-list');
        renderNotifications('notif-tab-list');
        updateNotifBadge();
        showToast('Tüm bildirimler okundu olarak işaretlendi.');
    };

    window.toggleNotifPanel = () => {
        const panel = document.getElementById('notif-panel');
        const overlay = document.getElementById('notif-overlay');
        const isVisible = panel.style.display === 'block';
        panel.style.display = isVisible ? 'none' : 'block';
        overlay.style.display = isVisible ? 'none' : 'block';
    };

    window.closeNotifPanel = () => {
        document.getElementById('notif-panel').style.display = 'none';
        document.getElementById('notif-overlay').style.display = 'none';
    };

    // ─── Add Content Modal ─────────────────────────────────────────────────
    let selectedContentType = 'facility';

    window.openContentModal = () => {
        const overlay = document.getElementById('content-modal-overlay');
        overlay.style.display = 'flex';
        document.getElementById('nc-name').value = '';
        document.getElementById('nc-desc').value = '';
    };

    window.closeContentModal = () => {
        document.getElementById('content-modal-overlay').style.display = 'none';
    };

    window.selectContentType = (btn) => {
        document.querySelectorAll('.content-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedContentType = btn.getAttribute('data-type');

        // Show / hide correct form section
        document.getElementById('fields-facility').style.display = selectedContentType === 'facility' ? 'block' : 'none';
        document.getElementById('fields-brand').style.display = selectedContentType === 'brand' ? 'block' : 'none';
        document.getElementById('fields-event').style.display = selectedContentType === 'event' ? 'block' : 'none';

        // Update modal title
        const titles = { facility: '🏢 Yeni Tesis Ekle', brand: '🏷️ Yeni Marka Ekle', event: '📅 Yeni Etkinlik Ekle' };
        document.getElementById('modal-main-title').textContent = titles[selectedContentType] || 'Yeni İçerik Ekle';
    };

    window.submitNewContent = (e) => {
        e.preventDefault();
        let newItem, name, notifBody;

        if (selectedContentType === 'facility') {
            name = document.getElementById('f-name').value;
            const city = document.getElementById('f-city').value;
            const category = document.getElementById('f-category').value;
            const address = document.getElementById('f-address').value;
            const phone = document.getElementById('f-phone').value;
            const website = document.getElementById('f-website').value;
            const openT = document.getElementById('f-open').value;
            const closeT = document.getElementById('f-close').value;
            const desc = document.getElementById('f-desc').value;
            const owner = document.getElementById('f-owner').value || 'Admin';
            const score = document.getElementById('f-score').value;
            newItem = { name, city, category, address, phone, website, hours: `${openT}–${closeT}`, desc, owner, rating: score, status: 'Beklemede' };
            notifBody = `${name} (${category}, ${city}) tesisi sisteme eklendi.`;
            mockFacilities.unshift(newItem);
            loadAllFacilitiesFromMock();
            loadRecentFacilities();

        } else if (selectedContentType === 'brand') {
            name = document.getElementById('b-name').value;
            const type = document.getElementById('b-type').value;
            const country = document.getElementById('b-country').value;
            const website = document.getElementById('b-website').value;
            const email = document.getElementById('b-email').value;
            const instagram = document.getElementById('b-instagram').value;
            const desc = document.getElementById('b-desc').value;
            const score = document.getElementById('b-score').value;
            const isPartner = document.getElementById('b-partner').value === '1';
            newItem = { name, category: type, city: country || 'Türkiye', website, email, instagram, desc, owner: 'Marka', rating: score, status: isPartner ? 'Aktif' : 'Beklemede' };
            notifBody = `${name} (${type}) markası sisteme eklendi.`;
            mockFacilities.unshift(newItem);
            loadAllFacilitiesFromMock();

        } else if (selectedContentType === 'event') {
            name = document.getElementById('e-name').value;
            const type = document.getElementById('e-type').value;
            const city = document.getElementById('e-city').value;
            const date = document.getElementById('e-date').value;
            const time = document.getElementById('e-time').value;
            const location = document.getElementById('e-location').value;
            const capacity = document.getElementById('e-capacity').value;
            const price = document.getElementById('e-price').value;
            const organizer = document.getElementById('e-organizer').value;
            const desc = document.getElementById('e-desc').value;
            newItem = { name, category: type, city, address: `${location} – ${date} ${time}`, owner: organizer || 'Admin', rating: '8.0', status: 'Beklemede', price, capacity, desc };
            notifBody = `${name} (${type}, ${city}) etkinliği ${date} tarihli olarak eklendi.`;
            mockFacilities.unshift(newItem);
            loadAllFacilitiesFromMock();
        }

        document.getElementById('content-modal-overlay').style.display = 'none';
        showToast(`"${name}" başarıyla sisteme eklendi!`);

        notifications.unshift({ id: Date.now(), title: 'Yeni İçerik Eklendi', body: notifBody, read: false, time: 'Az önce' });
        renderNotifications('notif-list');
        renderNotifications('notif-tab-list');
        updateNotifBadge();
    };

    // ─── Edit Modal ────────────────────────────────────────────────────────
    window.openEditModal = (index) => {
        const f = mockFacilities[index];
        if (!f) return;
        document.getElementById('edit-index').value = index;
        document.getElementById('edit-name').value = f.name || '';
        const catSel = document.getElementById('edit-category');
        [...catSel.options].forEach(o => o.selected = o.value === f.category);
        const citySel = document.getElementById('edit-city');
        [...citySel.options].forEach(o => o.selected = o.value === f.city);
        document.getElementById('edit-score').value = f.rating || 7.5;
        const statusSel = document.getElementById('edit-status');
        [...statusSel.options].forEach(o => o.selected = o.value === f.status);
        document.getElementById('edit-modal-overlay').style.display = 'flex';
    };

    window.closeEditModal = () => {
        document.getElementById('edit-modal-overlay').style.display = 'none';
    };

    window.submitEditContent = (e) => {
        e.preventDefault();
        const idx = parseInt(document.getElementById('edit-index').value);
        if (isNaN(idx) || !mockFacilities[idx]) return;
        mockFacilities[idx].name = document.getElementById('edit-name').value;
        mockFacilities[idx].category = document.getElementById('edit-category').value;
        mockFacilities[idx].city = document.getElementById('edit-city').value;
        mockFacilities[idx].rating = document.getElementById('edit-score').value;
        mockFacilities[idx].status = document.getElementById('edit-status').value;
        loadAllFacilitiesFromMock();
        loadRecentFacilities();
        document.getElementById('edit-modal-overlay').style.display = 'none';
        showToast(`"${mockFacilities[idx].name}" güncellendi!`);
    };


    // ─── Global Search ─────────────────────────────────────────────────────
    window.doGlobalSearch = (query) => {
        if (!query.trim()) return;
        switchTab('users');
        setTimeout(() => {
            document.getElementById('user-search').value = query;
            filterUserTable(query);
        }, 100);
    };

    // ─── Toast helper ──────────────────────────────────────────────────────
    function showToast(msg) {
        const existing = document.querySelector('.toast-dash');
        if (existing) existing.remove();
        const t = document.createElement('div');
        t.className = 'toast-dash';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3200);
    }

    // ─── Settings Save ─────────────────────────────────────────────────────
    window.saveSettings = () => {
        const siteName = document.getElementById('setting-site-name')?.value || 'Sporpuan';
        const autoPending = document.getElementById('setting-auto-pending')?.checked;
        const emailNotif = document.getElementById('setting-email-notif')?.checked;
        const qrActive = document.getElementById('setting-qr-active')?.checked;
        const facPts = document.getElementById('setting-facility-pts')?.value;
        const evtPts = document.getElementById('setting-event-pts')?.value;

        localStorage.setItem('sporpuan_settings', JSON.stringify({ siteName, autoPending, emailNotif, qrActive, facPts, evtPts }));
        showToast('Sistem ayarları kaydedildi! ✓');
    };

    // On load, restore settings
    const saved = JSON.parse(localStorage.getItem('sporpuan_settings') || '{}');
    if (saved.siteName && document.getElementById('setting-site-name')) document.getElementById('setting-site-name').value = saved.siteName;

    // ─── Tab Navigation ────────────────────────────────────────────────────
    const tabTitles = {
        overview: 'Genel Bakış', users: 'Kullanıcılar', facilities: 'Tesisler & Markalar',
        reviews: 'Yorumlar', notifications: 'Bildirimler', settings: 'Sistem Ayarları'
    };

    const allViewIds = ['content-overview', 'content-users', 'content-facilities', 'content-reviews', 'content-notifications', 'content-settings'];
    const pageTitle = document.getElementById('page-title');
    const tabs = document.querySelectorAll('.ds-nav-item');

    window.switchTab = (tabName) => {
        tabs.forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`.ds-nav-item[data-tab="${tabName}"]`);
        if (activeTab) activeTab.classList.add('active');

        allViewIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        const target = document.getElementById(`content-${tabName}`);
        if (target) target.style.display = 'flex';
        if (pageTitle) pageTitle.textContent = tabTitles[tabName] || tabName;
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.getAttribute('data-tab'));
        });
    });

    // ─── Sidebar Toggle ────────────────────────────────────────────────────
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.dash-sidebar');
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }

    // ─── Stats Load ────────────────────────────────────────────────────────
    async function loadStats() {
        try {
            const res = await fetch('http://localhost:8001/api/admin/stats');
            const data = await res.json();
            document.getElementById('stat-users').textContent = data.totalUsers || 1;
            document.getElementById('stat-reviews').textContent = data.totalReviews || 6;
            document.getElementById('stat-complaints').textContent = data.commentComplaints || 0;
            document.getElementById('pending-comments-badge').textContent = data.pendingComments || 2;

            // QR points - sum from users
            const usersRes = await fetch('http://localhost:8001/api/admin/users');
            const users = await usersRes.json();
            const totalPts = users.reduce((s, u) => s + (u.points || 0), 0);
            document.getElementById('stat-facilities').textContent = 6;
            document.getElementById('stat-qr-points') && (document.getElementById('stat-qr-points').textContent = totalPts);
        } catch (e) {
            document.getElementById('stat-users').textContent = 1;
            document.getElementById('stat-facilities').textContent = 6;
            document.getElementById('stat-reviews').textContent = 6;
            document.getElementById('stat-complaints').textContent = 0;
            if (document.getElementById('stat-qr-points')) document.getElementById('stat-qr-points').textContent = 60;
        }
    }

    // ─── Recent Facilities ─────────────────────────────────────────────────
    const mockFacilities = [
        { name: 'Bursa Spor Merkezi', city: 'Bursa', status: 'Aktif', category: 'Spor Salonu', owner: 'Admin', rating: '8.5' },
        { name: 'Kadıköy Basketbol', city: 'İstanbul', status: 'Aktif', category: 'Açık Saha', owner: 'Admin', rating: '7.8' },
        { name: 'İzmir Tenis Akademisi', city: 'İzmir', status: 'Beklemede', category: 'Tenis Kortu', owner: 'Partner', rating: '8.8' },
        { name: 'Ankara Olimpik Havuzu', city: 'Ankara', status: 'Aktif', category: 'Yüzme Havuzu', owner: 'Admin', rating: '9.2' },
        { name: 'Antalya Outdoor Yaşam', city: 'Antalya', status: 'Aktif', category: 'Outdoor', owner: 'Partner', rating: '9.0' },
        { name: 'Trabzon Fitness Center', city: 'Trabzon', status: 'Aktif', category: 'Fitness', owner: 'Partner', rating: '8.1' },
    ];

    function loadRecentFacilities() {
        const tbody = document.getElementById('table-recent-facilities');
        if (!tbody) return;
        tbody.innerHTML = mockFacilities.slice(0, 4).map(f => `
            <tr>
                <td><strong>${f.name}</strong></td>
                <td>${f.city}</td>
                <td><span class="status-badge ${f.status === 'Aktif' ? 'active' : 'pending'}">${f.status}</span></td>
            </tr>
        `).join('');
    }

    // ─── Recent Reviews (Overview) ─────────────────────────────────────────
    const mockReviews = [
        { user: 'Ahmet Y.', content: 'Çok temiz ve güvenilir bir salon.', facility: 'Bursa Spor Merkezi', status: 'Beklemede', date: '17.04.2026' },
        { user: 'Selin K.', content: 'Eğitmenler ilgisiz galiba.', facility: 'İzmir Tenis Akademisi', status: 'Beklemede', date: '17.04.2026' },
        { user: 'Can T.', content: 'Harika bir deneyimdi, kesinlikle tavsiye ederim!', facility: 'Ankara Olimpik Havuzu', status: 'Onaylı', date: '16.04.2026' },
        { user: 'Mert K.', content: 'Fiyat kalite dengesi mükemmel.', facility: 'Trabzon Fitness', status: 'Onaylı', date: '15.04.2026' },
        { user: 'Leyla K.', content: 'Parkur çok iyi düzenlenmiş.', facility: 'Antalya Outdoor', status: 'Beklemede', date: '15.04.2026' },
    ];

    function reviewActionBtns(index) {
        return `
            <button class="btn-icon" title="Onayla" onclick="approveReview(${index})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
            <button class="btn-icon danger" title="Reddet" onclick="rejectReview(${index})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
        `;
    }

    window.approveReview = (i) => {
        mockReviews[i].status = 'Onaylı';
        loadRecentReviews();
        loadAllReviews();
        loadStats();
        showToast(`${mockReviews[i].user} yorumu onaylandı!`);
    };
    window.rejectReview = (i) => {
        mockReviews[i].status = 'Reddedildi';
        loadRecentReviews();
        loadAllReviews();
        showToast(`${mockReviews[i].user} yorumu reddedildi.`);
    };

    function loadRecentReviews() {
        const tbody = document.getElementById('table-recent-reviews');
        if (!tbody) return;
        tbody.innerHTML = mockReviews.slice(0, 3).map((r, i) => `
            <tr>
                <td><div class="flex-center"><div class="avatar" style="width:28px;height:28px;background:#e2e8f0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;">${r.user[0]}</div>&nbsp;<strong>${r.user}</strong></div></td>
                <td><div style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${r.content}</div></td>
                <td>${reviewActionBtns(i)}</td>
            </tr>
        `).join('');
    }

    // ─── All Users tab ─────────────────────────────────────────────────────
    let allUsers = [];

    async function loadAllUsers() {
        try {
            const res = await fetch('http://localhost:8001/api/admin/users');
            allUsers = await res.json();
        } catch {
            allUsers = [{ id: 1, name: 'Selman Utku', email: 'selmanutkumarmara@gmail.com', role: 'Admin', points: 0, regDate: '01.01.2026' }];
        }
        renderUserTable(allUsers);
    }

    function renderUserTable(data) {
        const tbody = document.getElementById('table-all-users');
        if (!tbody) return;
        tbody.innerHTML = data.map(u => `
            <tr>
                <td><div class="flex-col"><strong>${u.name}</strong><span class="small-lbl">ID: #${u.id}</span></div></td>
                <td>${u.email}</td>
                <td><span class="status-badge ${u.role === 'Admin' ? 'admin' : 'user'}">${u.role}</span></td>
                <td><strong style="color:#10b981;">${u.points || 0} 🏅</strong></td>
                <td>${u.regDate || '16.02.2026'}</td>
                <td>
                    <button class="btn-icon" title="Düzenle" onclick="showToast('Kullanıcı düzenleme yakında!')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon danger" title="Sil" onclick="deleteUser('${u.id}')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    window.filterUserTable = (query) => {
        const role = document.getElementById('user-role-filter')?.value || '';
        const q = (query || '').toLowerCase();
        const filtered = allUsers.filter(u =>
            (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
            (!role || u.role === role)
        );
        renderUserTable(filtered);
    };

    window.deleteUser = async (id) => {
        if (!confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) return;
        try {
            await fetch(`http://localhost:8001/api/admin/delete-user/${id}`, { method: 'DELETE' });
        } catch { /* offline */ }
        allUsers = allUsers.filter(u => String(u.id) !== String(id));
        renderUserTable(allUsers);
        loadStats();
        showToast('Kullanıcı silindi.');
    };

    // ─── All Facilities tab ────────────────────────────────────────────────
    function loadAllFacilitiesFromMock() {
        const tbody = document.getElementById('table-all-facilities');
        if (!tbody) return;
        tbody.innerHTML = mockFacilities.map((f, i) => `
            <tr>
                <td><div class="flex-col"><strong>${f.name}</strong><span class="small-lbl">Sahibi: ${f.owner}</span></div></td>
                <td>${f.category}</td>
                <td>${f.city}</td>
                <td><strong>⭐ ${parseFloat(f.rating).toFixed(1)}</strong></td>
                <td><span class="status-badge ${f.status === 'Aktif' ? 'active' : 'pending'}">${f.status}</span></td>
                <td>
                    <button class="btn-icon" title="Düzenle" onclick="openEditModal(${i})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon danger" title="Kaldır" onclick="removeFacility(${i})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    window.removeFacility = (i) => {
        if (!confirm(`"${mockFacilities[i].name}" tesisini kaldırmak istediğinize emin misiniz?`)) return;
        const name = mockFacilities[i].name;
        mockFacilities.splice(i, 1);
        loadAllFacilitiesFromMock();
        loadRecentFacilities();
        showToast(`"${name}" kaldırıldı.`);
    };

    window.filterFacilityTable = (query) => {
        const q = (query || '').toLowerCase();
        const tbody = document.getElementById('table-all-facilities');
        if (!tbody) return;
        const filtered = mockFacilities.filter(f =>
            f.name.toLowerCase().includes(q) || f.city.toLowerCase().includes(q)
        );
        loadAllFacilitiesFromMock();
        // Re-render with filtered
        tbody.innerHTML = filtered.map((f, i) => `
            <tr>
                <td><div class="flex-col"><strong>${f.name}</strong><span class="small-lbl">Sahibi: ${f.owner}</span></div></td>
                <td>${f.category}</td>
                <td>${f.city}</td>
                <td><strong>⭐ ${parseFloat(f.rating).toFixed(1)}</strong></td>
                <td><span class="status-badge ${f.status === 'Aktif' ? 'active' : 'pending'}">${f.status}</span></td>
                <td>
                    <button class="btn-icon" title="Düzenle" onclick="showToast('Düzenleme yakında!')">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon danger" title="Kaldır" onclick="removeFacility(${i})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    };

    // ─── All Reviews tab ───────────────────────────────────────────────────
    function loadAllReviews(statusFilter = '') {
        const tbody = document.getElementById('table-all-reviews');
        if (!tbody) return;
        const data = statusFilter ? mockReviews.filter(r => r.status === statusFilter) : mockReviews;
        tbody.innerHTML = data.map((r, i) => `
            <tr>
                <td class="small-lbl">${r.date}</td>
                <td><strong>${r.user}</strong></td>
                <td>${r.facility}</td>
                <td><div style="max-width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${r.content}">${r.content}</div></td>
                <td><span class="status-badge ${r.status === 'Onaylı' ? 'active' : r.status === 'Reddedildi' ? 'admin' : 'pending'}">${r.status}</span></td>
                <td>${reviewActionBtns(i)}</td>
            </tr>
        `).join('');
    }

    window.filterReviewTable = (status) => loadAllReviews(status);

    // ─── showToast global ──────────────────────────────────────────────────
    window.showToast = showToast;

    // ─── Initialize ────────────────────────────────────────────────────────
    loadStats();
    loadRecentFacilities();
    loadRecentReviews();
    loadAllUsers();
    loadAllFacilitiesFromMock();
    loadAllReviews();
});
