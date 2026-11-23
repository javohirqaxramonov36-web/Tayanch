/** O‘zbekcha apostrof variantlarini qidiruvda bir xil talqin qiladi. */
export function qidiruvMatni(text: string): string {
  return text
    .normalize('NFKC')
    .toLocaleLowerCase('uz')
    .replace(/[‘’ʻʼ`']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
