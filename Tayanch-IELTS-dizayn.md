# Tayanch IELTS dizayni (7 ta ekran)

Claude Design kanvasidan eksport: https://claude.ai/artifact/6rKXWxXRMzckmGnBsptA92
Palitra: oq #ffffff, ikkinchi fon #f5f6fa, qora #0f1115, ko'k #4255ff (hover #2f40e0), tavsif #4a5063. Shrift: Figtree (400/500/700/800). Bo'shliqlar 4px shkalada, radius 6/16/24px va to'liq yumaloq, tugmalar kamida 48px. Kvadrat qavsdagi matnlar ([rasmiy manbadan], [rasmiy havola], [kanal manzili], [sana] va boshqalar) joy egallovchi, saytga qo'yishdan oldin muallif to'ldiradi.

Ekranlar: Main (IELTS kirish, kompyuter), KirishTelefon (kirish, telefon), Qollanma (Reading qo'llanma qolipi, kompyuter), QollanmaTelefon (qo'llanma, telefon), Reja (30 kunlik reja vositasi, kompyuter), RejaTelefon (reja, telefon), RejaHolatlar (telefondagi reja uch holatda).

## canvas.json

```json
{"v":3,"createdOnFiles":{"v":1,"at":"2026-11-04T12:00:00Z"},"title":"Tayanch IELTS bo'limi","launch":{"view":"canvas"},"pages":[],"boards":{"Main.dc.html":{"x":0,"y":0,"w":1280,"h":2900,"title":"1. IELTS kirish sahifasi (kompyuter, 1280)"},"KirishTelefon.dc.html":{"x":1360,"y":0,"w":390,"h":3800,"title":"1. IELTS kirish sahifasi (telefon, 390)","is_interactive":true},"Qollanma.dc.html":{"x":0,"y":4400,"w":1280,"h":3500,"title":"2. Qo'llanma qolipi: Reading (kompyuter, 1280)","is_interactive":true},"QollanmaTelefon.dc.html":{"x":1360,"y":4400,"w":390,"h":5800,"title":"2. Qo'llanma qolipi: Reading (telefon, 390)","is_interactive":true},"Reja.dc.html":{"x":0,"y":10900,"w":1280,"h":2400,"title":"3. Reja vositasi (kompyuter, 1280)","is_interactive":true},"RejaTelefon.dc.html":{"x":1360,"y":10900,"w":390,"h":3800,"title":"3. Reja vositasi (telefon, 390)","is_interactive":true},"RejaHolatlar.dc.html":{"x":1830,"y":10900,"w":1250,"h":900,"title":"3. Reja vositasi: telefon holatlari","is_interactive":true}},"order":["Main.dc.html","KirishTelefon.dc.html","Qollanma.dc.html","QollanmaTelefon.dc.html","Reja.dc.html","RejaTelefon.dc.html","RejaHolatlar.dc.html"],"notes":{"sarlavha":{"x":0,"y":-300,"text":"Tayanch IELTS: kirish, qo'llanma, reja","kind":"title1","maxW":3080},"izohKirish":{"x":0,"y":2940,"w":640,"fill":"blue","text":"Sahifadagi asosiy harakat bitta: reja vositasiga olib boradigan katta karta, soya faqat unda. Rasmiy namunalar uchta bir xil karta qatori emas, bitta chegarali ro'yxat: telefonda ham shu shaklda o'qiladi. SAT'dan farqi: sidebar'da 'tez orada' bandlar havola emas, kulrang yorliqli matn; nav radiusi 12 emas, shkaladagi 16px."},"izohKirishTel":{"x":1360,"y":3840,"w":390,"fill":"blue","text":"Menyu hamburger orqali ochiladi (Play'da bosib ko'r), tarkibi sidebar bilan bir xil. Reja kartasi qadamlardan keyin, rasmiy havolalardan oldin turadi. SAT telefon maketi qora fonda edi; bu yerda dizayn tizimidagi oq fon saqlandi."},"izohQollanma":{"x":0,"y":7940,"w":640,"fill":"blue","text":"Format kartasidagi sonlar ataylab bo'sh: '[rasmiy manbadan]' turibdi. Mundarija o'ngda yopishqoq, soya faqat T/F/NG mini-mashq kartasida. SAT'da 'qoida + misol' bloki yo'q edi: dalil gap ko'k fon va tagiga chiziq bilan belgilanadi, ma'noni faqat rang tashimaydi."},"izohQollanmaTel":{"x":1360,"y":10240,"w":390,"fill":"blue","text":"Mundarija sahifa boshida yig'iladigan tugma (Play'da ochiladi), shunda matnga tez yetiladi. 'Qoida + misol' ustma-ust: avval qoida, keyin parcha. T/F/NG tugmalari to'liq kenglikda, 56px baland."},"izohReja":{"x":0,"y":13340,"w":640,"fill":"blue","text":"Uch savol bittadan ekranda, tepada progress chizig'i; javob tanlanmaguncha 'Keyingisi' o'chiq. Natijada eng qiyin bo'limga 30 kundan 12 tasi beriladi, har hafta oxiri takrorlash kuni. Holat Tweaks'dan almashtiriladi (bo'sh, savol, natija, bajarilgan). SAT'dagi 'Mening natijalarim'dan farqi: ball ham, band ham yo'q."},"izohRejaTel":{"x":1360,"y":14740,"w":390,"fill":"blue","text":"Telefonda haftalar kartasi ichida kunlar qator bo'lib turadi; butun qator katakchaning label'i, barmoq bilan bosish oson. Kompyuterdagi 7 ustunli to'r o'rniga ro'yxat: 390px'da kun nomi qisqarmaydi."},"izohRejaHol":{"x":1830,"y":11840,"w":640,"fill":"blue","text":"Bitta telefon fayli uch holatda: hali reja yo'q, savol ekrani, bajarilgan kunlar. 'Ma'lumotlaring faqat shu brauzerda saqlanadi' eslatmasi har holatda ko'rinadi."}},"designSystems":[]}
```

