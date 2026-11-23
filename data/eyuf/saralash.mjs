/** Book o‘chirgichi mashq va mock saralashining umumiy kirish nuqtasi. */
export function savollarniSarala(bank, settings, { level, mock = false }) {
  return bank.items.filter(question =>
    question.level.includes(level) &&
    (question.contentSource !== 'book' || settings.book_content_enabled) &&
    (!mock || (question.verified && question.answer !== null))
  );
}

/** Tartib qiymati rasmiy kvota jadvalidagi tengliklarni barqaror yechadi. */
export function treklarniSarala(tracks, quotas, level) {
  const rows = new Map(quotas.items.map(row => [row.track_id, row]));
  return tracks.items.filter(track => track.level.includes(level)).toSorted((left, right) => {
    const a = rows.get(left.id);
    const b = rows.get(right.id);
    return b.open[level] - a.open[level] || a.order - b.order;
  });
}
