#!/bin/bash
osascript -e 'tell application "Terminal" to do script "cd \"/Users/selmanutku/Desktop/Sporpuan\" && /Users/selmanutku/.nvm/versions/node/v25.8.1/bin/node server.js"'
echo "Yeni bir Terminal penceresi açıldı ve sunucu orada başlatıldı."
echo "Lütfen o pencereyi kontrol edin."
sleep 3
exit
