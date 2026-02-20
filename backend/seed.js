const db = require('./src/config/db');
require('dotenv').config();

const operators = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14];
const busTypes = ['AC', 'Non-AC', 'Sleeper'];

const seedBuses = async () => {
    console.log("🚌 Starting Bus Seeding...");

    try {
        for (const opId of operators) {
            console.log(`Processing Operator ID: ${opId}`);

            for (let i = 1; i <= 3; i++) {
                const busNumber = `TR-${opId}${i}-${Math.floor(1000 + Math.random() * 9000)}`;
                const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
                
                const totalSeats = busType === 'Sleeper' ? 30 : 40;

                try {
                    await db.query(
                        'CALL add_bus($1, $2, $3, $4, NULL)',
                        [opId, busNumber, busType, totalSeats]
                    );
                    
                    console.log(` Bus Added: ${busNumber} (${busType}) for Operator ${opId}`);
                } catch (err) {
                    if (err.code === '23505') {
                        console.warn(`Skip: Bus number ${busNumber} already exists.`);
                    } else {
                        console.error(`Error adding bus for Operator ${opId}:`, err.message);
                    }
                }
            }
        }
        console.log(" Bus Seeding Complete.");
    } catch (err) {
        console.error("Critical Seeder Error:", err);
    } finally {
        process.exit();
    }
};


const getFare = (busType) => {
    if (busType === 'AC') return Math.floor(Math.random() * (1200 - 900 + 1)) + 900;
    if (busType === 'Non-AC') return Math.floor(Math.random() * (900 - 650 + 1)) + 650;
    if (busType === 'Sleeper') return Math.floor(Math.random() * (2000 - 1500 + 1)) + 1500;
    return 800;
};

const seedTrips = async () => {
    console.log("Starting Trip Seeding...");

    try {
        const operatorRes = await db.query('SELECT OperatorID FROM OPERATOR');
        const operators = operatorRes.rows.map(r => r.operatorid);

        const routeRes = await db.query('SELECT RouteID FROM ROUTE');
        const routes = routeRes.rows.map(r => r.routeid);

        if (operators.length === 0 || routes.length === 0) {
            console.error(" Aborting: No operators or routes found in DB. Please seed them first.");
            return;
        }

        const dailyTripsTemplate = [];

        console.log("Generating template from existing buses...");
        for (const opId of operators) {
            const busRes = await db.query('SELECT busid, bustype FROM BUS WHERE operatorid = $1', [opId]);
            const myBuses = busRes.rows;

            if (myBuses.length > 0) {
                for (const bus of myBuses) {
                    for (let i = 0; i < 2; i++) {
                        dailyTripsTemplate.push({
                            operatorId: opId,
                            busId: bus.busid,
                            routeId: routes[Math.floor(Math.random() * routes.length)],
                            departureTime: ['08:00:00', '10:30:00', '14:00:00', '18:30:00', '22:00:00'][Math.floor(Math.random() * 5)],
                            fare: getFare(bus.bustype)
                        });
                    }
                }
            }
        }

        if (dailyTripsTemplate.length === 0) {
            console.error("Aborting: No buses found for your operators. Trips cannot be assigned without buses.");
            console.log("Tip: Run your bus seeding script or insert data into the BUS table first.");
            return;
        }

        for (let day = 19; day <= 26; day++) {
            const tripDate = `2026-02-${day}`;
            console.log(`Seeding Date: ${tripDate} (${dailyTripsTemplate.length} trips)...`);

            for (const trip of dailyTripsTemplate) {
                try {
                    await db.query(
                        'CALL assign_trip($1, $2, $3, $4, $5, $6)',
                        [trip.operatorId, trip.routeId, trip.busId, tripDate, trip.departureTime, trip.fare]
                    );
                } catch (err) {
                    if (!err.message.includes('unique constraint')) {
                        console.error(`Error on ${tripDate} for Bus ${trip.busid}:`, err.message);
                    }
                }
            }
        }

        console.log("✅ Seeding Complete! Trips generated for Feb 19-26.");
    } catch (err) {
        console.error("Critical Seeder Error:", err);
    } finally {
        process.exit();
    }
};







// seedBuses();

// seedTrips();
