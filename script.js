// Canvas ve ekran elementleri
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const startScreen = document.getElementById('startScreen');
const playButton = document.getElementById('playButton');
const howToPlayScreen = document.getElementById('howToPlayScreen'); 
const startGameButton = document.getElementById('startGameButton'); 
const backToMenuButton = document.getElementById('backToMenuButton'); 

const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const mainMenuButton = document.getElementById('mainMenuButton');

// Yeni ses kontrol elementi
const soundToggleButton = document.getElementById('soundToggleButton'); 
// Web Audio API için AudioContext ve ana kazanç düğümü
let audioContext;
let masterGainNode; 

// Sesin açık olup olmadığını tutan değişken (localStorage'dan oku)
let isSoundOn = localStorage.getItem('isSoundOn') === 'false' ? false : true;
const backgroundMusicElement = document.getElementById('backgroundMusic');


// Power-up'lar
const powerUps = []; // Power-up'ları tutacak dizi
const powerUpWidth = 100; // Power-up genişliği
const powerUpHeight = 1000; // Power-up yüksekliği
const powerUpSpawnInterval = 5000; // Her 5 saniyede bir power-up çıksın
let lastPowerUpSpawnTime = 0; // Son power-up çıkma zamanı
const powerUpValue = 1; // Her power-up'ın ne kadar güç katacağı

// Bomba görseli ve özellikleri
const bombImage = new Image();
bombImage.src = 'assets/blast.png'; // Bomba görsel yolu
const bombWidth = 100; // Bomba genişliği
const bombHeight = 100; // Bomba yüksekliği
const bombSpawnChance = 0.2; // Bomba oluşma olasılığı

// Çarpan bonusu görseli ve özellikleri
const doubleScoreImage = new Image();
doubleScoreImage.src = 'assets/speed.png'; // Çarpan bonusu görsel yolu
const doubleScoreWidth = 50; // Çarpan bonusu görselinin genişliği
const doubleScoreHeight = 50; // Çarpan bonusu görselinin yüksekliği
const doubleScoreSpawnChance = 0.05; // Çarpan bonusu oluşma olasılığı (örn. %5)

// Küp görseli (oyuncu)
const playerImage = new Image();
playerImage.src = 'assets/cube.png'; // Oyuncu görsel yolu

// Engel görseli
const obstacleImage = new Image();
obstacleImage.src = 'assets/engel.png'; // Engel görsel yolu

// Canvas boyutlarını ayarla
canvas.width = 800;
canvas.height = 800;

// Oyun durumu değişkenleri
let gameOver = false;
let score = 0;
let cameraOffset = 0;
let animationFrameId; 

// Oyuncu objesi
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 100,
    width: 70,
    height: 70,
    horizontalSpeed: 3,
    verticalSpeed: 4,
    dx: 0,
    dy: 0,
    baseHorizontalSpeed: 3, 
    power: 4, 
};

// Engeller
const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 50;
const worldScrollSpeed = 3;

// Tuş girdileri için
const keys = {};

// Engellerin oluşma frekansı
const obstacleSpawnInterval = 1000;
let lastSpawnTime = 0;

// Yeni Mekanikler için Değişkenler
let isBulletTimeActive = false;
const bulletTimePlayerSpeedFactor = 0.5;
const bulletTimeDuration = 3000;
let bulletTimeStartTime = 0;

let isDashing = false;
const dashSpeedFactor = 3;
const dashDuration = 200;
const dashCooldown = 1000;
let dashStartTime = 0;
let lastDashTime = 0;

// AudioContext'i başlatma fonksiyonu
function createAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGainNode = audioContext.createGain(); // Ana kazanç düğümünü oluştur
        masterGainNode.connect(audioContext.destination); // Ana kazanç düğümünü çıkışa bağla
        // Başlangıç ses seviyesini ayarla
        masterGainNode.gain.value = isSoundOn ? 1 : 0;

    }
}

