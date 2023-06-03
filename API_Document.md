# Drone Medication Delivery APIs

API endpoints, request bodies, and responses for managing drone delivery operations.

## Drones

### Create Drone

**Endpoint**: `POST /drones`

Create a new drone with a name, battery capacity, and weight limit.

**Request**:

- Method: `POST`
- URL: `http://localhost:3000/drones`
- Body:

```json
{
  "serialNumber": "DRN001",
  "model": "Lightweight",
  "weightLimit": 500,
  "batteryCapacity": 100
}
```

**Response**:

- Drone object.

### Get All Drones

**Endpoint**: `GET /drones`

Retrieve a list of all drones.

**Request**:

- Method: `GET`
- URL: `http://localhost:3000/drones`

**Response**:

- Drone objects.

### Get Drone by Serial Number

**Endpoint**: `GET /drones/{droneSerial}`

Retrieve a specific drone by its serial number.

**Request**:

- Method: `GET`
- URL: `http://localhost:3000/drones/{droneSerial}`

**Response**:

- Drone object.

### Get Drones Available For Loading

**Endpoint**: `GET /drones/available-for-loading`

Retrieve a list of drones available for loading.

**Request**:

- Method: `GET`
- URL: `http://localhost:3000/drones/available-for-loading`

**Response**:

- Drone objects.

### Set Drone Battery Level

**Endpoint**: `PUT /drones/{droneSerial}/set-battery-level`

Set the battery level of a specific drone.

**Request**:

- Method: `PUT`
- URL: `http://localhost:3000/drones/{droneSerial}/set-battery-level`
- Body:

```json
{
  "batteryCapacity": 80
}
```

**Response**:

- Drone object.

### Get Drone Battery Level

**Endpoint**: `GET /drones/{droneSerial}/get-battery-level`

Retrieve the battery level of a specific drone.

**Request**:

- Method: `GET`
- URL: `http://localhost:3000/drones/{droneSerial}/get-battery-level`

**Response**:

- Battery level.

### Set Drone State

**Endpoint**: `PUT /drones/{droneSerial}/state`

Set the state of a specific drone.

**Request**:

- Method: `PUT`
- URL: `http://localhost:3000/drones/{droneSerial}/state`
- Body:

```json
{
  "state": "IDLE"
}
```

**Response**:

- Drone object.

### Delete Drone

**Endpoint**: `DELETE /drones/{droneSerial}`

Delete a specific drone.

**Request**:

- Method: `DELETE`
- URL: `http://localhost:3000/drones/{droneSerial}`

**Response**:

- message.

## Medications

### Load Medications to Drone

**Endpoint**: `POST /medications/{droneSerial}/loadMedication`

Load medications onto a drone by providing the medication name and weight.

**Request**:

- Method: `POST`
- URL: `http://localhost:3000/medications/{droneSerial}/loadMedication`
- Body:

```json
{
  "medications": [
    {
      "name": "MedicationA",
      "weight": 200,
      "code": "MED001",
      "image": "https://example.com/medicationA.jpg"
    },
    {
      "name": "MedicationB",
      "weight": 300,
      "code": "MED002",
      "image": "https://example.com/medicationB.jpg"
    }
  ]
}
```

**Response**:

- Drone object.

### Get Loaded Medications of Drone

**Endpoint**: `GET /medications/{droneSerial}/getMedication`

Retrieve the list of medications loaded onto a specific drone.

**Request**:

- Method: `GET`
- URL: `http://localhost:3000/medications/{droneSerial}/getMedication`

**Response**:

- Medication objects.

---

**Note**: Please replace `{droneSerial}` in the API endpoints with the actual serial number of the drone you are working with. The placeholder `{droneSerial}` is used to represent the unique identifier for each drone.

---