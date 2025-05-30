# Salon Saç - Salon Yönetim Sistemi Backend

## 📌 Proje Hakkında

**Salon Saç**, kuaför ve güzellik salonlarının çalışan, müşteri ve hizmet yönetimini kolaylaştırmak için geliştirilen profesyonel bir salon yönetim sistemidir.

Bu proje ile:

- Salon içi çalışanların ve patronların yetkilere göre ayrılması,
- Müşteri, hizmet, randevu, kasa hareketleri ve maaş/prim/avans işlemlerinin yönetimi,
- Kullanıcı rollerine göre işlem kısıtlamaları ve yetkilendirme sistemlerinin sağlanması hedeflenmiştir.

Sistem, gerçek dünya ihtiyaçlarına göre esnek, güvenli ve genişletilebilir bir mimariyle geliştirilmiştir.

---

## 🛠 Kullanılan Teknolojiler

- **Backend Framework:** Node.js + Express.js
- **API İletişimi:** GraphQL (Apollo Server)
- **Veritabanı:** MongoDB (Mongoose ODM)
- **Authentication & Authorization:** JWT (Json Web Token) ile kimlik doğrulama ve rol bazlı yetkilendirme
- **Şifre Güvenliği:** bcrypt ile güçlü şifreleme
- **Veri Doğrulama:** validator paketi ile email ve şifre validasyonu
- **Ortam Değişkenleri:** dotenv paketi ile güvenli konfigürasyon

---

## 🎯 Proje Özellikleri

- **Rol Bazlı Kullanıcı Yönetimi:**
  - Patron: Tam yetkili kullanıcı.
  - Çalışan: Sadece kendi verilerini görebilir ve güncelleyebilir.
  - Misafir: Kısıtlı işlemler.
- **Authentication Sistemi:**
  - Kayıt olma (register)
  - Giriş yapma (login)
  - Şifre güvenliği ve hashlenmesi
- **Kullanıcı İşlemleri:**
  - Kullanıcı kendi adını, telefon numarasını ve şifresini güncelleyebilir.
  - Patron, çalışanların maaş, prim ve avans bilgilerini değiştirebilir.
  - Patron, çalışanların rolünü değiştirebilir (misafir → çalışan / çalışan → patron).
- **Müşteri ve Hizmet Yönetimi:**
  - Müşteri ekleme, listeleme, silme
  - Hizmet ekleme, listeleme, silme
  - (İlerleyen aşamada: Randevu, Kasa Hareketleri, Maaş Takip modülleri entegre edilecektir.)
- **Güvenlik Önlemleri:**
  - Tüm hassas işlemler token tabanlı korunmaktadır.
  - Yetkisiz kullanıcı işlemleri engellenmektedir.
  - Şifreler hiçbir zaman veritabanında düz metin olarak saklanmaz.
- **Gelişmiş Veri Modelleme:**
  - Employee, Customer, Service gibi entity’ler modern veri modelleme tekniklerine göre tasarlanmıştır.
  - MongoDB üzerinden hızlı ve güvenilir veri erişimi sağlanmaktadır.

---

## 🚀 Projenin Sağladığı Avantajlar

- Çalışan ve patron yönetimini dijital ortama taşır.
- İşletme içerisindeki veri takibini düzenler ve hataları azaltır.
- Yetkilere göre veri güvenliğini artırır.
- Geliştirilebilir mimarisi sayesinde kolayca yeni modüller eklenebilir (Örneğin randevu sistemi, kasa raporları, gelir/gider tabloları).

---

## 🔥 Geliştirme Süreci

Bu proje, adım adım planlı ve test odaklı bir geliştirme süreci izlenerek oluşturulmuştur:

- Planlama → Modelleme → API geliştirme → Test → Güvenlik iyileştirmeleri
- Tüm CRUD ve authentication işlemleri Postman ile test edilmiştir.
- Kod yapısı modüler, okunabilir ve sürdürülebilir olacak şekilde organize edilmiştir.

---

# 📦 Projenin Gelecek Planları

- **Flutter Mobil Uygulaması**: Salon çalışanlarının telefon üzerinden randevu ve işlem yönetimi yapabilmesi
- **Next.js Web Panel**: Patronlar için gelişmiş bir yönetim paneli (isteğe bağlı)

---

# ✨ Sonuç

Salon Saç - Salon Yönetim Sistemi, küçük ve orta ölçekli işletmelerin günlük operasyonlarını dijital ortama taşımak için geliştirilmiş güçlü bir backend altyapısıdır.

Modern teknolojilerle geliştirilen bu proje, iş süreçlerini hızlandırır, hata oranını azaltır ve verimliliği artırır.

---

# 🎯 Proje Sahibi

**Berat A.**

Backend Developer | Flutter & Web Uygulamaları Geliştiricisi

---

# 📎 Not

Proje geliştirme sürecinde **temizlik, güvenlik ve sürdürülebilirlik** ilkeleri esas alınmıştır.

Her satır kod; test edilerek, gerçek dünya ihtiyaçlarına göre uyarlanarak yazılmıştır.