// Programatik olarak ses çalma fonksiyonu
function playSound(frequency, duration, type = 'sine') {
    if (!audioContext) {
        createAudioContext(); // Ses çalmadan önce context'i oluştur
    }
    if (!audioContext || !masterGainNode) return; // Eğer hala oluşturulamadıysa çık

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain(); // Bireysel sesin kazanç düğümü

    oscillator.connect(gainNode);
    gainNode.connect(masterGainNode); // Bireysel sesi ana kazanç düğümüne bağla

    oscillator.frequency.value = frequency;
    oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'

    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    // Kazancı çok daha küçük bir değere düşürerek cızırtıyı azalt
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    // Osilatörü kazanç azalmasından biraz sonra durdurarak ani kesilmeyi önle
    oscillator.stop(audioContext.currentTime + duration / 1000 + 0.05); // 0.05 saniye ek tampon
}

// Ses durumunu açıp kapatma fonksiyonu
function toggleSound() {
    isSoundOn = !isSoundOn; // Ses durumunu tersine çevir
    localStorage.setItem('isSoundOn', isSoundOn); // Tercihi kaydet

    if (masterGainNode) {
        masterGainNode.gain.value = isSoundOn ? 1 : 0; // Ana ses seviyesini ayarla
    }
    updateSoundButtonText(); // Düğme metnini güncelle

     // Eğer ses kapatıldıysa müziği durdur, açıldıysa çalmaya başla
    if (!isSoundOn) {
        backgroundMusicElement.onpause();
    } else {
        backgroundMusicElement.play().catch(e => console.error("Müzik çalınırken hata oluştu:", e));
    }
}

// Ses düğmesinin metnini güncelleme fonksiyonu
function updateSoundButtonText() {
    if (soundToggleButton) {
        soundToggleButton.textContent = isSoundOn ? 'Ses Kapat' : 'Ses Aç';
    }
}

// Oyuncuyu çiz
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Oyuncunun gücünü üzerine yaz
    ctx.fillStyle = 'white';   
    ctx.font = 'bold 24px Arial'; 
    ctx.textAlign = 'center';  
    ctx.fillText(player.power, player.x + player.width / 2, player.y + player.height / 2); // Konumunu ayarla
}

// Engelleri çiz
function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (obstacle.type === 'bomb') {
            ctx.drawImage(bombImage, obstacle.x, obstacle.y + cameraOffset, obstacle.width, obstacle.height);
        } else if (obstacle.type === 'doubleScore') { // Çarpan bonusunu çiz
            ctx.drawImage(doubleScoreImage, obstacle.x, obstacle.y + cameraOffset, obstacle.width, obstacle.height);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('2X', obstacle.x + obstacle.width / 2, obstacle.y + cameraOffset + obstacle.height / 2);
        } else {
            // Normal engel çizimi
            ctx.drawImage(obstacleImage, obstacle.x, obstacle.y + cameraOffset, obstacle.width, obstacle.height);

            ctx.fillStyle = 'black';    
            ctx.font = 'bold 24px Arial'; 
            ctx.textAlign = 'center';   
            ctx.textBaseline = 'middle'; 
            ctx.fillText(obstacle.power, obstacle.x + obstacle.width / 2, obstacle.y + cameraOffset + obstacle.height / 2 - 5);
        }
    });
}

// Skoru çiz
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 70, 30);
}

// Power-up'ları çiz
function drawPowerUps() {
    ctx.fillStyle = 'yellow'; 
    powerUps.forEach(pUp => {
        ctx.fillRect(pUp.x, pUp.y + cameraOffset, pUp.width, pUp.height);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', pUp.x + pUp.width / 2, pUp.y + cameraOffset + pUp.height / 2);
    });
}

// Yeni power-up oluştur
function spawnPowerUp() {
    const time = Date.now();
    if (time - lastPowerUpSpawnTime > powerUpSpawnInterval) {
        const randomX = Math.random() * (canvas.width - powerUpWidth);
        powerUps.push({
            x: randomX,
            y: canvas.height / 2, 
            width: powerUpWidth,
            height: powerUpHeight
        });
        lastPowerUpSpawnTime = time;
    }
}

