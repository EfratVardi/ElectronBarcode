import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://asaxstkldopvqojugigf.supabase.co';  // כתובת ה-API שלך
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYXhzdGtsZG9wdnFvanVnaWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5Nzk2NDcsImV4cCI6MjA1NTU1NTY0N30.I9sZMNAOddeYIY6cj5xI-fZT-SDXHkyKx0wGqih9T58';  // מפתח ה-API שלך

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🔹 שליפת הגדרות מערכת
export async function getSystemSettings() {
    const { data, error } = await supabase
        .from('system')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('❌ Error fetching system settings:', error.message);
        return null;
    }
    return data;
}

// 🔹 עדכון הגדרות מערכת
export async function updateSystemSettings(updatedValues) {
    const { error } = await supabase
        .from('system')
        .update(updatedValues)
        .eq('id', 1);

    return !error;
}

// 🔹 הכנסת תלמידים)
export async function insertStudents(data) {
    console.log("🔍 Inserting students...");

    // הכנסת תלמידים חדשים
    const { data: insertData, error: insertError } = await supabase.from('students').insert(data);

    console.log("📌 Supabase insert response:", { insertData, insertError });

    if (insertError) {
        console.error("❌ Error inserting students:", insertError.message);
        return false;
    }

    return true;
}


// 🔹 שליפת כל התלמידים
export async function getAllStudents() {
    const { data, error } = await supabase.from('students').select('*');
    return error ? [] : data;
}

// 🔹 עדכון תלמיד לפי ת"ז
export async function updateStudent(tz, points) {
    const { error } = await supabase
        .from('students')
        .update({ points })
        .eq('tz', tz);

    return !error;
}

// 🔹 שליפת תלמיד לפי ת"ז
export async function getStudentByTz(tz) {
    const cleanTz = tz.replace(/^0+/, '');

    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('tz', cleanTz)
        .single();

    return error ? null : data;
}

// 🔹 הוספת משימות (מוחק הכל לפני הכנסת נתונים)
export async function insertTasks(data) {
    await supabase.from('tasks').delete();
    const { error } = await supabase.from('tasks').insert(data);
    return !error;
}

// 🔹 שליפת משימה לפי קוד
export async function getTaskByCode(code) {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('code', code)
        .single();

    return error ? null : data;
}

// 🔹 הוספת מוצרים (מוחק הכל לפני הכנסת נתונים)
export async function insertProducts(data) {
    await supabase.from('products').delete();
    const { error } = await supabase.from('products').insert(data);
    return !error;
}

// 🔹 שליפת כל המוצרים
export async function getAllProducts() {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });;
    return error ? [] : data;
}

// 🔹 עדכון סטטוס רכישה במערכת
export async function updateBuyStatus(buy) {
    const { error } = await supabase
        .from('system')
        .update({ buy })
        .eq('id', 1);

    return !error;
}

// 🔹 הוספת מוצר חדש
export async function insertProduct(product) {
    const { error } = await supabase.from('products').insert([product]);
    return !error;
}

export async function updateProductName(code, newName) {
    // שליחה ל-Supabase
    const { data, error } = await supabase
        .from('products')
        .update({ name: newName })
        .eq('code', code)
        .select(); // מחזיר את השורה המעודכנת

    if (error) {
        console.error("Supabase Error:", error.message, error);
        return false;
    }

    console.log("Product name updated successfully:", data);
    return true;
}


export async function updateProductPoints(code, newPoints) {
    console.log(code,'-',newPoints)
    const {data, error } = await supabase.from('products').update({ points: newPoints }).eq('code', code);
    return !error;
}
