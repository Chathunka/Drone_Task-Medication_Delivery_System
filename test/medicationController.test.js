const request = require('supertest');
const app = require('../src/app');
const { connect, closeDatabase, clearDatabase } = require('./dbHandler');
const Drone = require('../src/models/modelDrone');
const Medication = require('../src/models/modelMedication');
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

// Test drone
const testDrone = {
    serialNumber: 'DRN001',
    model: 'Lightweight',
    weightLimit: 500,
    batteryCapacity: 100,
    state: 'IDLE',
};

// Test medication
const testMedication = {
    name: 'MedA',
    weight: 10,
    code: 'MED001',
    image: 'https://example.com/medA.jpg',
};

describe('POST /medications/:droneSerial/loadMedication', () => {
    it('should load medications onto a drone', async () => {
        // Create a drone in the database
        await Drone.create(testDrone);
        // Send a POST request to load medications onto the drone
        const response = await request(app)
            .post(`/medications/${testDrone.serialNumber}/loadMedication`)
            .send({ medications: [testMedication] });
            // Check response status code
            expect(response.status).toBe(200);
            // Check drone's state and medications
            const drone = await Drone.findOne({ serialNumber: testDrone.serialNumber });
            expect(drone.state).toBe('LOADING');
            expect(drone.medications.length).toBe(1);
            // Retrieve the medication details using the medication ID
            const medicationId = drone.medications[0];
            const medication = await Medication.findById(medicationId);
            expect(medication.name).toBe(testMedication.name);
            expect(medication.weight).toBe(testMedication.weight);
            expect(medication.code).toBe(testMedication.code);
            expect(medication.image).toBe(testMedication.image);
    });
});

describe('GET /medications/:droneSerial/loaded', () => {
    it('should retrieve the loaded medications for a drone', async () => {
        // Create a drone in the database
        await Drone.create(testDrone);
        // Send a POST request to load medications onto the drone
        const response = await request(app)
            .post(`/medications/${testDrone.serialNumber}/loadMedication`)
            .send({ medications: [testMedication] });
            // Check response status code
            expect(response.status).toBe(200);
        // Send a GET request to retrieve the loaded medications for the drone
        const response1 = await request(app).get(`/medications/${testDrone.serialNumber}/getMedication`);
            // Check response status code
            expect(response1.status).toBe(200);
            // Check the response body
            const loadedMedications = response1.body;
            expect(loadedMedications.length).toBe(1);
            expect(loadedMedications[0].name).toBe(testMedication.name);
            expect(loadedMedications[0].weight).toBe(testMedication.weight);
            expect(loadedMedications[0].code).toBe(testMedication.code);
            expect(loadedMedications[0].image).toBe(testMedication.image);
    });
});