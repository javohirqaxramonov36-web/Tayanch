# Tayanch

Chet elda o'qishni xohlovchi o'zbek yoshlari uchun ochiq yo'riqnoma sayti.
Jekyll, GitHub Pages. Manzil: https://javohirqaxramonov36-web.github.io/tayanch/

## Tuzilma

| Joy | Nima uchun |
| --- | --- |
| `_config.yml` | Sayt sozlamalari, `baseurl`, Telegram manzili |
| `_layouts/default.html` | Hamma sahifaning umumiy qolipi |
| `_includes/` | Menyu, footer, sahifa oxiri bloki, deadline ro'yxati |
| `_data/bolimlar.yml` | 4 bo'lim va ularning holati (`ochiq` yoki `tez-orada`) |
| `_data/manbalar.yml` | Manba jurnali |
| `_data/deadline.yml` | Deadline kalendari |
| `uz/` | O'zbekcha sahifalar |

## Qoidalar

- Ichki havolalar faqat `relative_url` filtri orqali yoziladi.
- Saytda qoida, talab yoki muddat faqat "rasmiy" darajadagi manba bilan chiqadi.
- Repo ochiq: ichki qoralamalar (`grants-qoralama.json`), `inbox/`, `.env` bu yerga qo'yilmaydi.
- Foydalanuvchi kiritgan narsa faqat uning brauzerida saqlanadi. Formalar va to'lov yo'q.
- Natija kafolatlanmaydi.

## Har sahifaning front matter maydonlari

```yaml
title: ""
description: ""
turi: ""              # bolim-kirishi | qollanma | mashq | vosita | umumiy ...
bolim: ""             # top-admission | ielts | sat | eyuf | umumiy
holat: qoralama       # qoralama | chop-etilgan
published: false      # qoralama sahifa saytga chiqmasligi uchun
tekshirilgan: 2026-11-04
keyingi_tekshiruv: 2026-12-04
manbalar: []          # _data/manbalar.yml dagi ID lar
tekshirilmagan: []
```
