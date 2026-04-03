const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000; // Changed back to 3000 or a common non-privileged port
console.log(`DEBUG: Sunucu portu set edildi: ${PORT}`);

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
};

const DB_FILE = path.join(__dirname, 'users.json');
const PARTNER_DB_FILE = path.join(__dirname, 'partners.json');

function getUsers() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

function getPartners() {
    try {
        return JSON.parse(fs.readFileSync(PARTNER_DB_FILE, 'utf-8'));
    } catch (e) {
        return [];
    }
}

function savePartners(partners) {
    fs.writeFileSync(PARTNER_DB_FILE, JSON.stringify(partners, null, 2));
}

const server = http.createServer((req, res) => {
    console.log(`DEBUG: Gelen istek (Request): ${req.method} ${req.url}`);
    // Enable CORS for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, api_key');

    // Handle Preflight OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 1. Auth API Endpoints (Users)
    if (req.url === '/api/auth/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { name, email, password } = JSON.parse(body);
            const users = getUsers();
            
            if (users.find(u => u.email === email)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Bu e-posta adresi zaten kayıtlı.' }));
            }
            
            const newUser = { id: Date.now(), name, email, password };
            users.push(newUser);
            saveUsers(users);
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Kayıt başarılı', user: { name: newUser.name, email: newUser.email } }));
        });
        return;
    }

    if (req.url === '/api/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { email, password } = JSON.parse(body);
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'E-posta veya şifre hatalı.' }));
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Giriş başarılı', user: { name: user.name, email: user.email } }));
        });
        return;
    }

    if (req.url.startsWith('/api/facilities/') && req.url.endsWith('/reviews') && req.method === 'POST') {
        const facilityId = req.url.split('/')[3];
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const reviewData = JSON.parse(body);
            console.log(`Review received for facility ${facilityId}:`, reviewData);
            
            // In a real app, we'd update a facilities.json. For this MVP, we'll return success.
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                message: 'Yorumunuz başarıyla iletildi. Kontrol edildikten sonra yayına alınacaktır.',
                review: reviewData 
            }));
        });
        return;
    }

    // 2. Partner API Endpoints
    if (req.url === '/api/partner/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { company, email, password } = JSON.parse(body);
            const partners = getPartners();
            
            if (partners.find(p => p.email === email)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Bu kurumsal e-posta adresi zaten kayıtlı.' }));
            }
            
            const newPartner = { id: Date.now(), company, email, password };
            partners.push(newPartner);
            savePartners(partners);
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Partner kaydı başarılı', partner: { company: newPartner.company, email: newPartner.email } }));
        });
        return;
    }

    if (req.url === '/api/partner/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { email, password } = JSON.parse(body);
            const partners = getPartners();
            const partner = partners.find(p => p.email === email && p.password === password);
            
            if (!partner) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Kurumsal bilgiler hatalı.' }));
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Partner girişi başarılı', partner: { company: partner.company, email: partner.email } }));
        });
        return;
    }

    // 3. Admin API Endpoints
    if (req.url === '/api/admin/stats' && req.method === 'GET') {
        const users = getUsers();
        const partners = getPartners();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            totalUsers: users.length,
            totalPartners: partners.length,
            commentComplaints: 0,
            pendingComments: 6
        }));
        return;
    }

    if (req.url === '/api/admin/users' && req.method === 'GET') {
        const users = getUsers();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users.map(u => ({
            ...u,
            role: u.email === 'selmanutkumarmara@gmail.com' ? u.role || 'Admin' : u.role || 'Kullanıcı',
            regDate: u.regDate || '16.02.2026',
            facilities: u.role === 'Admin' ? 'Tüm Tesisler' : '—'
        }))));
        return;
    }

    if (req.url === '/api/admin/invite' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { email } = JSON.parse(body);
            console.log(`Davet gönderildi: ${email}`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Davet e-postası ${email} adresine gönderildi.` }));
        });
        return;
    }

    if (req.url.startsWith('/api/admin/delete-user/') && req.method === 'DELETE') {
        const userId = req.url.split('/').pop();
        let users = getUsers();
        users = users.filter(u => String(u.id) !== userId);
        saveUsers(users);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Kullanıcı silindi." }));
        return;
    }

    if (req.url === '/api/admin/tab-data' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            comments: [
                { id: 1, user: "Ahmet Y.", facility: "Bursa Spor Merkezi", content: "Harika bir tesis, çok temiz!", date: "25.03.2026", status: "Onaylı" },
                { id: 2, user: "Merve K.", facility: "Kadıköy Basketbol", content: "Eğitmenler çok ilgili.", date: "24.03.2026", status: "Beklemede" },
                { id: 3, user: "Can Ö.", facility: "Ankara Olimpik Havuz", content: "Soyunma odaları yenilenmeli.", date: "24.03.2026", status: "Beklemede" },
                { id: 4, user: "Elif S.", facility: "İzmir Tenis", content: "Kortlar mükemmel durumda.", date: "23.03.2026", status: "Onaylı" },
                { id: 5, user: "Burak T.", facility: "Trabzon Fitness", content: "Fiyatlar çok uygun, teşekkürler.", date: "23.03.2026", status: "Onaylı" },
                { id: 6, user: "Zeynep A.", facility: "Antalya Dağ Kulübü", content: "Rehberler çok profesyonel.", date: "22.03.2026", status: "Beklemede" }
            ],
            facilities: [
                { id: 1, name: "Bursa Spor Merkezi", owner: "Ali Veli", city: "Bursa", rating: 4.8, status: "Aktif" },
                { id: 2, name: "Kadıköy Basketbol Sahası", owner: "Can S.", city: "İstanbul", rating: 4.5, status: "Aktif" },
                { id: 3, name: "Ankara Olimpik Yüzme Havuzu", owner: "Deniz K.", city: "Ankara", rating: 4.9, status: "Aktif" },
                { id: 4, name: "İzmir Tenis Akademisi", owner: "Elif M.", city: "İzmir", rating: 4.6, status: "Beklemede" },
                { id: 5, name: "Antalya Dağ Tırmanışı Kulübü", owner: "Burak T.", city: "Antalya", rating: 4.7, status: "Aktif" },
                { id: 6, name: "Trabzon Fitness Center", owner: "Zeynep A.", city: "Trabzon", rating: 4.3, status: "Aktif" }
            ],
            events: [
                { id: 1, name: "Bisiklet Festivali Bursa", date: "25.04.2026", city: "Bursa", participants: 350, status: "Yaklaşan" },
                { id: 2, name: "İstanbul Yarı Maratonu", date: "15.05.2026", city: "İstanbul", participants: 5400, status: "Kayıt Açık" },
                { id: 3, name: "Antalya IronMan 70.3", date: "03.11.2026", city: "Antalya", participants: 1200, status: "Kayıt Açık" }
            ],
            brands: [
                { id: 1, name: "Nike", category: "Koşu Ayakkabısı", products: 12, rating: 4.7, status: "Aktif" },
                { id: 2, name: "Under Armour", category: "Antrenman", products: 8, rating: 4.4, status: "Aktif" },
                { id: 3, name: "Garmin", category: "Akıllı Saat", products: 5, rating: 4.9, status: "Aktif" }
            ],
            complaints: [
                { id: 1, reporter: "Mehmet K.", targetComment: "Çok kötü hizmet!", reason: "Spam", date: "25.03.2026", status: "İnceleniyor" },
                { id: 2, reporter: "Ayşe D.", targetComment: "Burası berbat...", reason: "Hakaret", date: "24.03.2026", status: "İnceleniyor" }
            ],
            refundRequests: [
                { id: 1, user: "Ali R.", amount: "₺250", reason: "Üyelik iptali", date: "24.03.2026", status: "Beklemede" },
                { id: 2, user: "Fatma S.", amount: "₺180", reason: "Hatalı ücretlendirme", date: "23.03.2026", status: "Onaylandı" }
            ],
            subscriptions: [
                { id: 1, facility: "Bursa Spor Merkezi", plan: "Premium", price: "₺499/ay", startDate: "01.01.2026", status: "Aktif" },
                { id: 2, facility: "Kadıköy Basketbol", plan: "Standart", price: "₺199/ay", startDate: "15.02.2026", status: "Aktif" },
                { id: 3, facility: "Ankara Olimpik Havuz", plan: "Premium", price: "₺499/ay", startDate: "01.03.2026", status: "Aktif" },
                { id: 4, facility: "Trabzon Fitness", plan: "Deneme", price: "Ücretsiz", startDate: "20.03.2026", status: "Deneme" }
            ]
        }));
        return;
    }

    if (req.url === '/api/ai/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const { message } = JSON.parse(body);
                const aiResponse = await fetch('http://127.0.0.1:8045/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer sk-85207ed18a9449a5bb0c2d62f48aaa4c`
                    },
                    body: JSON.stringify({
                        model: 'gemini-3-flash',
                        messages: [{ role: 'user', content: message }]
                    })
                });
                
                const data = await aiResponse.json();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (error) {
                console.error("AI Error:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "AI servisine bağlanılamadı." }));
            }
        });
        return;
    }

    // 4. Partner API Endpoints
    if (req.url === '/api/partner/stats' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            score: "0.0",
            totalComments: 0,
            approvedComments: 0,
            favCount: 0,
            badgeLevel: "Yok"
        }));
        return;
    }

    if (req.url === '/api/partner/details' && req.method === 'GET') {
        // For demo, return first partner or mock data
        const partners = getPartners();
        const partner = partners[0] || { company: "IGU SPOR KULUBU", email: "selmanutkumarmara@gmail.com", phone: "05387644509", website: "sporsepeti.com.tr", bio: "wwdwd" };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(partner));
        return;
    }

    // 5. Handle API Proxy to avoid CORS
    if (req.url.startsWith('/api-proxy/')) {
        const targetPath = req.url.replace('/api-proxy', '/api');
        const targetUrl = 'https://app.base44.com' + targetPath;

        const strippedHeaders = { ...req.headers };
        delete strippedHeaders.host;
        delete strippedHeaders.origin;
        delete strippedHeaders.referer;

        const options = {
            method: req.method,
            headers: {
                ...strippedHeaders,
                host: 'app.base44.com',
                accept: 'application/json'
            }
        };

        const proxyReq = https.request(targetUrl, options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (err) => {
            console.error("Proxy Error:", err.message);
            if (!res.headersSent) {
                res.writeHead(500);
                res.end(`Proxy Error: ${err.message}`);
            } else {
                res.end();
            }
        });

        req.pipe(proxyReq);
        return;
    }

    // 3. Serve Static Files
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let filePath = '.' + parsedUrl.pathname;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.on('error', (err) => {
    console.error("SUNUCU HATASI (Server Error):", err);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`===========================================`);
    console.log(`Sunucu Başarıyla Başlatıldı (Server successfully running)`);
    console.log(`Adres: http://localhost:${PORT}`);
    console.log(`Proxy sunucusu aktif: /api-proxy/`);
    console.log(`Auth API aktif: /api/auth/`);
    console.log(`===========================================`);
});
