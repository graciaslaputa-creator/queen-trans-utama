# Queen Trans Batam — Website Statis

Website ini menggunakan HTML, CSS, dan JavaScript murni. Tidak ada React, Next.js, Node.js, backend, API, database, atau proses build.

## Menjalankan website

Buka `index.html` langsung di browser atau gunakan static server sederhana.

## Deploy

Unggah seluruh file dan folder proyek ke `public_html` Hostinger. File utama website adalah `index.html`.

Nomor tujuan WhatsApp tersimpan di `queentransbatam.js` sebagai `6287791918354`.

## CDN dan LCP

Optimasi halaman utama: hero WebP dengan preload sesuai viewport, stylesheet
font/ikon CDN nonblocking (dengan fallback noscript), dan hero tanpa animasi masuk.
Gambar JPEG tetap tersedia untuk metadata sosial. Tidak ada proses build baru.

Konfigurasi `.htaccess` menyiapkan kompresi, cache aset, dan TTL HTML di CDN
300 detik; browser tetap memvalidasi HTML. Header ini tidak mengaktifkan CDN.

Untuk Cloudflare pada domain hosting yang sudah ada:

1. Tambahkan domain ke akun Cloudflare dan periksa seluruh record DNS, termasuk
   record email, sebelum mengikuti instruksi nameserver dari dashboard.
2. Aktifkan proxy untuk record website saja. Gunakan SSL Full (strict) jika
   sertifikat origin valid; pastikan website HTTPS dapat diakses.
3. Aset statis dicache secara default. Pertahankan cache key Standard yang
   menyertakan query string agar versi CSS/JS `?v=` tetap dibedakan.
4. Opsional untuk HTML statis: buat Cache Rule Eligible for cache, hanya untuk
   hostname website dan path `/` atau path berakhiran `.html`. Hormati header
   origin; `.htaccess` menetapkan TTL edge 300 detik. Jangan terapkan rule ini
   ke halaman akun, admin, atau API jika nanti ditambahkan.
5. Setelah upload, purge cache URL yang berubah. Ganti nama gambar jika kontennya
   berubah karena cache browser gambar berlaku satu tahun dan immutable.
6. Periksa response header aset melalui DevTools atau `curl -I`: `cf-cache-status`
   akan menunjukkan HIT pada permintaan berulang yang sudah dicache (permintaan
   pertama dapat MISS). Verifikasi Content-Encoding dan Cache-Control juga.
7. Ukur ulang LCP mobile dan desktop pada URL produksi dengan cache browser kosong,
   beberapa kali dengan jaringan yang sama. Angka LCP baru belum diukur di proyek ini.

Dokumentasi resmi:
- https://developers.cloudflare.com/cache/concepts/default-cache-behavior/
- https://developers.cloudflare.com/cache/concepts/cdn-cache-control/
- https://developers.cloudflare.com/cache/how-to/set-caching-levels/

Catatan diagnosis: selector `div.terminal-object` dari laporan awal tidak ada
pada source proyek ini; pastikan pengukuran berasal dari URL Queen Trans yang benar.

## SEO / GEO dan perbaikan navigasi — 30 September 2026

Seluruh 11 halaman memiliki judul/deskripsi unik, canonical HTTPS, metadata
Open Graph/Twitter, identitas bisnis `AutoRental`, `WebSite`, serta data halaman
sesuai kontennya. Artikel memakai `BlogPosting`; FAQ memakai 15 tanya-jawab yang
sama dengan HTML; profil memakai `AboutPage`; dokumentasi memakai `ImageGallery`.
Breadcrumb terlihat oleh pengunjung, ringkasan artikel dan profil penerbit
tersedia tanpa JavaScript, dan sitemap mencakup semua URL canonical.

Rating agregat 4,9 / 1.250 ulasan dan koordinat lama dihapus dari metadata karena
belum ada sumber yang memvalidasinya. Jam layanan pemesanan 24 jam ditaruh di
ContactPoint, bukan dianggap sebagai jam buka kantor fisik. Data izin perusahaan
mengikuti informasi yang sudah dipublikasikan pemilik pada halaman Tentang Kami.

Bahasa sumber untuk indexing adalah Indonesia. Pemilih bahasa bekerja di browser;
tidak ditambahkan hreflang untuk URL bahasa terpisah yang belum tersedia.
`robots.txt` sudah mengizinkan crawling halaman publik dan menunjuk sitemap.
Tidak ada file AI khusus atau jaminan peringkat yang ditambahkan.

Navigasi mobile: `body.qt-nav-open` tidak lagi menggunakan `overflow:hidden`,
yang membuat body menjadi ancestor scroll baru bagi header sticky. Overlay memakai
warna gelap tanpa blur dan menahan gesture sentuh di luar menu. State menu dibersihkan
saat kembali lewat history, berpindah ke desktop, atau mengikuti anchor lokal.

Pemeriksaan lokal:

```sh
python3 scripts/check-seo.py  # Memerlukan beautifulsoup4.
node scripts/check-navigation.cjs
```

Pemeriksaan ini memvalidasi metadata, JSON-LD, kecocokan FAQ, tautan lokal,
sitemap, dan state JavaScript menu. Pengujian ini bukan pengukuran ranking atau
pengganti render browser. Browser pengujian tidak tersedia pada sesi perubahan.

Sesudah deployment:

1. Unggah semua HTML yang berubah, `design-system.css`, `seo-content.css`,
   `queentransbatam.js`, `blog-enhancements.js`, `smooth-scroll.js`, `sitemap.xml`,
   dan file optimasi dari perubahan sebelumnya. Pertahankan query versi aset.
2. Purge cache HTML CDN. Pada HP, buka FAQ dan Tentang Kami, gulir jauh ke bawah,
   buka hamburger, pilih tautan, lalu kembali. Menu harus terlihat di bawah header,
   bisa ditutup, dan tidak meninggalkan overlay. Ulangi di Safari/Chrome serta
   orientasi portrait/landscape.
3. Verifikasi properti domain di Google Search Console dan Bing Webmaster Tools,
   kirim `https://queentransbatam.com/sitemap.xml`, lalu periksa URL dan indexing.
4. Jalankan Rich Results Test/Schema Markup Validator pada URL produksi.
   Markup valid tidak menjamin rich result, peringkat, atau kutipan jawaban AI.
5. Samakan nama, alamat, kontak, serta jam layanan dengan Google Business Profile
   yang dikelola perusahaan. Pantau impresi, klik, query, serta halaman terindeks;
   gunakan data aktual untuk menentukan konten berikutnya.

Sumber pedoman:
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a
