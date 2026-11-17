# IELTS Reading testlari

Har test bitta JSON fayl: `<testId>.json` (fayl nomi `testId` bilan bir xil).

- Format: `docs/ielts-schema.md` (sxema v1).
- Tekshirish: `npm run validate:tests`. Xato bo'lsa `npm run build` ham to'xtaydi.
- Matn va savollar faqat original (`docs/kontent-siyosati.md`). Rasmiy test materiallari,
  kitob va boshqa saytlardan olingan matn bu yerga qo'yilmaydi.
- Sinov uchun qisqa test bu papkada emas: `tests/fixtures/ielts/`. U saytga chiqmaydi,
  faqat `IELTS_FIXTURE=1` bilan lokal ko'rishda qo'shiladi.
