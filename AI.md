# Yapay Zeka Araçları Kullanımı

Bu belge, projemizin geliştirilmesi sırasında yararlanılan yapay zeka araçlarını ve bu araçlarla gerçekleştirilen etkileşimleri detaylandırmaktadır.

---

## ChatGPT

### Kullanılan Promptlar ve Cevaplar

#### Promt 1:
https://stevopineapple.itch.io/rolling-racers bu oyuna benzer 2D bir oyun projesi yapıyorum html css ve js kullanıyorum. Bu oyundaki özellikleri ve kuralları 2D oyun projome uyarlama gerekiyor yardımcı olur musun?
#### Cevap 1:
```javascript

<canvas id="gameCanvas" width="800" height="400"></canvas>
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  speedX: 0,
  speedY: 0,
  gravity: 0.5,
  jumpPower: -10,
  onGround: false
};

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") player.speedX = 5;
  if (e.code === "ArrowLeft") player.speedX = -5;
  if (e.code === "Space" && player.onGround) {
    player.speedY = player.jumpPower;
    player.onGround = false;
  }
});
function updatePlayer() {
  player.speedY += player.gravity;
  player.y += player.speedY;
  player.x += player.speedX;

  // Yere düşme kontrolü
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.speedY = 0;
    player.onGround = true;
  }
}
let cameraX = 0;

function updateCamera() {
  cameraX = player.x - 100;
}
ctx.fillRect(player.x - cameraX, player.y, player.width, player.height);
```
#### Promt 2:
Bir yarış oyunu olduğu için arkaplanın yola benzemesini istiyorum.
### Cevap 2:
Evet! 🚗🛣️ Yola şeritler (orta çizgiler) eklemek gayet kolay ve mantıklı bir adım. Bunu Canvas üzerinde çizeceğiz, böylece kamera hareketiyle birlikte yukarı doğru kayacaklar.
✅ Şerit Efekti (Ortada kesik beyaz çizgiler)

Aşağıdaki adımları takip ederek orta şeritleri ekleyebilirsin:
🔧 1. drawBackground() Fonksiyonunu Oluştu
``` javascript
function drawBackground() {
    // Arka planı doldur
    ctx.fillStyle = "#222"; // Yolun koyu gri rengi
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Şerit çizgilerini çiz (ortadaki beyaz çizgiler)
    const lineWidth = 6;
    const lineHeight = 30;
    const lineSpacing = 40;

    ctx.fillStyle = "#fff";
    for (let y = (-cameraOffset % (lineHeight + lineSpacing)) - lineHeight; y < canvas.height; y += lineHeight + lineSpacing) {
        ctx.fillRect(canvas.width / 2 - lineWidth / 2, y, lineWidth, lineHeight);
    }
}
```
### Promt 3:
yolun kenarlarına seyirci koybilir miyiz
### Cevap 3:
Kare/dairelerle, kenarlarda küçük "seyirci figürleri" çizebiliriz.
➕ Avantajları:

    Kolay uygulanır

    Performans dostu

    Kamera ile birlikte yukarı kayabilir

🧠 Nasıl yapılır?
``` javascript
function drawSpectators() {
    const spectatorRadius = 5;
    const spacing = 10;
    const startXLeft = 20;
    const startXRight = canvas.width - 20;
    const numberOfSpectators = 30;

    ctx.fillStyle = "yellow";

    for (let i = 0; i < numberOfSpectators; i++) {
        let y = (i * spacing + (-cameraOffset % spacing)) % canvas.height;

        // Sol taraf
        ctx.beginPath();
        ctx.arc(startXLeft, y, spectatorRadius, 0, Math.PI * 2);
        ctx.fill();

        // Sağ taraf
        ctx.beginPath();
        ctx.arc(startXRight, y, spectatorRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}
```
## Google Gemini
### Kullanılan Promptlar ve Cevaplar

