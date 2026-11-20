import type { IqSavol } from './model';

// Muallif bergan PDF asosida. PDF va OCR oraliq fayllari _sources/ ichida qoladi.
export const savollar: readonly IqSavol[] = [
  {
    "id": "iq-1-01",
    "test": 1,
    "raqam": 1,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-01-qism-1.webp",
        "kenglik": 1041,
        "balandlik": 1048,
        "sahifa": 1
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Shakldagi qora chekka ikki yon bo‘ylab davom etishi va o‘rtadagi oq qism saqlanishi kerak. Buni D bo‘lak beradi."
  },
  {
    "id": "iq-1-02",
    "test": 1,
    "raqam": 2,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-02-qism-1.webp",
        "kenglik": 678,
        "balandlik": 118,
        "sahifa": 1
      },
      {
        "fayl": "/eyuf/iq/test-1-savol-02-qism-2.webp",
        "kenglik": 596,
        "balandlik": 451,
        "sahifa": 2
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Kesishish nuqtalarida chiziqlarni bo‘lmasdan sanadim. Rasmda 15 ta alohida to‘g‘ri chiziq bor. C — 15."
  },
  {
    "id": "iq-1-03",
    "test": 1,
    "raqam": 3,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-03-qism-1.webp",
        "kenglik": 773,
        "balandlik": 981,
        "sahifa": 2
      },
      {
        "fayl": "/eyuf/iq/test-1-savol-03-qism-2.webp",
        "kenglik": 568,
        "balandlik": 285,
        "sahifa": 3
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Chapdagi vertikal chiziq va yuqoridagi ikkita gorizontal chiziq birlashtiriladi. C variantida bir vertikal va ikki gorizontal chiziq bor."
  },
  {
    "id": "iq-1-04",
    "test": 1,
    "raqam": 4,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-04-qism-1.webp",
        "kenglik": 825,
        "balandlik": 1044,
        "sahifa": 3
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "A–I shakllar juftlanadi. F dagi bo‘yalmagan yulduz va ikki qora nuqtaning mos jufti yo‘q. Javob variantlarida F — C."
  },
  {
    "id": "iq-1-05",
    "test": 1,
    "raqam": 5,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-05-qism-1.webp",
        "kenglik": 741,
        "balandlik": 682,
        "sahifa": 4
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Kesishgan joylarda bo‘lmasdan, qisqa chiziqni ham qo‘shib sanaganda 16 ta chiziq chiqadi. C — 16."
  },
  {
    "id": "iq-1-06",
    "test": 1,
    "raqam": 6,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-06-qism-1.webp",
        "kenglik": 811,
        "balandlik": 648,
        "sahifa": 4
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "A, B, C va E shakllarni aylantirib bir-biriga moslashtirish mumkin. D dagi qora chekka va egri chiziqning o‘zaro joylashuvi akslangan."
  },
  {
    "id": "iq-1-07",
    "test": 1,
    "raqam": 7,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-07-qism-1.webp",
        "kenglik": 864,
        "balandlik": 387,
        "sahifa": 5
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Har to‘plamda ikki ustunning yig‘indisi teng. Oxirgi to‘plamda 8+13+9=30. 7+?+6=30 dan ?=17. B."
  },
  {
    "id": "iq-1-08",
    "test": 1,
    "raqam": 8,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-08-qism-1.webp",
        "kenglik": 754,
        "balandlik": 240,
        "sahifa": 5
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Ayirmalar 0,5, 1, 1,5, 2, 2,5, 3 bo‘lib ortadi. Keyingi ayirma 3,5. 89,5−3,5=86. B."
  },
  {
    "id": "iq-1-09",
    "test": 1,
    "raqam": 9,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-09-qism-1.webp",
        "kenglik": 1019,
        "balandlik": 806,
        "sahifa": 5
      },
      {
        "fayl": "/eyuf/iq/test-1-savol-09-qism-2.webp",
        "kenglik": 683,
        "balandlik": 613,
        "sahifa": 6
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": false,
    "yechim": "Qalqonlardagi aylanalarning ichma-ichligi va kesishishlarini solishtirdim. D kalitini yagona talqin bilan mustaqil tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-1-10",
    "test": 1,
    "raqam": 10,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-10-qism-1.webp",
        "kenglik": 914,
        "balandlik": 721,
        "sahifa": 6
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "C dagi nuqtaning diagonallar hosil qilgan sohaga nisbatan joyi qolgan shakllarning aylantirilgan holatiga mos kelmaydi."
  },
  {
    "id": "iq-1-11",
    "test": 1,
    "raqam": 11,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-11-qism-1.webp",
        "kenglik": 814,
        "balandlik": 1111,
        "sahifa": 7
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Chap son pastki chap sonning o‘ng sondagi ko‘paytmasi. Pastki o‘ng son yuqoridagi va o‘ngdagi sonlar yig‘indisi. Chap 24, yuqori 27, o‘ng 8 bo‘lsa 24÷8=3 va 27+8=35. D."
  },
  {
    "id": "iq-1-12",
    "test": 1,
    "raqam": 12,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-12-qism-1.webp",
        "kenglik": 758,
        "balandlik": 198,
        "sahifa": 7
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Har ikkala besh xonali sonda o‘rinlar 2,5,4,3,1 tartibiga o‘tadi. 38297 dan 87923 olinadi. D."
  },
  {
    "id": "iq-1-13",
    "test": 1,
    "raqam": 13,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-13-qism-1.webp",
        "kenglik": 770,
        "balandlik": 182,
        "sahifa": 7
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Amallar navbat bilan ×2+1, ×3+2, ×4+3. Keyingisi 47×5+4=239. D."
  },
  {
    "id": "iq-1-14",
    "test": 1,
    "raqam": 14,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-14-qism-1.webp",
        "kenglik": 779,
        "balandlik": 176,
        "sahifa": 8
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Ayirmalar −2,75, −5,5, −8,25. Keyingisi −11, shuning uchun 83,5−11=72,5. D."
  },
  {
    "id": "iq-1-15",
    "test": 1,
    "raqam": 15,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-15-qism-1.webp",
        "kenglik": 838,
        "balandlik": 643,
        "sahifa": 8
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "B shaklning markaz atrofidagi qora va oq qismlari qolganlarning aylantirilgan holatiga mos kelmaydi. B aks tasvir."
  },
  {
    "id": "iq-1-16",
    "test": 1,
    "raqam": 16,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-16-qism-1.webp",
        "kenglik": 830,
        "balandlik": 665,
        "sahifa": 8
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": false,
    "yechim": "Qator va ustunlar bo‘yicha yig‘indi hamda ketma-ketliklarni tekshirdim. C — 7,6,8,5,8 kalitini yagona qoida bilan tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-1-17",
    "test": 1,
    "raqam": 17,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-17-qism-1.webp",
        "kenglik": 781,
        "balandlik": 529,
        "sahifa": 9
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": true,
    "yechim": "Har ustunda 1-qator+3-qator=2-qator+4-qator. Oxirgi ustunda 4+6=8+?, shuning uchun ?=2. A."
  },
  {
    "id": "iq-1-18",
    "test": 1,
    "raqam": 18,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-18-qism-1.webp",
        "kenglik": 783,
        "balandlik": 402,
        "sahifa": 9
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Markazdagi son pastki chap sonni yuqoridagi songa bo‘lib, pastki o‘ng songa ko‘paytirishdan hosil bo‘ladi. 32÷8×9=36. B."
  },
  {
    "id": "iq-1-19",
    "test": 1,
    "raqam": 19,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-19-qism-1.webp",
        "kenglik": 837,
        "balandlik": 572,
        "sahifa": 9
      },
      {
        "fayl": "/eyuf/iq/test-1-savol-19-qism-2.webp",
        "kenglik": 29,
        "balandlik": 29,
        "sahifa": 10
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "B dagi qora soha uchala shaklning umumiy kesishmasiga mos kelmaydi. Qolganlarda bo‘yalgan qism uch shaklning umumiy sohasi."
  },
  {
    "id": "iq-1-20",
    "test": 1,
    "raqam": 20,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-1-savol-20-qism-1.webp",
        "kenglik": 903,
        "balandlik": 1341,
        "sahifa": 10
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Yonma-yon pastki kataklardagi nuqtalar qo‘shiladi, ikki xonali natijaning birlik xonasi olinadi. 6+5→1, 5+7→2, so‘ng 1+2=3. C."
  },
  {
    "id": "iq-2-01",
    "test": 2,
    "raqam": 1,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-01-qism-1.webp",
        "kenglik": 817,
        "balandlik": 707,
        "sahifa": 11
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Ketma-ket kvadratlarda ichki gorizontal chiziqlar soni bittadan ortadi. Tushib qolgan holat to‘rt ichki chiziqli C."
  },
  {
    "id": "iq-2-02",
    "test": 2,
    "raqam": 2,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-02-qism-1.webp",
        "kenglik": 785,
        "balandlik": 729,
        "sahifa": 11
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Figuraning uzun o‘qi har safar bir xil burchakka buriladi. Yetishmayotgan qiya holat B. Ichki bo‘linmalar soni ham saqlanadi."
  },
  {
    "id": "iq-2-03",
    "test": 2,
    "raqam": 3,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-03-qism-1.webp",
        "kenglik": 758,
        "balandlik": 518,
        "sahifa": 12
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Har ustunda yuqoridagi son o‘rtadagi va pastdagi sonlar ko‘paytmasi. 120÷24=5. C."
  },
  {
    "id": "iq-2-04",
    "test": 2,
    "raqam": 4,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-04-qism-1.webp",
        "kenglik": 827,
        "balandlik": 978,
        "sahifa": 12
      },
      {
        "fayl": "/eyuf/iq/test-2-savol-04-qism-2.webp",
        "kenglik": 687,
        "balandlik": 305,
        "sahifa": 13
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": false,
    "yechim": "Nuqtaning aylana va chiziqlarga nisbatan sohasini variantlarda tekshirdim. Skanerdagi ingichka chiziqlar sabab D ni mustaqil aniq tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-2-05",
    "test": 2,
    "raqam": 5,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-05-qism-1.webp",
        "kenglik": 803,
        "balandlik": 868,
        "sahifa": 13
      },
      {
        "fayl": "/eyuf/iq/test-2-savol-05-qism-2.webp",
        "kenglik": 29,
        "balandlik": 15,
        "sahifa": 14
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Namuna to‘rtta belgini 2,3 / 4,1 tartibiga joylaydi. Ikkinchi to‘plamda ham shu tartib C ni beradi."
  },
  {
    "id": "iq-2-06",
    "test": 2,
    "raqam": 6,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-06-qism-1.webp",
        "kenglik": 829,
        "balandlik": 682,
        "sahifa": 14
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Qatorlarda qadamlar mos ravishda +2, +4, +6, +8. Yetishmagan sonlar yuqoridan 12, 13, 26. C."
  },
  {
    "id": "iq-2-07",
    "test": 2,
    "raqam": 7,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-07-qism-1.webp",
        "kenglik": 676,
        "balandlik": 237,
        "sahifa": 14
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": false,
    "yechim": "Ingliz alifbosida farqlar 3,3,4,5 bo‘lib chiqadi. Keyingi +6 bilan V chiqadi, lekin dastlabki ikki bir xil farq izchil umumiy qoidani noaniq qiladi. D kaliti tekshirilmoqda."
  },
  {
    "id": "iq-2-08",
    "test": 2,
    "raqam": 8,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-08-qism-1.webp",
        "kenglik": 801,
        "balandlik": 418,
        "sahifa": 14
      },
      {
        "fayl": "/eyuf/iq/test-2-savol-08-qism-2.webp",
        "kenglik": 644,
        "balandlik": 737,
        "sahifa": 15
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": false,
    "yechim": "Bo‘laklarni aylantirib kvadrat hosil qilishni tekshirdim. C — DAB variantining to‘liq yig‘ilishini hozircha aniq tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-2-09",
    "test": 2,
    "raqam": 9,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-09-qism-1.webp",
        "kenglik": 769,
        "balandlik": 316,
        "sahifa": 15
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Yetti xonali sonning dastlabki uch raqami teskari, so‘nggi to‘rt raqami ham teskari yoziladi. 7469851 → 6471589. D."
  },
  {
    "id": "iq-2-10",
    "test": 2,
    "raqam": 10,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-10-qism-1.webp",
        "kenglik": 777,
        "balandlik": 443,
        "sahifa": 15
      },
      {
        "fayl": "/eyuf/iq/test-2-savol-10-qism-2.webp",
        "kenglik": 811,
        "balandlik": 639,
        "sahifa": 16
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": true,
    "yechim": "Namuna doira ichida uchburchak, kvadrat ichida doira va alohida uchburchak ichida qora nuqtadan iborat. Shu munosabatlarning hammasi A da saqlanadi."
  },
  {
    "id": "iq-2-11",
    "test": 2,
    "raqam": 11,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-11-qism-1.webp",
        "kenglik": 820,
        "balandlik": 294,
        "sahifa": 16
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": true,
    "yechim": "Qolgan sonlar bir xil raqamli juftlarga ajraladi. 9416/9614, 5278/5872, 6231/6132, 7895/7598. 6394 juftsiz. A."
  },
  {
    "id": "iq-2-12",
    "test": 2,
    "raqam": 12,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-12-qism-1.webp",
        "kenglik": 829,
        "balandlik": 510,
        "sahifa": 16
      },
      {
        "fayl": "/eyuf/iq/test-2-savol-12-qism-2.webp",
        "kenglik": 825,
        "balandlik": 446,
        "sahifa": 17
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": false,
    "yechim": "Beshburchaklar ichidagi qora va oq nuqtalarni yuqoriga o‘tkazish qoidasini tekshirdim. D kalitini barcha qatorda yagona qoida bilan tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-2-13",
    "test": 2,
    "raqam": 13,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-13-qism-1.webp",
        "kenglik": 713,
        "balandlik": 1056,
        "sahifa": 17
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": false,
    "yechim": "Yetishmagan bo‘lakdagi diagonal va qisqa gorizontal chiziqni qo‘shni kataklar bilan solishtirdim. C ning to‘liq yagona qoidasini tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-2-14",
    "test": 2,
    "raqam": 14,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-14-qism-1.webp",
        "kenglik": 826,
        "balandlik": 1068,
        "sahifa": 18
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Yoyilmada chiziqsiz doira bilan uning tepasidagi gorizontal chiziqli yuz qarama-qarshi. B ularni yonma-yon ko‘rsatadi, shuning uchun hosil bo‘lmaydi."
  },
  {
    "id": "iq-2-15",
    "test": 2,
    "raqam": 15,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-15-qism-1.webp",
        "kenglik": 766,
        "balandlik": 260,
        "sahifa": 18
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Toq o‘rinlardagi sonlar 9,13,17,21,25 bo‘lib +4 ga ortadi. Juft o‘rinlarda 16,13,10,7 bo‘lib −3 ga kamayadi. D — 25."
  },
  {
    "id": "iq-2-16",
    "test": 2,
    "raqam": 16,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-16-qism-1.webp",
        "kenglik": 789,
        "balandlik": 1010,
        "sahifa": 19
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": false,
    "yechim": "Nuqta joylashgan sohaning chiziq va tashqi chetga tutashuvlarini solishtirdim. D kalitini mustaqil qat’iy tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-2-17",
    "test": 2,
    "raqam": 17,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-17-qism-1.webp",
        "kenglik": 771,
        "balandlik": 476,
        "sahifa": 19
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Ayirmalar +3,+6,+9,+12,+15,+18. 31+15=46. C."
  },
  {
    "id": "iq-2-18",
    "test": 2,
    "raqam": 18,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-18-qism-1.webp",
        "kenglik": 823,
        "balandlik": 406,
        "sahifa": 20
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Har doirada uch son yig‘indisi 100. 100−16−71=13. D."
  },
  {
    "id": "iq-2-19",
    "test": 2,
    "raqam": 19,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-19-qism-1.webp",
        "kenglik": 806,
        "balandlik": 401,
        "sahifa": 20
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": false,
    "yechim": "Oltiburchaklardagi yig‘indi, ko‘paytma va qarama-qarshi sonlar munosabatlarini tekshirdim. B — 2 ni yagona izchil qoida bilan tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-2-20",
    "test": 2,
    "raqam": 20,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-2-savol-20-qism-1.webp",
        "kenglik": 889,
        "balandlik": 258,
        "sahifa": 20
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Har sondan eng kichik va eng katta raqam olib tashlanadi, qolganlari teskari yoziladi. 7496258 dan 2 va 9 olib tashlanadi. Qolgan 74658 → 85647. C."
  },
  {
    "id": "iq-3-01",
    "test": 3,
    "raqam": 1,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-01-qism-1.webp",
        "kenglik": 795,
        "balandlik": 961,
        "sahifa": 21
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Qatorlar bo‘yicha +4, ustunlar bo‘yicha +3. Yetishmagan sonlar 17,16,19. B."
  },
  {
    "id": "iq-3-02",
    "test": 3,
    "raqam": 2,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-02-qism-1.webp",
        "kenglik": 804,
        "balandlik": 235,
        "sahifa": 21
      },
      {
        "fayl": "/eyuf/iq/test-3-savol-02-qism-2.webp",
        "kenglik": 610,
        "balandlik": 386,
        "sahifa": 22
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Jadvaldagi eng katta juft son 82, eng kichik toq son 17. 82×17=1394. D."
  },
  {
    "id": "iq-3-03",
    "test": 3,
    "raqam": 3,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-03-qism-1.webp",
        "kenglik": 822,
        "balandlik": 942,
        "sahifa": 22
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Har safar navbat bilan chap va o‘ng tashqi kesma 45° ga buriladi. Keyingi holatda chap kesma yuqoriga, o‘ng kesma pastga tik turadi. C."
  },
  {
    "id": "iq-3-04",
    "test": 3,
    "raqam": 4,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-04-qism-1.webp",
        "kenglik": 804,
        "balandlik": 965,
        "sahifa": 23
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Namuna bitta nuqtali doira, bitta oddiy doira, uchburchak, alohida qora nuqta va qora-oq uchli kesmaga ega. D shu elementlar va ichma-ichlikni saqlaydi."
  },
  {
    "id": "iq-3-05",
    "test": 3,
    "raqam": 5,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-05-qism-1.webp",
        "kenglik": 747,
        "balandlik": 494,
        "sahifa": 23
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Qarama-qarshi sektorlar yig‘indisi 15. ?+2=15, shuning uchun ?=13. D."
  },
  {
    "id": "iq-3-06",
    "test": 3,
    "raqam": 6,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-06-qism-1.webp",
        "kenglik": 828,
        "balandlik": 605,
        "sahifa": 24
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "O‘ng katakdagi qora nuqtalar chap katakdagi oq nuqtalardan bittaga ko‘p. Pastda uch oq nuqta bor, demak to‘rtta qora nuqta kerak. D."
  },
  {
    "id": "iq-3-07",
    "test": 3,
    "raqam": 7,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-07-qism-1.webp",
        "kenglik": 783,
        "balandlik": 871,
        "sahifa": 24
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Namuna tashqi va ichki shakllarning turini almashtiradi, rang va ajratish chiziqlarini saqlaydi. Doira va bo‘sh kvadratlar kvadrat va bo‘sh doiralarga aylanadi. D."
  },
  {
    "id": "iq-3-08",
    "test": 3,
    "raqam": 8,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-08-qism-1.webp",
        "kenglik": 806,
        "balandlik": 721,
        "sahifa": 25
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Nuqta doira va rombning umumiy qismida, yulduzdan tashqarida turishi kerak. Shu soha D da mavjud."
  },
  {
    "id": "iq-3-09",
    "test": 3,
    "raqam": 9,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-09-qism-1.webp",
        "kenglik": 705,
        "balandlik": 753,
        "sahifa": 25
      },
      {
        "fayl": "/eyuf/iq/test-3-savol-09-qism-2.webp",
        "kenglik": 571,
        "balandlik": 230,
        "sahifa": 26
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Qo‘shni beshburchaklarda bir xil chiziqlar bekor qilinadi, yakka nuqta qoladi. Yetishmagan shakl faqat qora nuqtali C."
  },
  {
    "id": "iq-3-10",
    "test": 3,
    "raqam": 10,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-10-qism-1.webp",
        "kenglik": 782,
        "balandlik": 1019,
        "sahifa": 26
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Shakllar nisbiy joylashuvi soat yo‘nalishida almashadi, qora qism esa kesishma va tashqi qism o‘rtasida navbatlashadi. Navbatdagi holat D."
  },
  {
    "id": "iq-3-11",
    "test": 3,
    "raqam": 11,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-11-qism-1.webp",
        "kenglik": 839,
        "balandlik": 984,
        "sahifa": 27
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": false,
    "yechim": "Yoyilmadagi qarama-qarshi yuzlar H/C, E/S, N/L. Harflarning burilishini ham hisobga olib C ni mustaqil to‘liq tasdiqlash yakunlanmadi. Javob tekshirilmoqda."
  },
  {
    "id": "iq-3-12",
    "test": 3,
    "raqam": 12,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-12-qism-1.webp",
        "kenglik": 774,
        "balandlik": 462,
        "sahifa": 27
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Har bir qatordagi sonlar yig‘indisi 18. ?+4+3+7=18 dan ?=4. B."
  },
  {
    "id": "iq-3-13",
    "test": 3,
    "raqam": 13,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-13-qism-1.webp",
        "kenglik": 804,
        "balandlik": 629,
        "sahifa": 28
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": false,
    "yechim": "Tarozida katak markazlarini yelka sifatida hisoblash natijasi 6 ga aniq teng kelmayapti. Tayanch chizig‘i va yuk markazlari joyi qayta tekshirilmoqda. Kitob kaliti B — 6."
  },
  {
    "id": "iq-3-14",
    "test": 3,
    "raqam": 14,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-14-qism-1.webp",
        "kenglik": 772,
        "balandlik": 514,
        "sahifa": 28
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": false,
    "yechim": "Chegaradagi sonlarning ketma-ketligi, tomon yig‘indilari va qarama-qarshi juftlarni tekshirdim. D — 5 uchun yagona qoida tasdiqlanmadi. Javob tekshirilmoqda."
  },
  {
    "id": "iq-3-15",
    "test": 3,
    "raqam": 15,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-15-qism-1.webp",
        "kenglik": 808,
        "balandlik": 242,
        "sahifa": 28
      },
      {
        "fayl": "/eyuf/iq/test-3-savol-15-qism-2.webp",
        "kenglik": 544,
        "balandlik": 407,
        "sahifa": 29
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": false,
    "yechim": "Qator va ustunlardagi o‘sishlarni tekshirdim. C — 95,97,88,93 kalitini barcha oldingi qatorlarga mos yagona qoida bilan tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-3-16",
    "test": 3,
    "raqam": 16,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-16-qism-1.webp",
        "kenglik": 831,
        "balandlik": 232,
        "sahifa": 29
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Farqlar +1,+2,+3 tartibida takrorlanadi. 18 dan keyin 19,21,24 keladi. D."
  },
  {
    "id": "iq-3-17",
    "test": 3,
    "raqam": 17,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-17-qism-1.webp",
        "kenglik": 813,
        "balandlik": 524,
        "sahifa": 29
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Har qatorda harf o‘rinlari +2 va +3 ga ortadi. E,G,J va J,L,O hosil bo‘ladi. Yetishmagan G va O — B."
  },
  {
    "id": "iq-3-18",
    "test": 3,
    "raqam": 18,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-18-qism-1.webp",
        "kenglik": 761,
        "balandlik": 322,
        "sahifa": 29
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Yuqoridagi sonlar 83,64,45,26 bo‘lib −19. Pastdagilar 96,65,34,03 bo‘lib −31. D."
  },
  {
    "id": "iq-3-19",
    "test": 3,
    "raqam": 19,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-19-qism-1.webp",
        "kenglik": 785,
        "balandlik": 500,
        "sahifa": 30
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Tik ustunlar yig‘indilari 20,30,20,30,20,30 bo‘lib navbatlashadi. Oxirgi ustunda 30−3−9−7−5=6. C."
  },
  {
    "id": "iq-3-20",
    "test": 3,
    "raqam": 20,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-3-savol-20-qism-1.webp",
        "kenglik": 847,
        "balandlik": 1019,
        "sahifa": 30
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": false,
    "yechim": "Qarama-qarshi yuzlar ikki chiziq/E, X/doira, qora nuqta/Z. Belgilar burilishlari bilan A ni mustaqil to‘liq tasdiqlash yakunlanmadi. Javob tekshirilmoqda."
  },
  {
    "id": "iq-4-01",
    "test": 4,
    "raqam": 1,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-01-qism-1.webp",
        "kenglik": 787,
        "balandlik": 612,
        "sahifa": 31
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Uch shaklning hammasida bir xil bo‘lgan nuqtalar olib tashlanadi. Qolgan o‘rinlarda ko‘pchilik rang saqlanadi. Natijada yuqori o‘ngda oq, chapda va pastki o‘ngda qora nuqta qoladi. B."
  },
  {
    "id": "iq-4-02",
    "test": 4,
    "raqam": 2,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-02-qism-1.webp",
        "kenglik": 821,
        "balandlik": 672,
        "sahifa": 31
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": false,
    "yechim": "Ichki uchrashuv nuqtasi atrofidagi to‘rt yo‘nalishni aylantirib solishtirdim. C kalitini skanerdagi xira chiziqlar sabab mustaqil qat’iy tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-4-03",
    "test": 4,
    "raqam": 3,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-03-qism-1.webp",
        "kenglik": 638,
        "balandlik": 198,
        "sahifa": 32
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Harflarga mos ravishda +3,+4,−2 qo‘llanadi. F→I, R→V, J→H. C — IVH."
  },
  {
    "id": "iq-4-04",
    "test": 4,
    "raqam": 4,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-04-qism-1.webp",
        "kenglik": 795,
        "balandlik": 487,
        "sahifa": 32
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Beshburchaklardagi harflar FIVE, uchburchaklardagilar THREE, kvadratlardagilar FOUR so‘zini beradi. Yetishmagan V,H,U — D."
  },
  {
    "id": "iq-4-05",
    "test": 4,
    "raqam": 5,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-05-qism-1.webp",
        "kenglik": 824,
        "balandlik": 579,
        "sahifa": 32
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Qatorlarda 3→9→1→2→8 sikli yo‘nalishi navbatlashadi. 2-qatorda 9,3,8,2,1,9 va 3-qatorda 1,2,8,3,9,1 hosil bo‘ladi. Yetishmagan 3,8 / 2,8 — B."
  },
  {
    "id": "iq-4-06",
    "test": 4,
    "raqam": 6,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-06-qism-1.webp",
        "kenglik": 706,
        "balandlik": 124,
        "sahifa": 32
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Qolgan sonlarda o‘rtadagi raqam ikki chetdagi raqam yig‘indisi. 683 da 6+3=9, 8 ga teng emas. B."
  },
  {
    "id": "iq-4-07",
    "test": 4,
    "raqam": 7,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-07-qism-1.webp",
        "kenglik": 824,
        "balandlik": 416,
        "sahifa": 33
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": true,
    "yechim": "Namuna uch shaklda ham bor chiziqlarnigina qoldiradi. Ikkinchi qatorda umumiy qism to‘liq / diagonal, pastki o‘ngdagi \\ qism va chap yarim gorizontal chiziq. A."
  },
  {
    "id": "iq-4-08",
    "test": 4,
    "raqam": 8,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-08-qism-1.webp",
        "kenglik": 817,
        "balandlik": 491,
        "sahifa": 33
      }
    ],
    "kitobJavobi": "E",
    "tekshirilgan": true,
    "yechim": "O‘rtadagi son ikki chetdagi sonning o‘rtachasi. (73+25)÷2=49. E."
  },
  {
    "id": "iq-4-09",
    "test": 4,
    "raqam": 9,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-09-qism-1.webp",
        "kenglik": 765,
        "balandlik": 234,
        "sahifa": 33
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Amallar ÷3,+3,×3,−3 tartibida takrorlanadi. Yetishmagan uchlik 27,9,12. D."
  },
  {
    "id": "iq-4-10",
    "test": 4,
    "raqam": 10,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-10-qism-1.webp",
        "kenglik": 832,
        "balandlik": 176,
        "sahifa": 33
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": true,
    "yechim": "To‘rt sonli guruhlarning ustunlari alohida ketma-ketlik. Oxirgi ustun 4,−6,−16,−26. A."
  },
  {
    "id": "iq-4-11",
    "test": 4,
    "raqam": 11,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-11-qism-1.webp",
        "kenglik": 779,
        "balandlik": 118,
        "sahifa": 33
      },
      {
        "fayl": "/eyuf/iq/test-4-savol-11-qism-2.webp",
        "kenglik": 827,
        "balandlik": 810,
        "sahifa": 34
      }
    ],
    "kitobJavobi": "E",
    "tekshirilgan": true,
    "yechim": "Yoyilmani normal yo‘nalishlari bilan buklaganda qarama-qarshi yuz va ko‘rinadigan uch yuzning tartibi tekshirildi. A va B aks tartibda, C va D qarama-qarshi yuzlarni tutashtiradi. E hosil bo‘ladi."
  },
  {
    "id": "iq-4-12",
    "test": 4,
    "raqam": 12,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-12-qism-1.webp",
        "kenglik": 827,
        "balandlik": 643,
        "sahifa": 34
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Namuna doira ichida uchburchak, uchburchak ichida doira, kvadrat ichida qora nuqtaga ega. Shu uch munosabat D da saqlanadi."
  },
  {
    "id": "iq-4-13",
    "test": 4,
    "raqam": 13,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-13-qism-1.webp",
        "kenglik": 828,
        "balandlik": 689,
        "sahifa": 35
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Kichik tarozida A ning yelkasi 1, B niki 3 birlik. A=6 va B=2 muvozanat beradi. Asosiy tarozida (6+2)×7=3×4+4×11=56. D."
  },
  {
    "id": "iq-4-14",
    "test": 4,
    "raqam": 14,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-14-qism-1.webp",
        "kenglik": 816,
        "balandlik": 548,
        "sahifa": 35
      },
      {
        "fayl": "/eyuf/iq/test-4-savol-14-qism-2.webp",
        "kenglik": 369,
        "balandlik": 333,
        "sahifa": 36
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Satr va ustunlarda ustma-ust tushgan bir xil belgilar bekor qilinishi kerak. 7-katak shu qoidani buzadi. 7 raqami D variantida."
  },
  {
    "id": "iq-4-15",
    "test": 4,
    "raqam": 15,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-15-qism-1.webp",
        "kenglik": 812,
        "balandlik": 310,
        "sahifa": 36
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "7-katakda qo‘shni kataklarni solishtirganda chapda oq, o‘rtada qora, o‘ngda oq va pastki o‘ngda oq nuqta qolishi kerak. B shu tuzatishni beradi."
  },
  {
    "id": "iq-4-16",
    "test": 4,
    "raqam": 16,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-16-qism-1.webp",
        "kenglik": 808,
        "balandlik": 504,
        "sahifa": 36
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": false,
    "yechim": "Qatorlar va ustunlardagi shakl takrorlarini tekshirdim. C dagi uch katakni yagona qoida bilan mustaqil tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-4-17",
    "test": 4,
    "raqam": 17,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-17-qism-1.webp",
        "kenglik": 824,
        "balandlik": 353,
        "sahifa": 36
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Toq o‘rinlar har safar 1¼ ga kamayadi. Juft o‘rinlar 1¼ ga ortadi. 3 13/16 + 1¼ = 5 1/16. C."
  },
  {
    "id": "iq-4-18",
    "test": 4,
    "raqam": 18,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-18-qism-1.webp",
        "kenglik": 825,
        "balandlik": 354,
        "sahifa": 37
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": false,
    "yechim": "Uch doirada bir xil arifmetik bog‘lanishni izladim. A — 4 kalitini barcha namunalarga mos qoida bilan tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-4-19",
    "test": 4,
    "raqam": 19,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-19-qism-1.webp",
        "kenglik": 822,
        "balandlik": 505,
        "sahifa": 37
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Har satr va ustunda uch konsentrik sohaning har biri jami bir marta bo‘yaladi. Oxirgi satrda markaz va ikki tashqi soha allaqachon bo‘yalgan, demak bo‘sh uch halqa kerak. B."
  },
  {
    "id": "iq-4-20",
    "test": 4,
    "raqam": 20,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-4-savol-20-qism-1.webp",
        "kenglik": 826,
        "balandlik": 358,
        "sahifa": 37
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "C da qora tugun yo‘q, qolgan to‘rtta shaklda bittadan qora tugun bor. C ortiqcha."
  },
  {
    "id": "iq-5-01",
    "test": 5,
    "raqam": 1,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-01-qism-1.webp",
        "kenglik": 769,
        "balandlik": 671,
        "sahifa": 38
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": false,
    "yechim": "Aylanalarni o‘lcham bo‘yicha guruhlab tekshirdim. Skanerdagi yaqin radiuslarni aniq ajratish sabab A — 6 tur kaliti hozircha mustaqil tasdiqlanmadi. Javob tekshirilmoqda."
  },
  {
    "id": "iq-5-02",
    "test": 5,
    "raqam": 2,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-02-qism-1.webp",
        "kenglik": 759,
        "balandlik": 375,
        "sahifa": 38
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Markaz = yuqori + pastki chap − pastki o‘ng. 6+8−9=5. D."
  },
  {
    "id": "iq-5-03",
    "test": 5,
    "raqam": 3,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-03-qism-1.webp",
        "kenglik": 817,
        "balandlik": 379,
        "sahifa": 38
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Yonlardagi sonlarning mos raqamlari qo‘shilib, yig‘indilar yonma-yon yoziladi. 8+3=11, 1+5=6, 9+6=15. 11615 — D."
  },
  {
    "id": "iq-5-04",
    "test": 5,
    "raqam": 4,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-04-qism-1.webp",
        "kenglik": 827,
        "balandlik": 745,
        "sahifa": 39
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": false,
    "yechim": "To‘rtburchaklarning ustma-ust siljishlarini tekshirdim. D kalitini yagona ketma-ketlik qoidasi bilan mustaqil tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-5-05",
    "test": 5,
    "raqam": 5,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-05-qism-1.webp",
        "kenglik": 826,
        "balandlik": 616,
        "sahifa": 39
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": false,
    "yechim": "Chiziqlarning soni va joyini satr hamda ustun bo‘yicha solishtirdim. D bo‘lagini yagona qoida bilan tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-5-06",
    "test": 5,
    "raqam": 6,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-06-qism-1.webp",
        "kenglik": 644,
        "balandlik": 120,
        "sahifa": 39
      },
      {
        "fayl": "/eyuf/iq/test-5-savol-06-qism-2.webp",
        "kenglik": 799,
        "balandlik": 534,
        "sahifa": 40
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": false,
    "yechim": "Bo‘laklarni burib kvadrat yig‘ilishini tekshirdim. A — BCD variantining to‘liq yig‘ilishi mustaqil tasdiqlanmadi. Javob tekshirilmoqda."
  },
  {
    "id": "iq-5-07",
    "test": 5,
    "raqam": 7,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-07-qism-1.webp",
        "kenglik": 801,
        "balandlik": 804,
        "sahifa": 40
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Har satrning uchinchi katagida dastlabki ikki katakdagi umumiy nurlar qoladi. Pastki juftlikda umumiy nur yo‘q. D — nursiz doira."
  },
  {
    "id": "iq-5-08",
    "test": 5,
    "raqam": 8,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-08-qism-1.webp",
        "kenglik": 828,
        "balandlik": 649,
        "sahifa": 41
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": true,
    "yechim": "Namunalarda doira ichida bitta qora va uchta oq doiracha bor. A shu tarkibni saqlaydi. B da bittasi yetishmaydi, C va D da ikkita qora doiracha bor."
  },
  {
    "id": "iq-5-09",
    "test": 5,
    "raqam": 9,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-09-qism-1.webp",
        "kenglik": 805,
        "balandlik": 832,
        "sahifa": 41
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": true,
    "yechim": "Namuna ikki kesishuvchi doira, kvadrat va uchburchakka ega. Uchburchakning kvadrat va doiralar bilan kesishish munosabatini C saqlaydi."
  },
  {
    "id": "iq-5-10",
    "test": 5,
    "raqam": 10,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-10-qism-1.webp",
        "kenglik": 773,
        "balandlik": 1103,
        "sahifa": 42
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Har qator va ustunda to‘rtta turdagi belgi bittadan bo‘lishi kerak. Kichik va katta belgilar navbatlashishini ham saqlagan bo‘lak B."
  },
  {
    "id": "iq-5-11",
    "test": 5,
    "raqam": 11,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-11-qism-1.webp",
        "kenglik": 778,
        "balandlik": 411,
        "sahifa": 42
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Birinchi ikki qator yetti xonali son sifatida qo‘shiladi. 5749827+3864759=9614586. Oxirgi raqam 6 — B."
  },
  {
    "id": "iq-5-12",
    "test": 5,
    "raqam": 12,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-12-qism-1.webp",
        "kenglik": 836,
        "balandlik": 1042,
        "sahifa": 43
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": false,
    "yechim": "Yoyilmadagi yuzlar va diagonal yo‘nalishlarini buklab tekshirdim. C dagi yuz yo‘nalishini mustaqil to‘liq tasdiqlash yakunlanmadi. Javob tekshirilmoqda."
  },
  {
    "id": "iq-5-13",
    "test": 5,
    "raqam": 13,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-13-qism-1.webp",
        "kenglik": 773,
        "balandlik": 444,
        "sahifa": 43
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": true,
    "yechim": "Har qatorda chap son × o‘rta son = o‘ng son ×6. 12×2÷6=4. A."
  },
  {
    "id": "iq-5-14",
    "test": 5,
    "raqam": 14,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-14-qism-1.webp",
        "kenglik": 866,
        "balandlik": 601,
        "sahifa": 44
      }
    ],
    "kitobJavobi": "C",
    "tekshirilgan": false,
    "yechim": "Tashqi doiralardagi chiziqlar va qora-oq nuqtalar o‘zgarishini solishtirdim. C kaliti uchun yagona qoida mustaqil tasdiqlanmadi. Javob tekshirilmoqda."
  },
  {
    "id": "iq-5-15",
    "test": 5,
    "raqam": 15,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-15-qism-1.webp",
        "kenglik": 793,
        "balandlik": 854,
        "sahifa": 44
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": false,
    "yechim": "Qora-oq nuqtalarning aylanishi va tashqi shakl o‘zgarishini tekshirdim. C kalitini mustaqil qat’iy tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-5-16",
    "test": 5,
    "raqam": 16,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-16-qism-1.webp",
        "kenglik": 781,
        "balandlik": 188,
        "sahifa": 45
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": true,
    "yechim": "Harflarga +3,−3,+3 qo‘llanadi. J→M, R→O, M→P. B — MOP."
  },
  {
    "id": "iq-5-17",
    "test": 5,
    "raqam": 17,
    "variantlar": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-17-qism-1.webp",
        "kenglik": 779,
        "balandlik": 405,
        "sahifa": 45
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": false,
    "yechim": "Sonlar orasidagi bog‘lanish tekshirildi, D — 7 uchun yagona qoida tasdiqlanmadi. PDF da uchinchi variant ham D deb noto‘g‘ri bosilgan. Ilovadagi uchinchi tugma C — 6 ga, to‘rtinchisi D — 7 ga mos. Javob tekshirilmoqda."
  },
  {
    "id": "iq-5-18",
    "test": 5,
    "raqam": 18,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-18-qism-1.webp",
        "kenglik": 777,
        "balandlik": 455,
        "sahifa": 45
      }
    ],
    "kitobJavobi": "D",
    "tekshirilgan": true,
    "yechim": "Har ustunda yuqoridagi ikki son ko‘paytmasidan uchinchi son ayriladi. 16×4−32=32. D."
  },
  {
    "id": "iq-5-19",
    "test": 5,
    "raqam": 19,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-19-qism-1.webp",
        "kenglik": 706,
        "balandlik": 426,
        "sahifa": 45
      },
      {
        "fayl": "/eyuf/iq/test-5-savol-19-qism-2.webp",
        "kenglik": 515,
        "balandlik": 427,
        "sahifa": 46
      }
    ],
    "kitobJavobi": "A",
    "tekshirilgan": false,
    "yechim": "Kataklardagi qora va oq doiralarni ustma-ust solishtirdim. A kalitini barcha satr va ustunlarga mos yagona qoida bilan tasdiqlay olmadim. Javob tekshirilmoqda."
  },
  {
    "id": "iq-5-20",
    "test": 5,
    "raqam": 20,
    "variantlar": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rasmlar": [
      {
        "fayl": "/eyuf/iq/test-5-savol-20-qism-1.webp",
        "kenglik": 778,
        "balandlik": 487,
        "sahifa": 46
      }
    ],
    "kitobJavobi": "B",
    "tekshirilgan": false,
    "yechim": "Pog‘onali jadvalni yig‘indi, ayirma va ko‘paytma munosabatlari orqali tekshirdim. B — 2 uchun yagona qoida mustaqil tasdiqlanmadi. Javob tekshirilmoqda."
  }
];
