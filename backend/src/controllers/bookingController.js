const db = require('../config/db');

const createBooking = async (req, res) => {
    const customerId = req.user.id;
    const { tripId, seatId } = req.body;

    console.log(`[DEBUG] Booking attempt - Customer: ${customerId}, Trip: ${tripId}, Seats:`, seatId);

    if (!tripId || !seatId) {
        console.error('[DEBUG] Booking failed validation: Missing tripId or seatId');
        return res.status(400).json({ error: "Trip ID and Seat ID are required." });
    }

    const seatArray = Array.isArray(seatId) ? seatId : [seatId];

    if (seatArray.length === 0) {
        console.error('[DEBUG] Booking failed validation: Empty seat array');
        return res.status(400).json({ error: "At least one seat must be selected." });
    }

    try {
        console.log(`[DEBUG] Calling create_booking_bulk(${customerId}, ${tripId}, [${seatArray}])`);
        const result = await db.query(
            'CALL create_booking_bulk($1, $2, $3, NULL::int[])',
            [customerId, parseInt(tripId), seatArray]
        );

        const createdIds = result.rows[0] ? result.rows[0].p_booking_ids : [];
        console.log('[DEBUG] Booking successful, IDs:', createdIds);

        res.status(201).json({
            message: "Seats reserved successfully!",
            bookingId: createdIds
        });

    } catch (err) {
        console.error('[DEBUG] Booking Exception:', {
            message: err.message,
            code: err.code,
            detail: err.detail,
            hint: err.hint,
            stack: err.stack
        });

        if (err.message.includes('Constraint Violation') || err.code === '23505') {
            return res.status(409).json({
                error: "Seat Already Booked",
                message: "This seat has already been reserved. Please refresh and try another."
            });
        }

        res.status(500).json({ error: "Internal server error.", details: err.message });
    }
};

const getTripSeats = async (req, res) => {
    const { tripId } = req.params;

    try {
        const result = await db.query('SELECT * FROM get_trip_seat_map($1)', [tripId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No seats found for this trip." });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Fetch Trip Seats Error:', err);
        res.status(500).json({ error: "Internal server error fetching seat map." });
    }
};

module.exports = { createBooking, getTripSeats };
