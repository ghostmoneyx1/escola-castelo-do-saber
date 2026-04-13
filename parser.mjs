import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wendpwhrxwxatnovdwcp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbmRwd2hyeHd4YXRub3Zkd2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2Mjk4MzUsImV4cCI6MjA5MDIwNTgzNX0.P-S8Gi27hU4IEXksg2bsVqZCAuqe-gTa6qMJ10olcJg';
const supabase = createClient(supabaseUrl, supabaseKey);

const csv = fs.readFileSync('c:/Escola Castelo do Saber/alunos.csv.csv', 'utf8');
const lines = csv.split('\n');

let unitNames = new Set();
let classesMap = new Map();
let students = [];

for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    let inQuotes = false;
    let current = '';
    let cols = [];
    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            cols.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    cols.push(current.trim());

    const guardian = cols[3]?.trim();
    let phone = cols[4]?.trim() || '';
    if (phone.length > 30) phone = phone.substring(0, 30);
    const student = cols[5]?.trim();
    if (!student) continue;

    const grade = cols[6]?.trim() || '';
    const shift = cols[7]?.trim() || '';
    const unit = cols[8]?.trim() || '';
    
    if (unit) unitNames.add(unit);
    
    if (grade && shift && unit) {
        const classKey = `${grade}-${shift}-${unit}`;
        classesMap.set(classKey, { grade, shift, unitName: unit });
    }
    
    students.push({ student, guardian, phone, grade, shift, unitName: unit });
}

const payload = {
    units: Array.from(unitNames),
    classes: Array.from(classesMap.values()),
    students: students
};

console.log('Total students to import:', payload.students.length);

async function run() {
    const { data, error } = await supabase.rpc('import_students_from_json', { payload });
    if (error) {
        console.error('Error importing:', error);
    } else {
        console.log('Import successful!');
    }
}
run();
