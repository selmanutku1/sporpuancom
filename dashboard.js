/* dashboard.js - Interactions and data logic for Sporpuan Management Dashboard */

document.addEventListener('DOMContentLoaded', async () => {

    const tabs = document.querySelectorAll('.ds-nav-item');
    const pageTitle = document.getElementById('page-title');
    const views = {
        'overview': document.getElementById('content-overview'),
        'users': document.getElementById('content-users')
    };

    // Tab Navigation
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const target = tab.getAttribute('data-tab');
            if (views[target]) {
                Object.values(views).forEach(v => { if(v) v.style.display = 'none'; });
                views[target].style.display = 'flex';
                pageTitle.textContent = tab.textContent.trim();
            }
        });
    });

    // Fetch and populate overview stats
    async function loadStats() {
        try {
            const res = await fetch('http://localhost:8001/api/admin/stats');
            const data = await res.json();
            document.getElementById('stat-users').textContent = data.totalUsers || 24;
            document.getElementById('stat-facilities').textContent = 482; // Example
            document.getElementById('stat-reviews').textContent = 2150; // Example
            document.getElementById('stat-complaints').textContent = data.commentComplaints || 0;
            document.getElementById('pending-comments-badge').textContent = data.pendingComments || 6;
        } catch (e) {
            console.error("Failed to load stats", e);
        }
    }

    // Load recent facilities list
    async function loadRecentFacilities() {
        const tbody = document.getElementById('table-recent-facilities');
        const list = [
            { name: "Bursa Spor Merkezi", city: "Bursa", status: "Aktif" },
            { name: "Kadıköy Basketbol", city: "İstanbul", status: "Aktif" },
            { name: "İzmir Tenis Akademisi", city: "İzmir", status: "Beklemede" }
        ];

        tbody.innerHTML = list.map(f => `
            <tr>
                <td><strong>${f.name}</strong></td>
                <td>${f.city}</td>
                <td><span class="status-badge ${f.status === 'Aktif' ? 'active' : 'pending'}">${f.status}</span></td>
            </tr>
        `).join('');
    }

    // Load recent reviews
    async function loadRecentReviews() {
        const tbody = document.getElementById('table-recent-reviews');
        const list = [
            { user: "Ahmet Y.", content: "Çok temiz ve güvenilir bir salon.", action: "Onaylı" },
            { user: "Selin K.", content: "Eğitmenler ilgisiz.", action: "Beklemede" }
        ];

        tbody.innerHTML = list.map(r => `
            <tr>
                <td><div class="flex-center"><div class="avatar" style="width:28px;height:28px;background:#e2e8f0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;">${r.user[0]}</div> <strong>${r.user}</strong></div></td>
                <td><div style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${r.content}</div></td>
                <td>
                    <button class="btn-icon" title="Onayla"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                    <button class="btn-icon danger" title="Reddet"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>
                </td>
            </tr>
        `).join('');
    }

    // Load All Users
    async function loadAllUsers() {
        try {
            const res = await fetch('http://localhost:8001/api/admin/users');
            const users = await res.json();
            const tbody = document.getElementById('table-all-users');
            
            tbody.innerHTML = users.map(u => `
                <tr>
                    <td>
                        <div class="flex-col">
                            <strong>${u.name}</strong>
                            <span class="small-lbl">ID: #${u.id}</span>
                        </div>
                    </td>
                    <td>${u.email}</td>
                    <td><span class="status-badge ${u.role === 'Admin' ? 'admin' : 'user'}">${u.role}</span></td>
                    <td>${u.regDate || '16.02.2026'}</td>
                    <td>
                        <button class="btn-icon" title="Düzenle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                        <button class="btn-icon danger" title="Sil" onclick="deleteUser('${u.id}')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    </td>
                </tr>
            `).join('');

        } catch (e) {
            console.error(e);
        }
    }

    window.deleteUser = async (id) => {
        if(confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) {
            await fetch(`http://localhost:8001/api/admin/delete-user/${id}`, { method: 'DELETE' });
            loadAllUsers();
            loadStats();
        }
    };

    // Initialize View Data
    loadStats();
    loadRecentFacilities();
    loadRecentReviews();
    loadAllUsers();
});
