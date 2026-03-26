// Хранилище топа (в localStorage)
let topPlayers = [];

// Загрузка топа из localStorage
function loadTop() {
    const saved = localStorage.getItem('hockeyTop');
    if (saved) {
        topPlayers = JSON.parse(saved);
    } else {
        // Тестовые данные для примера
        topPlayers = [
            { name: "🐱 Кот Матроскин", score: 1250 },
            { name: "🐱 Леопольд", score: 980 },
            { name: "🐱 Том", score: 760 },
            { name: "🐱 Гарфилд", score: 540 },
            { name: "🐱 Саймон", score: 320 }
        ];
        saveTop();
    }
    renderTop();
}

// Сохранение топа в localStorage
function saveTop() {
    localStorage.setItem('hockeyTop', JSON.stringify(topPlayers));
}

// Отображение топа
function renderTop() {
    const topList = document.getElementById('topList');
    if (!topList) return;
    
    if (topPlayers.length === 0) {
        topList.innerHTML = '<div class="empty">Пока нет игроков. Будь первым!</div>';
        return;
    }
    
    // Сортируем по очкам
    const sorted = [...topPlayers].sort((a, b) => b.score - a.score);
    
    topList.innerHTML = '';
    sorted.slice(0, 10).forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'top-item';
        
        let medal = '';
        if (index === 0) medal = '🥇 ';
        else if (index === 1) medal = '🥈 ';
        else if (index === 2) medal = '🥉 ';
        
        item.innerHTML = `
            <span class="rank">${medal}${index + 1}</span>
            <span class="name">${escapeHtml(player.name)}</span>
            <span class="score">${player.score} 🏒</span>
        `;
        topList.appendChild(item);
    });
}

// Добавление игрока в топ
function addPlayerScore(name, score) {
    const existing = topPlayers.find(p => p.name === name);
    if (existing) {
        existing.score += score;
    } else {
        topPlayers.push({ name: name, score: score });
    }
    saveTop();
    renderTop();
    updateStatus('Топ обновлён!', 'success');
}

// Обновление статуса сервера (имитация)
function updateServerStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const serverTime = document.getElementById('serverTime');
    
    // Имитация проверки сервера
    const isOnline = Math.random() > 0.1; // 90% что онлайн
    
    if (isOnline) {
        statusDot.className = 'status-dot online';
        statusText.innerHTML = '✅ Сервер онлайн';
    } else {
        statusDot.className = 'status-dot offline';
        statusText.innerHTML = '❌ Сервер оффлайн (локальный режим)';
    }
    
    // Показываем текущее время
    const now = new Date();
    serverTime.textContent = now.toLocaleTimeString('ru-RU');
}

// Обновление статуса (временное сообщение)
function updateStatus(message, type) {
    const statusText = document.getElementById('statusText');
    if (statusText) {
        const originalText = statusText.innerHTML;
        statusText.innerHTML = type === 'success' ? '✅ ' + message : '⚠️ ' + message;
        setTimeout(() => {
            updateServerStatus();
        }, 2000);
    }
}

// Защита от XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Добавление тестовых очков
function addTestScore() {
    const name = prompt('Введите имя игрока:', 'Кот ' + Math.floor(Math.random() * 1000));
    if (name && name.trim()) {
        const points = Math.floor(Math.random() * 100) + 10;
        addPlayerScore(name.trim(), points);
        updateStatus(`${name} +${points} очков!`, 'success');
    }
}

// Обновить топ (перезагрузить)
function refreshTop() {
    renderTop();
    updateServerStatus();
    updateStatus('Топ обновлён', 'success');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTop();
    updateServerStatus();
    
    // Обновляем статус каждые 30 секунд
    setInterval(updateServerStatus, 30000);
    
    // Кнопки
    const refreshBtn = document.getElementById('refreshBtn');
    const addScoreBtn = document.getElementById('addScoreBtn');
    
    if (refreshBtn) refreshBtn.addEventListener('click', refreshTop);
    if (addScoreBtn) addScoreBtn.addEventListener('click', addTestScore);
});
