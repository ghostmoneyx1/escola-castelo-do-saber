import xlsx from 'xlsx';

const path = '../Controle de matrículas 2026.xlsx';
const workbook = xlsx.readFile(path);

for (const sheetName of workbook.SheetNames) {
  console.log(`\nSheet: ${sheetName}`);
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log('Headers (Row 1):', data[0]);
  console.log('Headers (Row 2):', data[1]);
  console.log('Sample Row:', data[2]);
}
