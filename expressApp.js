const express = require("express");

const app = express();
const PORT = 4000;

app.use(express.json());

const vehicles = [
  {
    id: 1,
    vehicleName: "Hyundai Creta",
    vehicleNumber: "HR26AB1234",
    type: "SUV",
    price: 1500000
  },
  {
    id: 2,
    vehicleName: "Honda City",
    vehicleNumber: "DL3CAB5678",
    type: "Sedan",
    price: 1200000
  },
  {
    id: 3,
    vehicleName: "Tata Nexon",
    vehicleNumber: "UP16CD9012",
    type: "SUV",
    price: 1100000
  }
];

const requiredFields = ["id", "vehicleName", "vehicleNumber", "type", "price"];

function validateVehicle(vehicle) {
  if (!vehicle || typeof vehicle !== "object" || Array.isArray(vehicle)) {
    return "Request body must be a JSON object.";
  }

  for (const field of requiredFields) {
    if (vehicle[field] === undefined || vehicle[field] === null || vehicle[field] === "") {
      return `Missing required field: ${field}.`;
    }
  }

  if (
    typeof vehicle.vehicleName !== "string" ||
    vehicle.vehicleName.trim() === "" ||
    typeof vehicle.vehicleNumber !== "string" ||
    vehicle.vehicleNumber.trim() === "" ||
    typeof vehicle.type !== "string" ||
    vehicle.type.trim() === ""
  ) {
    return "vehicleName, vehicleNumber and type must be non-empty strings.";
  }

  if (!Number.isFinite(Number(vehicle.price)) || Number(vehicle.price) <= 0) {
    return "Price must be a positive number.";
  }

  return null;
}

function findVehicleById(id) {
  return vehicles.find((vehicle) => String(vehicle.id) === String(id));
}

function normalizeVehicle(vehicle) {
  return {
    id: vehicle.id,
    vehicleName: vehicle.vehicleName.trim(),
    vehicleNumber: vehicle.vehicleNumber.trim(),
    type: vehicle.type.trim(),
    price: Number(vehicle.price)
  };
}

// GET /vehicles - retrieve all vehicles
app.get("/vehicles", (req, res) => {
  res.status(200).json(vehicles);
});

// GET /vehicles/:id - retrieve a vehicle by ID
app.get("/vehicles/:id", (req, res) => {
  const vehicle = findVehicleById(req.params.id);

  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found." });
  }

  res.status(200).json(vehicle);
});

// POST /vehicles - add a vehicle
app.post("/vehicles", (req, res) => {
  const validationError = validateVehicle(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (findVehicleById(req.body.id)) {
    return res.status(400).json({ error: "A vehicle with this ID already exists." });
  }

  const newVehicle = normalizeVehicle(req.body);
  vehicles.push(newVehicle);

  res.status(201).json({
    message: "Vehicle added successfully",
    vehicle: newVehicle
  });
});

// PUT /vehicles/:id - update vehicle details
app.put("/vehicles/:id", (req, res) => {
  const vehicle = findVehicleById(req.params.id);

  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found." });
  }

  const validationError = validateVehicle(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (String(req.body.id) !== String(req.params.id)) {
    return res.status(400).json({ error: "The body ID must match the vehicle ID in the URL." });
  }

  const duplicateId = vehicles.find(
    (item) => String(item.id) === String(req.body.id) && item !== vehicle
  );

  if (duplicateId) {
    return res.status(400).json({ error: "A vehicle with this ID already exists." });
  }

  Object.assign(vehicle, normalizeVehicle(req.body));

  res.status(200).json({
    message: "Vehicle updated successfully",
    vehicle
  });
});

// DELETE /vehicles/:id - delete a vehicle
app.delete("/vehicles/:id", (req, res) => {
  const index = vehicles.findIndex(
    (vehicle) => String(vehicle.id) === String(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "Vehicle not found." });
  }

  const deletedVehicle = vehicles.splice(index, 1)[0];

  res.status(200).json({
    message: "Vehicle deleted successfully",
    vehicle: deletedVehicle
  });
});

// Handle malformed JSON bodies
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON in request body." });
  }

  next(error);
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