#### Promt 1:
https://stevopineapple.itch.io/rolling-racers bu oyunu 2D kodlamak istiyorum html5 css ve js kullanacağım 2D ye dönüştürmek için nasıl yapmalıyım
### Cevap 1:
Harika bir seçim! Rolling Racers'ı 2D olarak HTML5, CSS ve JavaScript ile kodlamak oldukça eğlenceli bir proje olacaktır. Oyunun temel mekaniklerini 2D'ye uyarlarken dikkat etmeniz gereken bazı noktalar ve genel bir yol haritası aşağıda:

2D'ye Dönüştürme Stratejisi
Rolling Racers'ın ana konsepti yuvarlanan nesneler ve engellerden kaçma üzerine kurulu. Bunu 2D'ye aktarırken, perspektif yerine düzlem tabanlı bir görünüm benimsememiz gerekiyor.

1. Görsel Adaptasyon
Karakterler ve Engeller: Oyundaki "yuvarlanan" karakterler (toplar veya tekerlekler gibi) ve engeller (bloklar, duvarlar vb.) 2D sprite'lar veya basit geometrik şekiller (daireler, dikdörtgenler) olarak temsil edilecek. Topları yandan görünümde yuvarlanan daireler olarak çizebilir veya sprite animasyonları kullanabilirsiniz.
Yol/Zemin: Oyunun geçtiği yol, 2D'de basit bir çizgi veya dikdörtgen şerit olarak temsil edilebilir. Perspektif olmadığı için, yolun "derinliğini" efektlerle (örneğin, yokuşlar için eğimli çizgiler) veya basit bir arka plan kaydırma (parallax scrolling) ile verebilirsiniz.
Arka Plan: Gökyüzü, ağaçlar veya uzaktaki binalar gibi arka plan öğeleri, oyuna derinlik katmak için farklı hızlarda kaydırılabilir (parallax effect).
2. Mekanik Adaptasyon
Yuvarlanma/Hareket: 2D'de, yuvarlanma mekaniği genellikle x ekseninde hareket ve y ekseninde zıplama/düşme olarak basitleştirilir. Karakterin hızı, x eksenindeki konumunu güncelleyerek sağlanır.
Çarpışma Tespiti: 2D'de çarpışma tespiti (collision detection) çok daha basittir. Daire-dikdörtgen, dikdörtgen-dikdörtgen veya daire-daire çarpışma algoritmaları kullanabilirsiniz.
Engeller: Engeller, karakterin yolunu kesen veya karakterin üzerinden atlaması gereken statik 2D nesneler (dikdörtgenler, üçgenler) olacaktır.
Kontroller: Zıplama, sağa/sola hareket gibi kontroller 2D'de klavye tuşlarına (örneğin, Ok tuşları veya WASD) veya mobil cihazlar için dokunmatik kontrollere atanabilir.
Harika bir seçim! Rolling Racers'ı 2D olarak HTML5, CSS ve JavaScript ile kodlamak oldukça eğlenceli bir proje olacaktır. Oyunun temel mekaniklerini 2D'ye uyarlarken dikkat etmeniz gereken bazı noktalar ve genel bir yol haritası aşağıda:

2D'ye Dönüştürme Stratejisi
Rolling Racers'ın ana konsepti yuvarlanan nesneler ve engellerden kaçma üzerine kurulu. Bunu 2D'ye aktarırken, perspektif yerine düzlem tabanlı bir görünüm benimsememiz gerekiyor.