## Main.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>Tayanch IELTS kirish sahifasi</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#ffffff}
a{color:#4255ff}a:hover{color:#2f40e0}
a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #4255ff;outline-offset:2px}
</style>
</helmet>
<div style="width: 1280px; min-height: 2900px; box-sizing: border-box; font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #ffffff; display: flex">

<aside aria-label="IELTS bo'limi" style="flex: 0 0 288px; box-sizing: border-box; border-right: 1px solid #e6e8ee; padding: 20px 16px; display: flex; flex-direction: column; gap: 24px; background: #ffffff">
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; text-decoration: none; color: #0f1115">
<span aria-hidden="true" style="width: 36px; height: 36px; border-radius: 6px; background: #0f1115; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px">T</span>
<span style="font-weight: 800; font-size: 18px">Tayanch <span style="color: #4255ff">IELTS</span></span>
</a>

<nav aria-label="IELTS navigatsiyasi" style="display: flex; flex-direction: column; gap: 20px">
<a href="#" aria-current="page" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px">
<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path></svg>
IELTS bo'limi haqida</a>

<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Qo'llanmalar</p>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg>Listening</a>
<a href="Qollanma.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg>Reading</a>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg><span style="flex: 1">Writing Task 2</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"></path></svg><span style="flex: 1">Speaking</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"></path></svg><span style="flex: 1">General English</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span></p>
</div>

<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Vositalar</p>
<a href="Reja.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>30 kunlik reja</a>
</div>
</nav>

<div style="margin-top: auto; border-top: 1px solid #e6e8ee; padding-top: 16px; display: flex; flex-direction: column; gap: 4px">
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #4a5063; text-decoration: none; font-weight: 500; font-size: 14px"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>Tayanch bosh sahifasi</a>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #4a5063; text-decoration: none; font-weight: 500; font-size: 14px"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"></path></svg>Telegram kanal</a>
</div>
</aside>

<main style="flex: 1 1 auto; min-width: 0; box-sizing: border-box; padding: 56px 40px 64px">
<div style="max-width: 912px; display: flex; flex-direction: column; gap: 64px">

<section aria-labelledby="ielts-h" style="display: flex; gap: 32px; align-items: stretch">
<div style="flex: 3 1 0; display: flex; flex-direction: column; gap: 20px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">IELTS bo'limi · mustaqil tayyorgarlik</p>
<h1 id="ielts-h" style="margin: 0; font-size: 46px; line-height: 1.1; font-weight: 800; letter-spacing: -0.5px">IELTS'ga o'zing tayyorlan,<br><span style="color: #4255ff">reja bilan.</span></h1>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063; max-width: 56ch">Bu yerda har bo'lim uchun strategiya va kunma-kun mashq rejasi bor. Natijani esa hech kim kafolatlay olmaydi, biz ham: u sening mashqingga bog'liq.</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 4px">
<a href="Reja.dc.html" style="display: inline-flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 28px; border-radius: 999px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 16px">30 kunlik reja tuzish<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
<a href="#boshla" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 28px; border-radius: 999px; background: #f5f6fa; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px">Qayerdan boshlayman?</a>
</div>
</div>

<div style="flex: 2 1 0; box-sizing: border-box; background: #0f1115; color: #ffffff; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8b97ff">Imtihon to'rt bo'limdan iborat</p>
<ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px">
<li style="background: #1b1e26; border: 1px solid #2a2e38; border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 12px"><span aria-hidden="true" style="width: 36px; height: 36px; flex: none; border-radius: 6px; background: #4255ff; display: flex; align-items: center; justify-content: center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg></span><div><p style="margin: 0; font-weight: 800; font-size: 16px">Listening</p><p style="margin: 0; font-size: 14px; color: #b4b9c8">[vaqt: rasmiy manbadan]</p></div></li>
<li style="background: #1b1e26; border: 1px solid #2a2e38; border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 12px"><span aria-hidden="true" style="width: 36px; height: 36px; flex: none; border-radius: 6px; background: #4255ff; display: flex; align-items: center; justify-content: center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg></span><div><p style="margin: 0; font-weight: 800; font-size: 16px">Reading</p><p style="margin: 0; font-size: 14px; color: #b4b9c8">[vaqt: rasmiy manbadan]</p></div></li>
<li style="background: #1b1e26; border: 1px solid #2a2e38; border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 12px"><span aria-hidden="true" style="width: 36px; height: 36px; flex: none; border-radius: 6px; background: #4255ff; display: flex; align-items: center; justify-content: center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg></span><div><p style="margin: 0; font-weight: 800; font-size: 16px">Writing</p><p style="margin: 0; font-size: 14px; color: #b4b9c8">[vaqt: rasmiy manbadan]</p></div></li>
<li style="background: #1b1e26; border: 1px solid #2a2e38; border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 12px"><span aria-hidden="true" style="width: 36px; height: 36px; flex: none; border-radius: 6px; background: #4255ff; display: flex; align-items: center; justify-content: center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"></path></svg></span><div><p style="margin: 0; font-weight: 800; font-size: 16px">Speaking</p><p style="margin: 0; font-size: 14px; color: #b4b9c8">[vaqt: rasmiy manbadan]</p></div></li>
</ul>
</div>
</section>

<section id="boshla" aria-labelledby="boshla-h" style="display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px">
<h2 id="boshla-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">Qayerdan boshlayman?</h2>
<p style="margin: 0; font-size: 14px; font-weight: 500; color: #4a5063">Shu tartibda, bir haftadan kam vaqtda</p>
</div>
<ol style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<li style="padding: 24px 28px; display: grid; grid-template-columns: 56px minmax(0, 1fr) auto; align-items: center; column-gap: 20px">
<span aria-hidden="true" style="width: 48px; height: 48px; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px">1</span>
<div style="display: flex; flex-direction: column; gap: 4px"><h3 style="margin: 0; font-size: 24px; font-weight: 800">Format bilan tanish</h3>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">To'rt bo'limning har birida nima so'raladi va qancha vaqt beriladi.</p></div>
<a href="Qollanma.dc.html" style="font-weight: 700; font-size: 16px; white-space: nowrap; min-height: 48px; display: inline-flex; align-items: center">Format kartalari</a>
</li>
<li style="padding: 24px 28px; display: grid; grid-template-columns: 56px minmax(0, 1fr) auto; align-items: center; column-gap: 20px; border-top: 1px solid #e6e8ee">
<span aria-hidden="true" style="width: 48px; height: 48px; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px">2</span>
<div style="display: flex; flex-direction: column; gap: 4px"><h3 style="margin: 0; font-size: 24px; font-weight: 800">Rasmiy namunani ishla</h3>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Bepul rasmiy namunani soat bilan ishla. Qaysi bo'lim qiyinroq ekani shunda ko'rinadi.</p></div>
<a href="#rasmiy" style="font-weight: 700; font-size: 16px; white-space: nowrap; min-height: 48px; display: inline-flex; align-items: center">Rasmiy namunalar</a>
</li>
<li style="padding: 24px 28px; display: grid; grid-template-columns: 56px minmax(0, 1fr) auto; align-items: center; column-gap: 20px; border-top: 1px solid #e6e8ee">
<span aria-hidden="true" style="width: 48px; height: 48px; border-radius: 999px; background: #4255ff; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px">3</span>
<div style="display: flex; flex-direction: column; gap: 4px"><h3 style="margin: 0; font-size: 24px; font-weight: 800">30 kunlik reja tuz</h3>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Uchta savolga javob ber: reja qiyin bo'limingga ko'proq kun ajratadi.</p></div>
<a href="Reja.dc.html" style="font-weight: 700; font-size: 16px; white-space: nowrap; min-height: 48px; display: inline-flex; align-items: center">Reja tuzish</a>
</li>
</ol>
</section>

<section aria-labelledby="reja-cta-h" style="background: #ffffff; border: 1.5px solid #0f1115; border-radius: 24px; box-shadow: 0 8px 24px rgba(15,17,21,0.10); padding: 40px; display: flex; gap: 40px; align-items: center">
<div style="flex: 1 1 0; display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Asosiy qadam</p>
<h2 id="reja-cta-h" style="margin: 0; font-size: 32px; line-height: 1.2; font-weight: 800">Uch savolga javob ber, 30 kunlik rejang tayyor</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Imtihongacha qancha vaqt qolgani, kuniga necha soat bo'shligi va qaysi bo'lim qiyinligi. Reja shulardan tuziladi.</p>
<div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding-top: 4px">
<a href="Reja.dc.html" style="display: inline-flex; align-items: center; gap: 12px; min-height: 56px; padding: 0 32px; border-radius: 999px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 18px">Rejani tuzish<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
<p style="margin: 0; font-size: 14px; font-weight: 500; color: #4a5063">Ro'yxatdan o'tish ham, email ham kerak emas.</p>
</div>
</div>
<div aria-hidden="true" style="flex: 0 0 300px; background: #f5f6fa; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 8px">
<p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">1-hafta, namuna</p>
<div style="background: #ffffff; border-radius: 6px; padding: 12px 12px; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700"><span style="width: 20px; height: 20px; border-radius: 6px; background: #4255ff; display: flex; align-items: center; justify-content: center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"></path></svg></span><span style="color: #4a5063; font-weight: 500; width: 44px">1-kun</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>Writing</div>
<div style="background: #ffffff; border-radius: 6px; padding: 12px 12px; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700"><span style="width: 20px; height: 20px; box-sizing: border-box; border-radius: 6px; border: 1.5px solid #0f1115"></span><span style="color: #4a5063; font-weight: 500; width: 44px">2-kun</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg>Listening</div>
<div style="background: #ffffff; border-radius: 6px; padding: 12px 12px; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700"><span style="width: 20px; height: 20px; box-sizing: border-box; border-radius: 6px; border: 1.5px solid #0f1115"></span><span style="color: #4a5063; font-weight: 500; width: 44px">3-kun</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>Writing</div>
</div>
</section>

<section aria-labelledby="qol-h" style="display: flex; flex-direction: column; gap: 20px">
<h2 id="qol-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">Qo'llanmalar</h2>
<div style="display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 16px; align-items: start">
<div style="background: #f5f6fa; border-radius: 24px; padding: 8px">
<p style="margin: 12px 16px 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">IELTS bo'limlari</p>
<ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px">
<li><a href="#" style="background: #ffffff; border-radius: 16px; min-height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 16px; color: #0f1115; text-decoration: none"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg><span style="flex: 1; display: flex; flex-direction: column"><span style="font-weight: 800; font-size: 16px">Listening</span><span style="font-size: 14px; font-weight: 500; color: #4a5063">Savol turlari, oldindan o'qish, imlo tuzoqlari</span></span><span style="padding: 4px 12px; border-radius: 999px; background: #eef0ff; font-size: 13px; font-weight: 700; color: #2f40e0">ochiq</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
<li><a href="Qollanma.dc.html" style="background: #ffffff; border-radius: 16px; min-height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 16px; color: #0f1115; text-decoration: none"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg><span style="flex: 1; display: flex; flex-direction: column"><span style="font-weight: 800; font-size: 16px">Reading</span><span style="font-size: 14px; font-weight: 500; color: #4a5063">Skimming, scanning, True/False/Not Given</span></span><span style="padding: 4px 12px; border-radius: 999px; background: #eef0ff; font-size: 13px; font-weight: 700; color: #2f40e0">ochiq</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
<li style="background: #ffffff; border-radius: 16px; min-height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 16px; color: #4a5063"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg><span style="flex: 1; display: flex; flex-direction: column"><span style="font-weight: 700; font-size: 16px">Writing Task 2</span><span style="font-size: 14px; font-weight: 500">Insho tuzilishi va reja</span></span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span></li>
<li style="background: #ffffff; border-radius: 16px; min-height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 16px; color: #4a5063"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"></path></svg><span style="flex: 1; display: flex; flex-direction: column"><span style="font-weight: 700; font-size: 16px">Speaking</span><span style="font-size: 14px; font-weight: 500">Uch qism va o'zingni yozib eshitish</span></span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span></li>
</ul>
</div>
<div style="background: #f5f6fa; border-radius: 24px; padding: 8px">
<p style="margin: 12px 16px 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Asos</p>
<div style="background: #ffffff; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px; color: #4a5063">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"></path></svg><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span></div>
<span style="font-weight: 700; font-size: 16px">General English</span>
<span style="font-size: 14px; font-weight: 500; line-height: 1.5">B1 darajasidan B2'ga: grammatika va lug'at, IELTS'dan oldin.</span>
</div>
</div>
</div>
</section>

<section id="rasmiy" aria-labelledby="rasmiy-h" style="display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; flex-direction: column; gap: 8px">
<h2 id="rasmiy-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">Rasmiy bepul namunalar</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063; max-width: 62ch">Mashqni rasmiy namunadan boshla: format va qiyinlik haqiqiy imtihonga eng yaqin shu yerda. Havolalar tashqi saytga, yangi oynada ochiladi.</p>
</div>
<ul style="list-style: none; margin: 0; padding: 0; border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<li><a href="#" style="display: grid; grid-template-columns: 200px minmax(0, 1fr) auto; align-items: center; column-gap: 24px; min-height: 80px; padding: 0 28px; color: #0f1115; text-decoration: none"><span style="font-weight: 800; font-size: 18px">IELTS.org</span><span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 16px; color: #4a5063">[namunada nima borligi: tekshiriladi]</span><span style="font-size: 14px; font-weight: 500; color: #4255ff">[rasmiy havola]</span></span><svg aria-label="Tashqi havola" role="img" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg></a></li>
<li style="border-top: 1px solid #e6e8ee"><a href="#" style="display: grid; grid-template-columns: 200px minmax(0, 1fr) auto; align-items: center; column-gap: 24px; min-height: 80px; padding: 0 28px; color: #0f1115; text-decoration: none"><span style="font-weight: 800; font-size: 18px">British Council</span><span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 16px; color: #4a5063">[namunada nima borligi: tekshiriladi]</span><span style="font-size: 14px; font-weight: 500; color: #4255ff">[rasmiy havola]</span></span><svg aria-label="Tashqi havola" role="img" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg></a></li>
<li style="border-top: 1px solid #e6e8ee"><a href="#" style="display: grid; grid-template-columns: 200px minmax(0, 1fr) auto; align-items: center; column-gap: 24px; min-height: 80px; padding: 0 28px; color: #0f1115; text-decoration: none"><span style="font-weight: 800; font-size: 18px">IDP</span><span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 16px; color: #4a5063">[namunada nima borligi: tekshiriladi]</span><span style="font-size: 14px; font-weight: 500; color: #4255ff">[rasmiy havola]</span></span><svg aria-label="Tashqi havola" role="img" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg></a></li>
</ul>
</section>

<section aria-label="Telegram va eslatma" style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: stretch">
<a href="#" style="background: #f5f6fa; border-radius: 24px; padding: 24px; display: flex; align-items: center; gap: 16px; color: #0f1115; text-decoration: none">
<span aria-hidden="true" style="width: 48px; height: 48px; flex: none; border-radius: 999px; background: #ffffff; display: flex; align-items: center; justify-content: center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"></path></svg></span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 800; font-size: 18px">Telegram kanal</span><span style="font-size: 14px; font-weight: 500; color: #4255ff">[kanal manzili]</span></span>
</a>
<div style="border: 1.5px dashed #0f1115; border-radius: 24px; padding: 20px 24px; display: flex; flex-direction: column; gap: 8px">
<span style="align-self: flex-start; padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">matn tekshiriladi</span>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4a5063">IELTS – British Council, IDP va Cambridge'ning savdo belgisi. Tayanch ular bilan bog'liq emas.</p>
</div>
</section>

<section aria-labelledby="manba-h" style="border-top: 1.5px solid #0f1115; padding-top: 32px; display: flex; flex-direction: column; gap: 20px">
<h2 id="manba-h" style="margin: 0; font-size: 24px; font-weight: 800">Manbalar va tekshiruv</h2>
<dl style="margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 32px">
<div style="display: flex; flex-direction: column; gap: 4px"><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Rasmiy manbalar</dt><dd style="margin: 0; font-size: 16px; line-height: 1.6">[manbalar ro'yxati: muallif beradi]</dd></div>
<div style="display: flex; flex-direction: column; gap: 4px"><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Tekshirilgan sana</dt><dd style="margin: 0; font-size: 16px; line-height: 1.6">[sana]</dd></div>
<div style="display: flex; flex-direction: column; gap: 4px"><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Keyingi tekshiruv</dt><dd style="margin: 0; font-size: 16px; line-height: 1.6">[sana]</dd></div>
<div style="display: flex; flex-direction: column; gap: 4px"><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Tekshirilmagan joylar</dt><dd style="margin: 0; font-size: 16px; line-height: 1.6">[ro'yxat yoki "yo'q"]</dd></div>
</dl>
</section>

<section aria-labelledby="hol-h" style="background: #f5f6fa; border-radius: 24px; padding: 32px; display: flex; flex-direction: column; gap: 24px">
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Maket uchun · saytda ko'rinmaydi</p>
<h2 id="hol-h" style="margin: 0; font-size: 24px; font-weight: 800">Holatlar</h2>
</div>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px">
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Matn havolasi</p>
<span style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700"><span style="color: #4255ff">Reja tuzish</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">oddiy</span></span>
<span style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700"><span style="color: #2f40e0; text-decoration: underline; text-underline-offset: 3px">Reja tuzish</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">hover</span></span>
<span style="display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: 700"><span style="color: #4255ff; outline: 3px solid #4255ff; outline-offset: 2px; border-radius: 6px">Reja tuzish</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">fokus</span></span>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Asosiy tugma</p>
<span style="display: flex; align-items: center; justify-content: space-between"><span style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; background: #4255ff; color: #ffffff; font-weight: 800; font-size: 16px">Rejani tuzish</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">oddiy</span></span>
<span style="display: flex; align-items: center; justify-content: space-between"><span style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; background: #2f40e0; color: #ffffff; font-weight: 800; font-size: 16px">Rejani tuzish</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">hover</span></span>
<span style="display: flex; align-items: center; justify-content: space-between"><span style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; background: #4255ff; color: #ffffff; font-weight: 800; font-size: 16px; outline: 3px solid #4255ff; outline-offset: 2px">Rejani tuzish</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">fokus</span></span>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Qo'llanma yorlig'i</p>
<span style="display: flex; align-items: center; justify-content: space-between"><span style="padding: 4px 12px; border-radius: 999px; background: #eef0ff; font-size: 13px; font-weight: 700; color: #2f40e0">ochiq</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">havola, strelka bilan</span></span>
<span style="display: flex; align-items: center; justify-content: space-between"><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">havola emas, kulrang ikonka</span></span>
<p style="margin: 0; font-size: 13px; line-height: 1.5; color: #4a5063">"Tez orada" qatori bosilmaydi va Tab bilan unga o'tilmaydi.</p>
</div>
</div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Reja kartasi · bo'sh (hali reja yo'q)</p>
<p style="margin: 0; font-size: 18px; font-weight: 800">Uch savolga javob ber, 30 kunlik rejang tayyor</p>
<span style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; background: #4255ff; color: #ffffff; font-weight: 800; font-size: 16px">Rejani tuzish</span>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Reja kartasi · brauzerda reja bor</p>
<p style="margin: 0; font-size: 18px; font-weight: 800">Rejang davom etmoqda: [N] / 30 kun belgilangan</p>
<div aria-hidden="true" style="height: 8px; border-radius: 999px; background: #eceef3; overflow: hidden"><div style="width: 20%; height: 100%; background: #4255ff"></div></div>
<span style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; background: #4255ff; color: #ffffff; font-weight: 800; font-size: 16px">Bugungi kunni ochish</span>
</div>
</div>
</section>

</div>
</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1280,"height":2900}}'>
class Component extends DCLogic {
renderVals() {
return {};
}
}
</script>
</body>
</html>
```

## KirishTelefon.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>Tayanch IELTS kirish, telefonda</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#ffffff}
a{color:#4255ff}a:hover{color:#2f40e0}
a:focus-visible,button:focus-visible{outline:3px solid #4255ff;outline-offset:2px}
</style>
</helmet>
<div style="width: 390px; min-height: 3800px; box-sizing: border-box; font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #ffffff; display: flex; flex-direction: column">

<header style="height: 64px; flex: none; box-sizing: border-box; padding: 0 12px 0 20px; border-bottom: 1px solid #e6e8ee; display: flex; align-items: center; justify-content: space-between; background: #ffffff">
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; text-decoration: none; color: #0f1115">
<span aria-hidden="true" style="width: 34px; height: 34px; border-radius: 6px; background: #0f1115; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px">T</span>
<span style="font-weight: 800; font-size: 18px">Tayanch <span style="color: #4255ff">IELTS</span></span>
</a>
<button type="button" aria-label="{{menuYorliq}}" aria-expanded="{{menuOchiq}}" aria-controls="tel-menyu" onClick="{{menuAlmashtir}}" style="width: 48px; height: 48px; border: 1.5px solid #0f1115; border-radius: 999px; background: #ffffff; color: #0f1115; display: flex; align-items: center; justify-content: center; cursor: pointer">
<sc-if value="{{menuYopiq}}" hint-placeholder-val="{{ true }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"></path></svg></sc-if>
<sc-if value="{{menuOchiq}}" hint-placeholder-val="{{ false }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></sc-if>
</button>
</header>

<sc-if value="{{menuOchiq}}" hint-placeholder-val="{{ false }}">
<nav id="tel-menyu" aria-label="IELTS navigatsiyasi" style="box-sizing: border-box; padding: 16px 20px 24px; border-bottom: 1.5px solid #0f1115; background: #ffffff; display: flex; flex-direction: column; gap: 16px">
<a href="#" aria-current="page" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px">IELTS bo'limi haqida</a>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Qo'llanmalar</p>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg>Listening</a>
<a href="QollanmaTelefon.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg>Reading</a>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><span style="flex: 1">Writing Task 2</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><span style="flex: 1">Speaking</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><span style="flex: 1">General English</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
</div>
<a href="RejaTelefon.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>30 kunlik reja</a>
<a href="#" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #4a5063; text-decoration: none; font-weight: 500; font-size: 16px; border-top: 1px solid #e6e8ee">Tayanch bosh sahifasi</a>
</nav>
</sc-if>

<main style="flex: 1; padding: 32px 20px 48px; display: flex; flex-direction: column; gap: 48px">

<section aria-labelledby="t-h" style="display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">IELTS bo'limi</p>
<h1 id="t-h" style="margin: 0; font-size: 34px; line-height: 1.12; font-weight: 800">IELTS'ga o'zing tayyorlan, <span style="color: #4255ff">reja bilan.</span></h1>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Har bo'lim uchun strategiya va kunma-kun mashq rejasi. Natijani hech kim kafolatlay olmaydi, biz ham.</p>
<a href="RejaTelefon.dc.html" style="display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 52px; border-radius: 999px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 16px">30 kunlik reja tuzish<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
<div style="background: #0f1115; color: #ffffff; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8b97ff">To'rt bo'lim</p>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">
<div style="background: #1b1e26; border-radius: 16px; padding: 12px; display: flex; flex-direction: column; gap: 8px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b97ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg><span style="font-weight: 800; font-size: 16px">Listening</span><span style="font-size: 13px; color: #b4b9c8">[vaqt: rasmiy]</span></div>
<div style="background: #1b1e26; border-radius: 16px; padding: 12px; display: flex; flex-direction: column; gap: 8px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b97ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg><span style="font-weight: 800; font-size: 16px">Reading</span><span style="font-size: 13px; color: #b4b9c8">[vaqt: rasmiy]</span></div>
<div style="background: #1b1e26; border-radius: 16px; padding: 12px; display: flex; flex-direction: column; gap: 8px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b97ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg><span style="font-weight: 800; font-size: 16px">Writing</span><span style="font-size: 13px; color: #b4b9c8">[vaqt: rasmiy]</span></div>
<div style="background: #1b1e26; border-radius: 16px; padding: 12px; display: flex; flex-direction: column; gap: 8px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b97ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"></path></svg><span style="font-weight: 800; font-size: 16px">Speaking</span><span style="font-size: 13px; color: #b4b9c8">[vaqt: rasmiy]</span></div>
</div>
</div>
</section>

<section aria-labelledby="t-boshla" style="display: flex; flex-direction: column; gap: 16px">
<h2 id="t-boshla" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.2">Qayerdan boshlayman?</h2>
<ol style="list-style: none; margin: 0; padding: 0; border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<li><a href="QollanmaTelefon.dc.html" style="display: flex; align-items: center; gap: 16px; min-height: 76px; padding: 12px 16px; box-sizing: border-box; text-decoration: none; color: #0f1115"><span aria-hidden="true" style="width: 36px; height: 36px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800">1</span><span style="flex: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 800; font-size: 18px">Format bilan tanish</span><span style="font-size: 14px; font-weight: 500; color: #4a5063">Har bo'limda nima so'raladi</span></span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
<li style="border-top: 1px solid #e6e8ee"><a href="#t-rasmiy" style="display: flex; align-items: center; gap: 16px; min-height: 76px; padding: 12px 16px; box-sizing: border-box; text-decoration: none; color: #0f1115"><span aria-hidden="true" style="width: 36px; height: 36px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800">2</span><span style="flex: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 800; font-size: 18px">Rasmiy namunani ishla</span><span style="font-size: 14px; font-weight: 500; color: #4a5063">Soat bilan, qiyin bo'limni aniqla</span></span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
<li style="border-top: 1px solid #e6e8ee"><a href="RejaTelefon.dc.html" style="display: flex; align-items: center; gap: 16px; min-height: 76px; padding: 12px 16px; box-sizing: border-box; text-decoration: none; color: #0f1115"><span aria-hidden="true" style="width: 36px; height: 36px; flex: none; border-radius: 999px; background: #4255ff; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800">3</span><span style="flex: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 800; font-size: 18px">30 kunlik reja tuz</span><span style="font-size: 14px; font-weight: 500; color: #4a5063">Uch savol, qiyin bo'limga ko'proq kun</span></span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
</ol>
</section>

<section aria-labelledby="t-cta" style="background: #ffffff; border: 1.5px solid #0f1115; border-radius: 24px; box-shadow: 0 8px 24px rgba(15,17,21,0.10); padding: 24px; display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Asosiy qadam</p>
<h2 id="t-cta" style="margin: 0; font-size: 26px; line-height: 1.2; font-weight: 800">Uch savol, keyin 30 kunlik rejang tayyor</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Imtihongacha qancha vaqt qolgani, kuniga necha soat bo'shliging va qaysi bo'lim qiyinligi.</p>
<a href="RejaTelefon.dc.html" style="display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 56px; border-radius: 999px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 18px">Rejani tuzish</a>
<p style="margin: 0; font-size: 14px; font-weight: 500; color: #4a5063; text-align: center">Ro'yxatdan o'tish ham, email ham kerak emas.</p>
</section>

<section aria-labelledby="t-qol" style="display: flex; flex-direction: column; gap: 16px">
<h2 id="t-qol" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.2">Qo'llanmalar</h2>
<ul style="list-style: none; margin: 0; padding: 8px; background: #f5f6fa; border-radius: 24px; display: flex; flex-direction: column; gap: 4px">
<li><a href="#" style="background: #ffffff; border-radius: 16px; min-height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 12px; color: #0f1115; text-decoration: none"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg><span style="flex: 1; font-weight: 800; font-size: 16px">Listening</span><span style="padding: 4px 12px; border-radius: 999px; background: #eef0ff; font-size: 13px; font-weight: 700; color: #2f40e0">ochiq</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
<li><a href="QollanmaTelefon.dc.html" style="background: #ffffff; border-radius: 16px; min-height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 12px; color: #0f1115; text-decoration: none"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg><span style="flex: 1; font-weight: 800; font-size: 16px">Reading</span><span style="padding: 4px 12px; border-radius: 999px; background: #eef0ff; font-size: 13px; font-weight: 700; color: #2f40e0">ochiq</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
<li style="background: #ffffff; border-radius: 16px; min-height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 12px; color: #4a5063"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg><span style="flex: 1; font-weight: 700; font-size: 16px">Writing Task 2</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></li>
<li style="background: #ffffff; border-radius: 16px; min-height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 12px; color: #4a5063"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"></path></svg><span style="flex: 1; font-weight: 700; font-size: 16px">Speaking</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></li>
<li style="background: #ffffff; border-radius: 16px; min-height: 64px; padding: 0 16px; display: flex; align-items: center; gap: 12px; color: #4a5063"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"></path></svg><span style="flex: 1; font-weight: 700; font-size: 16px">General English</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></li>
</ul>
</section>

<section id="t-rasmiy" aria-labelledby="t-ras-h" style="display: flex; flex-direction: column; gap: 12px">
<h2 id="t-ras-h" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.2">Rasmiy bepul namunalar</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Haqiqiy imtihonga eng yaqin mashq. Tashqi saytda ochiladi.</p>
<ul style="list-style: none; margin: 4px 0 0; padding: 0; border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<li><a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 76px; padding: 12px 16px; box-sizing: border-box; color: #0f1115; text-decoration: none"><span style="flex: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 800; font-size: 18px">IELTS.org</span><span style="font-size: 14px; font-weight: 500; color: #4255ff">[rasmiy havola]</span></span><svg aria-label="Tashqi havola" role="img" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg></a></li>
<li style="border-top: 1px solid #e6e8ee"><a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 76px; padding: 12px 16px; box-sizing: border-box; color: #0f1115; text-decoration: none"><span style="flex: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 800; font-size: 18px">British Council</span><span style="font-size: 14px; font-weight: 500; color: #4255ff">[rasmiy havola]</span></span><svg aria-label="Tashqi havola" role="img" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg></a></li>
<li style="border-top: 1px solid #e6e8ee"><a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 76px; padding: 12px 16px; box-sizing: border-box; color: #0f1115; text-decoration: none"><span style="flex: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 800; font-size: 18px">IDP</span><span style="font-size: 14px; font-weight: 500; color: #4255ff">[rasmiy havola]</span></span><svg aria-label="Tashqi havola" role="img" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg></a></li>
</ul>
</section>

<a href="#" style="background: #f5f6fa; border-radius: 24px; padding: 20px; min-height: 48px; display: flex; align-items: center; gap: 16px; color: #0f1115; text-decoration: none">
<span aria-hidden="true" style="width: 48px; height: 48px; flex: none; border-radius: 999px; background: #ffffff; display: flex; align-items: center; justify-content: center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"></path></svg></span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 800; font-size: 18px">Telegram kanal</span><span style="font-size: 14px; font-weight: 500; color: #4255ff">[kanal manzili]</span></span>
</a>

<div style="border: 1.5px dashed #0f1115; border-radius: 24px; padding: 16px 20px; display: flex; flex-direction: column; gap: 8px">
<span style="align-self: flex-start; padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">matn tekshiriladi</span>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4a5063">IELTS – British Council, IDP va Cambridge'ning savdo belgisi. Tayanch ular bilan bog'liq emas.</p>
</div>

<section aria-labelledby="t-manba" style="border-top: 1.5px solid #0f1115; padding-top: 24px; display: flex; flex-direction: column; gap: 16px">
<h2 id="t-manba" style="margin: 0; font-size: 24px; font-weight: 800">Manbalar va tekshiruv</h2>
<dl style="margin: 0; display: flex; flex-direction: column; gap: 16px">
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Rasmiy manbalar</dt><dd style="margin: 4px 0 0; font-size: 16px">[manbalar ro'yxati]</dd></div>
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Tekshirilgan sana</dt><dd style="margin: 4px 0 0; font-size: 16px">[sana]</dd></div>
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Keyingi tekshiruv</dt><dd style="margin: 4px 0 0; font-size: 16px">[sana]</dd></div>
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Tekshirilmagan joylar</dt><dd style="margin: 4px 0 0; font-size: 16px">[ro'yxat yoki "yo'q"]</dd></div>
</dl>
</section>

<section aria-labelledby="t-hol" style="background: #f5f6fa; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Maket uchun · saytda ko'rinmaydi</p>
<h2 id="t-hol" style="margin: -8px 0 0; font-size: 24px; font-weight: 800">Holatlar</h2>
<div style="background: #ffffff; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Ro'yxat qatori: bosilgan va fokus</p>
<span style="display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 0 16px; border-radius: 16px; background: #eef0ff; font-weight: 800">Reading<span style="margin-left: auto; font-size: 13px; font-weight: 500; color: #4a5063">bosilganda</span></span>
<span style="display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 0 16px; border-radius: 16px; outline: 3px solid #4255ff; outline-offset: 2px; font-weight: 800">Reading<span style="margin-left: auto; font-size: 13px; font-weight: 500; color: #4a5063">fokus</span></span>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Reja kartasi · reja bor</p>
<p style="margin: 0; font-size: 18px; font-weight: 800">Rejang davom etmoqda: [N] / 30 kun</p>
<span style="display: flex; align-items: center; justify-content: center; min-height: 52px; border-radius: 999px; background: #4255ff; color: #ffffff; font-weight: 800">Bugungi kunni ochish</span>
</div>
</section>

</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":390,"height":3800}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { ochiq: false };
}
renderVals() {
var self = this;
var ochiq = this.state.ochiq;
return {
menuOchiq: ochiq,
menuYopiq: !ochiq,
menuYorliq: ochiq ? "Menyuni yopish" : "Menyuni ochish",
menuAlmashtir: function () { self.setState({ ochiq: !self.state.ochiq }); }
};
}
}
</script>
</body>
</html>
```

