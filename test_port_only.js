require('http').createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Test Sunucusu Çalışıyor! Port 8001 bağlantısı başarılı.');
}).listen(8001, '127.0.0.1', () => {
    console.log('===========================================');
    console.log('TEST SUNUCUSU BAŞLATILDI');
    console.log('Adres: http://localhost:8001');
    console.log('===========================================');
});
