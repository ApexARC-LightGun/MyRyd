const calculateDistance = (location1, location2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRadians(location2.latitude - location1.latitude);
    const dLon = toRadians(location2.longitude - location1.longitude);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRadians(location1.latitude)) * Math.cos(toRadians(location2.latitude)) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

const assignDriverAndChaser = async (ride, assignmentOption, acceptableWaitBuffer) => {
    const drivers = await Driver.find({ status: 'available' }); // Fetch all available drivers
    const chasers = await Driver.find({ status: 'available', role: 'chaser' }); // Fetch available chasers

    let assignedDriver;
    let assignedChaser;

    if (assignmentOption === 'closest') {
        // Assign the closest driver and chaser
        let shortestDriverDistance = Infinity;
        let shortestChaserDistance = Infinity;

        drivers.forEach((driver) => {
            const distance = calculateDistance(driver.location, ride.pickupLocation);
            if (distance < shortestDriverDistance) {
                shortestDriverDistance = distance;
                assignedDriver = driver;
            }
        });

        chasers.forEach((chaser) => {
            const distance = calculateDistance(chaser.location, ride.pickupLocation);
            if (distance < shortestChaserDistance) {
                shortestChaserDistance = distance;
                assignedChaser = chaser;
            }
        });
    } else if (assignmentOption === 'queue') {
        // Assign the longest-waiting driver and chaser
        assignedDriver = await Driver.findOne({ status: 'available' }).sort({ queuePosition: 1 });
        assignedChaser = await Driver.findOne({ status: 'available', role: 'chaser' }).sort({ queuePosition: 1 });
    }

    if (assignedDriver && assignedChaser) {
        assignedDriver.status = 'assigned';
        assignedChaser.status = 'assigned';

        await assignedDriver.save();
        await assignedChaser.save();

        ride.driver = assignedDriver._id;
        ride.chaser = assignedChaser._id;
        ride.status = 'assigned';
        await ride.save();
    }

    return { assignedDriver, assignedChaser };
};

const calculateRideCost = (distanceInKm, minimumPrice, costPerExtraUnit, waitCost) => {
    if (distanceInKm <= 1) {
        return minimumPrice + waitCost; // Base price + wait cost
    }

    const extraDistance = distanceInKm - 1; // Distance beyond 1km
    const extraUnits = Math.ceil(extraDistance / 0.2); // Each unit is 0.2km
    const extraCost = extraUnits * costPerExtraUnit;

    return minimumPrice + extraCost + waitCost; // Total cost
};

module.exports = { calculateDistance, assignDriverAndChaser, calculateRideCost };