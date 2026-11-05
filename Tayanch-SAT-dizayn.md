# Tayanch SAT dizayni (6 ta ekran)

Claude Design kanvasidan eksport: https://claude.ai/artifact/CpAzPf6KP3Uhx9zD1Xk2Pw
Palitra: oq #ffffff, qora #0f1115, ko'k #4255ff. Shrift: Figtree. Ekranlardagi savollar, so'zlar va raqamlar NAMUNA, saytga qo'yilmaydi.

Ekranlar: Main (SAT bosh sahifa, kompyuter), Mashq (test savoli), Telefon (qorong'i mavzu), Natijalar (Mening natijalarim), Lugat (lug'at kartochkalari), SavolBanki (savol banki).

## canvas.json

```json
{"v":3,"createdOnFiles":{"v":1,"at":"2026-11-04T12:00:00Z"},"title":"Tayanch SAT dizayni","launch":{"view":"canvas"},"pages":[],"boards":{"Main.dc.html":{"x":0,"y":0,"w":1280,"h":1500,"title":"SAT bo'limi — bosh sahifa (kompyuter)","expand":"fill"},"Mashq.dc.html":{"x":1360,"y":0,"w":1280,"h":820,"title":"Mashq testi — savol ekrani","is_interactive":true},"Telefon.dc.html":{"x":2720,"y":0,"w":390,"h":844,"title":"Telefon — SAT bosh sahifa"},"Natijalar.dc.html":{"x":1360,"y":940,"w":1280,"h":1240,"title":"Mening natijalarim","expand":"fill","is_interactive":true},"Lugat.dc.html":{"x":2720,"y":940,"w":1280,"h":820,"title":"Lug'at kartochkalari","is_interactive":true},"SavolBanki.dc.html":{"x":0,"y":1620,"w":1280,"h":1240,"title":"Savol banki","expand":"fill","is_interactive":true}},"order":["Main.dc.html","Mashq.dc.html","Telefon.dc.html","Natijalar.dc.html","Lugat.dc.html","SavolBanki.dc.html"],"notes":{"sarlavha":{"x":0,"y":-300,"text":"Tayanch SAT — oq, qora, ko'k","kind":"title1","maxW":3110}},"designSystems":[]}
```

