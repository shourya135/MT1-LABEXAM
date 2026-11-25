# MT1-LABEXAM — Vehicle Management

Vehicle Management Web Application for the Node.js lab examination.

## Requirements

- Node.js (LTS recommended)
- npm

## Setup

```bash
npm install
```

## Part A: Built-in HTTP and FS modules

Run in one terminal:

```bash
node httpServer.js
```

Server: `http://localhost:3000`

Routes:

- `GET /` — HTML welcome page
- `GET /vehicles` — vehicle array as JSON
- `GET /about` — application information
- `GET /info` — serves `public/info.html` with `fs.readFile()`
- `POST /add-vehicle` — add a vehicle using JSON

Example POST body for `http://localhost:3000/add-vehicle`:

```json
{
  "id": 4,
  "vehicleName": "Maruti Swift",
  "vehicleNumber": "DL8CAF5030",
  "type": "Hatchback",
  "price": 750000
}
```

## Part B: Express REST API

Run in a second terminal:

```bash
node expressApp.js
```

Server: `http://localhost:4000`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/vehicles` | List all vehicles |
| GET | `/vehicles/:id` | Get vehicle by ID |
| POST | `/vehicles` | Add vehicle |
| PUT | `/vehicles/:id` | Update vehicle |
| DELETE | `/vehicles/:id` | Delete vehicle |

POST and PUT use JSON request bodies. A vehicle contains `id`, `vehicleName`, `vehicleNumber`, `type`, and `price`. Price must be a positive number.

Example POST body:

```json
{
  "id": 4,
  "vehicleName": "Maruti Swift",
  "vehicleNumber": "DL8CAF5030",
  "type": "Hatchback",
  "price": 750000
}
```

## Postman test examples

- `GET http://localhost:4000/vehicles`
- `GET http://localhost:4000/vehicles/1`
- `POST http://localhost:4000/vehicles`
- `PUT http://localhost:4000/vehicles/1` (send the complete vehicle object with ID `1`)
- `DELETE http://localhost:4000/vehicles/1`

For POST and PUT, select **Body → raw → JSON**.

## Git submission

Create a repository named `MT1-LABEXAM`, then commit your work in modules. Example:

```bash
git init
git add .
git commit -m "Initial project setup"
git add httpServer.js public/info.html
git commit -m "Implement HTTP server and static info route"
git add expressApp.js
git commit -m "Implement Express vehicle CRUD API"
git add README.md package.json
git commit -m "Add project documentation and scripts"
```

The `screenshots/` folder is included for the required demonstration screenshots.
