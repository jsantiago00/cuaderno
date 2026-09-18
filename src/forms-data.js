// Guías de formas poéticas: explicación breve, esquema métrico/de rima,
// un ejemplo y una plantilla para arrancar a escribir.

export const poeticForms = [
  {
    id: 'haiku',
    name: 'Haiku',
    origin: 'Japón (adaptado al español)',
    summary: 'Tres versos breves, sin rima, que capturan una imagen o instante.',
    scheme: '5 - 7 - 5 sílabas, sin rima',
    tips: [
      'Buscá una imagen concreta de la naturaleza o de un instante cotidiano.',
      'No hace falta contar una historia completa: alcanza con una sola sensación.',
      'Evitá explicar el sentimiento directamente; mostralo a través de la imagen.',
    ],
    example: 'Cae la tarde\nun pájaro se posa\nsobre el silencio',
    template: {
      lines: 3,
      syllableTargets: [5, 7, 5],
      placeholder: ['', '', ''],
    },
  },
  {
    id: 'copla',
    name: 'Copla',
    origin: 'España / tradición hispanoamericana',
    summary: 'Estrofa popular de cuatro versos, ideal como base de una canción.',
    scheme: '4 versos octosílabos (8 sílabas), rima asonante en los versos pares (2° y 4°)',
    tips: [
      'Es la estructura base de muchas canciones populares y coplas de cancionero.',
      'La rima asonante solo repite las vocales desde la última vocal acentuada.',
      'Funciona muy bien encadenada: varias coplas seguidas arman una canción entera.',
    ],
    example: 'Si supieras lo que siento\ncuando cae el sol así,\nsabrías que en cada viento\nllevo un pedazo de ti',
    template: {
      lines: 4,
      syllableTargets: [8, 8, 8, 8],
      placeholder: ['', '', '', ''],
    },
  },
  {
    id: 'redondilla',
    name: 'Redondilla',
    origin: 'España, Siglo de Oro',
    summary: 'Cuatro versos octosílabos con rima consonante cruzada tipo ABBA.',
    scheme: '4 versos octosílabos, rima consonante ABBA',
    tips: [
      'La rima consonante repite todos los sonidos desde la vocal acentuada (no solo las vocales).',
      'El esquema ABBA "envuelve" el segundo y tercer verso entre el primero y el último.',
      'Muy usada para pensamientos breves y cerrados, casi como una idea completa.',
    ],
    example: 'Hoy el cielo está de fiesta (A)\ny yo guardo mi silencio (B)\ncomo quien guarda un secreto (B)\nque solo el viento contesta (A)',
    template: {
      lines: 4,
      syllableTargets: [8, 8, 8, 8],
      placeholder: ['', '', '', ''],
    },
  },
  {
    id: 'decima',
    name: 'Décima (espinela)',
    origin: 'España, siglo XVI (Vicente Espinel)',
    summary: 'Diez versos octosílabos con un esquema de rima muy característico. Ideal para relatos breves con un giro final.',
    scheme: '10 versos octosílabos, rima consonante: ABBAACCDDC',
    tips: [
      'Se suele dividir mentalmente en dos partes de 4 y una de 2, aunque se escribe corrida.',
      'El verso 5 suele cerrar una primera idea; el giro o remate llega cerca del verso 10.',
      'Es la base de muchas payadas, repentismo y trova en Latinoamérica.',
    ],
    example:
      'Voy contando lo vivido (A)\nen versos que van y vienen (B)\ncomo el agua que sostienen (B)\nlos ríos que no han partido (A)\nguardo aquello que he tenido (A)\nen la palma de la mano (C)\ny sé bien que no fue en vano (C)\nescribir lo que se siente (D)\nporque el verso simplemente (D)\nes tan solo ser humano (C)',
    template: {
      lines: 10,
      syllableTargets: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      placeholder: ['', '', '', '', '', '', '', '', '', ''],
    },
  },
  {
    id: 'romance',
    name: 'Romance',
    origin: 'Tradición oral española',
    summary: 'Serie de versos octosílabos, de extensión libre, con rima asonante solo en los versos pares.',
    scheme: 'Versos octosílabos en cantidad libre, rima asonante en versos pares; los impares quedan libres',
    tips: [
      'No tiene un número fijo de versos: podés extenderlo tanto como necesite la historia.',
      'Es ideal para narrar (cuenta algo que pasó), como una balada o corrido.',
      'La rima asonante es más flexible que la consonante: da libertad para narrar sin trabarte.',
    ],
    example:
      'Cuenta la gente del pueblo\nque una noche de verano\nvino el viento desde el norte\ny se llevó lo que amamos',
    template: {
      lines: 8,
      syllableTargets: [8, 8, 8, 8, 8, 8, 8, 8],
      placeholder: ['', '', '', '', '', '', '', ''],
    },
  },
  {
    id: 'soneto',
    name: 'Soneto',
    origin: 'Italia (Petrarca), adoptado en español',
    summary: 'Catorce versos endecasílabos organizados en dos cuartetos y dos tercetos.',
    scheme: '14 versos endecasílabos (11 sílabas): 2 cuartetos ABBA ABBA + 2 tercetos (CDC DCD u otra combinación)',
    tips: [
      'Los cuartetos suelen plantear una idea o imagen; los tercetos la resuelven o la contrastan.',
      'El endecasílabo es más largo: da lugar a desarrollar la imagen con más detalle.',
      'Es una de las formas más exigentes, pero también de las más versátiles para temas profundos.',
    ],
    example:
      'Hay tardes que se quedan en el pecho (A)\ncomo se queda el sol sobre los cerros, (B)\ny en esa luz, tan lenta, me pierdo (B)\nbuscando lo que el tiempo ya deshizo. (A)\n...',
    template: {
      lines: 14,
      syllableTargets: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
      placeholder: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    },
  },
  {
    id: 'letra-cancion',
    name: 'Letra de canción (verso-estribillo)',
    origin: 'Canción popular moderna',
    summary: 'Estructura flexible pensada para canciones: estrofas que narran y un estribillo que resume la idea central y se repite.',
    scheme: 'Estrofa (4-8 versos libres) + Estribillo (2-4 versos, se repite) + Estrofa + Estribillo + (Puente opcional) + Estribillo final',
    tips: [
      'El estribillo suele tener la frase más fuerte o memorable: la que querés que se quede.',
      'Las estrofas avanzan la historia; el estribillo se queda en el sentimiento central.',
      'No hace falta métrica estricta: la melodía después va a moldear el ritmo del texto.',
    ],
    example: '[Estrofa]\nCamino solo por la ciudad dormida...\n\n[Estribillo]\nY vuelvo siempre a vos,\ncomo vuelve la marea...',
    template: {
      sections: [
        { label: 'Estrofa 1', lines: 4 },
        { label: 'Estribillo', lines: 3 },
        { label: 'Estrofa 2', lines: 4 },
        { label: 'Estribillo', lines: 3 },
      ],
    },
  },
];

export function getFormById(id) {
  return poeticForms.find((f) => f.id === id) || null;
}

// Arma el texto inicial de una nota nueva a partir de una forma poética.
export function buildTemplateContent(form) {
  if (!form) return '';
  if (form.template.sections) {
    return form.template.sections
      .map((s) => `[${s.label}]\n${Array(s.lines).fill('').join('\n')}`)
      .join('\n\n');
  }
  const { syllableTargets } = form.template;
  return syllableTargets.map((count) => `(${count} sílabas) `).join('\n');
}
