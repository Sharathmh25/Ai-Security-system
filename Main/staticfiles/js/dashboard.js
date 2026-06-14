document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/api/alerts/';
    const REFRESH_RATE = 3000;
    
    const container = document.getElementById('alerts-container');
    const feedDisplay = document.getElementById('feed');
    const totalCount = document.getElementById('total');
    const safeCount = document.getElementById('safe');
    const threatsCount = document.getElementById('threats');
    const popupArea = document.getElementById('popupArea');
    
    let lastAlertId = null;
    let initialSyncComplete = false;

    syncSecurityMatrix();
    setInterval(syncSecurityMatrix, REFRESH_RATE);

    async function syncSecurityMatrix() {
        try {
            const res = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!res.ok) throw new Error(`HTTP Matrix Disruption: ${res.status}`);
            const alerts = await res.json();
            
            processIncomingAlerts(alerts);
            updateCounters(alerts);

        } catch (err) {
            console.error('Telemetry stream syncing exception:', err);
        }
    }

    function processIncomingAlerts(alerts) {
        if (!alerts || alerts.length === 0) {
            renderEmptyState();
            return;
        }

        const fallbackLoader = document.getElementById('fallbackLoader');
        if (fallbackLoader) fallbackLoader.remove();

        const latestAlert = alerts[0];
        
        if (lastAlertId !== null && latestAlert.id !== lastAlertId) {
            if (latestAlert.status.toLowerCase().includes('intruder')) {
                triggerThreatSequence(latestAlert);
            }
        }

        const currentKnownId = lastAlertId;
        lastAlertId = latestAlert.id;

        container.innerHTML = '';
        
        alerts.forEach(alert => {
            const shouldHighlight = (currentKnownId !== null && alert.id === latestAlert.id && alert.id !== currentKnownId);
            const cardElement = createAlertCard(alert, shouldHighlight);
            container.appendChild(cardElement);
        });

        if (!initialSyncComplete) {
            updateFeedText(`System operational. Synced ${alerts.length} node records.`);
            initialSyncComplete = true;
        }
    }

    function createAlertCard(alert, highlight) {
        const card = document.createElement('div');
        const isIntruder = alert.status.toLowerCase().includes('intruder');
        
        card.className = `alert-card ${highlight ? 'new-alert-glow' : ''}`;
        card.setAttribute('data-id', alert.id);

        const sourceImage = alert.image ? alert.image : window.DjangoConfig.fallbackImg;
        
        let badgeStyle = 'safe';
        if (isIntruder) badgeStyle = 'intruder';
        else if (alert.status.toLowerCase().includes('report')) badgeStyle = 'reported';

        card.innerHTML = `
            <div class="card-frame">
                <img src="${sourceImage}" alt="CCTV Data Frame" class="preview-img">
                <span class="badge ${badgeStyle}">${alert.status}</span>
            </div>
            <div class="card-details">
                <div class="timestamp-row">
                    <span>Hardware Sync:</span>
                    <var>${alert.timestamp}</var>
                </div>
                <div class="control-cluster">
                    <button class="btn-ctrl safe" data-action="safe">Mark Safe</button>
                    <button class="btn-ctrl report" data-action="report">Report</button>
                </div>
            </div>
        `;

        card.querySelectorAll('.btn-ctrl').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                postCommandAction(alert.id, action);
            });
        });

        return card;
    }

    async function postCommandAction(id, action) {
        try {
            const response = await fetch(`/api/alerts/${id}/action/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': window.DjangoConfig.csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ action: action })
            });
            if (!response.ok) throw new Error('Command deployment failure.');
            syncSecurityMatrix();
        } catch (fault) {
            console.error(fault);
        }
    }

    function triggerThreatSequence(alert) {
        updateFeedText(`🚨 INTRUSION DETECTED AT TIMESTAMP: ${alert.timestamp}`);
        spawnPopupNotification(alert);
        executeAlarmAudio();
    }

    function spawnPopupNotification(alert) {
        const toast = document.createElement('div');
        toast.className = 'floating-toast';
        toast.textContent = `🚨 CRITICAL EXTRUSION: Intruder footprint tracked at ${alert.timestamp}`;
        
        if (popupArea) popupArea.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function executeAlarmAudio() {
        const sound = new Audio(window.DjangoConfig.alarmSoundUrl);
        sound.play().catch(() => {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.4);
            } catch (_) {}
        });
    }

    function updateCounters(alerts) {
        let total = alerts.length, safe = 0, threats = 0;
        
        alerts.forEach(a => {
            const status = a.status.toLowerCase();
            if (status.includes('safe')) safe++;
            if (status.includes('intruder')) threats++;
        });

        if (totalCount) totalCount.textContent = total;
        if (safeCount) safeCount.textContent = safe;
        if (threatsCount) threatsCount.textContent = threats;
    }

    function updateFeedText(text) {
        if (feedDisplay) feedDisplay.textContent = text;
    }

    function renderEmptyState() {
        if (container) {
            container.innerHTML = `
                <div class="initial-loader">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <p>CCTV stream clear. No active security exceptions found.</p>
                </div>
            `;
        }
        updateCounters([]);
        updateFeedText("Nominal environment baseline confirmed.");
    }
});