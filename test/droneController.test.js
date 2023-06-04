const request = require('supertest');
const app = require('../src/app');
const { connect, closeDatabase, clearDatabase } = require('./dbHandler');
const Drone = require('../src/models/modelDrone');
let server;

//Start Server, connect DB before all
beforeAll(async () => {
    await connect();
    startServer();
});

//Clear the DB before each test
beforeEach(async () => {
    await clearDatabase();
});

//Close Database, Close Server after all
afterAll(async () => {
    jest.setTimeout(10000); // Increase the timeout to 10000 milliseconds
    await closeDatabase();
    closeServer();
});

const startServer = () => {
    // Start the server
    const port = process.env.PORT || 3000;
    server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

const closeServer = () => {
    if (server) {
        server.close();
        console.log('Server closed');
    }
};

// Test the registerDrone endpoint
describe('POST /drones', () => {
    it('should register a new drone', async () => {
        // Test drone
        const testDrone = {
            "serialNumber": "DRN001",
            "model": "Lightweight",
            "weightLimit": 500,
            "batteryCapacity": 100
        };
        const response = await request(app)
        .post('/drones')
        .send(testDrone)
        .expect(201);
        // Check Registration
        expect(response.body.serialNumber).toBe(testDrone.serialNumber);
        expect(response.body.model).toBe(testDrone.model);
        expect(response.body.weightLimit).toBe(testDrone.weightLimit);
        expect(response.body.batteryCapacity).toBe(testDrone.batteryCapacity);
    });

    it('should return an error', async () => {
        const response = await request(app)
        .post('/drones')
        .send({})
        .expect(500);
        // Check error message
        //expect(response.body.error).toBe('error message');
    });
});

// Test the getAllDrones endpoint
describe('GET /drones', () => {
    it('should get all drones', async () => {
        // Create some test drones with state
        const drone1 = {
            "serialNumber": "DRN006",
            "model": "Lightweight",
            "weightLimit": 500,
            "batteryCapacity": 100,
            "state":"IDLE"
        };
        const drone2 = {
            "serialNumber": "DRN007",
            "model": "Lightweight",
            "weightLimit": 500,
            "batteryCapacity": 100,
            "state":"IDLE"
        };
        // Insert the test drones into the database
        await Drone.create(drone1);
        await Drone.create(drone2);
        // Send a GET request to the /drones endpoint
        const response = await request(app).get('/drones').expect(200);
        // Check the response contains the correct number of drones
        expect(response.body.length).toBe(2);
        // Check the response contains the test drones
        const drones = response.body.map((drone) => drone.serialNumber);
        expect(drones).toContain(drone1.serialNumber);
        expect(drones).toContain(drone2.serialNumber);
    });
});

// Test the getDroneBySerial endpoint
describe('GET /drones/:serialNumber', () => {
    it('should get a drone by serial number', async () => {
        // Create a drone and save it to the database
        const drone = new Drone({
            serialNumber: 'DRN001',
            model: 'Lightweight',
            weightLimit: 500,
            batteryCapacity: 100,
            state: 'IDLE'
        });
        await drone.save();

        const response = await request(app)
            .get(`/drones/${drone.serialNumber}`)
            .expect(200);
            // Check response matches the drone data
            expect(response.body.serialNumber).toBe(drone.serialNumber);
            expect(response.body.model).toBe(drone.model);
            expect(response.body.weightLimit).toBe(drone.weightLimit);
            expect(response.body.batteryCapacity).toBe(drone.batteryCapacity);
    });

    it('should return 404 if drone with specified serial number does not exist', async () => {
        const nonExistentSerialNumber = 'DRN999';
        const response = await request(app)
            .get(`/drones/${nonExistentSerialNumber}`)
            .expect(404);
            // Check the response contains the appropriate error message
            // expect(response.body.error).toBe('Error Message');
    });
});

// Test the getAvailableForLoading endpoint
describe('GET /drones/available-for-loading', () => {
    it('should get the available drones for loading', async () => {
        // Create test drones with different states
        const testDrones = [
            {
                serialNumber: 'DRN001',
                model: 'Lightweight',
                weightLimit: 500,
                batteryCapacity: 100,
                state: 'IDLE',
            },
            {
                serialNumber: 'DRN002',
                model: 'Lightweight',
                weightLimit: 500,
                batteryCapacity: 100,
                state: 'LOADING',
            },
            {
                serialNumber: 'DRN003',
                model: 'Lightweight',
                weightLimit: 500,
                batteryCapacity: 100,
                state: 'DELIVERED',
            },
            {
                serialNumber: 'DRN004',
                model: 'Lightweight',
                weightLimit: 500,
                batteryCapacity: 100,
                state: 'LOADED',
            },
            {
                serialNumber: 'DRN005',
                model: 'Lightweight',
                weightLimit: 500,
                batteryCapacity: 100,
                state: 'DELIVERING',
            },
            {
                serialNumber: 'DRN006',
                model: 'Lightweight',
                weightLimit: 500,
                batteryCapacity: 100,
                state: 'RETURNING',
            },
        ];
        // Insert test drones into the database
        await Drone.insertMany(testDrones);
        // Make a GET request to the /drones/available-for-loading endpoint
        const response = await request(app).get('/drones/available-for-loading').expect(200);
        // Filter the test drones to get only the available drones based on state
        const availableDrones = testDrones.filter(
            (drone) =>
                drone.state === 'IDLE' ||
                drone.stste === 'LOADING' ||
                drone.stste === 'DELIVERED'
        );
        // Filter the test drones to get the not available drones based on state
        const notAvailableDrones = testDrones.filter(
            (drone) =>
                drone.state === 'LOADED' ||
                drone.state === 'DELIVERING' ||
                drone.state === 'RETURNING'
        );
        // Check the response body contains the available drones
        expect(response.body.map(({ __v, _id, medications, ...drone }) => drone)).toEqual(
            expect.arrayContaining(
                availableDrones.map((drone) =>
                    expect.objectContaining(drone)
                )
            )
        );
        // Check the response body does not contain the not available drones
        expect(response.body.map(({ __v, _id, medications, ...drone }) => drone)).not.toEqual(
            expect.arrayContaining(
                notAvailableDrones.map((drone) =>
                    expect.objectContaining(drone)
                )
            )
        );
    });
});

//Test the updateDroneState endpoint
describe('PUT /drones/:serialNumber/state', () => {
    it('should update the state of a drone', async () => {
        // Create a drone with state
        const drone = new Drone({
            serialNumber: 'DRN001',
            model: 'Lightweight',
            weightLimit: 500,
            batteryCapacity: 100,
            state: 'IDLE'
        });
        await drone.save();
        const newState = 'DELIVERING'; // set new state of the drone
        const response = await request(app)
            .put(`/drones/${drone.serialNumber}/state`)
            .send({ state: newState })
            .expect(200);
            // Check the response matches the updated state
            expect(response.body.state).toBe(newState);
    });
    it('should return 404 if drone with specified serial number does not exist', async () => {
        const nonExistentSerialNumber = 'DRN999';
        const newState = 'DELIVERING';
        const response = await request(app)
            .put(`/drones/${nonExistentSerialNumber}/state`)
            .send({ state: newState })
            .expect(404);
            // check the response contains the appropriate error message
            // expect(response.body.error).toBe('error message');
    });
});

//Test the deleteDrone endpoint
describe('DELETE /drones/:serialNumber', () => {
    it('should delete a drone', async () => {
        // Create a test drone
        const drone = new Drone({
            serialNumber: 'DRN001',
            model: 'Lightweight',
            weightLimit: 500,
            batteryCapacity: 100,
            state: 'IDLE'
        });
        await drone.save();
        const response = await request(app)
            .delete(`/drones/${drone.serialNumber}`)
            .expect(200);
            // Check the response contains the appropriate success message
            expect(response.body.message).toBe('Drone deleted successfully');
    });
    it('should return 404 if drone with specified serial number does not exist', async () => {
        const nonExistentSerialNumber = 'DRN999';
        const response = await request(app)
        .delete(`/drones/${nonExistentSerialNumber}`)
        .expect(404);
        // Check the response contains the appropriate error message
        // expect(response.body.error).toBe('error message');
    });
});

//Test the getDroneBatteryLevel endpoint
describe('GET /drones/:serialNumber/get-battery-level', () => {
    it('should get the battery level of a drone', async () => {
        // Create a test drone
        const drone = new Drone({
            serialNumber: 'DRN001',
            model: 'Lightweight',
            weightLimit: 500,
            batteryCapacity: 100,
            state: 'IDLE'
        });
        await drone.save();
        const response = await request(app)
            .get(`/drones/${drone.serialNumber}/get-battery-level`)
            .expect(200);
            // Check the response matches the drone's battery level
            expect(response.body.batteryLevel).toBe(drone.batteryCapacity);
    });
    it('should return 404 if drone with specified serial number does not exist', async () => {
        const nonExistentSerialNumber = 'DRN999';
        const response = await request(app)
            .get(`/drones/${nonExistentSerialNumber}/get-battery-level`)
            .expect(404);
            // Check the response contains the appropriate error message
            // expect(response.body.error).toBe('error message');
    });
});

//Test the updateDroneBatteryLevel endpoint
describe('PUT /drones/:serialNumber/set-battery-level', () => {
    it('should update the battery level of a drone', async () => {
        // Create a test drone
        const drone = new Drone({
            serialNumber: 'DRN001',
            model: 'Lightweight',
            weightLimit: 500,
            batteryCapacity: 100,
            state: 'IDLE'
        });
        await drone.save();
        const newBatteryLevel = 80;
        const response = await request(app)
            .put(`/drones/${drone.serialNumber}/set-battery-level`)
            .send({ batteryCapacity: newBatteryLevel })
            .expect(200);
            // Check the response matches the updated battery level
            expect(response.body.batteryCapacity).toBe(newBatteryLevel);
    });
    it('should return 404 if drone with specified serial number does not exist', async () => {
        const nonExistentSerialNumber = 'DRN999';
        const newBatteryLevel = 80;
        const response = await request(app)
            .put(`/drones/${nonExistentSerialNumber}/set-battery-level`)
            .send({ batteryCapacity: newBatteryLevel })
            .expect(404);
            // Check the response contains the appropriate error message
            // expect(response.body.error).toBe('error message');
    });
});