## Qollanma.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>IELTS Reading qo'llanmasi</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#ffffff}
a{color:#4255ff}a:hover{color:#2f40e0}
a:focus-visible,button:focus-visible{outline:3px solid #4255ff;outline-offset:2px}
</style>
</helmet>
<div style="width: 1280px; min-height: 3500px; box-sizing: border-box; font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #ffffff; display: flex">

<aside aria-label="IELTS bo'limi" style="flex: 0 0 288px; box-sizing: border-box; border-right: 1px solid #e6e8ee; padding: 20px 16px; display: flex; flex-direction: column; gap: 24px; background: #ffffff">
<a href="Main.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; text-decoration: none; color: #0f1115">
<span aria-hidden="true" style="width: 36px; height: 36px; border-radius: 6px; background: #0f1115; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px">T</span>
<span style="font-weight: 800; font-size: 18px">Tayanch <span style="color: #4255ff">IELTS</span></span>
</a>
<nav aria-label="IELTS navigatsiyasi" style="display: flex; flex-direction: column; gap: 20px">
<a href="Main.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px">
<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path></svg>
IELTS bo'limi haqida</a>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Qo'llanmalar</p>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg>Listening</a>
<a href="#" aria-current="page" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg>Reading</a>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg><span style="flex: 1">Writing Task 2</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"></path></svg><span style="flex: 1">Speaking</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"></path></svg><span style="flex: 1">General English</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span></p>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Vositalar</p>
<a href="Reja.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>30 kunlik reja</a>
</div>
</nav>
<div style="margin-top: auto; border-top: 1px solid #e6e8ee; padding-top: 16px; display: flex; flex-direction: column; gap: 4px">
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #4a5063; text-decoration: none; font-weight: 500; font-size: 14px"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>Tayanch bosh sahifasi</a>
</div>
</aside>

<main style="flex: 1 1 auto; min-width: 0; box-sizing: border-box; padding: 40px 40px 64px">
<div style="max-width: 912px; display: flex; flex-direction: column; gap: 40px">

<nav aria-label="Joylashuv" style="font-size: 14px; font-weight: 500; color: #4a5063; display: flex; gap: 8px; align-items: center"><a href="Main.dc.html" style="font-weight: 700">IELTS</a><span aria-hidden="true">/</span><span>Qo'llanmalar</span><span aria-hidden="true">/</span><span aria-current="page" style="color: #0f1115; font-weight: 700">Reading</span></nav>

<header style="display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; display: flex; align-items: center; gap: 12px"><span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Qo'llanma</span><span style="padding: 4px 12px; border-radius: 999px; background: #eef0ff; font-size: 13px; font-weight: 700; color: #2f40e0">ochiq</span></p>
<h1 style="margin: 0; font-size: 46px; line-height: 1.1; font-weight: 800; letter-spacing: -0.5px">Reading: javobni emas, <span style="color: #4255ff">dalilni qidir</span></h1>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063; max-width: 60ch">Har bir to'g'ri javobning orqasida matndagi bitta gap turadi. Bu qo'llanma o'sha gapni tez topishni o'rgatadi: savol turlari, skimming va scanning, True/False/Not Given va vaqt.</p>
</header>

<section aria-label="Format kartasi" style="border: 1.5px solid #0f1115; border-radius: 24px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); overflow: hidden">
<div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 8px"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg>Bo'lim</span><span style="font-size: 18px; font-weight: 800">Reading</span><span style="font-size: 14px; font-weight: 500; color: #4a5063">Academic va General</span></div>
<div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 8px; border-left: 1px solid #e6e8ee"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 6v6l4 2"></path></svg>Vaqt</span><span style="font-size: 16px; font-weight: 700">[rasmiy manbadan]</span></div>
<div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 8px; border-left: 1px solid #e6e8ee"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path></svg>Savollar</span><span style="font-size: 16px; font-weight: 700">[rasmiy manbadan]</span></div>
<div style="padding: 20px 24px; display: flex; flex-direction: column; gap: 8px; border-left: 1px solid #e6e8ee"><span style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"></path></svg>Matnlar</span><span style="font-size: 16px; font-weight: 700">[rasmiy manbadan]</span></div>
</section>

<div style="display: flex; gap: 40px; align-items: flex-start">

<article style="flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 56px">

<section id="turlar" aria-labelledby="turlar-h" style="display: flex; flex-direction: column; gap: 16px">
<h2 id="turlar-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">Savol turlari</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Savol turini birinchi bo'lib aniqla: u matnda nimani qidirishingni aytadi. Ro'yxat rasmiy manba bilan solishtiriladi.</p>
<ul style="list-style: none; margin: 0; padding: 0; border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<li style="padding: 16px 20px; display: grid; grid-template-columns: 220px minmax(0, 1fr); column-gap: 16px"><span style="font-weight: 800">True / False / Not Given</span><span style="color: #4a5063">Fakt matnga mosmi, zidmi yoki umuman yo'qmi</span></li>
<li style="padding: 16px 20px; display: grid; grid-template-columns: 220px minmax(0, 1fr); column-gap: 16px; border-top: 1px solid #e6e8ee"><span style="font-weight: 800">Yes / No / Not Given</span><span style="color: #4a5063">Xuddi shunday, lekin muallifning fikri haqida</span></li>
<li style="padding: 16px 20px; display: grid; grid-template-columns: 220px minmax(0, 1fr); column-gap: 16px; border-top: 1px solid #e6e8ee"><span style="font-weight: 800">Matching headings</span><span style="color: #4a5063">Har abzasning asosiy g'oyasi</span></li>
<li style="padding: 16px 20px; display: grid; grid-template-columns: 220px minmax(0, 1fr); column-gap: 16px; border-top: 1px solid #e6e8ee"><span style="font-weight: 800">Multiple choice</span><span style="color: #4a5063">Bir variantni dalil bilan tasdiqlash, qolganini rad etish</span></li>
<li style="padding: 16px 20px; display: grid; grid-template-columns: 220px minmax(0, 1fr); column-gap: 16px; border-top: 1px solid #e6e8ee"><span style="font-weight: 800">Completion</span><span style="color: #4a5063">Gap, jadval yoki xulosadagi bo'sh joy: so'z cheklovini o'qi</span></li>
</ul>
</section>

<section id="skim" aria-labelledby="skim-h" style="display: flex; flex-direction: column; gap: 16px">
<h2 id="skim-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">Skimming va scanning</h2>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
<div style="background: #f5f6fa; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 12px">
<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z"></path></svg>
<h3 style="margin: 0; font-size: 24px; font-weight: 800">Skimming</h3>
<p style="margin: 0; line-height: 1.6"><b>Nima uchun:</b> abzasning asosiy g'oyasi.</p>
<p style="margin: 0; line-height: 1.6; color: #4a5063">Sarlavha, birinchi va oxirgi gaplarni o'qi. Tafsilotga to'xtama.</p>
</div>
<div style="background: #f5f6fa; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 12px">
<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3"></path></svg>
<h3 style="margin: 0; font-size: 24px; font-weight: 800">Scanning</h3>
<p style="margin: 0; line-height: 1.6"><b>Nima uchun:</b> aniq ism, son yoki sana.</p>
<p style="margin: 0; line-height: 1.6; color: #4a5063">Savoldan kalit so'zni ol, matnda o'zini va sinonimini izla.</p>
</div>
</div>
</section>

<section id="tfng" aria-labelledby="tfng-h" style="display: flex; flex-direction: column; gap: 20px">
<h2 id="tfng-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">True / False / Not Given</h2>
<dl style="margin: 0; display: flex; flex-direction: column; gap: 12px">
<div style="display: flex; gap: 12px"><dt style="flex: 0 0 104px; font-weight: 800">True</dt><dd style="margin: 0; color: #4a5063; line-height: 1.6">Matn xuddi shu narsani aytadi, boshqa so'zlar bilan bo'lsa ham.</dd></div>
<div style="display: flex; gap: 12px"><dt style="flex: 0 0 104px; font-weight: 800">False</dt><dd style="margin: 0; color: #4a5063; line-height: 1.6">Matn buning teskarisini aytadi.</dd></div>
<div style="display: flex; gap: 12px"><dt style="flex: 0 0 104px; font-weight: 800">Not Given</dt><dd style="margin: 0; color: #4a5063; line-height: 1.6">Matnda bu haqda tasdiq ham, inkor ham yo'q.</dd></div>
</dl>

<div aria-label="Qoida va misol" style="border: 1.5px solid #0f1115; border-radius: 24px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); overflow: hidden">
<div style="padding: 24px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Qoida</p>
<p style="margin: 0; font-size: 18px; font-weight: 800; line-height: 1.4">False uchun matnda zid gap bo'lishi shart. Uni topa olmasang, javob Not Given.</p>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Umumiy bilimingga suyanma: faqat matn hisob.</p>
</div>
<figure style="margin: 0; padding: 24px; background: #f5f6fa; display: flex; flex-direction: column; gap: 12px">
<figcaption style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Misol · passage parchasi</figcaption>
<p style="margin: 0; font-size: 16px; line-height: 1.7">[namuna passage: muallif beradi] <mark style="background: #eef0ff; color: #0f1115; text-decoration: underline; text-decoration-color: #4255ff; text-decoration-thickness: 2px; text-underline-offset: 4px; padding: 0px 4px; border-radius: 6px">[dalil gap: muallif belgilaydi]</mark> [davomi: muallif beradi]</p>
<p style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: #4a5063"><span aria-hidden="true" style="width: 16px; height: 4px; border-radius: 999px; background: #4255ff"></span>Ko'k tagchiziq: javobni beradigan gap</p>
</figure>
</div>

<section aria-labelledby="mashq-h" style="background: #ffffff; border: 1.5px solid #0f1115; border-radius: 24px; box-shadow: 0 8px 24px rgba(15,17,21,0.10); padding: 28px; display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
<p id="mashq-h" style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Mini-mashq</p>
<span style="font-size: 14px; font-weight: 500; color: #4a5063">Ball hisoblanmaydi</span>
</div>
<p style="margin: 0; font-size: 24px; line-height: 1.4; font-weight: 800">"[da'vo gap: muallif beradi]"</p>
<p style="margin: 0; font-size: 16px; color: #4a5063">Yuqoridagi parchaga ko'ra bu gap qanday?</p>
<div role="radiogroup" aria-labelledby="mashq-h" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px">
<sc-for list="{{variantlar}}" as="v" hint-placeholder-count="3">
<button type="button" role="radio" aria-checked="{{v.tanlangan}}" onClick="{{v.tanla}}" disabled="{{tanlandi}}" style="{{v.uslub}}">
<sc-if value="{{v.togriBelgi}}" hint-placeholder-val="{{ false }}"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"></path></svg></sc-if>
<sc-if value="{{v.xatoBelgi}}" hint-placeholder-val="{{ false }}"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></sc-if>
{{v.matn}}</button>
</sc-for>
</div>
<sc-if value="{{tanlandi}}" hint-placeholder-val="{{ false }}">
<div aria-live="polite" style="{{javobUslub}}">
<p style="margin: 0; font-size: 18px; font-weight: 800">{{javobSarlavha}}</p>
<p style="margin: 0; font-size: 16px; line-height: 1.6">Dalil gap: <mark style="background: #eef0ff; color: #0f1115; text-decoration: underline; text-decoration-color: #4255ff; text-decoration-thickness: 2px; text-underline-offset: 4px; padding: 0px 4px; border-radius: 6px">[dalil gap: muallif belgilaydi]</mark></p>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">[nega aynan shu javob: muallif izohi]</p>
<button type="button" onClick="{{qayta}}" style="align-self: flex-start; min-height: 48px; padding: 0 20px; border: 1.5px solid #0f1115; border-radius: 999px; background: #ffffff; color: #0f1115; font: inherit; font-weight: 700; font-size: 16px; cursor: pointer">Qayta urinish</button>
</div>
</sc-if>
</section>
</section>

<section id="tuzoq" aria-labelledby="tuzoq-h" style="display: flex; flex-direction: column; gap: 16px">
<h2 id="tuzoq-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">Tuzoqlar</h2>
<ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px">
<li style="display: flex; gap: 16px; align-items: flex-start"><span aria-hidden="true" style="width: 32px; height: 32px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px">1</span><p style="margin: 4px 0 0; line-height: 1.6"><b>Bir xil so'z, boshqa ma'no.</b> <span style="color: #4a5063">Savoldagi so'z matnda bor, lekin u boshqa fikrni aytayotgan bo'lishi mumkin.</span></p></li>
<li style="display: flex; gap: 16px; align-items: flex-start"><span aria-hidden="true" style="width: 32px; height: 32px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px">2</span><p style="margin: 4px 0 0; line-height: 1.6"><b>Not Given'ni False deb belgilash.</b> <span style="color: #4a5063">Zid gapni topmaguncha False qo'yma.</span></p></li>
<li style="display: flex; gap: 16px; align-items: flex-start"><span aria-hidden="true" style="width: 32px; height: 32px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px">3</span><p style="margin: 4px 0 0; line-height: 1.6"><b>"Some", "always", "only".</b> <span style="color: #4a5063">Bitta cheklovchi so'z javobni butunlay o'zgartiradi.</span></p></li>
<li style="display: flex; gap: 16px; align-items: flex-start"><span aria-hidden="true" style="width: 32px; height: 32px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px">4</span><p style="margin: 4px 0 0; line-height: 1.6"><b>Bitta savolda qotib qolish.</b> <span style="color: #4a5063">Belgilab qo'y, keyingisiga o't, oxirida qayt.</span></p></li>
</ol>
</section>

<section id="vaqt" aria-labelledby="vaqt-h" style="display: flex; flex-direction: column; gap: 16px">
<h2 id="vaqt-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">Vaqt strategiyasi</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Umumiy vaqt: [rasmiy manbadan]. Uni matnlar orasida oldindan bo'lib qo'y va soatga qarab tur.</p>
<div style="border: 1.5px solid #0f1115; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<div aria-hidden="true" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px">
<div style="height: 12px; border-radius: 999px; background: #4255ff"></div>
<div style="height: 12px; border-radius: 999px; background: #4255ff"></div>
<div style="height: 12px; border-radius: 999px; background: #0f1115"></div>
</div>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 14px">
<span><b>1-matn</b><br><span style="color: #4a5063">[vaqt ulushi]</span></span>
<span><b>2-matn</b><br><span style="color: #4a5063">[vaqt ulushi]</span></span>
<span><b>3-matn</b><br><span style="color: #4a5063">[vaqt ulushi] + tekshiruv</span></span>
</div>
</div>
</section>

<section aria-labelledby="keyingi-h" style="background: #0f1115; color: #ffffff; border-radius: 24px; padding: 28px; display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8b97ff">Keyingi qadam</p>
<h2 id="keyingi-h" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.25">Rasmiy namunadagi bitta Reading matnini soat bilan ishla</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #b4b9c8">Keyin har xatoning dalil gapini top. Reja vositasi bu ishni kunlarga bo'lib beradi.</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 4px">
<a href="Reja.dc.html" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 800">30 kunlik reja tuzish</a>
<a href="Main.dc.html" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #1b1e26; color: #ffffff; text-decoration: none; font-weight: 700">Rasmiy namunalar</a>
</div>
</section>

</article>

<nav aria-label="Sahifa mundarijasi" style="flex: 0 0 240px; position: sticky; top: 24px; display: flex; flex-direction: column; gap: 4px; border: 1.5px solid #0f1115; border-radius: 24px; padding: 12px">
<p style="margin: 8px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Mundarija</p>
<a href="#turlar" aria-current="true" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; background: #eef0ff; color: #2f40e0; text-decoration: none; font-weight: 700; font-size: 16px">Savol turlari</a>
<a href="#skim" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px">Skimming va scanning</a>
<a href="#tfng" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px">True / False / Not Given</a>
<a href="#tuzoq" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px">Tuzoqlar</a>
<a href="#vaqt" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px">Vaqt strategiyasi</a>
</nav>
</div>

<section aria-labelledby="manba-h" style="border-top: 1.5px solid #0f1115; padding-top: 32px; display: flex; flex-direction: column; gap: 20px">
<h2 id="manba-h" style="margin: 0; font-size: 24px; font-weight: 800">Manbalar va tekshiruv</h2>
<dl style="margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 32px">
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Rasmiy manbalar</dt><dd style="margin: 4px 0 0; font-size: 16px; line-height: 1.6">[manbalar ro'yxati]</dd></div>
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Tekshirilgan sana</dt><dd style="margin: 4px 0 0; font-size: 16px; line-height: 1.6">[sana]</dd></div>
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Keyingi tekshiruv</dt><dd style="margin: 4px 0 0; font-size: 16px; line-height: 1.6">[sana]</dd></div>
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Tekshirilmagan joylar</dt><dd style="margin: 4px 0 0; font-size: 16px; line-height: 1.6">[ro'yxat yoki "yo'q"]</dd></div>
</dl>
</section>

<section aria-labelledby="hol-h" style="background: #f5f6fa; border-radius: 24px; padding: 32px; display: flex; flex-direction: column; gap: 20px">
<div>
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Maket uchun · saytda ko'rinmaydi</p>
<h2 id="hol-h" style="margin: 4px 0 0; font-size: 24px; font-weight: 800">Holatlar</h2>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Mini-mashq tugmasi</p>
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; font-size: 13px; font-weight: 500; color: #4a5063">
<span style="display: flex; flex-direction: column; gap: 8px"><span style="display: flex; align-items: center; justify-content: center; min-height: 52px; border: 2px solid #0f1115; border-radius: 16px; color: #0f1115; font-weight: 800; font-size: 16px">False</span>tanlanmagan</span>
<span style="display: flex; flex-direction: column; gap: 8px"><span style="display: flex; align-items: center; justify-content: center; min-height: 52px; border: 2px solid #0f1115; border-radius: 16px; color: #0f1115; font-weight: 800; font-size: 16px; outline: 3px solid #4255ff; outline-offset: 2px">False</span>fokus</span>
<span style="display: flex; flex-direction: column; gap: 8px"><span style="display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 52px; border: 2px solid #4255ff; background: #4255ff; border-radius: 16px; color: #ffffff; font-weight: 800; font-size: 16px">Not Given</span>to'g'ri</span>
<span style="display: flex; flex-direction: column; gap: 8px"><span style="display: flex; align-items: center; justify-content: center; min-height: 52px; border: 2px dashed #0f1115; background: #f5f6fa; border-radius: 16px; color: #0f1115; font-weight: 800; font-size: 16px; text-decoration: line-through">False</span>xato</span>
</div>
</div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Mundarija bandi</p>
<span style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; background: #f5f6fa; font-weight: 700">Tuzoqlar <span style="margin-left: auto; font-size: 13px; font-weight: 500; color: #4a5063">hover</span></span>
<span style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; background: #eef0ff; color: #2f40e0; font-weight: 700">Savol turlari <span style="margin-left: auto; font-size: 13px; font-weight: 500; color: #4a5063">joriy bo'lim</span></span>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Bo'sh holat: mashq hali yo'q</p>
<div style="border: 1.5px dashed #0f1115; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 8px">
<span style="font-weight: 800">Bu bo'lim uchun mashq tayyorlanmoqda</span>
<span style="font-size: 14px; color: #4a5063">Hozircha rasmiy namunadan foydalan.</span>
<span style="align-self: flex-start; padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span>
</div>
</div>
</div>
</section>

</div>
</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1280,"height":3500}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { tanlov: null };
}
renderVals() {
var self = this;
var s = this.state;
var togriId = "ng";
var tanlandi = s.tanlov !== null;
var asos = "min-height: 56px; box-sizing: border-box; padding: 0 12px; border-radius: 16px; font: inherit; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; ";
var xom = [{ id: "t", matn: "True" }, { id: "f", matn: "False" }, { id: "ng", matn: "Not Given" }];
var variantlar = xom.map(function (v) {
var tanlangan = s.tanlov === v.id;
var togri = v.id === togriId;
var uslub = asos + "background: #ffffff; color: #0f1115; border: 2px solid #0f1115;";
if (tanlandi && togri) uslub = asos + "background: #4255ff; color: #ffffff; border: 2px solid #4255ff; cursor: default;";
else if (tanlandi && tanlangan) uslub = asos + "background: #f5f6fa; color: #0f1115; border: 2px dashed #0f1115; text-decoration: line-through; cursor: default;";
else if (tanlandi) uslub = asos + "background: #ffffff; color: #4a5063; border: 2px solid #dfe2ea; cursor: default;";
return {
matn: v.matn,
tanlangan: tanlangan,
togriBelgi: tanlandi && togri,
xatoBelgi: tanlandi && tanlangan && !togri,
uslub: uslub,
tanla: function () { if (self.state.tanlov === null) self.setState({ tanlov: v.id }); }
};
});
var togrimi = s.tanlov === togriId;
return {
variantlar: variantlar,
tanlandi: tanlandi,
javobSarlavha: togrimi ? "To'g'ri: Not Given" : "Bu safar emas. To'g'ri javob: Not Given",
javobUslub: "border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; " + (togrimi ? "background: #eef0ff; border: 1.5px solid #4255ff;" : "background: #f5f6fa; border: 1.5px dashed #0f1115;"),
qayta: function () { self.setState({ tanlov: null }); }
};
}
}
</script>
</body>
</html>
```

## QollanmaTelefon.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>IELTS Reading qo'llanmasi, telefonda</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#ffffff}
a{color:#4255ff}a:hover{color:#2f40e0}
a:focus-visible,button:focus-visible{outline:3px solid #4255ff;outline-offset:2px}
</style>
</helmet>
<div style="width: 390px; min-height: 5800px; box-sizing: border-box; font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #ffffff; display: flex; flex-direction: column">

<header style="height: 64px; flex: none; box-sizing: border-box; padding: 0 12px 0 20px; border-bottom: 1px solid #e6e8ee; display: flex; align-items: center; justify-content: space-between">
<a href="KirishTelefon.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; text-decoration: none; color: #0f1115">
<span aria-hidden="true" style="width: 34px; height: 34px; border-radius: 6px; background: #0f1115; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px">T</span>
<span style="font-weight: 800; font-size: 18px">Tayanch <span style="color: #4255ff">IELTS</span></span>
</a>
<button type="button" aria-label="{{menuYorliq}}" aria-expanded="{{menuOchiq}}" aria-controls="q-menyu" onClick="{{menuAlmashtir}}" style="width: 48px; height: 48px; border: 1.5px solid #0f1115; border-radius: 999px; background: #ffffff; color: #0f1115; display: flex; align-items: center; justify-content: center; cursor: pointer">
<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="{{menuIkon}}"></path></svg>
</button>
</header>

<sc-if value="{{menuOchiq}}" hint-placeholder-val="{{ false }}">
<nav id="q-menyu" aria-label="IELTS navigatsiyasi" style="box-sizing: border-box; padding: 16px 20px 24px; border-bottom: 1.5px solid #0f1115; background: #ffffff; display: flex; flex-direction: column; gap: 16px">
<a href="KirishTelefon.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px">IELTS bo'limi haqida</a>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Qo'llanmalar</p>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg>Listening</a>
<a href="#" aria-current="page" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg>Reading</a>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><span style="flex: 1">Writing Task 2</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><span style="flex: 1">Speaking</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><span style="flex: 1">General English</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
</div>
<a href="RejaTelefon.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>30 kunlik reja</a>
<a href="#" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #4a5063; text-decoration: none; font-weight: 500; font-size: 16px; border-top: 1px solid #e6e8ee">Tayanch bosh sahifasi</a>
</nav>
</sc-if>

<main style="flex: 1; padding: 24px 20px 48px; display: flex; flex-direction: column; gap: 40px">

<div style="display: flex; flex-direction: column; gap: 16px">
<nav aria-label="Joylashuv" style="font-size: 14px; font-weight: 500; color: #4a5063; display: flex; gap: 8px; align-items: center"><a href="KirishTelefon.dc.html" style="font-weight: 700; min-height: 48px; display: inline-flex; align-items: center">IELTS</a><span aria-hidden="true">/</span><span aria-current="page" style="color: #0f1115; font-weight: 700">Reading</span></nav>
<p style="margin: 0; display: flex; align-items: center; gap: 12px"><span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Qo'llanma</span><span style="padding: 4px 12px; border-radius: 999px; background: #eef0ff; font-size: 13px; font-weight: 700; color: #2f40e0">ochiq</span></p>
<h1 style="margin: 0; font-size: 34px; line-height: 1.12; font-weight: 800">Reading: javobni emas, <span style="color: #4255ff">dalilni qidir</span></h1>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Har bir to'g'ri javobning orqasida matndagi bitta gap turadi. Bu qo'llanma o'sha gapni tez topishni o'rgatadi.</p>
</div>

<section aria-label="Format kartasi" style="border: 1.5px solid #0f1115; border-radius: 24px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); overflow: hidden">
<div style="padding: 16px; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Bo'lim</span><span style="font-size: 18px; font-weight: 800">Reading</span><span style="font-size: 14px; font-weight: 500; color: #4a5063">Academic va General</span></div>
<div style="padding: 16px; display: flex; flex-direction: column; gap: 4px; border-left: 1px solid #e6e8ee"><span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Vaqt</span><span style="font-size: 16px; font-weight: 700">[rasmiy manbadan]</span></div>
<div style="padding: 16px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #e6e8ee"><span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Savollar</span><span style="font-size: 16px; font-weight: 700">[rasmiy manbadan]</span></div>
<div style="padding: 16px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #e6e8ee; border-left: 1px solid #e6e8ee"><span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Matnlar</span><span style="font-size: 16px; font-weight: 700">[rasmiy manbadan]</span></div>
</section>

<nav aria-label="Sahifa mundarijasi" style="border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<button type="button" aria-expanded="{{mundOchiq}}" aria-controls="t-mund" onClick="{{mundAlmashtir}}" style="width: 100%; min-height: 56px; padding: 0 16px; border: 0; background: #ffffff; color: #0f1115; font: inherit; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer">
<span style="display: flex; align-items: center; gap: 12px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path></svg>Mundarija</span>
<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{mundStrelka}}"></path></svg>
</button>
<sc-if value="{{mundOchiq}}" hint-placeholder-val="{{ false }}">
<div id="t-mund" style="padding: 0 8px 8px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #e6e8ee">
<a href="#t-turlar" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700">Savol turlari</a>
<a href="#t-skim" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700">Skimming va scanning</a>
<a href="#t-tfng" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700">True / False / Not Given</a>
<a href="#t-tuzoq" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700">Tuzoqlar</a>
<a href="#t-vaqt" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700">Vaqt strategiyasi</a>
</div>
</sc-if>
</nav>

<section id="t-turlar" aria-labelledby="t-turlar-h" style="display: flex; flex-direction: column; gap: 12px">
<h2 id="t-turlar-h" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.2">Savol turlari</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Savol turini birinchi bo'lib aniqla. Ro'yxat rasmiy manba bilan solishtiriladi.</p>
<ul style="list-style: none; margin: 0; padding: 0; border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<li style="padding: 16px 16px; display: flex; flex-direction: column; gap: 4px"><span style="font-weight: 800">True / False / Not Given</span><span style="font-size: 16px; color: #4a5063">Fakt matnga mosmi, zidmi yoki yo'qmi</span></li>
<li style="padding: 16px 16px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #e6e8ee"><span style="font-weight: 800">Yes / No / Not Given</span><span style="font-size: 16px; color: #4a5063">Muallifning fikri haqida</span></li>
<li style="padding: 16px 16px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #e6e8ee"><span style="font-weight: 800">Matching headings</span><span style="font-size: 16px; color: #4a5063">Abzasning asosiy g'oyasi</span></li>
<li style="padding: 16px 16px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #e6e8ee"><span style="font-weight: 800">Multiple choice</span><span style="font-size: 16px; color: #4a5063">Bir variantni dalil bilan tasdiqlash</span></li>
<li style="padding: 16px 16px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #e6e8ee"><span style="font-weight: 800">Completion</span><span style="font-size: 16px; color: #4a5063">Bo'sh joy: so'z cheklovini o'qi</span></li>
</ul>
</section>

<section id="t-skim" aria-labelledby="t-skim-h" style="display: flex; flex-direction: column; gap: 12px">
<h2 id="t-skim-h" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.2">Skimming va scanning</h2>
<div style="background: #f5f6fa; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 8px">
<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z"></path></svg>
<h3 style="margin: 0; font-size: 24px; font-weight: 800">Skimming</h3>
<p style="margin: 0; line-height: 1.6"><b>Nima uchun:</b> abzasning asosiy g'oyasi.</p>
<p style="margin: 0; line-height: 1.6; color: #4a5063">Sarlavha, birinchi va oxirgi gaplarni o'qi.</p>
</div>
<div style="background: #f5f6fa; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 8px">
<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3"></path></svg>
<h3 style="margin: 0; font-size: 24px; font-weight: 800">Scanning</h3>
<p style="margin: 0; line-height: 1.6"><b>Nima uchun:</b> aniq ism, son yoki sana.</p>
<p style="margin: 0; line-height: 1.6; color: #4a5063">Kalit so'zni va uning sinonimini izla.</p>
</div>
</section>

<section id="t-tfng" aria-labelledby="t-tfng-h" style="display: flex; flex-direction: column; gap: 16px">
<h2 id="t-tfng-h" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.2">True / False / Not Given</h2>
<dl style="margin: 0; display: flex; flex-direction: column; gap: 12px">
<div><dt style="font-weight: 800">True</dt><dd style="margin: 4px 0 0; color: #4a5063; line-height: 1.6">Matn xuddi shuni aytadi, boshqa so'zlar bilan bo'lsa ham.</dd></div>
<div><dt style="font-weight: 800">False</dt><dd style="margin: 4px 0 0; color: #4a5063; line-height: 1.6">Matn buning teskarisini aytadi.</dd></div>
<div><dt style="font-weight: 800">Not Given</dt><dd style="margin: 4px 0 0; color: #4a5063; line-height: 1.6">Matnda tasdiq ham, inkor ham yo'q.</dd></div>
</dl>

<div aria-label="Qoida va misol" style="border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<div style="padding: 20px; display: flex; flex-direction: column; gap: 8px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Qoida</p>
<p style="margin: 0; font-size: 18px; font-weight: 800; line-height: 1.4">False uchun matnda zid gap bo'lishi shart. Uni topa olmasang, javob Not Given.</p>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Umumiy bilimingga suyanma: faqat matn hisob.</p>
</div>
<figure style="margin: 0; padding: 20px; background: #f5f6fa; border-top: 1px solid #e6e8ee; display: flex; flex-direction: column; gap: 12px">
<figcaption style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Misol · passage parchasi</figcaption>
<p style="margin: 0; font-size: 16px; line-height: 1.7">[namuna passage: muallif beradi] <mark style="background: #eef0ff; color: #0f1115; text-decoration: underline; text-decoration-color: #4255ff; text-decoration-thickness: 2px; text-underline-offset: 4px; padding: 0px 4px; border-radius: 6px">[dalil gap: muallif belgilaydi]</mark> [davomi]</p>
<p style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: #4a5063"><span aria-hidden="true" style="width: 16px; height: 4px; border-radius: 999px; background: #4255ff"></span>Ko'k tagchiziq: javobni beradigan gap</p>
</figure>
</div>

<section aria-labelledby="t-mashq-h" style="background: #ffffff; border: 1.5px solid #0f1115; border-radius: 24px; box-shadow: 0 8px 24px rgba(15,17,21,0.10); padding: 20px; display: flex; flex-direction: column; gap: 16px">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
<p id="t-mashq-h" style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Mini-mashq</p>
<span style="font-size: 14px; font-weight: 500; color: #4a5063">Ball hisoblanmaydi</span>
</div>
<p style="margin: 0; font-size: 24px; line-height: 1.4; font-weight: 800">"[da'vo gap: muallif beradi]"</p>
<p style="margin: 0; font-size: 16px; color: #4a5063">Yuqoridagi parchaga ko'ra bu gap qanday?</p>
<div role="radiogroup" aria-labelledby="t-mashq-h" style="display: flex; flex-direction: column; gap: 12px">
<sc-for list="{{variantlar}}" as="v" hint-placeholder-count="3">
<button type="button" role="radio" aria-checked="{{v.tanlangan}}" onClick="{{v.tanla}}" disabled="{{tanlandi}}" style="{{v.uslub}}">
<sc-if value="{{v.togriBelgi}}" hint-placeholder-val="{{ false }}"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"></path></svg></sc-if>
<sc-if value="{{v.xatoBelgi}}" hint-placeholder-val="{{ false }}"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></sc-if>
{{v.matn}}</button>
</sc-for>
</div>
<sc-if value="{{tanlandi}}" hint-placeholder-val="{{ false }}">
<div aria-live="polite" style="{{javobUslub}}">
<p style="margin: 0; font-size: 18px; font-weight: 800">{{javobSarlavha}}</p>
<p style="margin: 0; font-size: 16px; line-height: 1.6">Dalil gap: <mark style="background: #eef0ff; color: #0f1115; text-decoration: underline; text-decoration-color: #4255ff; text-decoration-thickness: 2px; text-underline-offset: 4px; padding: 0px 4px; border-radius: 6px">[dalil gap: muallif belgilaydi]</mark></p>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">[nega aynan shu javob: muallif izohi]</p>
<button type="button" onClick="{{qayta}}" style="min-height: 52px; border: 1.5px solid #0f1115; border-radius: 999px; background: #ffffff; color: #0f1115; font: inherit; font-weight: 700; font-size: 16px; cursor: pointer">Qayta urinish</button>
</div>
</sc-if>
</section>
</section>

<section id="t-tuzoq" aria-labelledby="t-tuzoq-h" style="display: flex; flex-direction: column; gap: 12px">
<h2 id="t-tuzoq-h" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.2">Tuzoqlar</h2>
<ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 16px">
<li style="display: flex; gap: 16px; align-items: flex-start"><span aria-hidden="true" style="width: 32px; height: 32px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px">1</span><p style="margin: 4px 0 0; line-height: 1.6"><b>Bir xil so'z, boshqa ma'no.</b> <span style="color: #4a5063">So'z matnda bor, lekin boshqa fikrni aytishi mumkin.</span></p></li>
<li style="display: flex; gap: 16px; align-items: flex-start"><span aria-hidden="true" style="width: 32px; height: 32px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px">2</span><p style="margin: 4px 0 0; line-height: 1.6"><b>Not Given'ni False deb belgilash.</b> <span style="color: #4a5063">Zid gapni topmaguncha False qo'yma.</span></p></li>
<li style="display: flex; gap: 16px; align-items: flex-start"><span aria-hidden="true" style="width: 32px; height: 32px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px">3</span><p style="margin: 4px 0 0; line-height: 1.6"><b>"Some", "always", "only".</b> <span style="color: #4a5063">Bitta cheklovchi so'z javobni o'zgartiradi.</span></p></li>
<li style="display: flex; gap: 16px; align-items: flex-start"><span aria-hidden="true" style="width: 32px; height: 32px; flex: none; border-radius: 999px; border: 1.5px solid #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px">4</span><p style="margin: 4px 0 0; line-height: 1.6"><b>Bitta savolda qotib qolish.</b> <span style="color: #4a5063">Belgilab qo'y, keyingisiga o't.</span></p></li>
</ol>
</section>

<section id="t-vaqt" aria-labelledby="t-vaqt-h" style="display: flex; flex-direction: column; gap: 12px">
<h2 id="t-vaqt-h" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.2">Vaqt strategiyasi</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Umumiy vaqt: [rasmiy manbadan]. Uni matnlar orasida oldindan bo'lib qo'y.</p>
<ol style="list-style: none; margin: 0; padding: 0; border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<li style="padding: 16px 16px; display: flex; justify-content: space-between; gap: 12px"><b>1-matn</b><span style="color: #4a5063">[vaqt ulushi]</span></li>
<li style="padding: 16px 16px; display: flex; justify-content: space-between; gap: 12px; border-top: 1px solid #e6e8ee"><b>2-matn</b><span style="color: #4a5063">[vaqt ulushi]</span></li>
<li style="padding: 16px 16px; display: flex; justify-content: space-between; gap: 12px; border-top: 1px solid #e6e8ee"><b>3-matn</b><span style="color: #4a5063">[vaqt ulushi] + tekshiruv</span></li>
</ol>
</section>

<section aria-labelledby="t-keyingi-h" style="background: #0f1115; color: #ffffff; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8b97ff">Keyingi qadam</p>
<h2 id="t-keyingi-h" style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.25">Rasmiy namunadagi bitta Reading matnini soat bilan ishla</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #b4b9c8">Keyin har xatoning dalil gapini top.</p>
<a href="RejaTelefon.dc.html" style="display: flex; align-items: center; justify-content: center; min-height: 52px; border-radius: 999px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 800">30 kunlik reja tuzish</a>
<a href="KirishTelefon.dc.html" style="display: flex; align-items: center; justify-content: center; min-height: 52px; border-radius: 999px; background: #1b1e26; color: #ffffff; text-decoration: none; font-weight: 700">Rasmiy namunalar</a>
</section>

<section aria-labelledby="t-manba" style="border-top: 1.5px solid #0f1115; padding-top: 24px; display: flex; flex-direction: column; gap: 16px">
<h2 id="t-manba" style="margin: 0; font-size: 24px; font-weight: 800">Manbalar va tekshiruv</h2>
<dl style="margin: 0; display: flex; flex-direction: column; gap: 16px">
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Rasmiy manbalar</dt><dd style="margin: 4px 0 0; font-size: 16px">[manbalar ro'yxati]</dd></div>
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Tekshirilgan sana</dt><dd style="margin: 4px 0 0; font-size: 16px">[sana]</dd></div>
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Keyingi tekshiruv</dt><dd style="margin: 4px 0 0; font-size: 16px">[sana]</dd></div>
<div><dt style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Tekshirilmagan joylar</dt><dd style="margin: 4px 0 0; font-size: 16px">[ro'yxat yoki "yo'q"]</dd></div>
</dl>
</section>

<section aria-labelledby="t-hol" style="background: #f5f6fa; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Maket uchun · saytda ko'rinmaydi</p>
<h2 id="t-hol" style="margin: -8px 0 0; font-size: 24px; font-weight: 800">Holatlar</h2>
<div style="background: #ffffff; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Mini-mashq tugmasi</p>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 52px; padding: 0 16px; border: 2px solid #0f1115; border-radius: 16px; font-weight: 800">False<span style="font-size: 13px; font-weight: 500; color: #4a5063">tanlanmagan</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 52px; padding: 0 16px; border: 2px solid #0f1115; border-radius: 16px; font-weight: 800; outline: 3px solid #4255ff; outline-offset: 2px">False<span style="font-size: 13px; font-weight: 500; color: #4a5063">fokus</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 52px; padding: 0 16px; border: 2px solid #4255ff; background: #4255ff; color: #ffffff; border-radius: 16px; font-weight: 800">Not Given<span style="font-size: 13px; font-weight: 500">to'g'ri</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 52px; padding: 0 16px; border: 2px dashed #0f1115; background: #f5f6fa; border-radius: 16px; font-weight: 800"><span style="text-decoration: line-through">False</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">xato</span></span>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 8px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Bo'sh holat: mashq hali yo'q</p>
<div style="border: 1.5px dashed #0f1115; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 8px">
<span style="font-weight: 800">Bu bo'lim uchun mashq tayyorlanmoqda</span>
<span style="font-size: 14px; color: #4a5063">Hozircha rasmiy namunadan foydalan.</span>
<span style="align-self: flex-start; padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700; color: #4a5063">tez orada</span>
</div>
</div>
</section>

</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":390,"height":5800}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { tanlov: null, mund: false, menu: false };
}
renderVals() {
var self = this;
var s = this.state;
var togriId = "ng";
var tanlandi = s.tanlov !== null;
var asos = "width: 100%; min-height: 56px; box-sizing: border-box; padding: 0 16px; border-radius: 16px; font: inherit; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; ";
var xom = [{ id: "t", matn: "True" }, { id: "f", matn: "False" }, { id: "ng", matn: "Not Given" }];
var variantlar = xom.map(function (v) {
var tanlangan = s.tanlov === v.id;
var togri = v.id === togriId;
var uslub = asos + "background: #ffffff; color: #0f1115; border: 2px solid #0f1115;";
if (tanlandi && togri) uslub = asos + "background: #4255ff; color: #ffffff; border: 2px solid #4255ff; cursor: default;";
else if (tanlandi && tanlangan) uslub = asos + "background: #f5f6fa; color: #0f1115; border: 2px dashed #0f1115; text-decoration: line-through; cursor: default;";
else if (tanlandi) uslub = asos + "background: #ffffff; color: #4a5063; border: 2px solid #dfe2ea; cursor: default;";
return {
matn: v.matn, tanlangan: tanlangan,
togriBelgi: tanlandi && togri,
xatoBelgi: tanlandi && tanlangan && !togri,
uslub: uslub,
tanla: function () { if (self.state.tanlov === null) self.setState({ tanlov: v.id }); }
};
});
var togrimi = s.tanlov === togriId;
return {
menuOchiq: s.menu,
menuYorliq: s.menu ? "Menyuni yopish" : "Menyuni ochish",
menuIkon: s.menu ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16",
menuAlmashtir: function () { self.setState({ menu: !self.state.menu }); },
mundOchiq: s.mund,
mundStrelka: s.mund ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6",
mundAlmashtir: function () { self.setState({ mund: !self.state.mund }); },
variantlar: variantlar,
tanlandi: tanlandi,
javobSarlavha: togrimi ? "To'g'ri: Not Given" : "Bu safar emas. To'g'ri javob: Not Given",
javobUslub: "border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px; " + (togrimi ? "background: #eef0ff; border: 1.5px solid #4255ff;" : "background: #f5f6fa; border: 1.5px dashed #0f1115;"),
qayta: function () { self.setState({ tanlov: null }); }
};
}
}
</script>
</body>
</html>
```

## Reja.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>IELTS 30 kunlik reja vositasi</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#ffffff}
a{color:#4255ff}a:hover{color:#2f40e0}
a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #4255ff;outline-offset:2px}
</style>
</helmet>
<div style="width: 1280px; min-height: 2400px; box-sizing: border-box; font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #ffffff; display: flex">

<aside aria-label="IELTS bo'limi" style="flex: 0 0 288px; box-sizing: border-box; border-right: 1px solid #e6e8ee; padding: 20px 16px; display: flex; flex-direction: column; gap: 24px">
<a href="Main.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; text-decoration: none; color: #0f1115"><span aria-hidden="true" style="width: 36px; height: 36px; border-radius: 6px; background: #0f1115; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px">T</span><span style="font-weight: 800; font-size: 18px">Tayanch <span style="color: #4255ff">IELTS</span></span></a>
<nav aria-label="IELTS navigatsiyasi" style="display: flex; flex-direction: column; gap: 20px">
<a href="Main.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path></svg>IELTS bo'limi haqida</a>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Qo'llanmalar</p>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg>Listening</a>
<a href="Qollanma.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg>Reading</a>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg><span style="flex: 1">Writing Task 2</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"></path></svg><span style="flex: 1">Speaking</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a90a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"></path></svg><span style="flex: 1">General English</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Vositalar</p>
<a href="#" aria-current="page" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>30 kunlik reja</a>
</div>
</nav>
<div style="margin-top: auto; border-top: 1px solid #e6e8ee; padding-top: 16px; display: flex; flex-direction: column; gap: 4px">
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #4a5063; text-decoration: none; font-weight: 500; font-size: 14px"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>Tayanch bosh sahifasi</a>
</div>
</aside>

<main style="flex: 1 1 auto; min-width: 0; box-sizing: border-box; padding: 48px 40px 64px">
<div style="max-width: 912px; display: flex; flex-direction: column; gap: 32px">
<header style="display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Vosita</p>
<h1 style="margin: 0; font-size: 46px; line-height: 1.1; font-weight: 800">30 kunlik IELTS rejasi</h1>
<p style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: #4a5063"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>Ma'lumotlaring faqat shu brauzerda saqlanadi.</p>
</header>

<sc-if value="{{ekranBosh}}" hint-placeholder-val="{{ false }}">
<section aria-labelledby="bosh-h" style="border: 1.5px dashed #0f1115; border-radius: 24px; padding: 48px; display: flex; flex-direction: column; align-items: flex-start; gap: 16px">
<svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>
<h2 id="bosh-h" style="margin: 0; font-size: 32px; font-weight: 800">Hali reja yo'q</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063; max-width: 52ch">Uchta savolga javob ber, reja shu yerda paydo bo'ladi. Ro'yxatdan o'tish ham, email ham kerak emas.</p>
<button type="button" onClick="{{boshla}}" style="min-height: 52px; padding: 0 28px; border: 0; border-radius: 999px; background: #4255ff; color: #ffffff; font: inherit; font-weight: 800; font-size: 16px; cursor: pointer">Boshlash</button>
</section>
</sc-if>

<sc-if value="{{ekranSavol}}" hint-placeholder-val="{{ false }}">
<section aria-labelledby="savol-h" style="background: #ffffff; border: 1.5px solid #0f1115; border-radius: 24px; box-shadow: 0 8px 24px rgba(15,17,21,0.10); padding: 40px; display: flex; flex-direction: column; gap: 24px; max-width: 680px">
<div style="display: flex; align-items: center; gap: 16px">
<div role="progressbar" aria-label="Savollar" aria-valuemin="1" aria-valuemax="3" aria-valuenow="{{qadamRaqam}}" style="flex: 1; height: 8px; border-radius: 999px; background: #eceef3; overflow: hidden"><div style="height: 100%; width: {{progress}}; background: #4255ff; border-radius: 999px"></div></div>
<span style="font-size: 14px; font-weight: 700; color: #4a5063">{{qadamRaqam}} / 3</span>
</div>
<div style="display: flex; flex-direction: column; gap: 8px">
<h2 id="savol-h" style="margin: 0; font-size: 32px; line-height: 1.2; font-weight: 800">{{savol.sarlavha}}</h2>
<p style="margin: 0; font-size: 16px; color: #4a5063">{{savol.izoh}}</p>
</div>
<div role="radiogroup" aria-labelledby="savol-h" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px">
<sc-for list="{{variantlar}}" as="v" hint-placeholder-count="4">
<button type="button" role="radio" aria-checked="{{v.tanlangan}}" onClick="{{v.tanla}}" style="{{v.uslub}}">{{v.matn}}</button>
</sc-for>
</div>
<div style="display: flex; justify-content: space-between; align-items: center">
<button type="button" onClick="{{orqaga}}" style="min-height: 52px; padding: 0 20px; border: 0; border-radius: 999px; background: transparent; color: #4a5063; font: inherit; font-weight: 700; font-size: 16px; cursor: pointer">Orqaga</button>
<button type="button" onClick="{{keyingi}}" disabled="{{tanlanmagan}}" style="{{keyingiUslub}}">{{keyingiMatn}}</button>
</div>
</section>
</sc-if>

<sc-if value="{{ekranNatija}}" hint-placeholder-val="{{ true }}">
<section aria-labelledby="natija-h" style="display: flex; flex-direction: column; gap: 24px">
<div style="border: 1.5px solid #0f1115; border-radius: 24px; padding: 28px; display: flex; gap: 32px; align-items: center">
<div style="flex: 1; display: flex; flex-direction: column; gap: 12px">
<h2 id="natija-h" style="margin: 0; font-size: 32px; font-weight: 800">Sening rejang</h2>
<p style="margin: 0; display: flex; flex-wrap: wrap; gap: 8px">
<span style="padding: 4px 12px; border-radius: 999px; background: #f5f6fa; font-size: 14px; font-weight: 700">{{javob.hafta}}</span>
<span style="padding: 4px 12px; border-radius: 999px; background: #f5f6fa; font-size: 14px; font-weight: 700">Kuniga {{javob.soat}}</span>
<span style="padding: 4px 12px; border-radius: 999px; background: #eef0ff; color: #2f40e0; font-size: 14px; font-weight: 700">Eng qiyin: {{qiyinNom}} · 12 kun</span>
</p>
<sc-if value="{{qisqa}}" hint-placeholder-val="{{ false }}"><p style="margin: 0; font-size: 14px; color: #4a5063">Imtihon 30 kundan oldin: oxirgi kunlarni rasmiy namunaga ajrat.</p></sc-if>
</div>
<div style="flex: 0 0 260px; display: flex; flex-direction: column; gap: 8px">
<span style="font-size: 14px; font-weight: 700">Belgilangan: {{bajarilganSoni}} / 30 kun</span>
<div aria-hidden="true" style="height: 8px; border-radius: 999px; background: #eceef3; overflow: hidden"><div style="height: 100%; width: {{bajarilganFoiz}}; background: #4255ff"></div></div>
<button type="button" onClick="{{qayta}}" style="align-self: flex-start; min-height: 48px; padding: 0 20px; border: 1.5px solid #0f1115; border-radius: 999px; background: #ffffff; color: #0f1115; font: inherit; font-weight: 700; font-size: 16px; cursor: pointer">Qayta tuzish</button>
</div>
</div>
<sc-for list="{{haftalar}}" as="h" hint-placeholder-count="5">
<div style="border: 1.5px solid #0f1115; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<h3 style="margin: 0; font-size: 24px; font-weight: 800">{{h.nom}} <span style="font-size: 14px; font-weight: 500; color: #4a5063">{{h.oraliq}}</span></h3>
<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px">
<sc-for list="{{h.kunlar}}" as="d" hint-placeholder-count="7">
<label style="{{d.uslub}}">
<span style="display: flex; align-items: center; justify-content: space-between"><span style="font-size: 13px; font-weight: 500; color: #4a5063">{{d.kun}}-kun</span><input type="checkbox" checked="{{d.bajarildi}}" onChange="{{d.belgila}}" style="width: 20px; height: 20px; margin: 0; accent-color: #4255ff; cursor: pointer"></span>
<span style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 800"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{d.ikon}}"></path></svg>{{d.nom}}</span>
</label>
</sc-for>
</div>
</div>
</sc-for>
</section>
</sc-if>

<section aria-labelledby="r-hol-h" style="background: #f5f6fa; border-radius: 24px; padding: 32px; display: flex; flex-direction: column; gap: 20px">
<div>
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Maket uchun · saytda ko'rinmaydi</p>
<h2 id="r-hol-h" style="margin: 4px 0 0; font-size: 24px; font-weight: 800">Holatlar</h2>
</div>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Javob varianti</p>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 60px; padding: 0 16px; border: 2px solid #dfe2ea; border-radius: 16px; font-weight: 700">3–4 hafta<span style="font-size: 13px; font-weight: 500; color: #4a5063">tanlanmagan</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 60px; padding: 0 16px; border: 2px solid #0f1115; border-radius: 16px; font-weight: 700">3–4 hafta<span style="font-size: 13px; font-weight: 500; color: #4a5063">bosilganda</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 60px; padding: 0 16px; border: 2px solid #4255ff; background: #eef0ff; border-radius: 16px; font-weight: 700">3–4 hafta<span style="font-size: 13px; font-weight: 500; color: #4a5063">tanlangan</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 60px; padding: 0 16px; border: 2px solid #dfe2ea; border-radius: 16px; font-weight: 700; outline: 3px solid #4255ff; outline-offset: 2px">3–4 hafta<span style="font-size: 13px; font-weight: 500; color: #4a5063">fokus</span></span>
</div>
<div style="display: flex; flex-direction: column; gap: 16px">
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">"Keyingisi" tugmasi</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; font-weight: 500; color: #4a5063">
<span style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #eceef3; color: #4a5063; font-size: 16px; font-weight: 800">Keyingisi</span>o'chiq</span>
<span style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #4255ff; color: #ffffff; font-size: 16px; font-weight: 800">Keyingisi</span>faol</span>
<span style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #2f40e0; color: #ffffff; font-size: 16px; font-weight: 800">Keyingisi</span>bosilganda</span>
<span style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #4255ff; color: #ffffff; font-size: 16px; font-weight: 800; outline: 3px solid #4255ff; outline-offset: 2px">Keyingisi</span>fokus</span>
</div>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Kun katakchasi</p>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 13px; font-weight: 500; color: #4a5063">
<span style="display: flex; flex-direction: column; gap: 4px"><span style="min-height: 88px; box-sizing: border-box; padding: 12px; border-radius: 16px; border: 1.5px solid #dfe2ea; color: #0f1115; font-size: 14px; font-weight: 800; display: flex; align-items: flex-end">Writing</span>belgilanmagan</span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="min-height: 88px; box-sizing: border-box; padding: 12px; border-radius: 16px; border: 1.5px solid #4255ff; background: #eef0ff; color: #0f1115; font-size: 14px; font-weight: 800; display: flex; align-items: flex-end">Writing</span>bajarilgan</span>
<span style="display: flex; flex-direction: column; gap: 4px"><span style="min-height: 88px; box-sizing: border-box; padding: 12px; border-radius: 16px; border: 1.5px solid #dfe2ea; color: #0f1115; font-size: 14px; font-weight: 800; display: flex; align-items: flex-end; outline: 3px solid #4255ff; outline-offset: 2px">Writing</span>fokus</span>
</div>
</div>
</div>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px">
<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 14px; font-weight: 700">Matn havolasi</span><span style="font-size: 13px; font-weight: 500; color: #4a5063">oddiy · bosilganda · fokus</span></span>
<span style="display: flex; align-items: center; gap: 24px; font-size: 16px; font-weight: 700"><span style="color: #4255ff">Reading qo'llanmasi</span><span style="color: #2f40e0; text-decoration: underline; text-underline-offset: 4px">Reading qo'llanmasi</span><span style="color: #4255ff; outline: 3px solid #4255ff; outline-offset: 2px; border-radius: 6px">Reading qo'llanmasi</span></span>
</div>
</section>

</div>
</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"holat":{"editor":"enum","options":["bosh","savol","natija","bajarilgan"],"default":"bajarilgan"},"$preview":{"width":1280,"height":2400}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = this.seed(props.holat || "bajarilgan");
}
seed(h) {
var s = { ekran: "natija", qadam: 0, javob: { hafta: "3–4 hafta", soat: "1–2 soat", qiyin: "Writing" }, bajarilgan: {} };
if (h === "bosh") { s.ekran = "bosh"; s.javob = { hafta: null, soat: null, qiyin: null }; }
if (h === "savol") { s.ekran = "savol"; s.javob = { hafta: "3–4 hafta", soat: null, qiyin: null }; }
if (h === "bajarilgan") s.bajarilgan = { 1: true, 2: true, 3: true, 4: true, 5: true };
return s;
}
componentDidUpdate(prev) {
if (prev.holat !== this.props.holat) this.setState(this.seed(this.props.holat));
}
renderVals() {
var self = this;
var s = this.state;
var ikon = {
Listening: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z",
Reading: "M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z",
Writing: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
Speaking: "M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4",
Takror: "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5",
Namuna: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6",
Tahlil: "M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3"
};
var savollar = [
{ key: "hafta", sarlavha: "Imtihongacha necha hafta qoldi?", izoh: "Taxminiy javob ham yetadi.", v: ["1–2 hafta", "3–4 hafta", "5–8 hafta", "8 haftadan ko'p"] },
{ key: "soat", sarlavha: "Kuniga necha soat ajrata olasan?", izoh: "Orzu qilganingni emas, haqiqiy vaqtingni tanla.", v: ["1 soatgacha", "1–2 soat", "2–3 soat", "3 soatdan ko'p"] },
{ key: "qiyin", sarlavha: "Qaysi bo'lim senga eng qiyin?", izoh: "Shu bo'limga ko'proq kun ajratiladi.", v: ["Listening", "Reading", "Writing", "Speaking"] }
];
var q = savollar[s.qadam];
var tanlov = s.javob[q.key];
var asos = "min-height: 60px; box-sizing: border-box; padding: 0 20px; border-radius: 16px; font: inherit; font-size: 16px; font-weight: 700; color: #0f1115; text-align: left; cursor: pointer; ";
var variantlar = q.v.map(function (m) {
var t = tanlov === m;
return {
matn: m, tanlangan: t,
uslub: asos + (t ? "background: #eef0ff; border: 2px solid #4255ff;" : "background: #ffffff; border: 2px solid #dfe2ea;"),
tanla: function () { var j = Object.assign({}, self.state.javob); j[q.key] = m; self.setState({ javob: j }); }
};
});
var qiyin = s.javob.qiyin || "Writing";
var tartib = ["Listening", "Reading", "Writing", "Speaking"];
var boshqa = tartib.filter(function (x) { return x !== qiyin; });
var nomlar = [];
for (var w = 0; w < 4; w++) {
nomlar.push(qiyin, boshqa[w % 3], qiyin, boshqa[(w + 1) % 3], qiyin, boshqa[(w + 2) % 3], "Takror");
}
nomlar.push("Namuna", "Tahlil");
var soni = 0;
var kunlar = nomlar.map(function (nom, i) {
var k = i + 1;
var b = !!s.bajarilgan[k];
if (b) soni++;
return {
kun: k, nom: nom, ikon: ikon[nom], bajarildi: b,
uslub: "min-height: 88px; box-sizing: border-box; padding: 12px; border-radius: 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; cursor: pointer; " + (b ? "background: #eef0ff; border: 1.5px solid #4255ff;" : "background: #ffffff; border: 1.5px solid #dfe2ea;"),
belgila: function () { var o = Object.assign({}, self.state.bajarilgan); o[k] = !o[k]; self.setState({ bajarilgan: o }); }
};
});
var haftalar = [0, 1, 2, 3].map(function (w) {
return { nom: (w + 1) + "-hafta", oraliq: (w * 7 + 1) + "–" + (w * 7 + 7) + "-kun", kunlar: kunlar.slice(w * 7, w * 7 + 7) };
});
haftalar.push({ nom: "Yakun", oraliq: "29–30-kun: rasmiy namuna va tahlil", kunlar: kunlar.slice(28) });
var tanlanmagan = !tanlov;
var oxirgi = s.qadam === 2;
return {
ekranBosh: s.ekran === "bosh",
ekranSavol: s.ekran === "savol",
ekranNatija: s.ekran === "natija",
savol: q,
variantlar: variantlar,
qadamRaqam: s.qadam + 1,
progress: Math.round((s.qadam + 1) / 3 * 100) + "%",
tanlanmagan: tanlanmagan,
keyingiMatn: oxirgi ? "Rejani ko'rish" : "Keyingisi",
keyingiUslub: "min-height: 52px; padding: 0 28px; border: 0; border-radius: 999px; font: inherit; font-weight: 800; font-size: 16px; " + (tanlanmagan ? "background: #eceef3; color: #4a5063; cursor: not-allowed;" : "background: #4255ff; color: #ffffff; cursor: pointer;"),
boshla: function () { self.setState({ ekran: "savol", qadam: 0 }); },
orqaga: function () { if (self.state.qadam === 0) self.setState({ ekran: "bosh" }); else self.setState({ qadam: self.state.qadam - 1 }); },
keyingi: function () { if (tanlanmagan) return; if (oxirgi) self.setState({ ekran: "natija", bajarilgan: {} }); else self.setState({ qadam: self.state.qadam + 1 }); },
qayta: function () { self.setState({ ekran: "savol", qadam: 0, javob: { hafta: null, soat: null, qiyin: null }, bajarilgan: {} }); },
javob: { hafta: s.javob.hafta || "3–4 hafta", soat: s.javob.soat || "1–2 soat" },
qiyinNom: qiyin,
qisqa: s.javob.hafta === "1–2 hafta",
haftalar: haftalar,
bajarilganSoni: soni,
bajarilganFoiz: Math.round(soni / 30 * 100) + "%"
};
}
}
</script>
</body>
</html>
```

## RejaTelefon.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>IELTS reja vositasi, telefonda</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#ffffff}
a{color:#4255ff}a:hover{color:#2f40e0}
a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #4255ff;outline-offset:2px}
</style>
</helmet>
<div style="width: 390px; min-height: 844px; box-sizing: border-box; font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #ffffff; display: flex; flex-direction: column">

<header style="height: 64px; flex: none; box-sizing: border-box; padding: 0 12px 0 20px; border-bottom: 1px solid #e6e8ee; display: flex; align-items: center; justify-content: space-between">
<a href="KirishTelefon.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; text-decoration: none; color: #0f1115">
<span aria-hidden="true" style="width: 34px; height: 34px; border-radius: 6px; background: #0f1115; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px">T</span>
<span style="font-weight: 800; font-size: 18px">Tayanch <span style="color: #4255ff">IELTS</span></span>
</a>
<button type="button" aria-label="{{menuYorliq}}" aria-expanded="{{menuOchiq}}" aria-controls="r-menyu" onClick="{{menuAlmashtir}}" style="width: 48px; height: 48px; border: 1.5px solid #0f1115; border-radius: 999px; background: #ffffff; color: #0f1115; display: flex; align-items: center; justify-content: center; cursor: pointer">
<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="{{menuIkon}}"></path></svg>
</button>
</header>

<sc-if value="{{menuOchiq}}" hint-placeholder-val="{{ false }}">
<nav id="r-menyu" aria-label="IELTS navigatsiyasi" style="box-sizing: border-box; padding: 16px 20px 24px; border-bottom: 1.5px solid #0f1115; background: #ffffff; display: flex; flex-direction: column; gap: 16px">
<a href="KirishTelefon.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px">IELTS bo'limi haqida</a>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Qo'llanmalar</p>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"></path></svg>Listening</a>
<a href="QollanmaTelefon.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"></path></svg>Reading</a>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><span style="flex: 1">Writing Task 2</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><span style="flex: 1">Speaking</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
<p style="margin: 0; display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; color: #4a5063; font-weight: 500; font-size: 16px"><span style="flex: 1">General English</span><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">tez orada</span></p>
</div>
<a href="#" aria-current="page" style="display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 16px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>30 kunlik reja</a>
<a href="#" style="display: flex; align-items: center; min-height: 48px; padding: 0 12px; border-radius: 16px; color: #4a5063; text-decoration: none; font-weight: 500; font-size: 16px; border-top: 1px solid #e6e8ee">Tayanch bosh sahifasi</a>
</nav>
</sc-if>

<main style="flex: 1; padding: 24px 20px 40px; display: flex; flex-direction: column; gap: 24px">
<div style="display: flex; flex-direction: column; gap: 8px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4255ff">Vosita</p>
<h1 style="margin: 0; font-size: 34px; line-height: 1.12; font-weight: 800">30 kunlik IELTS rejasi</h1>
<p style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: #4a5063"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>Ma'lumotlaring faqat shu brauzerda saqlanadi.</p>
</div>

<sc-if value="{{ekranBosh}}" hint-placeholder-val="{{ false }}">
<section aria-labelledby="tb-h" style="border: 1.5px dashed #0f1115; border-radius: 24px; padding: 28px 20px; display: flex; flex-direction: column; gap: 16px">
<svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>
<h2 id="tb-h" style="margin: 0; font-size: 26px; font-weight: 800">Hali reja yo'q</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5063">Uchta savolga javob ber, reja shu yerda paydo bo'ladi. Ro'yxatdan o'tish ham, email ham kerak emas.</p>
<button type="button" onClick="{{boshla}}" style="min-height: 52px; border: 0; border-radius: 999px; background: #4255ff; color: #ffffff; font: inherit; font-weight: 800; font-size: 16px; cursor: pointer">Boshlash</button>
</section>
</sc-if>

<sc-if value="{{ekranSavol}}" hint-placeholder-val="{{ false }}">
<section aria-labelledby="ts-h" style="background: #ffffff; border: 1.5px solid #0f1115; border-radius: 24px; box-shadow: 0 8px 24px rgba(15,17,21,0.10); padding: 20px; display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; align-items: center; gap: 12px">
<div role="progressbar" aria-label="Savollar" aria-valuemin="1" aria-valuemax="3" aria-valuenow="{{qadamRaqam}}" style="flex: 1; height: 8px; border-radius: 999px; background: #eceef3; overflow: hidden"><div style="height: 100%; width: {{progress}}; background: #4255ff; border-radius: 999px"></div></div>
<span style="font-size: 14px; font-weight: 700; color: #4a5063">{{qadamRaqam}} / 3</span>
</div>
<div style="display: flex; flex-direction: column; gap: 8px">
<h2 id="ts-h" style="margin: 0; font-size: 26px; line-height: 1.2; font-weight: 800">{{savol.sarlavha}}</h2>
<p style="margin: 0; font-size: 16px; color: #4a5063">{{savol.izoh}}</p>
</div>
<div role="radiogroup" aria-labelledby="ts-h" style="display: flex; flex-direction: column; gap: 12px">
<sc-for list="{{variantlar}}" as="v" hint-placeholder-count="4">
<button type="button" role="radio" aria-checked="{{v.tanlangan}}" onClick="{{v.tanla}}" style="{{v.uslub}}">{{v.matn}}</button>
</sc-for>
</div>
<button type="button" onClick="{{keyingi}}" disabled="{{tanlanmagan}}" style="{{keyingiUslub}}">{{keyingiMatn}}</button>
<button type="button" onClick="{{orqaga}}" style="min-height: 48px; border: 0; border-radius: 999px; background: transparent; color: #4a5063; font: inherit; font-weight: 700; font-size: 16px; cursor: pointer">Orqaga</button>
</section>
</sc-if>

<sc-if value="{{ekranNatija}}" hint-placeholder-val="{{ true }}">
<section aria-labelledby="tn-h" style="display: flex; flex-direction: column; gap: 16px">
<div style="border: 1.5px solid #0f1115; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 12px">
<h2 id="tn-h" style="margin: 0; font-size: 26px; font-weight: 800">Sening rejang</h2>
<p style="margin: 0; display: flex; flex-wrap: wrap; gap: 8px">
<span style="padding: 4px 12px; border-radius: 999px; background: #f5f6fa; font-size: 14px; font-weight: 700">{{javob.hafta}}</span>
<span style="padding: 4px 12px; border-radius: 999px; background: #f5f6fa; font-size: 14px; font-weight: 700">Kuniga {{javob.soat}}</span>
<span style="padding: 4px 12px; border-radius: 999px; background: #eef0ff; color: #2f40e0; font-size: 14px; font-weight: 700">Eng qiyin: {{qiyinNom}} · 12 kun</span>
</p>
<sc-if value="{{qisqa}}" hint-placeholder-val="{{ false }}"><p style="margin: 0; font-size: 14px; color: #4a5063">Imtihon 30 kundan oldin: oxirgi kunlarni rasmiy namunaga ajrat.</p></sc-if>
<span style="font-size: 14px; font-weight: 700">Belgilangan: {{bajarilganSoni}} / 30 kun</span>
<div aria-hidden="true" style="height: 8px; border-radius: 999px; background: #eceef3; overflow: hidden"><div style="height: 100%; width: {{bajarilganFoiz}}; background: #4255ff"></div></div>
<button type="button" onClick="{{qayta}}" style="min-height: 48px; border: 1.5px solid #0f1115; border-radius: 999px; background: #ffffff; color: #0f1115; font: inherit; font-weight: 700; font-size: 16px; cursor: pointer">Qayta tuzish</button>
</div>
<sc-for list="{{haftalar}}" as="h" hint-placeholder-count="5">
<div style="border: 1.5px solid #0f1115; border-radius: 24px; padding: 8px; display: flex; flex-direction: column; gap: 4px">
<h3 style="margin: 8px 12px; font-size: 18px; font-weight: 800">{{h.nom}} <span style="font-size: 14px; font-weight: 500; color: #4a5063">{{h.oraliq}}</span></h3>
<sc-for list="{{h.kunlar}}" as="d" hint-placeholder-count="7">
<label style="{{d.uslub}}">
<span style="width: 52px; font-size: 14px; font-weight: 500; color: #4a5063">{{d.kun}}-kun</span>
<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{{d.ikon}}"></path></svg>
<span style="flex: 1; font-size: 16px; font-weight: 800">{{d.nom}}</span>
<input type="checkbox" checked="{{d.bajarildi}}" onChange="{{d.belgila}}" style="width: 22px; height: 22px; margin: 0; accent-color: #4255ff; cursor: pointer">
</label>
</sc-for>
</div>
</sc-for>
</section>
</sc-if>

<section aria-labelledby="rt-hol-h" style="background: #f5f6fa; border-radius: 24px; padding: 20px; display: flex; flex-direction: column; gap: 16px">
<div>
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">Maket uchun · saytda ko'rinmaydi</p>
<h2 id="rt-hol-h" style="margin: 4px 0 0; font-size: 24px; font-weight: 800">Holatlar</h2>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Javob varianti</p>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 56px; padding: 0 16px; border: 2px solid #0f1115; border-radius: 16px; font-weight: 700">Writing<span style="font-size: 13px; font-weight: 500; color: #4a5063">bosilganda</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 56px; padding: 0 16px; border: 2px solid #4255ff; background: #eef0ff; border-radius: 16px; font-weight: 700">Writing<span style="font-size: 13px; font-weight: 500; color: #4a5063">tanlangan</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 56px; padding: 0 16px; border: 2px solid #dfe2ea; border-radius: 16px; font-weight: 700; outline: 3px solid #4255ff; outline-offset: 2px">Writing<span style="font-size: 13px; font-weight: 500; color: #4a5063">fokus</span></span>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 14px; font-weight: 700">"Keyingisi" tugmasi</p>
<span style="display: flex; align-items: center; justify-content: center; min-height: 52px; border-radius: 999px; background: #eceef3; color: #4a5063; font-weight: 800">Keyingisi · o'chiq</span>
<span style="display: flex; align-items: center; justify-content: center; min-height: 52px; border-radius: 999px; background: #2f40e0; color: #ffffff; font-weight: 800">Keyingisi · bosilganda</span>
<span style="display: flex; align-items: center; justify-content: center; min-height: 52px; border-radius: 999px; background: #4255ff; color: #ffffff; font-weight: 800; outline: 3px solid #4255ff; outline-offset: 2px">Keyingisi · fokus</span>
</div>
<div style="background: #ffffff; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 8px">
<p style="margin: 0; font-size: 14px; font-weight: 700">Kun qatori</p>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 56px; padding: 0 12px; border-radius: 16px; font-weight: 800">Writing<span style="font-size: 13px; font-weight: 500; color: #4a5063">belgilanmagan</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 56px; padding: 0 12px; border-radius: 16px; background: #eef0ff; font-weight: 800">Writing<span style="font-size: 13px; font-weight: 500; color: #4a5063">bajarilgan</span></span>
<span style="display: flex; align-items: center; justify-content: space-between; min-height: 56px; padding: 0 12px; border-radius: 16px; font-weight: 800; outline: 3px solid #4255ff; outline-offset: 2px">Writing<span style="font-size: 13px; font-weight: 500; color: #4a5063">fokus</span></span>
</div>
</section>
</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"holat":{"editor":"enum","options":["bosh","savol","natija","bajarilgan"],"default":"natija"},"$preview":{"width":390,"height":3800}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = this.seed(props.holat || "natija");
}
seed(h) {
var s = { ekran: "natija", qadam: 0, javob: { hafta: "3–4 hafta", soat: "1–2 soat", qiyin: "Writing" }, bajarilgan: {} };
if (h === "bosh") { s.ekran = "bosh"; s.javob = { hafta: null, soat: null, qiyin: null }; }
if (h === "savol") { s.ekran = "savol"; s.javob = { hafta: "3–4 hafta", soat: null, qiyin: null }; }
if (h === "bajarilgan") s.bajarilgan = { 1: true, 2: true, 3: true, 4: true, 5: true };
return s;
}
componentDidUpdate(prev) {
if (prev.holat !== this.props.holat) this.setState(this.seed(this.props.holat));
}
renderVals() {
var self = this;
var s = this.state;
var ikon = {
Listening: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z",
Reading: "M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z",
Writing: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
Speaking: "M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4",
Takror: "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5",
Namuna: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6",
Tahlil: "M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3"
};
var savollar = [
{ key: "hafta", sarlavha: "Imtihongacha necha hafta qoldi?", izoh: "Taxminiy javob ham yetadi.", v: ["1–2 hafta", "3–4 hafta", "5–8 hafta", "8 haftadan ko'p"] },
{ key: "soat", sarlavha: "Kuniga necha soat ajrata olasan?", izoh: "Orzu qilganingni emas, haqiqiy vaqtingni tanla.", v: ["1 soatgacha", "1–2 soat", "2–3 soat", "3 soatdan ko'p"] },
{ key: "qiyin", sarlavha: "Qaysi bo'lim senga eng qiyin?", izoh: "Shu bo'limga ko'proq kun ajratiladi.", v: ["Listening", "Reading", "Writing", "Speaking"] }
];
var q = savollar[s.qadam];
var tanlov = s.javob[q.key];
var asos = "width: 100%; min-height: 56px; box-sizing: border-box; padding: 0 16px; border-radius: 16px; font: inherit; font-size: 16px; font-weight: 700; color: #0f1115; text-align: left; cursor: pointer; ";
var variantlar = q.v.map(function (m) {
var t = tanlov === m;
return {
matn: m, tanlangan: t,
uslub: asos + (t ? "background: #eef0ff; border: 2px solid #4255ff;" : "background: #ffffff; border: 2px solid #dfe2ea;"),
tanla: function () { var j = Object.assign({}, self.state.javob); j[q.key] = m; self.setState({ javob: j }); }
};
});
var qiyin = s.javob.qiyin || "Writing";
var tartib = ["Listening", "Reading", "Writing", "Speaking"];
var boshqa = tartib.filter(function (x) { return x !== qiyin; });
var nomlar = [];
for (var w = 0; w < 4; w++) {
nomlar.push(qiyin, boshqa[w % 3], qiyin, boshqa[(w + 1) % 3], qiyin, boshqa[(w + 2) % 3], "Takror");
}
nomlar.push("Namuna", "Tahlil");
var soni = 0;
var kunlar = nomlar.map(function (nom, i) {
var k = i + 1;
var b = !!s.bajarilgan[k];
if (b) soni++;
return {
kun: k, nom: nom, ikon: ikon[nom], bajarildi: b,
uslub: "min-height: 56px; box-sizing: border-box; padding: 0 12px; border-radius: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; " + (b ? "background: #eef0ff;" : "background: #ffffff;"),
belgila: function () { var o = Object.assign({}, self.state.bajarilgan); o[k] = !o[k]; self.setState({ bajarilgan: o }); }
};
});
var haftalar = [0, 1, 2, 3].map(function (w) {
return { nom: (w + 1) + "-hafta", oraliq: (w * 7 + 1) + "–" + (w * 7 + 7) + "-kun", kunlar: kunlar.slice(w * 7, w * 7 + 7) };
});
haftalar.push({ nom: "Yakun", oraliq: "29–30-kun", kunlar: kunlar.slice(28) });
var tanlanmagan = !tanlov;
var oxirgi = s.qadam === 2;
return {
ekranBosh: s.ekran === "bosh",
ekranSavol: s.ekran === "savol",
ekranNatija: s.ekran === "natija",
menuOchiq: !!s.menu,
menuYorliq: s.menu ? "Menyuni yopish" : "Menyuni ochish",
menuIkon: s.menu ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16",
menuAlmashtir: function () { self.setState({ menu: !self.state.menu }); },
savol: q,
variantlar: variantlar,
qadamRaqam: s.qadam + 1,
progress: Math.round((s.qadam + 1) / 3 * 100) + "%",
tanlanmagan: tanlanmagan,
keyingiMatn: oxirgi ? "Rejani ko'rish" : "Keyingisi",
keyingiUslub: "min-height: 52px; border: 0; border-radius: 999px; font: inherit; font-weight: 800; font-size: 16px; " + (tanlanmagan ? "background: #eceef3; color: #4a5063; cursor: not-allowed;" : "background: #4255ff; color: #ffffff; cursor: pointer;"),
boshla: function () { self.setState({ ekran: "savol", qadam: 0 }); },
orqaga: function () { if (self.state.qadam === 0) self.setState({ ekran: "bosh" }); else self.setState({ qadam: self.state.qadam - 1 }); },
keyingi: function () { if (tanlanmagan) return; if (oxirgi) self.setState({ ekran: "natija", bajarilgan: {} }); else self.setState({ qadam: self.state.qadam + 1 }); },
qayta: function () { self.setState({ ekran: "savol", qadam: 0, javob: { hafta: null, soat: null, qiyin: null }, bajarilgan: {} }); },
javob: { hafta: s.javob.hafta || "3–4 hafta", soat: s.javob.soat || "1–2 soat" },
qiyinNom: qiyin,
qisqa: s.javob.hafta === "1–2 hafta",
haftalar: haftalar,
bajarilganSoni: soni,
bajarilganFoiz: Math.round(soni / 30 * 100) + "%"
};
}
}
</script>
</body>
</html>
```

