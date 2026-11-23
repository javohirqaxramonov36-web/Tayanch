# 006. Qavat obunalari va to'lov usullari

- **Holat**: qabul qilingan (muallif, 2026-11-21).
- **To'ldiradi**: 001 (hisob, to'lov, server). 001 dagi "bitta hisob", "obuna `bolim` bilan", "to'lov faqat server orqali" qoidalari o'zgarmaydi.

## Savol

Tayanch 6 qavatli. To'lov har qavatga alohidami yoki hamma qavat uchun bittami? Saytga Click va Payme tugmalari kerakmi?

## Qaror

1. **Obuna har qavatga alohida.** Har obuna bitta `bolim` ga tegishli (`sat`, `ielts`, `eyuf`, `top-admission`, `ai-academy`). Tarif nomlari umumiy (Free, Pro, Max), narx va kvota qavatning `plans` qatorlarida.
2. **Hisob va boshqaruv bitta joyda.** Bitta hisob (Supabase Auth). 1-qavatda `/uz/hisob/obunalar/` sahifasi: har qavat bo'yicha amaldagi tarif, tugash sanasi, umumiy to'lov tarixi va har qavat tarif sahifasiga havola. Sahifa o'zbekcha.
3. **Har qavat tarif sahifasi o'z joyida.** SAT: `/uz/sat/hisob/obuna/` (inglizcha, o'zgarmaydi). Boshqa qavatda pullik kontent tayyor bo'lgandagina u qavat uchun `plans` qatori va tarif sahifasi ochiladi. Bo'sh qavatga obuna sotilmaydi.
4. **Paket keyinga qoldiriladi.** "Tayanch To'liq" (bir to'lov bilan bir nechta `bolim`) kamida 2 qavatda pullik qism bo'lgandan keyin alohida ADR bilan ko'riladi.
5. **To'lov usullari inPAY sahifasida.** Saytda alohida "Click" va "Payme" integratsiyasi qurilmaydi. inPAY to'lov sahifasi (`checkout_url`) Click, Payme, Uzcard, Humo ni o'zi ko'rsatadi. "Pay" tugmasi yonida faqat matnli yozuv: to'lov usullari ro'yxati (logolar brend qoidalari tekshirilgandan keyin).
6. **Usulni oldindan tanlash: tekshirish kerak.** inPAY API v2 (IP03) to'lov yaratishda usulni (masalan, faqat Payme) belgilashga ruxsat bersa, keyin ikkita tugma ("Click orqali", "Payme orqali") qo'shilishi mumkin. Ruxsat bermasa, bitta "Pay" tugmasi qoladi.

## Nega

- Har qavat auditoriyasi boshqa: SAT o'quvchisiga EYUF yoki IELTS kerak emas.
- Pullik kontent hozir faqat SAT'da; umumiy obuna yo'q narsaga pul olish bo'lardi.
- Sxema allaqachon tayyor: `subscriptions.bolim`, `private.current_plan(user, bolim)`.
- Click va Payme bilan to'g'ridan-to'g'ri ulanish ikki qo'shimcha shartnoma, kalit va webhook talab qiladi; inPAY buni bitta integratsiyada beradi.

## Oqibatlar

- `plans` jadvalida har qator `bolim` ga bog'lanishi kerak (tekshirish kerak: hozir bormi). Yo'q bo'lsa, migratsiya bilan qo'shiladi, mavjud qatorlar `sat`.
- `tolov-yaratish` tarif kodidan `bolim` ni aniqlaydi; `returnUrl` qavatga qarab tanlanadi (hozir SAT yo'liga qattiq yozilgan).
- Yangi qavatda pullik qism: `plans` qatori + tarif sahifasi + `current_plan(user, '<bolim>')` tekshiruvi. Login va to'lov kodi qayta yozilmaydi.
- Brauzer hali ham to'lovni tasdiqlamaydi; obuna faqat imzolangan webhook orqali (001).

## Ochiq savollar (muallif)

- Boshqa qavatlar uchun narx va kvotalar (hozir yo'q, raqam uydirilmaydi).
- Paket qachon va qaysi narxda.
