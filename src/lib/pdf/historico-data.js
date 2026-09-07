// Lógica pura do Histórico Escolar (sem react-pdf) — testável isolada.

// Matérias que a escola quer no histórico, na ordem pedida pela secretaria.
// `aliases` são os nomes (sem acento, minúsculos) que podem aparecer em `subjects.name`.
export const HISTORICO_SUBJECTS = [
  { label: "Língua Portuguesa", aliases: ["portugues", "lingua portuguesa"] },
  { label: "Matemática", aliases: ["matematica"] },
  { label: "Ciências", aliases: ["ciencias"] },
  { label: "História", aliases: ["historia"] },
  { label: "Geografia", aliases: ["geografia"] },
  { label: "Língua Estrangeira (Inglês)", aliases: ["ingles", "lingua estrangeira", "lingua inglesa"] },
];

export const HISTORICO_YEARS = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"];

export function normalizeSubjectName(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// Média anual por matéria (média simples das unidades lançadas).
// Devolve { [label]: number | null } seguindo HISTORICO_SUBJECTS.
export function subjectAverages(grades = []) {
  const totals = new Map();

  for (const grade of grades) {
    const name = normalizeSubjectName(grade.subjects?.name);
    if (!name || grade.score == null || grade.score === "") continue;
    const entry = totals.get(name) || { sum: 0, count: 0 };
    entry.sum += Number(grade.score);
    entry.count += 1;
    totals.set(name, entry);
  }

  const result = {};
  for (const subject of HISTORICO_SUBJECTS) {
    const entry = subject.aliases.map((alias) => totals.get(alias)).find(Boolean);
    result[subject.label] = entry ? Math.round((entry.sum / entry.count) * 10) / 10 : null;
  }
  return result;
}

// Índice da coluna do ano: "3º Ano" → 2. null fora do Fundamental I (Grupo 0X etc.).
export function yearIndex(className) {
  const match = (className || "").match(/(\d)\s*[ºo°]/);
  if (!match) return null;
  const index = Number(match[1]) - 1;
  return index >= 0 && index < HISTORICO_YEARS.length ? index : null;
}

export function formatScore(value) {
  if (value == null) return "";
  return Number(value).toFixed(1).replace(".", ",");
}
