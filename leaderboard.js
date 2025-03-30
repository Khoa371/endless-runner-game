// ========== LEADERBOARD SYSTEM ==========
class LeaderboardManager {
    constructor() {
        this.DINO_SCORES_KEY = 'dinoHighScores';
        this.CORONA_SCORES_KEY = 'coronaHighScores';
        this.MAX_SCORES = 5;
        this.playerName = 'Người chơi';
        this.initializeScores();
        this.loadPlayerName();
    }

    initializeScores() {
        if (!localStorage.getItem(this.DINO_SCORES_KEY)) {
            localStorage.setItem(this.DINO_SCORES_KEY, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.CORONA_SCORES_KEY)) {
            localStorage.setItem(this.CORONA_SCORES_KEY, JSON.stringify([]));
        }
    }

    loadPlayerName() {
        const name = prompt('Nhập tên của bạn:', 'Người chơi');
        this.playerName = name || 'Người chơi';
    }

    addScore(gameMode, score) {
        const key = gameMode === 'dino' ? this.DINO_SCORES_KEY : this.CORONA_SCORES_KEY;
        let scores = JSON.parse(localStorage.getItem(key));
        
        const newScore = {
            score: score,
            date: new Date().toLocaleDateString('vi-VN'),
            playerName: this.playerName
        };

        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, this.MAX_SCORES);
        localStorage.setItem(key, JSON.stringify(scores));
        this.updateLeaderboardDisplay();
    }

    getHighScores(gameMode) {
        const key = gameMode === 'dino' ? this.DINO_SCORES_KEY : this.CORONA_SCORES_KEY;
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    updateLeaderboardDisplay() {
        this.displayScores('dino', '#dinosaur-scores');
        this.displayScores('corona', '#corona-scores');
    }

    displayScores(gameMode, selector) {
        const scores = this.getHighScores(gameMode);
        const medals = ['gold', 'silver', 'bronze'];
        const html = scores.map((score, index) => `
            <div class="score-item">
                <div class="medal ${medals[index] || ''}"><i class="fas fa-medal"></i></div>
                <span class="player-name">${score.playerName}</span>
                <span class="score">${score.score} điểm</span>
                <span class="date">${score.date}</span>
            </div>
        `).join('');
        document.querySelector(selector).innerHTML = html;
    }
}

// ========== DINO GAME ==========
class DinoGame {
    constructor() {
        this.canvas = document.getElementById('dino-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.gameActive = false;
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.jump();
        });
    }

    jump() {
        if (!this.gameActive) {
            this.startGame();
            return;
        }
        // Add jump logic here
    }

    startGame() {
        this.score = 0;
        this.gameActive = true;
        this.gameLoop();
    }

    gameOver() {
        this.gameActive = false;
        leaderboard.addScore('dino', this.score);
        alert(`Game Over! Điểm của bạn: ${this.score}`);
    }

    gameLoop() {
        if (!this.gameActive) return;
        
        // Update game state
        this.score++;
        
        // Render game
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillText(`Điểm: ${this.score}`, 10, 20);
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ========== CORONA GAME ==========
class CoronaGame {
    constructor() {
        this.canvas = document.getElementById('corona-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.gameActive = false;
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('click', () => this.jump());
    }

    jump() {
        if (!this.gameActive) {
            this.startGame();
            return;
        }
        // Add jump logic here
    }

    startGame() {
        this.score = 0;
        this.gameActive = true;
        this.gameLoop();
    }

    gameOver() {
        this.gameActive = false;
        leaderboard.addScore('corona', this.score);
        alert(`Game Over! Điểm của bạn: ${this.score}`);
    }

    gameLoop() {
        if (!this.gameActive) return;
        
        // Update game state
        this.score++;
        
        // Render game
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillText(`Điểm: ${this.score}`, 10, 20);
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ========== MAIN SYSTEM ==========
const leaderboard = new LeaderboardManager();
const dinoGame = new DinoGame();
const coronaGame = new CoronaGame();

// Tab system
function showTab(tabId) {
    document.querySelectorAll('.game-container').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    if (tabId === 'leaderboard') {
        leaderboard.updateLeaderboardDisplay();
    }
}

// Initialize first tab
showTab('dino-game');