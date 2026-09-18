// Contador aproximado de sílabas métricas en español.
// Cubre: separación silábica básica (onset simple pasa a la sílaba
// siguiente, grupos consonánticos inseparables como "pr", "bl", etc. se
// mantienen juntos), diptongos/triptongos, hiatos (vocal fuerte+fuerte o
// tilde en vocal débil), sinalefa entre palabras y la "ley del acento
// final" (agudas suman una sílaba, esdrújulas restan una). No cubre
// licencias poéticas como la diéresis o el hiato forzado a propósito: es
// una guía, no un árbitro — el oído siempre manda.

const VOWELS = 'aeiouáéíóúü';
const STRONG = 'aeoáéó';
const WEAK = 'iuíú';
const TILDED = 'áéíóú';
const INSEPARABLE_CLUSTERS = new Set([
  'pr', 'pl', 'br', 'bl', 'tr', 'dr', 'cr', 'cl', 'gr', 'gl', 'fr', 'fl',
]);

function isVowel(ch) {
  return ch ? VOWELS.includes(ch) : false;
}

function stripToLetters(word) {
  return word.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
}

// Encuentra los rangos [inicio, fin) de cada núcleo vocálico (sílaba),
// separando hiatos (vocal fuerte + fuerte, o tilde sobre vocal débil).
function findNucleusRanges(word) {
  const ranges = [];
  let i = 0;
  while (i < word.length) {
    if (!isVowel(word[i])) {
      i += 1;
      continue;
    }
    let start = i;
    let j = i;
    while (j < word.length && isVowel(word[j])) {
      if (j > start) {
        const prev = word[j - 1];
        const cur = word[j];
        const bothStrong = STRONG.includes(prev) && STRONG.includes(cur);
        const weakTilded = (WEAK.includes(prev) && TILDED.includes(prev)) || (WEAK.includes(cur) && TILDED.includes(cur));
        if (bothStrong || weakTilded) {
          ranges.push([start, j]);
          start = j;
        }
      }
      j += 1;
    }
    ranges.push([start, j]);
    i = j;
  }
  return ranges;
}

function splitWordSyllables(rawWord) {
  const word = stripToLetters(rawWord);
  if (!word) return [];

  const nuclei = findNucleusRanges(word);
  if (!nuclei.length) return [word];

  const syllables = [];
  let segStart = 0;

  for (let idx = 0; idx < nuclei.length; idx += 1) {
    const [, nEnd] = nuclei[idx];
    const isLast = idx === nuclei.length - 1;
    const nextStart = isLast ? word.length : nuclei[idx + 1][0];
    const between = word.slice(nEnd, nextStart);

    if (isLast) {
      syllables.push(word.slice(segStart, nEnd) + between);
      break;
    }

    let splitAt;
    if (between.length <= 1) {
      splitAt = 0;
    } else if (between.length === 2) {
      splitAt = INSEPARABLE_CLUSTERS.has(between) ? 0 : 1;
    } else {
      const lastTwo = between.slice(-2);
      splitAt = INSEPARABLE_CLUSTERS.has(lastTwo) ? between.length - 2 : between.length - 1;
    }

    syllables.push(word.slice(segStart, nEnd) + between.slice(0, splitAt));
    segStart = nEnd + splitAt;
  }

  return syllables;
}

export function countWordSyllables(word) {
  return splitWordSyllables(word).length;
}

function wordStressType(rawWord) {
  const word = stripToLetters(rawWord);
  const syll = splitWordSyllables(word);
  if (syll.length <= 1) return 'monosilaba';

  const tildedIndex = syll.findIndex((s) => [...s].some((c) => TILDED.includes(c)));
  if (tildedIndex !== -1) {
    const fromEnd = syll.length - 1 - tildedIndex;
    if (fromEnd === 0) return 'aguda';
    if (fromEnd === 1) return 'llana';
    return 'esdrujula';
  }

  const lastChar = word[word.length - 1];
  if (isVowel(lastChar) || lastChar === 'n' || lastChar === 's') return 'llana';
  return 'aguda';
}

function endsInVowelSound(word) {
  const clean = stripToLetters(word);
  return isVowel(clean[clean.length - 1]);
}

function startsWithVowelSound(word) {
  const clean = stripToLetters(word);
  const first = clean[0] === 'h' ? clean[1] : clean[0];
  return isVowel(first);
}

/**
 * Cuenta las sílabas métricas de un verso completo: aplica sinalefa entre
 * palabras y la ley del acento final. Devuelve un número aproximado.
 */
export function countLineSyllables(line) {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 0;

  let total = 0;
  for (const w of words) {
    total += countWordSyllables(w);
  }

  // Sinalefa: cada frontera vocal-final + vocal-inicial funde dos sílabas en una.
  for (let i = 0; i < words.length - 1; i += 1) {
    if (endsInVowelSound(words[i]) && startsWithVowelSound(words[i + 1])) {
      total -= 1;
    }
  }

  const stress = wordStressType(words[words.length - 1]);
  if (stress === 'aguda' || stress === 'monosilaba') total += 1;
  else if (stress === 'esdrujula') total -= 1;

  return Math.max(total, 0);
}