// Power-up'ları güncelle ve çarpışmaları kontrol et
function updatePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const pUp = powerUps[i];
        pUp.y -= worldScrollSpeed; 

        // Power-up ekran dışına çıktıysa kaldır
        if (pUp.y + pUp.height < 0) {
            powerUps.splice(i, 1);
        }

        // Oyuncu ile power-up çarpışma kontrolü
        if (player.x < pUp.x + pUp.width &&
            player.x + player.width > pUp.x &&
            player.y < pUp.y + pUp.height &&
            player.y + player.height > pUp.y) {
            // Çarpışma oldu: Oyuncunun gücünü artır
            player.power += powerUpValue;
            playSound(880, 100, 'sine'); // Power-up toplama sesi (daha yüksek frekans)
            // Power-up'ı diziden kaldır
            powerUps.splice(i, 1);
        }
    }
}

function updatePlayer() {
    let currentHorizontalSpeed = player.horizontalSpeed;
    let currentVerticalSpeed = player.verticalSpeed;

    // Eğer mermi zamanı aktifse, oyuncunun hızını 'bulletTimePlayerSpeedFactor' ile çarp.
    if (isBulletTimeActive) {
        currentHorizontalSpeed *= bulletTimePlayerSpeedFactor;
        currentVerticalSpeed *= bulletTimePlayerSpeedFactor;
        if (Date.now() - bulletTimeStartTime > bulletTimeDuration || !keys[' ']) {
            isBulletTimeActive = false;
        }
    }

    // Dash (Atılma/Hızlı Hareket) mekaniği kontrolü
    if (isDashing) {
        currentHorizontalSpeed *= dashSpeedFactor;
        currentVerticalSpeed *= dashSpeedFactor;
        if (Date.now() - dashStartTime > dashDuration) {
            isDashing = false;
        }
    }

    player.dx = 0;
    // Sol ok tuşu veya 'a' tuşu basılıysa, oyuncuyu sola doğru hareket ettir 
    if (keys['ArrowLeft'] || keys['a']) {
        player.dx = -currentHorizontalSpeed;
    }
     // Sağ ok tuşu veya 'd' tuşu basılıysa, oyuncuyu sağa doğru hareket ettir
    if (keys['ArrowRight'] || keys['d']) {
        player.dx = currentHorizontalSpeed;
    }
    // Oyuncunun x konumunu hesaplanan yatay hareket miktarı kadar güncelle.
    player.x += player.dx;

    player.dy = 0;
    // Yukarı ok tuşu veya 'w' tuşu basılıysa, oyuncuyu yukarı doğru hareket ettir
    if (keys['ArrowUp'] || keys['w']) {
        player.dy = -currentVerticalSpeed;
    }
     // Aşağı ok tuşu veya 's' tuşu basılıysa, oyuncuyu aşağı doğru hareket ettir 
    if (keys['ArrowDown'] || keys['s']) {
        player.dy = currentVerticalSpeed;
    }

     /* Eğer oyuncu yukarı doğru hareket ediyorsa (player.dy < 0) VE
     oyuncu ekranın üst %10'luk kısmına ulaştıysa (player.y <= canvas.height * 0.1),
     oyuncuyu hareket ettirmek yerine kamerayı (arka planı) kaydır.*/
    if (player.dy < 0 && player.y <= canvas.height * 0.1) {
        cameraOffset += player.dy;
    } else {
        player.y += player.dy;
    }

    //sınır kontrolü
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.y -= worldScrollSpeed;

        // Engel ekran dışına çıktıysa kaldır
        if (obstacle.y + obstacle.height < 0) {
            obstacles.splice(i, 1);
            if (obstacle.type === 'normal') {
                score++;
            }
        }

        // Oyuncu ile engel çarpışma kontrolü
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {

            if (obstacle.type === 'bomb') {
                playSound(60, 300, 'sawtooth'); // Bomba sesi (düşük frekans, uzun süre, testere)
                gameOver = true;
                return;
            } else if (obstacle.type === 'doubleScore') { // Çarpan bonusu çarpışması
                player.power *= 2; 
                playSound(1000, 150, 'triangle'); // Çarpan bonusu sesi (yüksek frekans, üçgen)
                obstacles.splice(i, 1); 
                return; 
            } else { // Normal engel çarpışması
                playSound(220, 100, 'square'); // Çarpışma sesi (orta frekans, kare)
                if (player.power > obstacle.power) {
                    obstacles.splice(i, 1);
                    score += 5;
                    player.power++;
                } else if (player.power < obstacle.power) {
                    player.power -= 1;
                    score -= 5;
                    if (player.power <= 0) {
                        gameOver = true;
                    }
                    obstacles.splice(i, 1);
                } else { // Eşit güçte çarpışma
                    gameOver = true;
                    obstacles.splice(i, 1);
                }
            }
        }
    }
}

