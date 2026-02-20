const db = require('./src/config/db');

async function testBookingFix() {
    console.log('🧪 --- TESTING SEAT-BUS MISMATCH FIX ---');

    try {
        // 1. Setup: Get a Trip and its Bus
        const tripRes = await db.query('SELECT TripID, BusID FROM TRIP LIMIT 1');
        if (tripRes.rows.length === 0) {
            console.log('⚠️ No trips found to test. Please seed trips first.');
            process.exit(0);
        }
        const { tripid, busid } = tripRes.rows[0];
        console.log(`Trip ID: ${tripid}, Assigned Bus: ${busid}`);

        // 2. Get a valid seat (from the same bus)
        const validSeatRes = await db.query('SELECT SeatID FROM SEAT WHERE BusID = $1 LIMIT 1', [busid]);
        const validSeatId = validSeatRes.rows[0].seatid;
        console.log(`Testing with VALID seat: ${validSeatId}`);

        // 3. Get an invalid seat (from a different bus)
        const invalidSeatRes = await db.query('SELECT SeatID FROM SEAT WHERE BusID <> $1 LIMIT 1', [busid]);
        if (invalidSeatRes.rows.length === 0) {
            console.log('⚠️ Only one bus found. Cannot test mismatch perfectly, but will try with a non-existent SeatID.');
            var invalidSeatId = 999999;
        } else {
            var invalidSeatId = invalidSeatRes.rows[0].seatid;
        }
        console.log(`Testing with INVALID seat: ${invalidSeatId}`);

        // 4. Test INVALID booking (Should fail)
        console.log('\nStep A: Attempting INVALID booking (Mismatch)...');
        try {
            await db.query('CALL create_booking($1, $2, $3, NULL)', [1, tripid, invalidSeatId]);
            console.error('❌ FAILURE: Mismatched booking was allowed!');
        } catch (err) {
            if (err.message.includes('Constraint Violation')) {
                console.log('✅ SUCCESS: Caught expected error:', err.message);
            } else {
                console.error('❌ UNEXPECTED ERROR:', err.message);
            }
        }

        // 5. Test VALID booking (Should succeed if not already booked)
        console.log('\nStep B: Attempting VALID booking...');
        try {
            await db.query('CALL create_booking($1, $2, $3, NULL)', [1, tripid, validSeatId]);
            console.log('✅ SUCCESS: Valid booking processed correctly.');
        } catch (err) {
            if (err.message.includes('unique constraint') || err.message.includes('already taken')) {
                console.log('ℹ️ Note: Seat was already booked, but the validation check was passed.');
            } else {
                console.error('❌ FAILURE: Valid booking rejected:', err.message);
            }
        }

    } catch (err) {
        console.error('Test script exploded:', err);
    } finally {
        process.exit(0);
    }
}

testBookingFix();
