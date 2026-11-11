export const TODOS_OS_MESES = Array.from({ length: 12 }, (_, i) => i + 1);

// Vencimento no dia do contrato; em mês curto cai no último dia.
export function calcDueDate(year, month, day) {
  const lastDay = new Date(year, month, 0).getDate();
  const d = Math.min(day, lastDay);
  return `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// Meses que ainda não têm parcela no contrato (UNIQUE contract_id, month).
export function mesesLivres(parcelas) {
  const usados = new Set(parcelas.map((p) => p.month));
  return TODOS_OS_MESES.filter((m) => !usados.has(m));
}

export function montarParcelas({ contractId, studentId, year, dueDay, amount, meses }) {
  return [...meses]
    .sort((a, b) => a - b)
    .map((month) => ({
      contract_id: contractId,
      student_id: studentId,
      month,
      year,
      due_date: calcDueDate(year, month, dueDay),
      amount,
      status: "A vencer",
    }));
}