function spawnObstacle() {
    const time = Date.now();
    if (time - lastSpawnTime > obstacleSpawnInterval) {
        const minGap = 150;
        const maxGap = 300;
        const gap = Math.random() * (maxGap - minGap) + minGap;

        let newObstacle = {
            x: Math.random() * (canvas.width - obstacleWidth),
            y: canvas.height + gap,
            width: obstacleWidth,
            height: obstacleHeight,
            power: Math.floor(Math.random() * 5) + 1, // 1 ile 5 arasında rastgele güç
            type: 'normal' // Başlangıçta 'normal' tipinde
        };

        const randomChance = Math.random();
        if (randomChance < bombSpawnChance) { // Bomba olasılığı
            newObstacle.type = 'bomb';
            newObstacle.width = bombWidth;
            newObstacle.height = bombHeight;
        } else if (randomChance < bombSpawnChance + doubleScoreSpawnChance) { // Çarpan bonusu olasılığı
            newObstacle.type = 'doubleScore'; 
            newObstacle.width = doubleScoreWidth;
            newObstacle.height = doubleScoreHeight;
        }
        obstacles.push(newObstacle);
        lastSpawnTime = time;
    }
}

function drawBackground() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lineWidth = 6;
    const lineHeight = 30;
    const lineSpacing = 40;
    ctx.fillStyle = "#fff";

    for (
        let y = (-cameraOffset % (lineHeight + lineSpacing)) - lineHeight;
        y < canvas.height;
        y += lineHeight + lineSpacing
    ) {
        ctx.fillRect(canvas.width / 2 - lineWidth / 2, y, lineWidth, lineHeight);
    }
}

