class Game {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = false;
        this.gameArea = document.getElementById('game-area');
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.startButton = document.getElementById('start-button');
        this.startScreen = document.getElementById('start-screen');
        this.endScreen = document.getElementById('end-screen');
        this.finalScore = document.getElementById('final-score');
        this.finalLevel = document.getElementById('final-level');
        this.missedClicksElement = document.getElementById('missed-clicks');
        this.restartButton = document.getElementById('restart-button');
        this.level = 1;
        this.missedClicks = 0;
        
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.startGame());
        
        // Oyun alanına yanlış tıklama eventi ekle
        this.gameArea.addEventListener('click', (e) => {
            if (e.target === this.gameArea && this.isPlaying) {
                this.score = Math.max(0, this.score - 5);
                this.missedClicks++;
                this.updateScore();
            }
        });
    }

    startGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = true;
        this.level = 1;
        this.missedClicks = 0;
        this.startScreen.style.display = 'none';
        this.endScreen.style.display = 'none';
        this.updateScore();
        this.updateTime();
        
        this.gameInterval = setInterval(() => {
            this.createTarget();
        }, 1000 - (this.level * 50)); // Level arttıkça daha hızlı hedef oluştur

        this.timeInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTime();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    createTarget() {
        const target = document.createElement('div');
        target.className = 'target';
        
        // Zamanla küçülen hedefler (20px - 60px)
        const maxSize = Math.max(60 - (this.level * 5), 20);
        const size = Math.random() * 30 + maxSize - 30;
        target.style.width = `${size}px`;
        target.style.height = `${size}px`;
        
        // Rastgele pozisyon
        const maxX = this.gameArea.clientWidth - size;
        const maxY = this.gameArea.clientHeight - size;
        let posX = Math.random() * maxX;
        let posY = Math.random() * maxY;
        
        // Hareket yönü ve hızı
        const speed = 2 + (this.level * 0.5);
        const directionX = Math.random() > 0.5 ? speed : -speed;
        const directionY = Math.random() > 0.5 ? speed : -speed;
        
        // Hedefi hareket ettir
        const moveInterval = setInterval(() => {
            posX += directionX;
            posY += directionY;
            
            // Sınırlara çarpınca yön değiştir
            if (posX <= 0 || posX >= maxX) {
                directionX *= -1;
            }
            if (posY <= 0 || posY >= maxY) {
                directionY *= -1;
            }
            
            target.style.left = `${posX}px`;
            target.style.top = `${posY}px`;
        }, 20);
        
        // Rastgele renk
        const hue = Math.random() * 360;
        target.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        
        target.addEventListener('click', () => {
            this.score += Math.round(200 / size * 10);
            this.updateScore();
            clearInterval(moveInterval);
            target.remove();
            
            // Her 100 puan için level atlama
            this.level = Math.floor(this.score / 100) + 1;
        });
        
        this.gameArea.appendChild(target);
        
        // Zamanla azalan görünme süresi
        const disappearTime = Math.max(2000 - (this.level * 200), 800);
        setTimeout(() => {
            if (target.parentNode === this.gameArea) {
                clearInterval(moveInterval);
                target.remove();
            }
        }, disappearTime);
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    updateTime() {
        this.timeElement.textContent = this.timeLeft;
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.gameInterval);
        clearInterval(this.timeInterval);
        
        // Tüm hedefleri temizle
        while (this.gameArea.firstChild) {
            this.gameArea.removeChild(this.gameArea.firstChild);
        }
        
        // İstatistikleri güncelle ve end screen'i göster
        this.finalScore.textContent = this.score;
        this.finalLevel.textContent = this.level;
        this.missedClicksElement.textContent = this.missedClicks;
        this.endScreen.style.display = 'block';
    }
}

// Oyunu başlat
new Game(); 