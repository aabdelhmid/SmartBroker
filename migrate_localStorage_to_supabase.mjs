import { supabase } from './src/lib/supabase.js';

// This script migrates data from localStorage to Supabase
// Run with: node migrate_localStorage_to_supabase.mjs

async function migrateData() {
    console.log('🚀 Starting data migration from localStorage to Supabase...\n');

    // Note: This script needs to be run in a browser context to access localStorage
    // For now, we'll create a manual migration guide

    console.log('⚠️  This script needs to run in the browser to access localStorage.');
    console.log('');
    console.log('📋 Manual Migration Steps:');
    console.log('');
    console.log('1. Open your app in the browser: http://localhost:3001');
    console.log('2. Open DevTools (F12 or Cmd+Option+I)');
    console.log('3. Go to Console tab');
    console.log('4. Paste the following code:');
    console.log('');
    console.log('─'.repeat(80));
    console.log(`
// Extract localStorage data
const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
const properties = JSON.parse(localStorage.getItem('properties') || '[]');
const leads = JSON.parse(localStorage.getItem('leads') || '[]');
const interests = JSON.parse(localStorage.getItem('interests') || '[]');

console.log('📊 Data Summary:');
console.log('Users:', mockUsers.length);
console.log('Properties:', properties.length);
console.log('Leads:', leads.length);
console.log('Interests:', interests.length);

// Download as JSON
const data = { mockUsers, properties, leads, interests };
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'localStorage_backup.json';
a.click();
URL.revokeObjectURL(url);

console.log('✅ Data exported to localStorage_backup.json');
    `);
    console.log('─'.repeat(80));
    console.log('');
    console.log('5. This will download a JSON file with all your data');
    console.log('6. Send me that file and I\'ll create the SQL migration script');
}

migrateData();
