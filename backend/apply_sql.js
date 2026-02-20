const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

async function applySqlFiles() {
    const dbDir = path.join(__dirname, 'DB');
    const files = [
        'auth_mgmt.sql',
        'trip_mgmt.sql',
        'booking_mgmt.sql',
        'bus_seat_mgmt.sql',
        'payment_refund_mgmt.sql',
        'operator_mgmt.sql'
    ];

    try {
        for (const file of files) {
            const filePath = path.join(dbDir, file);
            if (fs.existsSync(filePath)) {
                console.log(`Applying ${file}...`);
                const sql = fs.readFileSync(filePath, 'utf8');
                await db.query(sql);
                console.log(`Successfully applied ${file}.`);
            } else {
                console.log(`File not found: ${file}`);
            }
        }
        console.log('All SQL files applied successfully.');
    } catch (err) {
        console.error('Error applying SQL files:', err);
    } finally {
        process.exit(0);
    }
}

applySqlFiles();