## RejaHolatlar.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>Reja vositasi holatlari, telefonda</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#f5f6fa}
</style>
</helmet>
<div style="width: 1250px; height: 900px; box-sizing: border-box; font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #f5f6fa; display: flex; gap: 40px">
<div style="flex: 0 0 390px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">1 · Bo'sh: hali reja yo'q</p>
<div style="width: 390px; height: 844px; overflow: hidden; border-radius: 24px; background: #ffffff">
<dc-import name="RejaTelefon" holat="bosh" hint-size="390px,844px"></dc-import>
</div>
</div>
<div style="flex: 0 0 390px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">2 · Savol ekrani, javob tanlangan</p>
<div style="width: 390px; height: 844px; overflow: hidden; border-radius: 24px; background: #ffffff">
<dc-import name="RejaTelefon" holat="savol" hint-size="390px,844px"></dc-import>
</div>
</div>
<div style="flex: 0 0 390px; display: flex; flex-direction: column; gap: 12px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #4a5063">3 · Bajarilgan kunlar</p>
<div style="width: 390px; height: 844px; overflow: hidden; border-radius: 24px; background: #ffffff">
<dc-import name="RejaTelefon" holat="bajarilgan" hint-size="390px,844px"></dc-import>
</div>
</div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1250,"height":900}}'>
class Component extends DCLogic {
renderVals() {
return {};
}
}
</script>
</body>
</html>
```
