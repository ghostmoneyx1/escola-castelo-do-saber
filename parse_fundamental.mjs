import xlsx from 'xlsx';
import fs from 'fs';

const path = '../Controle de matrículas 2026.xlsx';
const workbook = xlsx.readFile(path);
const sheetName = 'Ensino Fundamental';
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const studentsArr = [];
const unitsSet = new Set();
const classesSet = new Set();

// We know the headers start at row 1 (0-indexed 1) or data starts at row 2.
for (let i = 2; i < data.length; i++) {
  const row = data[i];
  if (!row) continue;
  
  const guardianName = typeof row[3] === 'string' ? row[3].trim().replace(/'/g, "''") : String(row[3] || '').replace(/'/g, "''");
  const contact = typeof row[4] === 'string' ? row[4].trim().replace(/'/g, "''") : String(row[4] || '').replace(/'/g, "''");
  const studentName = typeof row[5] === 'string' ? row[5].trim().replace(/'/g, "''") : String(row[5] || '').replace(/'/g, "''");
  let className = typeof row[6] === 'string' ? row[6].trim().replace(/'/g, "''") : String(row[6] || '').replace(/'/g, "''");
  const unitName = typeof row[7] === 'string' ? row[7].trim().replace(/'/g, "''") : String(row[7] || '').replace(/'/g, "''");
  
  if (!studentName || studentName === 'undefined' || !className || className === 'undefined' || !unitName || unitName === 'undefined') continue;

  const shiftName = 'Matutino'; // Defaulting as it's missing in the spreadsheet

  unitsSet.add(unitName);
  
  const classKey = `${className}-${shiftName}-${unitName}`;
  classesSet.add(JSON.stringify({ grade: className, shift: shiftName, unitName: unitName }));

  studentsArr.push({
      name: studentName,
      unit: unitName,
      class: className,
      shift: shiftName,
      guardian: guardianName,
      phone: contact
  });
}

let sql = `
DO $$
DECLARE
    v_unit_id UUID;
    v_class_id UUID;
    v_student_id UUID;
    v_guardian_id UUID;
BEGIN
`;

// Insert Units
for (const unit of unitsSet) {
    sql += `   -- Unit: ${unit}\n`;
    sql += `   IF NOT EXISTS (SELECT 1 FROM units WHERE name = '${unit}') THEN\n`;
    sql += `       INSERT INTO units (name) VALUES ('${unit}');\n`;
    sql += `   END IF;\n`;
}

// Insert Classes
for (const clsStr of classesSet) {
    const cls = JSON.parse(clsStr);
    sql += `   -- Class: ${cls.grade} | ${cls.shift} | ${cls.unitName}\n`;
    sql += `   SELECT id INTO v_unit_id FROM units WHERE name = '${cls.unitName}';\n`;
    sql += `   IF NOT EXISTS (SELECT 1 FROM classes WHERE grade = '${cls.grade}' AND shift = '${cls.shift}' AND unit_id = v_unit_id AND year = 2026) THEN\n`;
    sql += `       INSERT INTO classes (name, grade, shift, unit_id, year) VALUES ('${cls.grade}', '${cls.grade}', '${cls.shift}', v_unit_id, 2026);\n`;
    sql += `   END IF;\n`;
}

// Insert Students
for (const st of studentsArr) {
    sql += `
   -- Student: ${st.name}
   SELECT id INTO v_guardian_id FROM guardians WHERE name = '${st.guardian}' AND phone = '${st.phone}';
   IF v_guardian_id IS NULL THEN
       INSERT INTO guardians (name, phone, relationship) VALUES ('${st.guardian}', '${st.phone}', 'Outro') RETURNING id INTO v_guardian_id;
   END IF;
   SELECT id INTO v_unit_id FROM units WHERE name = '${st.unit}';
   SELECT id INTO v_class_id FROM classes WHERE grade = '${st.class}' AND shift = '${st.shift}' AND unit_id = v_unit_id AND year = 2026 LIMIT 1;
   
   IF NOT EXISTS (SELECT 1 FROM students WHERE name = '${st.name}') THEN
       INSERT INTO students (name, class_id, unit_id) VALUES ('${st.name}', v_class_id, v_unit_id) RETURNING id INTO v_student_id;
       IF v_guardian_id IS NOT NULL THEN
           INSERT INTO student_guardians (student_id, guardian_id, is_primary) VALUES (v_student_id, v_guardian_id, true);
       END IF;
       IF v_class_id IS NOT NULL THEN
           INSERT INTO enrollments (student_id, class_id, year, status) VALUES (v_student_id, v_class_id, 2026, 'Ativa');
       END IF;
   END IF;
`;
}

sql += `END $$;\n`;

fs.writeFileSync('generate_fund.sql', sql);
console.log("SQL generated at generate_fund.sql with students count:", studentsArr.length);
