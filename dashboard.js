/* dashboard.js – Sporpuan Admin Panel – Integrated Version */

window.initDashboardLogic = async () => {
    console.log("Initializing Dashboard Logic...");

    // --- Sidebar & Mobile Toggle Refs ---
    const sidebar = document.querySelector('.dash-sidebar');
    const mobileSidebarBtn = document.getElementById('mobile-sidebar-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    if (mobileSidebarBtn && sidebar) {
        mobileSidebarBtn.onclick = () => sidebar.classList.toggle('mobile-open');
    }
    if (sidebarToggle && sidebar) {
        sidebarToggle.onclick = () => sidebar.classList.toggle('collapsed');
    }

    // Close sidebar on nav click (mobile)
    document.querySelectorAll('.ds-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 1024 && sidebar) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });

    // --- State & Initialization ---
    if (!window.mockFacilities) {
        window.mockFacilities = [
            { _type: 'facility', name: 'Bursa Spor Merkezi', city: 'Bursa', status: 'Aktif', category: 'Spor Salonu', owner: 'Admin', rating: '8.5' },
            { _type: 'facility', name: 'Kadıköy Basketbol', city: 'İstanbul', status: 'Aktif', category: 'Açık Saha', owner: 'Admin', rating: '7.8' },
            { _type: 'facility', name: 'İzmir Tenis Akademisi', city: 'İzmir', status: 'Beklemede', category: 'Tenis Kortu', owner: 'Partner', rating: '8.8' },
            { _type: 'brand', name: 'Nike Türkiye', city: 'İstanbul', status: 'Aktif', category: 'Spor Giyim', owner: 'Marka', rating: '9.5' }
        ];
    }

    if (!window.allUsers) {
        window.allUsers = [
            { id: 1, name: 'Selman Utku', email: 'selmanutkumarmara@gmail.com', role: 'Admin', points: 250, regDate: '01.01.2026' }
        ];
    }

    // Load initial data
    loadStats();
    loadRecentFacilities();
    loadAllFacilitiesFromMock();
};

// --- GLOBAL HANDLERS (Bridged to window) ---

window.openContentModal = () => {
    const form = document.getElementById('add-content-form');
    if (form) form.reset();
    const overlay = document.getElementById('content-modal-overlay');
    if (overlay) overlay.style.display = 'flex';
};

window.closeContentModal = () => {
    const overlay = document.getElementById('content-modal-overlay');
    if (overlay) overlay.style.display = 'none';
};

let selectedContentType = 'facility';
window.selectContentType = (btn) => {
    document.querySelectorAll('.content-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedContentType = btn.getAttribute('data-type');

    document.getElementById('fields-facility').style.display = selectedContentType === 'facility' ? 'block' : 'none';
    document.getElementById('fields-brand').style.display = selectedContentType === 'brand' ? 'block' : 'none';
    document.getElementById('fields-event').style.display = selectedContentType === 'event' ? 'block' : 'none';
};

window.submitNewContent = (e) => {
    e.preventDefault();
    const nameInput = selectedContentType === 'facility' ? 'f-name' : (selectedContentType === 'brand' ? 'b-name' : 'e-name');
    const name = document.getElementById(nameInput).value;
    
    if (selectedContentType === 'facility') {
        const city = document.getElementById('f-city').value;
        const category = document.getElementById('f-category').value;
        window.mockFacilities.unshift({ _type: 'facility', name, city, category, status: 'Beklemede', owner: 'Admin', rating: '7.5' });
    }

    window.closeContentModal();
    if (typeof window.showToast === 'function') window.showToast(`"${name}" eklendi!`);
    loadAllFacilitiesFromMock();
    loadRecentFacilities();
};

window.openEditModal = (index) => {
    const f = window.mockFacilities[index];
    if (!f) return;
    document.getElementById('edit-index').value = index;
    document.getElementById('edit-name').value = f.name;
    document.getElementById('edit-category').value = f.category || '';
    document.getElementById('edit-city').value = f.city || '';
    document.getElementById('edit-modal-overlay').style.display = 'flex';
};

window.closeEditModal = () => {
    document.getElementById('edit-modal-overlay').style.display = 'none';
};

window.submitEditContent = (e) => {
    e.preventDefault();
    const idx = document.getElementById('edit-index').value;
    const f = window.mockFacilities[idx];
    if (f) {
        f.name = document.getElementById('edit-name').value;
        f.category = document.getElementById('edit-category').value;
        f.city = document.getElementById('edit-city').value;
    }
    window.closeEditModal();
    loadAllFacilitiesFromMock();
    if (typeof window.showToast === 'function') window.showToast("Değişiklikler kaydedildi.");
};

// --- DATA RENDERS ---

function loadRecentFacilities() {
    const tbody = document.getElementById('table-recent-facilities');
    if (!tbody || !window.mockFacilities) return;
    tbody.innerHTML = window.mockFacilities.slice(0, 4).map(f => `
        <tr>
            <td><strong>${f.name}</strong></td>
            <td>${f.city}</td>
            <td><span class="status-badge ${f.status === 'Aktif' ? 'active' : 'pending'}">${f.status}</span></td>
        </tr>
    `).join('');
}

function loadAllFacilitiesFromMock() {
    const tbody = document.getElementById('table-all-facilities');
    if (!tbody || !window.mockFacilities) return;
    tbody.innerHTML = window.mockFacilities.map((f, i) => `
        <tr>
            <td><strong>${f.name}</strong></td>
            <td>${f.category}</td>
            <td>${f.city}</td>
            <td><span class="status-badge ${f.status === 'Aktif' ? 'active' : 'pending'}">${f.status}</span></td>
            <td>
                <button class="btn-icon" onclick="openEditModal(${i})">✏️</button>
            </td>
        </tr>
    `).join('');
}

async function loadStats() {
    const sUsers = document.getElementById('stat-users');
    if (sUsers) sUsers.textContent = window.allUsers?.length || '0';
    const sFacs = document.getElementById('stat-facilities');
    if (sFacs) sFacs.textContent = window.mockFacilities?.length || '0';
}

// Auto-init if DOM is ready (fallback)
if (document.readyState === 'complete') window.initDashboardLogic();
else window.addEventListener('load', window.initDashboardLogic);
