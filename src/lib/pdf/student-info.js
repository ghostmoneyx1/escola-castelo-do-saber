function normalizeRelationship(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function resolveGuardians(guardians = []) {
  const byRelationship = (target) =>
    guardians.find((g) => normalizeRelationship(g.relationship) === target);

  const mae = byRelationship("mae");
  const pai = byRelationship("pai");

  return { mae, pai, responsavel: mae || pai || guardians[0] };
}

export function genderSuffix(student) {
  return student?.gender === "Feminino" ? "a" : "o";
}

// Postgres devolve `date` como "YYYY-MM-DD", que new Date() lê como UTC.
// Em fusos negativos isso retrocede um dia — daí o parse manual.
export function formatBirthDate(value) {
  if (!value) return null;
  const [year, month, day] = String(value).slice(0, 10).split("-");
  if (!year || !month || !day) return null;
  return `${day}/${month}/${year}`;
}

export function birthText(student) {
  const formatted = formatBirthDate(student?.birth_date);
  if (!formatted) return "";
  return `, nascid${genderSuffix(student)} em ${formatted}`;
}

export function filiacaoText(student, { pai, mae, responsavel }) {
  const suffix = genderSuffix(student);

  if (pai && mae) return `, filh${suffix} do senhor ${pai.name} e da senhora ${mae.name}`;
  if (pai) return `, filh${suffix} do senhor ${pai.name}`;
  if (mae) return `, filh${suffix} da senhora ${mae.name}`;
  if (responsavel) {
    return `, cujo responsável é ${responsavel.name}${responsavel.cpf ? `, CPF ${responsavel.cpf}` : ""}`;
  }
  return "";
}