## Main.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>Tayanch SAT bosh sahifa</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800;900&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#ffffff}
a{color:#4255ff}a:hover{color:#2f40e0}
</style>
</helmet>
<div style="font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #ffffff; display: flex; flex-wrap: wrap; min-height: 100vh">

<aside aria-label="SAT bo'limi" style="flex: 1 1 288px; max-width: 288px; box-sizing: border-box; border-right: 1px solid #e6e8ee; padding: 20px 16px; display: flex; flex-direction: column; gap: 24px; background: #ffffff">
<div style="display: flex; align-items: center; justify-content: space-between">
<a href="#" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #0f1115">
<span aria-hidden="true" style="width: 36px; height: 36px; border-radius: 10px; background: #0f1115; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px">T</span>
<span style="font-weight: 800; font-size: 18px">Tayanch <span style="color: #4255ff">SAT</span></span>
</a>
<button type="button" aria-label="Yon panelni yig'ish" style="width: 44px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: #5a6072; display: flex; align-items: center; justify-content: center; cursor: pointer">
<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"></rect><path d="M9 4v16"></path><path d="M15 10l-2 2 2 2"></path></svg>
</button>
</div>

<nav aria-label="SAT navigatsiyasi" style="display: flex; flex-direction: column; gap: 20px">
<a href="#" aria-current="page" style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: 12px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px">
<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path></svg>
SAT bo'limi haqida</a>

<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Mashq</p>
<a href="Mashq.dc.html" style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"></path><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>Test</a>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="2"></rect><rect x="3" y="14" width="18" height="6" rx="2"></rect></svg>Savol banki</a>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"></path><path d="M10 20V4"></path><path d="M16 20v-7"></path><path d="M22 20H2"></path></svg>Mening natijalarim</a>
</div>

<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">O'qish</p>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"></path></svg>Kitoblar</a>
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="14" rx="2"></rect><path d="M7 3h12a2 2 0 0 1 2 2v12"></path></svg>Lug'at</a>
</div>

<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Qo'llanmalar</p>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px 0 44px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Strategiya</a>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px 0 44px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Math va Desmos</a>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px 0 44px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Reading &amp; Writing</a>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px 0 44px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Vaqt va retake</a>
</div>
</nav>

<div style="margin-top: auto; border-top: 1px solid #e6e8ee; padding-top: 16px; display: flex; flex-direction: column; gap: 4px">
<a href="#" style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #4a5063; text-decoration: none; font-weight: 600; font-size: 14px"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>Tayanch bosh sahifasi</a>
<button type="button" style="display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border: 0; border-radius: 12px; background: #f5f6fa; color: #0f1115; font: inherit; font-weight: 600; font-size: 14px; cursor: pointer; text-align: left"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg>Qorong'i mavzu</button>
</div>
</aside>

<main style="flex: 999 1 560px; min-width: 0; box-sizing: border-box; padding: 56px 40px 64px">
<div style="max-width: 960px; display: flex; flex-direction: column; gap: 56px">

<section aria-labelledby="sat-h" style="display: flex; flex-wrap: wrap; gap: 32px; align-items: stretch">
<div style="flex: 3 1 420px; display: flex; flex-direction: column; gap: 20px">
<p style="margin: 0; display: flex; align-items: center; gap: 12px"><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">Qoralama</span><span style="font-size: 14px; font-weight: 500; color: #5a6072">Bo'lim kirishi</span></p>
<h1 id="sat-h" style="margin: 0; font-size: 56px; line-height: 1.05; font-weight: 900; letter-spacing: -1px">Digital SAT,<br><span style="color: #4255ff">qimmat kurslarsiz.</span></h1>
<p style="margin: 0; font-size: 19px; line-height: 1.6; color: #4a5063; max-width: 58ch">English (Reading &amp; Writing) va Math bir xil e'tibor bilan. Reja muallifning SAT 1420 natijasiga olib kelgan mustaqil tayyorgarligiga asoslanadi: Desmos va formulalar, vaqtni boshqarish, xatolar tahlili.</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 4px">
<a href="Mashq.dc.html" style="display: inline-flex; align-items: center; gap: 10px; min-height: 52px; padding: 0 26px; border-radius: 999px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 16px">Mashq testini boshlash<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></a>
<a href="#" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 26px; border-radius: 999px; background: #eceef3; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 16px">Strategiyani o'qish</a>
</div>
</div>

<div style="flex: 2 1 280px; box-sizing: border-box; background: #0f1115; color: #ffffff; border-radius: 24px; padding: 28px; display: flex; flex-direction: column; gap: 20px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8b97ff">Imtihon tuzilmasi</p>
<div style="display: flex; flex-direction: column; gap: 12px">
<div style="background: #1b1e26; border: 1px solid #2a2e38; border-radius: 16px; padding: 16px 18px; display: flex; align-items: center; gap: 14px">
<span aria-hidden="true" style="width: 40px; height: 40px; border-radius: 12px; background: #4255ff; display: flex; align-items: center; justify-content: center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"></path></svg></span>
<div><p style="margin: 0; font-weight: 800; font-size: 17px">Reading &amp; Writing</p><p style="margin: 2px 0 0; font-size: 14px; color: #b4b9c8">[modul soni va vaqti — rasmiy manbadan]</p></div>
</div>
<div style="background: #1b1e26; border: 1px solid #2a2e38; border-radius: 16px; padding: 16px 18px; display: flex; align-items: center; gap: 14px">
<span aria-hidden="true" style="width: 40px; height: 40px; border-radius: 12px; background: #4255ff; display: flex; align-items: center; justify-content: center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg></span>
<div><p style="margin: 0; font-weight: 800; font-size: 17px">Math</p><p style="margin: 2px 0 0; font-size: 14px; color: #b4b9c8">[modul soni va vaqti — rasmiy manbadan]</p></div>
</div>
</div>
<p style="margin: 0; font-size: 13px; line-height: 1.5; color: #b4b9c8">Tayanch College Board bilan aloqador emas.</p>
</div>
</section>

<section aria-labelledby="yol-h" style="display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 12px">
<h2 id="yol-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">Qayerdan boshlaysiz?</h2>
<p style="margin: 0; font-size: 14px; font-weight: 500; color: #5a6072">Uch qadam, istalgan tartibda</p>
</div>
<ol style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<li style="padding: 22px 28px; display: grid; grid-template-columns: 140px minmax(0, 1fr) auto; align-items: center; column-gap: 24px; row-gap: 4px">
<span style="font-size: 13px; font-weight: 700; color: #4255ff">1 · TUSHUNISH</span>
<div style="display: flex; flex-direction: column; gap: 4px"><h3 style="margin: 0; font-size: 20px; font-weight: 800">Strategiya</h3>
<p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4a5063">Tayyorgarlikni qayerdan boshlash va qanday rejalashtirish.</p></div>
<a href="#" style="font-weight: 700; font-size: 15px; white-space: nowrap">Qo'llanmani ochish</a>
</li>
<li style="padding: 22px 28px; display: grid; grid-template-columns: 140px minmax(0, 1fr) auto; align-items: center; column-gap: 24px; row-gap: 4px; border-top: 1px solid #e6e8ee">
<span style="font-size: 13px; font-weight: 700; color: #4255ff">2 · MASHQ</span>
<div style="display: flex; flex-direction: column; gap: 4px"><h3 style="margin: 0; font-size: 20px; font-weight: 800">Test va savol banki</h3>
<p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4a5063">Mavzu bo'yicha qisqa testlar, javobdan keyin darhol izoh.</p></div>
<a href="Mashq.dc.html" style="font-weight: 700; font-size: 15px; white-space: nowrap">Mashq qilish</a>
</li>
<li style="padding: 22px 28px; display: grid; grid-template-columns: 140px minmax(0, 1fr) auto; align-items: center; column-gap: 24px; row-gap: 4px; border-top: 1px solid #e6e8ee">
<span style="font-size: 13px; font-weight: 700; color: #4255ff">3 · TAHLIL</span>
<div style="display: flex; flex-direction: column; gap: 4px"><h3 style="margin: 0; font-size: 20px; font-weight: 800">Mening natijalarim</h3>
<p style="margin: 0; font-size: 15px; line-height: 1.55; color: #4a5063">Xatolar ro'yxati, faqat shu brauzerda saqlanadi. Ball hisoblanmaydi.</p></div>
<a href="#" style="font-weight: 700; font-size: 15px; white-space: nowrap">Natijalarni ko'rish</a>
</li>
</ol>
</section>

<section aria-labelledby="sahifa-h" style="display: flex; flex-direction: column; gap: 20px">
<h2 id="sahifa-h" style="margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2">Bo'limdagi barcha sahifalar</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px">
<div style="background: #f5f6fa; border-radius: 24px; padding: 8px">
<p style="margin: 12px 16px 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">O'qish</p>
<ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px">
<li style="background: #ffffff; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px"><span style="font-weight: 700">Kitoblar</span><span style="padding: 3px 10px; border-radius: 999px; background: #eceef3; font-size: 12px; font-weight: 700; color: #4a5063">tez orada</span></li>
<li style="background: #ffffff; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px"><span style="font-weight: 700">Lug'at kartochkalari</span><span style="padding: 3px 10px; border-radius: 999px; background: #eceef3; font-size: 12px; font-weight: 700; color: #4a5063">tez orada</span></li>
</ul>
</div>
<div style="background: #f5f6fa; border-radius: 24px; padding: 8px">
<p style="margin: 12px 16px 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Qo'llanmalar</p>
<ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px">
<li style="background: #ffffff; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px"><span style="font-weight: 700">Math va Desmos</span><span style="padding: 3px 10px; border-radius: 999px; background: #eceef3; font-size: 12px; font-weight: 700; color: #4a5063">tez orada</span></li>
<li style="background: #ffffff; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px"><span style="font-weight: 700">Reading &amp; Writing</span><span style="padding: 3px 10px; border-radius: 999px; background: #eceef3; font-size: 12px; font-weight: 700; color: #4a5063">tez orada</span></li>
<li style="background: #ffffff; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px"><span style="font-weight: 700">Vaqt va retake</span><span style="padding: 3px 10px; border-radius: 999px; background: #eceef3; font-size: 12px; font-weight: 700; color: #4a5063">tez orada</span></li>
</ul>
</div>
</div>
</section>

<section aria-label="Aloqa va eslatma" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; border-top: 1px solid #e6e8ee; padding-top: 32px">
<p style="margin: 0; display: flex; align-items: center; gap: 10px; font-weight: 700">Telegram kanal <span style="padding: 3px 10px; border-radius: 999px; background: #eceef3; font-size: 12px; font-weight: 700; color: #4a5063">tez orada</span></p>
<p style="margin: 0; font-size: 14px; color: #5a6072; max-width: 60ch">SAT College Board'ning savdo belgisi. Tayanch u bilan bog'liq emas. Natija kafolatlanmaydi.</p>
</section>

</div>
</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1280,"height":1500}}'>
class Component extends DCLogic {
renderVals() {
return {};
}
}
</script>
</body>
</html>
```

## Mashq.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>SAT mashq savoli</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800;900&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#f5f6fa}
a{color:#4255ff}a:hover{color:#2f40e0}
</style>
</helmet>
<div style="width: 1280px; height: 820px; box-sizing: border-box; font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #f5f6fa; display: flex; flex-direction: column">

<header style="height: 72px; flex: none; box-sizing: border-box; padding: 0 32px; background: #ffffff; border-bottom: 1px solid #e6e8ee; display: flex; align-items: center; gap: 24px">
<a href="Main.dc.html" aria-label="SAT bo'limiga qaytish" style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #0f1115; background: #f5f6fa">
<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
</a>
<div style="display: flex; flex-direction: column; gap: 2px">
<span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Math · Namuna</span>
<span style="font-size: 17px; font-weight: 800">Chiziqli tenglamalar</span>
</div>
<div style="flex: 1; display: flex; align-items: center; gap: 14px; max-width: 520px; margin-left: auto">
<div role="progressbar" aria-label="Mashq jarayoni" aria-valuemin="0" aria-valuemax="{{jami}}" aria-valuenow="{{joriy}}" style="flex: 1; height: 8px; border-radius: 999px; background: #eceef3; overflow: hidden">
<div style="height: 100%; width: {{progress}}; background: #4255ff; border-radius: 999px"></div>
</div>
<span style="font-size: 14px; font-weight: 700; color: #4a5063; white-space: nowrap">{{joriy}} / {{jami}}</span>
</div>
<button type="button" style="min-height: 44px; padding: 0 18px; border: 0; border-radius: 999px; background: #eceef3; color: #0f1115; font: inherit; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer">
<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><path d="M8 6h8"></path><path d="M8 11h2M14 11h2M8 15h2M14 15h2M8 19h2M14 19h2"></path></svg>
Desmos</button>
</header>

<main style="flex: 1; min-height: 0; display: flex; justify-content: center; align-items: flex-start; padding: 40px 32px">
<div style="width: 760px; display: flex; flex-direction: column; gap: 20px">

<section aria-labelledby="savol" style="background: #ffffff; border-radius: 24px; box-shadow: 0 4px 16px rgba(15,17,21,0.08); padding: 36px; display: flex; flex-direction: column; gap: 24px">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
<span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">Savol {{joriy}}</span>
<button type="button" aria-pressed="{{belgilangan}}" onClick="{{belgila}}" style="min-height: 44px; padding: 0 14px; border: 0; border-radius: 999px; background: transparent; color: #4a5063; font: inherit; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer">
<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="{{bayroqRang}}" stroke="#4255ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4"></path><path d="M4 4h13l-2 4 2 4H4"></path></svg>
Keyinroq qaytish</button>
</div>
<h1 id="savol" style="margin: 0; font-size: 24px; line-height: 1.4; font-weight: 700">Agar 3x + 5 = 20 bo'lsa, x ning qiymati nechaga teng?</h1>

<div role="radiogroup" aria-labelledby="savol" style="display: flex; flex-direction: column; gap: 12px">
<sc-for list="{{variantlar}}" as="v" hint-placeholder-count="4">
<button type="button" role="radio" aria-checked="{{v.tanlangan}}" onClick="{{v.tanla}}" disabled="{{tekshirildi}}" style="{{v.uslub}}">
<span style="{{v.harfUslub}}">{{v.harf}}</span>
<span style="flex: 1">{{v.matn}}</span>
<sc-if value="{{v.togri}}" hint-placeholder-val="{{ false }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4255ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"></path></svg></sc-if>
<sc-if value="{{v.notogri}}" hint-placeholder-val="{{ false }}"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f1115" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></sc-if>
</button>
</sc-for>
</div>
</section>

<sc-if value="{{tekshirildi}}" hint-placeholder-val="{{ false }}">
<section aria-live="polite" style="{{izohUslub}}">
<p style="margin: 0; font-size: 18px; font-weight: 800">{{izohSarlavha}}</p>
<p style="margin: 0; font-size: 16px; line-height: 1.6">Ikki tomondan 5 ni ayiramiz: 3x = 15. Keyin 3 ga bo'lamiz: x = 5. Tekshirish: 3 · 5 + 5 = 20.</p>
</section>
</sc-if>

<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
<button type="button" style="min-height: 52px; padding: 0 22px; border: 0; border-radius: 999px; background: transparent; color: #4a5063; font: inherit; font-weight: 700; font-size: 15px; cursor: pointer">O'tkazib yuborish</button>
<sc-if value="{{tekshirildi}}" hint-placeholder-val="{{ false }}">
<button type="button" onClick="{{qayta}}" style="min-height: 52px; padding: 0 28px; border: 0; border-radius: 999px; background: #0f1115; color: #ffffff; font: inherit; font-weight: 800; font-size: 16px; cursor: pointer">Keyingi savol</button>
</sc-if>
<sc-if value="{{tekshirilmadi}}" hint-placeholder-val="{{ true }}">
<button type="button" onClick="{{tekshir}}" disabled="{{tanlanmagan}}" style="{{tekshirUslub}}">Tekshirish</button>
</sc-if>
</div>

</div>
</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1280,"height":820}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { tanlov: null, tekshirildi: false, belgilangan: false };
}
renderVals() {
var s = this.state;
var self = this;
var togriId = 'b';
var xom = [
{ id: 'a', harf: 'A', matn: '3' },
{ id: 'b', harf: 'B', matn: '5' },
{ id: 'c', harf: 'C', matn: '15' },
{ id: 'd', harf: 'D', matn: '25/3' }
];
var asos = 'width: 100%; min-height: 60px; box-sizing: border-box; padding: 0 18px; border-radius: 16px; font: inherit; font-size: 17px; font-weight: 600; color: #0f1115; text-align: left; display: flex; align-items: center; gap: 16px; cursor: pointer; ';
var variantlar = xom.map(function (v) {
var tanlangan = s.tanlov === v.id;
var togri = s.tekshirildi && v.id === togriId;
var notogri = s.tekshirildi && tanlangan && v.id !== togriId;
var uslub = asos + 'background: #ffffff; border: 2px solid #dfe2ea;';
var harfUslub = 'width: 32px; height: 32px; flex: none; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; background: #f5f6fa; color: #4a5063;';
if (tanlangan && !s.tekshirildi) {
uslub = asos + 'background: #ffffff; border: 2px solid #4255ff;';
harfUslub = harfUslub.replace('background: #f5f6fa; color: #4a5063;', 'background: #4255ff; color: #ffffff;');
}
if (togri) {
uslub = asos + 'background: #eef0ff; border: 2px solid #4255ff;';
harfUslub = harfUslub.replace('background: #f5f6fa; color: #4a5063;', 'background: #4255ff; color: #ffffff;');
}
if (notogri) {
uslub = asos + 'background: #f5f6fa; border: 2px dashed #0f1115; text-decoration: line-through;';
harfUslub = harfUslub.replace('background: #f5f6fa; color: #4a5063;', 'background: #0f1115; color: #ffffff;');
}
return {
harf: v.harf, matn: v.matn, tanlangan: tanlangan, togri: togri, notogri: notogri,
uslub: uslub, harfUslub: harfUslub,
tanla: function () { if (!s.tekshirildi) self.setState({ tanlov: v.id }); }
};
});
var togrimi = s.tanlov === togriId;
var tanlanmagan = s.tanlov === null;
return {
variantlar: variantlar,
joriy: 3,
jami: 10,
progress: s.tekshirildi ? '30%' : '20%',
tekshirildi: s.tekshirildi,
tekshirilmadi: !s.tekshirildi,
tanlanmagan: tanlanmagan,
belgilangan: s.belgilangan,
bayroqRang: s.belgilangan ? '#4255ff' : 'none',
belgila: function () { self.setState({ belgilangan: !s.belgilangan }); },
tekshir: function () { if (!tanlanmagan) self.setState({ tekshirildi: true }); },
qayta: function () { self.setState({ tanlov: null, tekshirildi: false }); },
izohSarlavha: togrimi ? "To'g'ri! Javob: B" : "Bu safar emas. To'g'ri javob: B",
izohUslub: togrimi
? 'border-radius: 24px; padding: 24px 28px; display: flex; flex-direction: column; gap: 8px; background: #4255ff; color: #ffffff;'
: 'border-radius: 24px; padding: 24px 28px; display: flex; flex-direction: column; gap: 8px; background: #0f1115; color: #ffffff;',
tekshirUslub: 'min-height: 52px; padding: 0 32px; border: 0; border-radius: 999px; font: inherit; font-weight: 800; font-size: 16px; ' + (tanlanmagan ? 'background: #eceef3; color: #5a6072; cursor: not-allowed;' : 'background: #4255ff; color: #ffffff; cursor: pointer;')
};
}
}
</script>
</body>
</html>
```

