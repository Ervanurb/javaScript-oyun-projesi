# 🏎️ Rolling Racers - 2D Sonsuz Yarış Oyunu

**Rolling Racers**, oyuncunun kontrol ettiği bir küple diğer küplerle yarıştığı, sonsuz bir 2D yarış oyunudur. Oyuncu, yol boyunca çıkan engellerden kaçmalı, güçlendiricileri toplamalı ve yüksek skor elde etmeye çalışmalıdır. Bu oyun, Rolling Racers (https://stevopineapple.itch.io/rolling-racers) oyunun temel mantığı örnek alınarak tasarlanmştır.

## 🎮 Özellikler

- Oyuncu kontrollü küp
- Sonsuz ilerleyen zemin
- Farklı türde engeller:
  - 🟫 Normal Engeller (güç karşılaştırmalı çarpışma)
  - 💣 Bombalar (anında oyun sonu)
  - ✨ Çarpan Bonusları (puanı geçici olarak ikiye katlar)
- Güçlendiriciler:
  - ⚡ Ekstra güç artışı
  - 🧲 Mıknatıs etkisi (yakın engellerden kaçınma)
- Dinamik skor sistemi
- Ses efektleri


## 🚀 Nasıl Çalıştırılır?

### 1. Projeyi İndir

```bash
git clone https://github.com/kullanici-adi/rolling-racers.git
cd rolling-racers

 ## Oyunun Ekran Görüntüsü

# Hedeflenen Oyun Mekaniği ve Özgün Yaklaşım
Seçilen Temel Mekanik: Dikeyde ilerleyen bir engelden kaçış oyununun temel mekaniği, oyuncunun engellerle etkileşim kurabilme ve gücünü yönetebilme yeteneğiyle zenginleştirilmiştir.

Oyun Adı: (Varsa, temel aldığınız spesifik bir oyunun adını buraya yazabilirsiniz. Eğer esinlendiğiniz genel bir tür ise boş bırakılabilir.)
Oyun Bağlantısı: (Varsa, temel aldığınız spesifik bir oyunun bağlantısını buraya yapıştırabilirsiniz.)

## Kullanılan Teknolojiler

- HTML5
- CSS3
- JavaScript (ES6)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

# Projemdeki Özgün Uyarlama:

## Dinamik Güç Sistemi: Oyuncunun bir güç (power) değeri bulunur. Çarpıştığı normal engellerle gücü karşılaştırılır; eğer oyuncunun gücü engelden yüksekse engeli yok eder ve gücü artar. Eğer gücü düşükse gücü azalır. Eşit güçte çarpışma ise oyunun bitmesine neden olur.
Toplanabilir Power-Up'lar: Yola rastgele dağılmış power-up'lar (sarı kareler) toplanarak oyuncunun gücü artırılabilir.
## Tehlikeli Bombalar: Normal engellere ek olarak, çarpıldığında oyunu anında bitiren bombalar oyuna eklenmiştir.
## Çarpan Bonusları: Oyuncunun gücünü iki katına çıkaran özel çarpan bonusları (2X) oyuna dinamizm katmaktadır.
## "Bullet Time" (Mermi Zamanı) Mekaniği: Oyuncu boşluk tuşuna basılı tutarak kısa süreliğine dünyayı yavaşlatabilir ve daha hassas hareket edebilir. Bu, zor anlarda stratejik avantaj sağlar.
## "Dash" (Atılma) Mekaniği: Oyuncu Shift tuşuna basarak kısa süreliğine ileri atılabilir. Bu, hızlı kaçışlar veya pozisyon alma için kullanılabilir ve bir soğuma süresi (cooldown) vardır.
##Kamera Takibi ve Dünya Kaydırma: Oyuncu ekranın belirli bir üst eşiğine (ekran yüksekliğinin %10'u) ulaştığında, oyuncunun dikey konumu sabit kalırken arka plan ve engeller aşağı doğru kayarak sonsuz bir ilerleme hissi yaratılır.
## Programatik Ses Efektleri: Çarpışmalar, power-up toplama, bullet time ve dash gibi olaylar için Web Audio API kullanılarak özgün ses efektleri programatik olarak üretilmiştir.

# Kontroller
Hareket: W, A, S, D tuşları veya Yukarı, Sol, Aşağı, Sağ ok tuşları.
Ses Kontrolü: Ana menüde ve oyun içinde bulunan "Ses Kapat/Aç" butonu.

# Oyun Sahnesi ve Nesneler
Oyun Sahnesi Zenginliği: Dinamik olarak kayan, ortasında şerit çizgileri bulunan bir yol, oyuncunun yukarı hareketine göre değişen kamera ofseti ile sürekli hareketli bir ortam sunulmuştur. Bu durum, oyunun "sonsuz koşucu" hissini pekiştirmektedir.
Kullanılan Nesneler:
Oyuncu (Küp): assets/cube.png görseliyle temsil edilen, gücü ve özel yetenekleri olan ana karakter.
Normal Engeller: assets/engel.png görseliyle temsil edilen, çarpışma gücüne sahip ve farklı değerlerdeki küpler.
Bombalar: assets/blast.png görseliyle temsil edilen, çarpıldığında oyunu anında bitiren tehlikeli objeler.
Çarpan Bonusları: assets/speed.png görseliyle temsil edilen ve üzerinde "2X" yazan, toplandığında oyuncunun gücünü iki katına çıkaran özel bonuslar.

# Tarayıcı Uyumluluğu
Bu oyun, Google Chrome ve Mozilla Firefox tarayıcılarında sorunsuz çalışacak şekilde test edilmiştir.



# Asset Kaynakları
Bu projede kullanılan ve kendime ait olmayan tüm görsel varlıkların kaynakları aşağıda belirtilmiştir:

assets/cube.png (Oyuncu Görseli), assets/engel.png (Engel Görseli), assets/blast.png (Bomba Görseli), assets/speed.png (Çarpan Bonusu Görseli): https://www.flaticon.com/
Ses Efektleri: playSound() fonksiyonu ile Web Audio API kullanılarak programatik olarak üretilmiştir. Harici bir ses dosyası kullanılmamıştır.