function drawRoad() {
    ctx.fillStyle = '#555';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const laneCount = 6;
    const laneWidth = canvas.width / laneCount;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;

    for (let i = 1; i < laneCount; i++) {
        const x = i * laneWidth;
        ctx.setLineDash([20, 20]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

// Oyun Döngüsü
function gameLoop() {
    if (gameOver) {
        // Mevcut animasyon karesini iptal et
        cancelAnimationFrame(animationFrameId);
        canvas.style.display = 'none';
        gameOverScreen.style.display = 'block';
        finalScoreDisplay.textContent = score;
         backgroundMusicElement.pause(); 
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePowerUps();
    spawnPowerUp();
    drawPowerUps();
    drawBackground();
    drawRoad();
    updatePlayer();
    updateObstacles();
    spawnObstacle();
    drawPlayer();
    drawObstacles();
    drawScore();
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Olay Dinleyicileri (Tuş Basımları)
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    // Kullanıcı etkileşimi olduğunda AudioContext'i başlat
    createAudioContext();

    if (e.key === ' ' && !isBulletTimeActive) {
        isBulletTimeActive = true;
        bulletTimeStartTime = Date.now();
        playSound(440, 200, 'sine'); // Bullet time açılma sesi (orta frekans, sinüs)
    }

    if (e.key === 'Shift' && !isDashing && (Date.now() - lastDashTime > dashCooldown)) {
        isDashing = true;
        dashStartTime = Date.now();
        lastDashTime = Date.now();
        playSound(660, 100, 'square'); // Dash sesi (yüksek frekans, kare)
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ' && isBulletTimeActive) {
        isBulletTimeActive = false;
    }
});

// Oyunu Başlatma ve Sıfırlama
function resetGame() {
    // Önceki oyun döngüsünü durdur 
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    cameraOffset = 0;
    gameOver = false;
    score = 0;
    player.x = canvas.width / 2 - 20;
    player.y = canvas.height - 100;
    player.dx = 0;
    player.dy = 0;
    player.power = 4; // Oyuncunun gücünü başlangıç değerine sıfırla
    obstacles.length = 0;
    powerUps.length = 0; // Power-up dizisini temizle
    lastSpawnTime = 0;
    lastPowerUpSpawnTime = 0; // Power-up spawn zamanını sıfırla
    isBulletTimeActive = false;
    isDashing = false;
    player.horizontalSpeed = player.baseHorizontalSpeed; // Hızı başlangıç değerine getir

    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'none';
    howToPlayScreen.style.display = 'none'; // Nasıl Oynanır ekranını da gizle
    canvas.style.display = 'block';

    if (isSoundOn) {
        backgroundMusicElement.play().catch(e => console.error("Müzik çalınırken hata oluştu:", e)); // Oyun başladığında müziği çal
    }
    gameLoop(); // Oyun döngüsünü yeniden başlat
}

// Ana menüye dönme fonksiyonu
function returnToMainMenu() {
    // Oyun döngüsünü durdur
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    gameOver = true; // gameLoop'un erken dönmesini sağlar

    canvas.style.display = 'none'; // Canvas'ı gizle
    gameOverScreen.style.display = 'none'; // Game Over ekranını gizle
    startScreen.style.display = 'flex'; // Başlangıç ekranını göster
    backgroundMusicElement.pause();
}


// "Play" butonuna basıldığında (Başlangıç ekranından)
playButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    howToPlayScreen.style.display = 'flex'; // Nasıl Oynanır ekranını göster
    createAudioContext(); // Kullanıcı etkileşimiyle AudioContext'i başlat
});

// "Oyuna Başla!" butonuna basıldığında (Nasıl Oynanır ekranından)
startGameButton.addEventListener('click', () => {
    howToPlayScreen.style.display = 'none'; // Nasıl Oynanır ekranını gizle
    resetGame(); // Oyunu sıfırla ve başlat
});

// "Ana Menü" butonuna basıldığında (Nasıl Oynanır ekranından)
backToMenuButton.addEventListener('click', () => {
    howToPlayScreen.style.display = 'none'; // Nasıl Oynanır ekranını gizle
    startScreen.style.display = 'flex'; // Giriş ekranını tekrar göster
});

// Ana Menüye Dön butonu için click event listener (Game Over ekranından)
mainMenuButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    returnToMainMenu();
});

// Yeniden Başlat butonu için click event listener (Game Over ekranından)
restartButton.addEventListener('click', () => {
    resetGame(); // Oyunu sıfırlayan fonksiyonu çağırır
});

// Ses düğmesine olay dinleyici ekle
if (soundToggleButton) {
    soundToggleButton.addEventListener('click', toggleSound);
}


// Başlangıç durumu
window.onload = () => {
    startScreen.style.display = 'flex';
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'none';
    howToPlayScreen.style.display = 'none'; // Nasıl Oynanır ekranı da başlangıçta gizli
    createAudioContext(); // Sayfa yüklendiğinde AudioContext'i başlat
    updateSoundButtonText(); // Ses düğmesinin başlangıç metnini ayarla
};