## Telefon.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>Tayanch SAT telefonda</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800;900&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#0f1115}
a{color:#8b97ff}a:hover{color:#ffffff}
</style>
</helmet>
<div style="width: 390px; height: 844px; box-sizing: border-box; overflow: hidden; font-family: 'Figtree', system-ui, sans-serif; color: #ffffff; background: #0f1115; display: flex; flex-direction: column">

<header style="height: 64px; flex: none; box-sizing: border-box; padding: 0 12px 0 16px; border-bottom: 1px solid #2a2e38; display: flex; align-items: center; justify-content: space-between">
<a href="#" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #ffffff">
<span aria-hidden="true" style="width: 34px; height: 34px; border-radius: 10px; background: #ffffff; color: #0f1115; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 17px">T</span>
<span style="font-weight: 800; font-size: 17px">Tayanch <span style="color: #8b97ff">SAT</span></span>
</a>
<button type="button" aria-label="Menyuni ochish" aria-expanded="false" style="width: 44px; height: 44px; border: 0; border-radius: 12px; background: #1b1e26; color: #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer">
<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>
</button>
</header>

<main style="flex: 1; min-height: 0; padding: 28px 16px; display: flex; flex-direction: column; gap: 28px">
<section aria-labelledby="t-h" style="display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; display: flex; align-items: center; gap: 10px"><span style="padding: 4px 12px; border-radius: 999px; background: #2a2e38; font-size: 13px; font-weight: 700">Qoralama</span><span style="font-size: 14px; font-weight: 500; color: #b4b9c8">Bo'lim kirishi</span></p>
<h1 id="t-h" style="margin: 0; font-size: 38px; line-height: 1.08; font-weight: 900; letter-spacing: -0.5px">Digital SAT,<br><span style="color: #8b97ff">qimmat kurslarsiz.</span></h1>
<p style="margin: 0; font-size: 17px; line-height: 1.6; color: #b4b9c8">English va Math bir xil e'tibor bilan. Muallifning mustaqil tayyorgarligiga asoslangan reja.</p>
<a href="Mashq.dc.html" style="display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; border-radius: 999px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 16px">Mashq testini boshlash<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></a>
</section>

<section aria-labelledby="t-yol" style="display: flex; flex-direction: column; gap: 12px">
<h2 id="t-yol" style="margin: 0; font-size: 22px; font-weight: 800">Qayerdan boshlaysiz?</h2>
<ol style="list-style: none; margin: 0; padding: 0; border: 1.5px solid #2a2e38; border-radius: 20px; overflow: hidden">
<li><a href="#" style="display: flex; align-items: center; gap: 14px; min-height: 64px; padding: 0 16px; text-decoration: none; color: #ffffff"><span style="font-size: 13px; font-weight: 800; color: #8b97ff; width: 16px">1</span><span style="flex: 1; font-weight: 700; font-size: 16px">Strategiya</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b4b9c8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
<li style="border-top: 1px solid #2a2e38"><a href="Mashq.dc.html" style="display: flex; align-items: center; gap: 14px; min-height: 64px; padding: 0 16px; text-decoration: none; color: #ffffff"><span style="font-size: 13px; font-weight: 800; color: #8b97ff; width: 16px">2</span><span style="flex: 1; font-weight: 700; font-size: 16px">Test va savol banki</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b4b9c8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
<li style="border-top: 1px solid #2a2e38"><a href="#" style="display: flex; align-items: center; gap: 14px; min-height: 64px; padding: 0 16px; text-decoration: none; color: #ffffff"><span style="font-size: 13px; font-weight: 800; color: #8b97ff; width: 16px">3</span><span style="flex: 1; font-weight: 700; font-size: 16px">Mening natijalarim</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b4b9c8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg></a></li>
</ol>
</section>

<section aria-label="Imtihon tuzilmasi" style="background: #1b1e26; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 10px">
<p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8b97ff">Imtihon tuzilmasi</p>
<p style="margin: 0; font-size: 15px; font-weight: 700">Reading &amp; Writing · Math</p>
<p style="margin: 0; font-size: 13px; color: #b4b9c8">[modul va vaqt — rasmiy manbadan]</p>
</section>
</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":390,"height":844}}'>
class Component extends DCLogic {
renderVals() {
return {};
}
}
</script>
</body>
</html>
```

## Natijalar.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>Mening natijalarim</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800;900&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#ffffff}
a{color:#4255ff}a:hover{color:#2f40e0}
</style>
</helmet>
<div style="font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #ffffff; display: flex; flex-wrap: wrap; min-height: 100vh">

<aside aria-label="SAT bo'limi" style="flex: 1 1 288px; max-width: 288px; box-sizing: border-box; border-right: 1px solid #e6e8ee; padding: 20px 16px; display: flex; flex-direction: column; gap: 24px">
<a href="Main.dc.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #0f1115; min-height: 44px">
<span aria-hidden="true" style="width: 36px; height: 36px; border-radius: 10px; background: #0f1115; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px">T</span>
<span style="font-weight: 800; font-size: 18px">Tayanch <span style="color: #4255ff">SAT</span></span>
</a>
<nav aria-label="SAT navigatsiyasi" style="display: flex; flex-direction: column; gap: 20px">
<a href="Main.dc.html" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">SAT bo'limi haqida</a>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Mashq</p>
<a href="Mashq.dc.html" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Test</a>
<a href="#" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Savol banki</a>
<a href="#" aria-current="page" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px">Mening natijalarim</a>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">O'qish</p>
<a href="#" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Kitoblar</a>
<a href="#" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Lug'at</a>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Qo'llanmalar</p>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Strategiya</a>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Math va Desmos</a>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Reading &amp; Writing</a>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Vaqt va retake</a>
</div>
</nav>
</aside>

<main style="flex: 999 1 560px; min-width: 0; box-sizing: border-box; padding: 56px 40px 64px">
<div style="max-width: 960px; display: flex; flex-direction: column; gap: 40px">

<section aria-labelledby="nat-h" style="display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; display: flex; align-items: center; gap: 12px"><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">Vosita</span><span style="padding: 4px 12px; border-radius: 999px; border: 1.5px dashed #5a6072; font-size: 13px; font-weight: 700; color: #4a5063">Namuna ma'lumot</span></p>
<h1 id="nat-h" style="margin: 0; font-size: 46px; line-height: 1.1; font-weight: 900; letter-spacing: -0.5px">Mening natijalarim</h1>
<p style="margin: 0; font-size: 18px; line-height: 1.6; color: #4a5063; max-width: 60ch">Mashqlardagi javoblaringiz va xatolaringiz. Ma'lumot faqat shu brauzerda saqlanadi, hech qayerga yuborilmaydi. Ball hisoblanmaydi: bu SAT balli emas.</p>
</section>

<section aria-label="Umumiy ko'rsatkichlar" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px">
<div style="background: #0f1115; color: #ffffff; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 14px; grid-column: span 2">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8b97ff">Bo'limlar bo'yicha</p>
<div style="display: flex; flex-direction: column; gap: 14px">
<div style="display: flex; flex-direction: column; gap: 8px">
<div style="display: flex; justify-content: space-between; font-weight: 700"><span>Reading &amp; Writing</span><span>14 / 20 to'g'ri</span></div>
<div aria-hidden="true" style="height: 8px; border-radius: 999px; background: #2a2e38; overflow: hidden"><div style="width: 70%; height: 100%; background: #8b97ff; border-radius: 999px"></div></div>
</div>
<div style="display: flex; flex-direction: column; gap: 8px">
<div style="display: flex; justify-content: space-between; font-weight: 700"><span>Math</span><span>9 / 16 to'g'ri</span></div>
<div aria-hidden="true" style="height: 8px; border-radius: 999px; background: #2a2e38; overflow: hidden"><div style="width: 56%; height: 100%; background: #8b97ff; border-radius: 999px"></div></div>
</div>
</div>
</div>
<div style="border: 1.5px solid #0f1115; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 6px">
<p style="margin: 0; font-size: 14px; font-weight: 600; color: #4a5063">Takrorlash kerak</p>
<p style="margin: 0; font-size: 40px; font-weight: 900; line-height: 1.1">13</p>
<p style="margin: 0; font-size: 14px; color: #5a6072">xato javob</p>
<a href="Mashq.dc.html" style="margin-top: auto; padding-top: 8px; font-weight: 700; font-size: 15px">Xatolarni qayta ishlash</a>
</div>
</section>

<section aria-labelledby="royxat-h" style="display: flex; flex-direction: column; gap: 16px">
<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px">
<h2 id="royxat-h" style="margin: 0; font-size: 28px; font-weight: 800">Javoblar tarixi</h2>
<div role="group" aria-label="Filtr" style="display: flex; flex-wrap: wrap; gap: 6px; padding: 4px; background: #f5f6fa; border-radius: 999px">
<sc-for list="{{filtrlar}}" as="f" hint-placeholder-count="3">
<button type="button" aria-pressed="{{f.faol}}" onClick="{{f.tanla}}" style="{{f.uslub}}">{{f.nomi}} <span style="opacity: 0.7">{{f.soni}}</span></button>
</sc-for>
</div>
</div>

<ul style="list-style: none; margin: 0; padding: 0; border: 1.5px solid #0f1115; border-radius: 24px; overflow: hidden">
<sc-for list="{{qatorlar}}" as="q" hint-placeholder-count="5">
<li style="{{q.qatorUslub}}">
<span style="{{q.belgiUslub}}" aria-label="{{q.holatMatn}}" role="img">
<sc-if value="{{q.togri}}" hint-placeholder-val="{{ true }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"></path></svg></sc-if>
<sc-if value="{{q.xato}}" hint-placeholder-val="{{ false }}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></sc-if>
</span>
<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px">
<span style="font-weight: 700; font-size: 16px">{{q.mavzu}}</span>
<span style="font-size: 14px; color: #5a6072">{{q.bolim}} · {{q.sana}} · javobingiz {{q.javob}}, to'g'risi {{q.togriJavob}}</span>
</div>
<sc-if value="{{q.xato}}" hint-placeholder-val="{{ false }}">
<a href="Mashq.dc.html" style="display: inline-flex; align-items: center; min-height: 44px; padding: 0 18px; border-radius: 999px; background: #eceef3; color: #0f1115; text-decoration: none; font-weight: 700; font-size: 14px; white-space: nowrap">Qayta yechish</a>
</sc-if>
</li>
</sc-for>
</ul>
<sc-if value="{{bosh}}" hint-placeholder-val="{{ false }}">
<p style="margin: 0; padding: 32px; text-align: center; background: #f5f6fa; border-radius: 24px; color: #4a5063">Bu filtrda javob yo'q.</p>
</sc-if>
</section>

<section aria-label="Ma'lumot" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; background: #f5f6fa; border-radius: 24px; padding: 24px">
<div style="display: flex; flex-direction: column; gap: 4px; max-width: 56ch">
<p style="margin: 0; font-weight: 800">Ma'lumot faqat shu brauzerda</p>
<p style="margin: 0; font-size: 14px; color: #4a5063">Boshqa qurilma yoki brauzerda bu ro'yxat ko'rinmaydi. O'chirsangiz, qaytarib bo'lmaydi.</p>
</div>
<button type="button" style="min-height: 48px; padding: 0 22px; border: 1.5px solid #0f1115; border-radius: 999px; background: #ffffff; color: #0f1115; font: inherit; font-weight: 700; font-size: 15px; cursor: pointer">Natijalarni o'chirish</button>
</section>

</div>
</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1280,"height":1240}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { filtr: 'hammasi' };
}
renderVals() {
var self = this;
var f = this.state.filtr;
var hammasi = [
{ mavzu: 'Chiziqli tenglamalar', bolim: 'Math', sana: '3-noyabr', javob: 'B', togriJavob: 'B', togri: true },
{ mavzu: "Matndagi asosiy g'oya", bolim: 'Reading & Writing', sana: '3-noyabr', javob: 'C', togriJavob: 'A', togri: false },
{ mavzu: 'Foizlar', bolim: 'Math', sana: '2-noyabr', javob: 'D', togriJavob: 'A', togri: false },
{ mavzu: "Tinish belgilari", bolim: 'Reading & Writing', sana: '2-noyabr', javob: 'A', togriJavob: 'A', togri: true },
{ mavzu: 'Kvadrat tenglamalar', bolim: 'Math', sana: '1-noyabr', javob: 'C', togriJavob: 'B', togri: false }
];
var xatolar = hammasi.filter(function (q) { return !q.togri; });
var togrilar = hammasi.filter(function (q) { return q.togri; });
var tanlangan = f === 'xato' ? xatolar : f === 'togri' ? togrilar : hammasi;
var pill = 'min-height: 40px; padding: 0 16px; border: 0; border-radius: 999px; font: inherit; font-weight: 700; font-size: 14px; cursor: pointer; ';
var filtrlar = [
{ id: 'hammasi', nomi: 'Hammasi', soni: hammasi.length },
{ id: 'xato', nomi: 'Xatolar', soni: xatolar.length },
{ id: 'togri', nomi: "To'g'ri", soni: togrilar.length }
].map(function (x) {
var faol = x.id === f;
return {
nomi: x.nomi, soni: x.soni, faol: faol,
uslub: pill + (faol ? 'background: #0f1115; color: #ffffff;' : 'background: transparent; color: #4a5063;'),
tanla: function () { self.setState({ filtr: x.id }); }
};
});
var qatorlar = tanlangan.map(function (q, i) {
var belgi = 'width: 36px; height: 36px; flex: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; ';
return {
mavzu: q.mavzu, bolim: q.bolim, sana: q.sana, javob: q.javob, togriJavob: q.togriJavob,
togri: q.togri, xato: !q.togri,
holatMatn: q.togri ? "To'g'ri" : 'Xato',
belgiUslub: belgi + (q.togri ? 'background: #4255ff; color: #ffffff;' : 'background: #0f1115; color: #ffffff;'),
qatorUslub: 'display: flex; align-items: center; gap: 16px; padding: 16px 20px;' + (i > 0 ? ' border-top: 1px solid #e6e8ee;' : '')
};
});
return { filtrlar: filtrlar, qatorlar: qatorlar, bosh: qatorlar.length === 0 };
}
}
</script>
</body>
</html>
```

## Lugat.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>Lug'at kartochkalari</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800;900&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#f5f6fa}
a{color:#4255ff}a:hover{color:#2f40e0}
</style>
</helmet>
<div style="width: 1280px; height: 820px; box-sizing: border-box; font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #f5f6fa; display: flex; flex-direction: column">

<header style="height: 72px; flex: none; box-sizing: border-box; padding: 0 32px; background: #ffffff; border-bottom: 1px solid #e6e8ee; display: flex; align-items: center; gap: 24px">
<a href="Main.dc.html" aria-label="SAT bo'limiga qaytish" style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #0f1115; background: #f5f6fa">
<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
</a>
<div style="display: flex; flex-direction: column; gap: 2px">
<span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Lug'at · Namuna to'plam</span>
<span style="font-size: 17px; font-weight: 800">Reading &amp; Writing so'zlari</span>
</div>
<div style="flex: 1; display: flex; align-items: center; gap: 14px; max-width: 460px; margin-left: auto">
<div role="progressbar" aria-label="To'plam jarayoni" aria-valuemin="0" aria-valuemax="{{jami}}" aria-valuenow="{{tartib}}" style="flex: 1; height: 8px; border-radius: 999px; background: #eceef3; overflow: hidden">
<div style="height: 100%; width: {{progress}}; background: #4255ff; border-radius: 999px"></div>
</div>
<span style="font-size: 14px; font-weight: 700; color: #4a5063; white-space: nowrap">{{tartib}} / {{jami}}</span>
</div>
</header>

<main style="flex: 1; min-height: 0; display: flex; gap: 32px; padding: 40px 48px; box-sizing: border-box">

<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 24px">
<button type="button" onClick="{{agdar}}" aria-label="{{kartaLabel}}" style="{{kartaUslub}}">
<span style="{{yuzYorliqUslub}}">{{yuzYorliq}}</span>
<sc-if value="{{oldi}}" hint-placeholder-val="{{ true }}">
<span style="display: flex; flex-direction: column; align-items: center; gap: 12px">
<span lang="en" style="font-size: 56px; font-weight: 900; letter-spacing: -1px">{{karta.soz}}</span>
<span style="font-size: 16px; font-weight: 600; color: #5a6072">{{karta.turkum}}</span>
</span>
</sc-if>
<sc-if value="{{orqasi}}" hint-placeholder-val="{{ false }}">
<span style="display: flex; flex-direction: column; align-items: center; gap: 18px; max-width: 520px">
<span style="font-size: 36px; font-weight: 800; line-height: 1.2">{{karta.tarjima}}</span>
<span lang="en" style="font-size: 18px; line-height: 1.6; color: #b4b9c8; font-style: italic">“{{karta.misol}}”</span>
</span>
</sc-if>
<span style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; font-size: 14px; font-weight: 600; color: {{maslahatRang}}">Ag'darish uchun bosing</span>
</button>

<div style="display: flex; align-items: center; gap: 12px">
<button type="button" onClick="{{oldingi}}" aria-label="Oldingi karta" style="width: 52px; height: 52px; border: 0; border-radius: 999px; background: #ffffff; color: #0f1115; display: flex; align-items: center; justify-content: center; cursor: pointer">
<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
</button>
<button type="button" onClick="{{bilmayman}}" style="min-height: 52px; padding: 0 26px; border: 1.5px solid #0f1115; border-radius: 999px; background: #ffffff; color: #0f1115; font: inherit; font-weight: 800; font-size: 16px; cursor: pointer">Hali o'rganyapman</button>
<button type="button" onClick="{{bilaman}}" style="min-height: 52px; padding: 0 26px; border: 0; border-radius: 999px; background: #4255ff; color: #ffffff; font: inherit; font-weight: 800; font-size: 16px; cursor: pointer">Bilaman</button>
<button type="button" onClick="{{keyingi}}" aria-label="Keyingi karta" style="width: 52px; height: 52px; border: 0; border-radius: 999px; background: #ffffff; color: #0f1115; display: flex; align-items: center; justify-content: center; cursor: pointer">
<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
</button>
</div>
</div>

<aside aria-label="To'plam holati" style="width: 300px; flex: none; display: flex; flex-direction: column; gap: 16px">
<div style="background: #ffffff; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 16px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Shu to'plamda</p>
<div style="display: flex; gap: 12px">
<div style="flex: 1; border-radius: 16px; background: #4255ff; color: #ffffff; padding: 16px; display: flex; flex-direction: column; gap: 2px">
<span style="font-size: 32px; font-weight: 900">{{bilganSoni}}</span>
<span style="font-size: 14px; font-weight: 600">Bilaman</span>
</div>
<div style="flex: 1; border-radius: 16px; border: 1.5px solid #0f1115; padding: 16px; display: flex; flex-direction: column; gap: 2px">
<span style="font-size: 32px; font-weight: 900">{{organSoni}}</span>
<span style="font-size: 14px; font-weight: 600">O'rganyapman</span>
</div>
</div>
</div>
<div style="background: #ffffff; border-radius: 24px; padding: 8px; display: flex; flex-direction: column">
<p style="margin: 12px 16px 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">So'zlar</p>
<ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px">
<sc-for list="{{royxat}}" as="r" hint-placeholder-count="6">
<li><button type="button" onClick="{{r.tanla}}" aria-current="{{r.joriy}}" style="{{r.uslub}}"><span lang="en">{{r.soz}}</span><span style="{{r.holatUslub}}">{{r.holat}}</span></button></li>
</sc-for>
</ul>
</div>
<button type="button" onClick="{{aralashtir}}" style="min-height: 48px; border: 0; border-radius: 999px; background: #eceef3; color: #0f1115; font: inherit; font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer">
<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>
Bilmaganimga o'tish</button>
</aside>

</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1280,"height":820}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { i: 0, orqa: false, holat: {} };
}
renderVals() {
var self = this;
var s = this.state;
var kartalar = [
{ soz: 'ambiguous', turkum: 'sifat', tarjima: "noaniq, ikki xil tushunilishi mumkin", misol: 'The ending of the story was deliberately ambiguous.' },
{ soz: 'concede', turkum: "fe'l", tarjima: "tan olmoq, yon bermoq", misol: 'She conceded that her first plan had a flaw.' },
{ soz: 'meticulous', turkum: 'sifat', tarjima: "juda puxta, mayda-chuydasigacha e'tiborli", misol: 'He kept meticulous notes on every mistake.' },
{ soz: 'undermine', turkum: "fe'l", tarjima: "zaiflashtirmoq, putur yetkazmoq", misol: 'One weak example can undermine the whole argument.' },
{ soz: 'plausible', turkum: 'sifat', tarjima: "ishonarli, bo'lishi mumkin", misol: 'Both explanations sound plausible at first.' },
{ soz: 'scrutinize', turkum: "fe'l", tarjima: "sinchiklab tekshirmoq", misol: 'Scrutinize each answer choice before you pick one.' }
];
var n = kartalar.length;
var karta = kartalar[s.i];
var bor = function (k) { return s.holat[k]; };
var bilganSoni = kartalar.filter(function (k) { return bor(k.soz) === 'bilaman'; }).length;
var organSoni = kartalar.filter(function (k) { return bor(k.soz) === 'organ'; }).length;
var belgila = function (h) {
var yangi = Object.assign({}, s.holat);
yangi[karta.soz] = h;
self.setState({ holat: yangi, i: (s.i + 1) % n, orqa: false });
};
var royxat = kartalar.map(function (k, idx) {
var h = bor(k.soz);
var joriy = idx === s.i;
return {
soz: k.soz,
joriy: joriy ? 'true' : 'false',
holat: h === 'bilaman' ? 'bilaman' : h === 'organ' ? "o'rganyapman" : '—',
holatUslub: 'font-size: 12px; font-weight: 700; ' + (h === 'bilaman' ? 'color: #4255ff;' : h === 'organ' ? 'color: #0f1115;' : 'color: #5a6072;'),
uslub: 'width: 100%; min-height: 44px; padding: 0 16px; border: 0; border-radius: 14px; font: inherit; font-size: 15px; font-weight: 700; color: #0f1115; display: flex; align-items: center; justify-content: space-between; cursor: pointer; ' + (joriy ? 'background: #f5f6fa;' : 'background: transparent;'),
tanla: function () { self.setState({ i: idx, orqa: false }); }
};
});
var asos = 'position: relative; width: 100%; max-width: 760px; height: 440px; box-sizing: border-box; padding: 40px; border-radius: 24px; font: inherit; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; ';
return {
karta: karta,
tartib: s.i + 1,
jami: n,
progress: Math.round(((s.i + 1) / n) * 100) + '%',
oldi: !s.orqa,
orqasi: s.orqa,
yuzYorliq: s.orqa ? "O'zbekcha" : 'English',
yuzYorliqUslub: 'position: absolute; top: 20px; left: 24px; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 700; ' + (s.orqa ? 'background: #2a2e38; color: #ffffff;' : 'background: #eceef3; color: #0f1115;'),
kartaUslub: asos + (s.orqa ? 'background: #0f1115; color: #ffffff; border: 1.5px solid #0f1115;' : 'background: #ffffff; color: #0f1115; border: 1.5px solid #0f1115; box-shadow: 0 4px 16px rgba(15,17,21,0.08);'),
kartaLabel: s.orqa ? "Kartani old tomonga ag'darish" : "Kartani ag'darib tarjimani ko'rish",
maslahatRang: s.orqa ? '#b4b9c8' : '#5a6072',
agdar: function () { self.setState({ orqa: !s.orqa }); },
oldingi: function () { self.setState({ i: (s.i - 1 + n) % n, orqa: false }); },
keyingi: function () { self.setState({ i: (s.i + 1) % n, orqa: false }); },
bilaman: function () { belgila('bilaman'); },
bilmayman: function () { belgila('organ'); },
aralashtir: function () {
var birinchi = kartalar.findIndex(function (k) { return bor(k.soz) !== 'bilaman'; });
if (birinchi >= 0) self.setState({ i: birinchi, orqa: false });
},
bilganSoni: bilganSoni,
organSoni: organSoni,
royxat: royxat
};
}
}
</script>
</body>
</html>
```

## SavolBanki.dc.html

```html
<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<title>Savol banki</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700;800;900&amp;display=swap" rel="stylesheet">
<style>
body{margin:0;background:#ffffff}
a{color:#4255ff}a:hover{color:#2f40e0}
</style>
</helmet>
<div style="font-family: 'Figtree', system-ui, sans-serif; color: #0f1115; background: #ffffff; display: flex; flex-wrap: wrap; min-height: 100vh">

<aside aria-label="SAT bo'limi" style="flex: 1 1 288px; max-width: 288px; box-sizing: border-box; border-right: 1px solid #e6e8ee; padding: 20px 16px; display: flex; flex-direction: column; gap: 24px">
<a href="Main.dc.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #0f1115; min-height: 44px">
<span aria-hidden="true" style="width: 36px; height: 36px; border-radius: 10px; background: #0f1115; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px">T</span>
<span style="font-weight: 800; font-size: 18px">Tayanch <span style="color: #4255ff">SAT</span></span>
</a>
<nav aria-label="SAT navigatsiyasi" style="display: flex; flex-direction: column; gap: 20px">
<a href="Main.dc.html" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">SAT bo'limi haqida</a>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Mashq</p>
<a href="Mashq.dc.html" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Test</a>
<a href="#" aria-current="page" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px">Savol banki</a>
<a href="Natijalar.dc.html" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Mening natijalarim</a>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">O'qish</p>
<a href="#" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Kitoblar</a>
<a href="Lugat.dc.html" style="display: flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Lug'at</a>
</div>
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0 0 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">Qo'llanmalar</p>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Strategiya</a>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Math va Desmos</a>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Reading &amp; Writing</a>
<a href="#" style="display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 12px; color: #0f1115; text-decoration: none; font-weight: 600; font-size: 15px">Vaqt va retake</a>
</div>
</nav>
</aside>

<main style="flex: 999 1 560px; min-width: 0; box-sizing: border-box; padding: 56px 40px 64px">
<div style="max-width: 960px; display: flex; flex-direction: column; gap: 32px">

<section aria-labelledby="bank-h" style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px">
<div style="display: flex; flex-direction: column; gap: 14px; max-width: 60ch">
<p style="margin: 0; display: flex; align-items: center; gap: 12px"><span style="padding: 4px 12px; border-radius: 999px; background: #eceef3; font-size: 13px; font-weight: 700">Mashq</span><span style="padding: 4px 12px; border-radius: 999px; border: 1.5px dashed #5a6072; font-size: 13px; font-weight: 700; color: #4a5063">Namuna ma'lumot</span></p>
<h1 id="bank-h" style="margin: 0; font-size: 46px; line-height: 1.1; font-weight: 900; letter-spacing: -0.5px">Savol banki</h1>
<p style="margin: 0; font-size: 18px; line-height: 1.6; color: #4a5063">Mavzuni tanlang va faqat shu mavzudagi savollarni yeching. Har javobdan keyin izoh chiqadi.</p>
</div>
<a href="Mashq.dc.html" style="display: inline-flex; align-items: center; gap: 10px; min-height: 52px; padding: 0 26px; border-radius: 999px; background: #4255ff; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 16px; white-space: nowrap">{{boshlashMatn}}<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></a>
</section>

<section aria-label="Filtrlar" style="display: flex; flex-direction: column; gap: 16px; border-bottom: 1px solid #e6e8ee; padding-bottom: 24px">
<div role="tablist" aria-label="Bo'lim" style="display: flex; gap: 6px; padding: 4px; background: #f5f6fa; border-radius: 999px; align-self: flex-start">
<sc-for list="{{bolimlar}}" as="b" hint-placeholder-count="2">
<button type="button" role="tab" aria-selected="{{b.faol}}" onClick="{{b.tanla}}" style="{{b.uslub}}">{{b.nomi}}</button>
</sc-for>
</div>
<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px">
<span style="font-size: 14px; font-weight: 700; color: #5a6072; margin-right: 4px">Qiyinlik:</span>
<sc-for list="{{qiyinliklar}}" as="q" hint-placeholder-count="4">
<button type="button" aria-pressed="{{q.faol}}" onClick="{{q.tanla}}" style="{{q.uslub}}">{{q.nomi}}</button>
</sc-for>
<label style="margin-left: auto; display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: 15px; font-weight: 600; cursor: pointer">
<input type="checkbox" checked="{{faqatYechilmagan}}" onChange="{{yechilmaganAlmashtir}}" style="width: 20px; height: 20px; accent-color: #4255ff; margin: 0">
Faqat yechilmaganlar
</label>
</div>
</section>

<section aria-labelledby="mavzu-h" style="display: flex; flex-direction: column; gap: 16px">
<h2 id="mavzu-h" style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #5a6072">{{bolimNomi}} mavzulari</h2>
<ul style="list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px">
<sc-for list="{{mavzular}}" as="m" hint-placeholder-count="6">
<li>
<button type="button" aria-pressed="{{m.faol}}" onClick="{{m.tanla}}" style="{{m.uslub}}">
<span style="display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%">
<span style="font-size: 17px; font-weight: 800; text-align: left">{{m.nomi}}</span>
<span style="{{m.belgiUslub}}" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"></path></svg></span>
</span>
<span style="display: flex; flex-direction: column; gap: 8px; width: 100%">
<span style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; color: {{m.izohRang}}"><span>{{m.yechilgan}} / {{m.jami}} yechilgan</span><span>{{m.qolgan}} ta qoldi</span></span>
<span aria-hidden="true" style="display: block; height: 8px; border-radius: 999px; background: {{m.izIzRang}}; overflow: hidden"><span style="display: block; height: 100%; width: {{m.foiz}}; background: {{m.toldirishRang}}; border-radius: 999px"></span></span>
</span>
</button>
</li>
</sc-for>
</ul>
</section>

<section aria-label="Tanlov" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; background: #0f1115; color: #ffffff; border-radius: 24px; padding: 24px 28px">
<div style="display: flex; flex-direction: column; gap: 4px">
<p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #8b97ff">Tanlangan</p>
<p style="margin: 0; font-size: 20px; font-weight: 800">{{tanlovMatn}}</p>
<p style="margin: 0; font-size: 14px; color: #b4b9c8">{{tanlovIzoh}}</p>
</div>
<a href="Mashq.dc.html" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 26px; border-radius: 999px; background: #ffffff; color: #0f1115; text-decoration: none; font-weight: 800; font-size: 16px">Yechishni boshlash</a>
</section>

<p style="margin: 0; font-size: 14px; color: #5a6072; max-width: 62ch">Savollar Tayanch uchun alohida tuziladi, boshqa saytlardan ko'chirilmaydi. [Savollar manbasi va litsenziyasi belgilangach shu yerda yoziladi.]</p>

</div>
</main>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1280,"height":1240}}'>
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { bolim: 'rw', qiyinlik: 'hammasi', tanlangan: { rw: ['Matndagi asosiy g‘oya'], math: ['Chiziqli tenglamalar'] }, yechilmagan: false };
}
renderVals() {
var self = this;
var s = this.state;
var data = {
rw: [
{ nomi: "Matndagi asosiy g‘oya", yechilgan: 6, jami: 12 },
{ nomi: "So‘zning kontekstdagi ma’nosi", yechilgan: 3, jami: 10 },
{ nomi: 'Matn tuzilishi va maqsadi', yechilgan: 0, jami: 8 },
{ nomi: 'Dalil bilan xulosa', yechilgan: 2, jami: 9 },
{ nomi: 'Tinish belgilari', yechilgan: 9, jami: 9 },
{ nomi: "Gaplarni bog‘lash", yechilgan: 1, jami: 7 }
],
math: [
{ nomi: 'Chiziqli tenglamalar', yechilgan: 4, jami: 12 },
{ nomi: 'Foizlar va nisbatlar', yechilgan: 2, jami: 10 },
{ nomi: 'Kvadrat tenglamalar', yechilgan: 0, jami: 8 },
{ nomi: 'Funksiyalar', yechilgan: 5, jami: 11 },
{ nomi: 'Geometriya', yechilgan: 1, jami: 9 },
{ nomi: 'Statistika', yechilgan: 7, jami: 7 }
]
};
var pill = 'min-height: 44px; padding: 0 18px; border: 0; border-radius: 999px; font: inherit; font-weight: 700; font-size: 15px; cursor: pointer; ';
var bolimlar = [{ id: 'rw', nomi: 'Reading & Writing' }, { id: 'math', nomi: 'Math' }].map(function (b) {
var faol = b.id === s.bolim;
return { nomi: b.nomi, faol: faol ? 'true' : 'false', uslub: pill + (faol ? 'background: #0f1115; color: #ffffff;' : 'background: transparent; color: #4a5063;'), tanla: function () { self.setState({ bolim: b.id }); } };
});
var chip = 'min-height: 40px; padding: 0 16px; border-radius: 999px; font: inherit; font-weight: 700; font-size: 14px; cursor: pointer; ';
var qiyinliklar = [{ id: 'hammasi', nomi: 'Hammasi' }, { id: 'oson', nomi: 'Oson' }, { id: 'orta', nomi: "O‘rta" }, { id: 'qiyin', nomi: 'Qiyin' }].map(function (q) {
var faol = q.id === s.qiyinlik;
return { nomi: q.nomi, faol: faol ? 'true' : 'false', uslub: chip + (faol ? 'background: #4255ff; color: #ffffff; border: 2px solid #4255ff;' : 'background: #ffffff; color: #0f1115; border: 2px solid #dfe2ea;'), tanla: function () { self.setState({ qiyinlik: q.id }); } };
});
var tanlanganlar = s.tanlangan[s.bolim] || [];
var royxat = data[s.bolim].filter(function (m) { return !s.yechilmagan || m.yechilgan < m.jami; });
var mavzular = royxat.map(function (m) {
var faol = tanlanganlar.indexOf(m.nomi) >= 0;
var qolgan = m.jami - m.yechilgan;
return {
nomi: m.nomi, yechilgan: m.yechilgan, jami: m.jami, qolgan: qolgan,
faol: faol ? 'true' : 'false',
foiz: Math.round((m.yechilgan / m.jami) * 100) + '%',
uslub: 'width: 100%; min-height: 120px; box-sizing: border-box; padding: 20px; border-radius: 20px; font: inherit; color: inherit; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; cursor: pointer; ' + (faol ? 'background: #0f1115; color: #ffffff; border: 1.5px solid #0f1115;' : 'background: #ffffff; color: #0f1115; border: 1.5px solid #0f1115;'),
belgiUslub: 'width: 28px; height: 28px; flex: none; border-radius: 999px; display: flex; align-items: center; justify-content: center; ' + (faol ? 'background: #4255ff; color: #ffffff;' : 'background: #ffffff; color: transparent; border: 2px solid #dfe2ea; box-sizing: border-box;'),
izohRang: faol ? '#b4b9c8' : '#4a5063',
izIzRang: faol ? '#2a2e38' : '#eceef3',
toldirishRang: faol ? '#8b97ff' : '#4255ff',
tanla: function () {
var yangi = Object.assign({}, s.tanlangan);
var joriy = (yangi[s.bolim] || []).slice();
var k = joriy.indexOf(m.nomi);
if (k >= 0) joriy.splice(k, 1); else joriy.push(m.nomi);
yangi[s.bolim] = joriy;
self.setState({ tanlangan: yangi });
}
};
});
var tanlanganData = data[s.bolim].filter(function (m) { return tanlanganlar.indexOf(m.nomi) >= 0; });
var qolganJami = tanlanganData.reduce(function (a, m) { return a + (m.jami - m.yechilgan); }, 0);
var qNomi = { hammasi: 'barcha qiyinlikda', oson: 'oson', orta: "o‘rta", qiyin: 'qiyin' }[s.qiyinlik];
return {
bolimlar: bolimlar,
qiyinliklar: qiyinliklar,
mavzular: mavzular,
bolimNomi: s.bolim === 'rw' ? 'Reading & Writing' : 'Math',
faqatYechilmagan: s.yechilmagan,
yechilmaganAlmashtir: function () { self.setState({ yechilmagan: !s.yechilmagan }); },
boshlashMatn: 'Aralash 10 ta savol',
tanlovMatn: tanlanganData.length === 0 ? 'Mavzu tanlanmagan' : tanlanganData.length + ' ta mavzu, ' + qolganJami + ' ta yechilmagan savol',
tanlovIzoh: tanlanganData.length === 0 ? "Yuqoridan bir yoki bir nechta mavzuni bosing." : 'Qiyinlik: ' + qNomi + '. ' + tanlanganData.map(function (m) { return m.nomi; }).join(', ')
};
}
}
</script>
</body>
</html>
```