1. Görsel Adaptasyon
Karakterler ve Engeller: Oyundaki "yuvarlanan" karakterler (toplar veya tekerlekler gibi) ve engeller (bloklar, duvarlar vb.) 2D sprite'lar veya basit geometrik şekiller (daireler, dikdörtgenler) olarak temsil edilecek. Topları yandan görünümde yuvarlanan daireler olarak çizebilir veya sprite animasyonları kullanabilirsiniz.
Yol/Zemin: Oyunun geçtiği yol, 2D'de basit bir çizgi veya dikdörtgen şerit olarak temsil edilebilir. Perspektif olmadığı için, yolun "derinliğini" efektlerle (örneğin, yokuşlar için eğimli çizgiler) veya basit bir arka plan kaydırma (parallax scrolling) ile verebilirsiniz.
Arka Plan: Gökyüzü, ağaçlar veya uzaktaki binalar gibi arka plan öğeleri, oyuna derinlik katmak için farklı hızlarda kaydırılabilir (parallax effect).
2. Mekanik Adaptasyon
Yuvarlanma/Hareket: 2D'de, yuvarlanma mekaniği genellikle x ekseninde hareket ve y ekseninde zıplama/düşme olarak basitleştirilir. Karakterin hızı, x eksenindeki konumunu güncelleyerek sağlanır.
Çarpışma Tespiti: 2D'de çarpışma tespiti (collision detection) çok daha basittir. Daire-dikdörtgen, dikdörtgen-dikdörtgen veya daire-daire çarpışma algoritmaları kullanabilirsiniz.
Engeller: Engeller, karakterin yolunu kesen veya karakterin üzerinden atlaması gereken statik 2D nesneler (dikdörtgenler, üçgenler) olacaktır.
Kontroller: Zıplama, sağa/sola hareket gibi kontroller 2D'de klavye tuşlarına (örneğin, Ok tuşları veya WASD) veya mobil cihazlar için dokunmatik kontrollere atanabilir.
HTML5, CSS ve JavaScript ile 2D Oyun Yapısı
1. HTML Yapısı (index.html)
Oyununuzun temelini oluşturacak. Bir <canvas> etiketi, oyununuzu çizeceğiniz ana yüzey olacak.

HTML

```html
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rolling Racers 2D</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Rolling Racers 2D</h1>
    <canvas id="gameCanvas" width="800" height="400"></canvas>
    <script src="script.js"></script>
</body>
</html>
2. CSS Stilleri (style.css)
Canvas'ı ortalamak ve temel bir görünüm vermek için kullanabilirsiniz.

```
CSS
```css
body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background-color: #333;
    color: #eee;
    font-family: Arial, sans-serif;
}

canvas {
    background-color: #87CEEB; /* Gökyüzü rengi */
    border: 2px solid #555;
    display: block; /* Altında boşluk olmaması için */
}
```
3. JavaScript Oyun Mantığı (script.js)
Oyunun tüm mantığı burada olacak.

