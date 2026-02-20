# Yardım Dernekleri İlan Platformu - Sistem Mimarisi ve Proje Planı

Bu belge, derneklerin ilan verebileceği, PWA destekli, mobil öncelikli uygulamanın mimari tasarımını, veri modelini ve proje yaşam döngüsü planını içermektedir.

---

## 1. Sistem Mimarisi Diyagramı (Metinsel)

```text
[ İstek ] -> [ Vercel Edge / Node.js Serverless ] (Next.js 16 App Router)
                       |
                       +--> [ Yönlendirme & Sayfa Render ] (SSR/SSG & ISR)
                       |
                       +--> [ Server Actions ] <--- (Gelişmiş Güvenlik ve Veri Manipülasyonu)
                                |
                                +-- (Auth) ----> [ Firebase Auth ] (Google Login)
                                |
                                +-- (Yetki) ---> [ Firebase Admin SDK ] (Rol Kontrolü & Güvenli DB İşlemleri)
                                |
                                +-- (Veri) ----> [ Firebase Firestore ] (NoSQL DB)
                                |
                                +-- (Dosya) ---> [ Cloudflare R2 ] (S3 Uyumlu Object Storage)
                                                        ^
[ Client (Tarayıcı / PWA) ]                             | (Signed URL ile Doğrudan Yükleme)
      |                                                 |
      +-- (Sınırlandırılmış Doğrudan Yükeleme) ---------+
```

### Klasör Yapısı (Modern / Scalable)
```text
src/
├── app/                  # Next.js App Router sayfaları ve layoutlar
│   ├── (public)/         # Herkese açık sayfalar (Ana sayfa, ilanlar)
│   ├── (admin)/          # Admin paneli (Sadece yetkililer girebilir)
│   ├── api/              # (Gerekirse) Webhook veya dış API endpointleri
│   └── layout.tsx
├── actions/              # Server Actions (CRUD işlemleri, form backend'leri)
│   ├── announcement.ts
│   ├── association.ts
│   └── storage.ts        # Signed URL oluşturma işlemleri
├── components/           # UI Bileşenleri (Reusable)
│   ├── ui/               # Temel elementler (Button, Input, Modal - shadcn/ui benzeri)
│   ├── announcements/    # İlan kartları, filtreler, whatsapp butonu
│   ├── admin/            # Admin formları, dashboard araçları
│   └── shared/           # Header, Footer, PWA Install Prompt
├── hooks/                # Custom React Hooks (useRandomAnnouncements, vb.)
├── lib/                  # Yapılandırma ve Servis Başlatıcıları
│   ├── firebase/         # Firebase Client SDK config
│   ├── firebase-admin/   # Firebase Admin SDK config
│   ├── r2/               # S3/R2 AWS-SDK client
│   └── sharp.ts          # Görsel işleme config
├── types/                # TypeScript Interfaces & Types (Veri modeli tipleri)
└── utils/                # Yardımcı fonksiyonlar (Tarih formatlama, URL oluşturma vb.)
```

---

## 2. Veri Modeli (Firestore)

Veritabanı döküman-tabanlı (NoSQL) olarak Firebase Firestore üzerinde tasarlanmıştır.

### Koleksiyon: `admins`
Admin erişiminin yönetildiği gizli güvenilir kaynak.
* `uid`: String (Firebase Auth UUID, Document ID)
* `email`: String (Google Login Email)
* `role`: String ("superadmin", "editor")
* `createdAt`: Timestamp
* `isActive`: Boolean

### Koleksiyon: `associations`
Derneklerin bilgilerini saklar.
* `id`: String (Document ID)
* `name`: String
* `logoUrl`: String (R2 CDN URL)
* `address`: String
* `phone`: String
* `website`: String (Opsiyonel)
* `createdAt`: Timestamp
* `updatedAt`: Timestamp