a. Canvas Kurulumu
JavaScript
```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // 2D çizim bağlamı

// Oyun ayarları
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
let gameRunning = false; // Oyunun çalışıp çalışmadığını kontrol etmek için

// Oyuncunun özellikleri
const player = {
    x: 50,
    y: GAME_HEIGHT - 70, // Zemine yakın başlangıç
    radius: 20,
    color: 'red',
    velocityY: 0,
    gravity: 0.5,
    isJumping: false
};

// Engeller (şimdilik basit dikdörtgenler)
let obstacles = [];

// Oyun döngüsü için zamanlama
let lastTime = 0;
b. Çizim Fonksiyonları
JavaScript

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'green'; // Engel rengi
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawGround() {
    ctx.fillStyle = 'brown'; // Zemin rengi
    ctx.fillRect(0, GAME_HEIGHT - 30, GAME_WIDTH, 30); // Zemin çizgisi
}

function clearCanvas() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}
```
c. Oyun Güncelleme Mantığı
JavaScript
```javascript
function update(deltaTime) {
    // Yerçekimi ve zıplama
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Zemine çarptığında durdurma
    if (player.y + player.radius > GAME_HEIGHT - 30) {
        player.y = GAME_HEIGHT - 30 - player.radius;
        player.velocityY = 0;
        player.isJumping = false;
    }

    // Engelleri hareket ettirme ve yeni engeller oluşturma
    obstacles.forEach(obstacle => {
        obstacle.x -= 3; // Engel hızı
    });
 
    // Ekranın dışına çıkan engelleri temizleme
  
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Rastgele yeni engel oluşturma
    if (Math.random() < 0.01 && obstacles.length < 5) { // Belirli bir olasılıkla ve maksimum engel sayısı
        const obstacleWidth = 20 + Math.random() * 30;
        const obstacleHeight = 20 + Math.random() * 40;
        obstacles.push({
            x: GAME_WIDTH,
            y: GAME_HEIGHT - 30 - obstacleHeight, // Zeminin üstünde
            width: obstacleWidth,
            height: obstacleHeight
        });
    }

    // Çarpışma tespiti (Daire-Dikdörtgen)

    obstacles.forEach(obstacle => {
        // Dairenin en yakın x ve y noktalarını bulma
        let testX = player.x;
        let testY = player.y;

        if (player.x < obstacle.x)           testX = obstacle.x;
        else if (player.x > obstacle.x + obstacle.width)  testX = obstacle.x + obstacle.width;
        if (player.y < obstacle.y)           testY = obstacle.y;
        else if (player.y > obstacle.y + obstacle.height) testY = obstacle.y + obstacle.height;

        let distX = player.x - testX;
        let distY = player.y - testY;
        let distance = Math.sqrt((distX * distX) + (distY * distY));

        if (distance <= player.radius) {
            // Çarpışma oldu! Oyun bitti veya can azaldı.
            console.log("Çarpışma!");
            gameRunning = false; // Oyunu durdur
            alert("Oyun Bitti! Çarpıştınız!");
        }
    });
}
```
d. Giriş İşleme (Zıplama)
JavaScript
```javascript
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !player.isJumping) {
        player.velocityY = -10; // Zıplama gücü
        player.isJumping = true;
    }
});
e. Oyun Döngüsü
JavaScript

function gameLoop(currentTime) {
    if (!gameRunning) return;

    const deltaTime = (currentTime - lastTime) / 1000; // Saniye cinsinden
    lastTime = currentTime;

    clearCanvas();
    update(deltaTime);
    drawGround();
    drawObstacles();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

// Oyunu başlatma
function startGame() {
    player.x = 50;
    player.y = GAME_HEIGHT - 70;
    player.velocityY = 0;
    player.isJumping = false;
    obstacles = [];
    gameRunning = true;
    lastTime = performance.now(); // İlk zamanı başlat
    requestAnimationFrame(gameLoop);
}

// Sayfa yüklendiğinde oyunu başlat
window.onload = startGame;
Sonraki Adımlar ve İyileştirmeler
```
Bu basit yapı, oyununuzun temelini oluşturur. Üzerine ekleyebileceğiniz bazı iyileştirmeler:

Gelişmiş Grafikler: ctx.drawImage() kullanarak sprite'ları çizebilirsiniz. Karakterin yuvarlanma animasyonu için birden fazla sprite kullanabilirsiniz.
Daha Karmaşık Engeller: Farklı şekillerde ve yüksekliklerde engeller, hatta hareketli engeller ekleyebilirsiniz.
Skor Sistemi: Oyuncunun ne kadar ilerlediğini gösteren bir skor sayacı ekleyin.
Ses Efektleri ve Müzik: Zıplama, çarpışma gibi olaylar için sesler ekleyin.
Menü Sistemi: Başlangıç, duraklatma ve bitiş ekranları tasarlayın.
Mobil Uyumluluk: Dokunmatik ekran kontrolleri ekleyin.
Parallax Scrolling: Arka plan elemanlarını farklı hızlarda kaydırarak derinlik hissi yaratın.
Fizik Motoru: Daha gerçekçi yuvarlanma ve zıplama efektleri için basit bir fizik motoru entegre edebilirsiniz (ancak bu, başlangıç için karmaşık olabilir).
Bu temel yapı, 2D Rolling Racers oyununuzu geliştirmek için harika bir başlangıç noktası olacaktır. İyi eğlenceler!