### Koleksiyon: `announcements`
İlan detayları ve ağırlıkları bu koleksiyonda bulunur. (Aylık artan veri için uygun yapı)
* `id`: String (Document ID)
* `associationId`: String (associations tablosu referansı)
* `title`: String
* `shortDescription`: String
* `fullDescription`: String
* `images`: Array<String> (R2 CDN URL'leri, filigranlanmış ve optimize edilmiş)
* `videos`: Array<String> (YouTube Linkleri veya R2 Video URL'leri)
* `contactInfo`: Object (Opsiyonel: Eğer boşsa genel/dernek nosu kullanılır)
  * `fullName`: String
  * `email`: String
  * `whatsappPhone`: String
* `status`: String Enum ("active", "passive", "archived")
* `featured`: Boolean (Öne çıkanlar)
* `randomWeight`: Number (Random listelemeyi hesaplamak/optimize etmek için kullanılabilir)
* `createdAt`: Timestamp
* `updatedAt`: Timestamp

---

## 3. API Akışı & Entegrasyonlar

Next.js 16'nın getirdiği **Server Actions** ile API Routes ihtiyacı minimize edilecektir.

**1. Auth ve Rol Kontrol Akışı:**
1. Admin, gizli route'a gider (örn: `/admin-portal-xyz` veya query-param ile korunan bir URL).
2. Firebase Authentication (Google) üzerinden giriş yapar.
3. Client'tan Firebase ID Token alınır ve Next.js Server Action (`verifyAdmin`)'a gönderilir.
4. Server Action, Firebase Admin SDK ile token'ı doğrular ve kullanıcının UID'sini `admins` koleksiyonunda kontrol eder.
5. Onaylanırsa yetkili bir Http-Only `Session Cookie` oluşturulur ve admin paneline yönlendirilir.

**2. Görsel Yükleme & Sharp Mimarisi (Hybrid Approach):**
*Gereksinim: Hem doğrudan R2'ye Signed URL ile yükleme, hem de server tarafında Sharp ile optimizasyon & watermark yapılması.*
1. **İstek:** Admin client'ta dosyayı seçer, Next.js Server Action'a metadata iletir.
2. **Server Action:** Dosya boyutunu kontrol eder. Client'ın doğrudan Vercel üzerinden server'a dosyayı göndermesi (formData ile) Vercel'in limitlerine (örn. 4.5MB payload limit) takılabilir.
3. **Akış Optimizasyonu:** Büyük dosyalar Server Action'a FormData olarak gelip **Sharp** üzerinden geçirilip buffer'a alınır, ardından `@aws-sdk/client-s3` aracılığıyla Cloudflare R2'ye aktarılır.
    * *Performans notu:* Vercel limitlerini aşan (örn 10MB+) dosyalar doğrudan R2'ye Signed URL ile `staging/` klasörüne yüklenir. Sonra bir webhook/Server Action R2'den stream ile dosyayı alır, Sharp'tan geçirir (Watermark vs. ekler), `production/` klasörüne yazar ve orijinalini siler.

**3. İlan Gösterimi ve Rastgele Dağılım Sıralaması:**
* Firestore'da büyük koleksiyonlardan tamamen rastgele veri çekmek (Random) verimsizdir.
* **Çözüm Algoritması:** Yeni bir ilan açılırken `randomWeight` (örneğin 1-1000 arası rastgele tamsayı) atanır. Client'tan rastgele istek geldiğinde frontend rastgele bir sayı öğretir ve Firestore `where('randomWeight', '>=', clientRandomNumber).limit(10)` sorgusu yapar veya Edge Cache (Redis) vb. ile son 1 haftanın ilan id'leri önbellekte (in-memory) karıştırılarak kullanıcıya sunulur. Bu performans dostu bir cache-busting mantığı yaratır.

---

## 4. Güvenlik Planı

* **Firestore Security Rules:** Client-side isteklerini (sadece okuma amaçlı) sınırlarız.
  ```javascript
  match /announcements/{docId} {
    allow read: if resource.data.status == 'active';
    allow write: if false; // Tümü Server Actions (Admin SDK) ile yapılır.
  }
  ```
* **Admin Route Koruması:** Admin sayfaları (`/admin/layout.tsx`) Middleware tarafında gelen Auth Cookie'sini (JWT) kontrol eder. Cookie geçersizse anında `/` ana sayfaya yönlendirilir.
* **Signed URL Koruması:** Storage yüklemeleri için oluşturulan pre-signed URL'ler sadece 5 dakika geçerli (`expiresIn: 300`) olacak şekilde tokenlanır. Sadece doğrulanmış Admin'ler bu URL'leri oluşturma hakkına sahip olur.
* **Rate Limiting:** Vercel KV / Upstash Redis ile `src/actions` içerisindeki kritik aksiyonlara (Sign-in form, SignedURL istekleri) *IP-Based Rate Limit* uygulanacaktır (örn: Dk'da maksimum 10 istek).

---

## 5. Ölçeklenebilirlik Planı (Scalability)

1. **Görsel Depolama (Cloudflare R2):** S3 API uyumlu olarak R2 seçildiği için egress bant genişliği ücreti sıfırdır. Bu, çok sayıda kullanıcının resim/video indirmesi maliyet yaratmayacaktır.
2. **CDN ve Caching:** Next.js veri fetch işlemlerinde `next/cache` kullanılarak, ilanlar (örneğin günlük/saatlik) önbelleğe alınacak. Son 1 haftanın ilan listesi Vercel Data Cache'de tutularak Firestore okuma (read) maliyetleri %90 oranında düşürülecektir.
3. **Multi-tenant Geleceği:** İleride her dernek kendi ilanını yönetmek isterse: `admins` koleksiyonunda `role: 'association_admin'` yetkisi tanımlanır ve kullanıcının içine `managedAssociationIds: ['assoc123']` listesi eklenerek RLS (Row Level Security) katmanı Server Actions'a yedirilebilir.

---

## 6. Risk Analizi

| Risk | Etki | İhtimal | Azaltma / Çözüm Stratejisi |
| :--- | :--- | :--- | :--- |
| **Firestore Read Maliyeti** <br/>(Sürekli F5 basılması) | Yüksek | Yüksek | Next.js tarafında ISR (saatlik rebuild) veya Server-side memory caching uygulanarak Firestore sorgularının azaltılması. Randomizasyonun client-side veya cache-layer tarafında karışımla (shuffle) yapılması. |
| **Mobil Performans** <br/>(Çoklu görsel ve videolar) | Yüksek | Orta | Sharp.js ile WebP formata zorunlu dönüşüm. Resimler için Next.js `<Image>` bileşeni ve Cloudflare entegrasyonu. Videoların lazy-loading (sadece tıklanınca/görününce YouTube iframe yükleme) yöntemiyle yüklenmesi. |
| **PWA Cache'de Eski Veri** | Orta | Orta | Service Worker mimarisinde Network-First (veya Stale-While-Revalidate) stratejisi kullanmak. `next-pwa` config'ini veri isteklerini (API/ServerAction) cachelemeyecek, yalnızca statik CSS/JS ve app kabuğunu (App Shell) cacheleyecek şekilde ayarlamak. |
| **Vercel Execution Limit** <br/>(Büyük resim Upload'u) | Orta | Orta | Resimleri önce Signed URL ile R2'ye yükletip, görsel işlemeyi (watermark/sharp) Vercel üzerinde yapabilmek için dosya boyutu limitlerine dikkat edilmeli. |

---

## 7. Ekstra Stratejiler

### Performans ve SEO
* **SEO Stratejisi:** Next.js Metadata API ile her bir ilan için dinamik (Server-Side) `og:title`, `og:image`, `twitter:card` oluşturulmalıdır. WhatsApp paylaşımlarında zengin önizleme görülmesi için `<meta>` tagleri kritik seviyededir.
* **JSON-LD (Schema Markup):** İlanlar Google için `JobPosting` veya `Article` veri tiplerinde `<script type="application/ld+json">` tagıyla sayfaya gömülecektir.

### PWA Stratejisi
* Kullanıcılar siteye ilk girdiğinde (mobil cihazda), `manifest.json` ve metadata aracılığıyla sistem "Ana Ekrana Ekle" (A2HS) teklifi sunacaktır.
* Özel bir PWA prompt UI (snackbar vb.) hazırlanıp, kullanıcının Apple (Share -> Add to Home Screen) veya Android deneyimleri yönlendirilebilir kılınacaktır.
* Offline Modda: Kullanıcı önbellekteki ilan kartlarını görebilecek; ancak yeni bir WhatsApp tıklaması tetiklendiğinde normal cihaz WhatsApp uygulaması açılacağından offline durum WhatsApp share için engel teşkil etmeyecektir.

### WhatsApp Entegrasyonu Akışı
Kullanıcı WhatsApp butonuna bastığında dinamik URL oluşturulur:
```typescript
const url = `https://wa.me/${telefonNumarasi}?text=${encodeURIComponent(
  `Merhaba, ilanınız için iletişime geçiyorum:\n${ilanBasligi}\nDetay: ${siteURL}/ilan/${ilanId}`
)}`;
```
Bu sayede iletişim anında kurulmuş olur ve hangi ilandan ulaşıldığı yetkiliye hazır script ile aktarılmış olur.

---

Bu plan dahilinde, projeyi Next.js 16 (App Router), Firebase ve Tailwind 4 kullanarak, `npm` (veya `pnpm`, `yarn`) ile hızlıca başlatabilir ve `src` klasör temelini inşa etmeye geçebiliriz.
