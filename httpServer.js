const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const infoFilePath = path.join(__dirname, "public", "info.html");

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

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON in request body."));
      }
    });

    req.on("error", reject);
  });
}

function hasRequiredVehicleFields(vehicle) {
  return vehicle &&
    vehicle.id !== undefined && vehicle.id !== null && String(vehicle.id).trim() !== "" &&
    typeof vehicle.vehicleName === "string" && vehicle.vehicleName.trim() !== "" &&
    typeof vehicle.vehicleNumber === "string" && vehicle.vehicleNumber.trim() !== "" &&
    typeof vehicle.type === "string" && vehicle.type.trim() !== "" &&
    vehicle.price !== undefined && vehicle.price !== null &&
    Number.isFinite(Number(vehicle.price)) && Number(vehicle.price) > 0;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  if (req.method === "GET" && pathname === "/") {
    return sendHtml(
      res,
      200,
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vehicle Management</title>
</head>
<body>
  <h1>Welcome to Vehicle Management</h1>
  <p>Node.js HTTP Module Lab Application</p>
  <nav>
    <a href="/vehicles">View Vehicles</a> |
    <a href="/about">About</a> |
    <a href="/info">Information</a>
  </nav>
</body>
</html>`
    );
  }

  if (req.method === "GET" && pathname === "/vehicles") {
    return sendJson(res, 200, vehicles);
  }

  if (req.method === "POST" && pathname === "/add-vehicle") {
    try {
      const vehicle = await readJsonBody(req);

      if (!hasRequiredVehicleFields(vehicle)) {
        return sendJson(res, 400, {
          error: "Required fields: id, vehicleName, vehicleNumber, type and positive price."
        });
      }

      if (vehicles.some((item) => String(item.id) === String(vehicle.id))) {
        return sendJson(res, 400, { error: "A vehicle with this ID already exists." });
      }

      const newVehicle = {
        id: vehicle.id,
        vehicleName: vehicle.vehicleName.trim(),
        vehicleNumber: vehicle.vehicleNumber.trim(),
        type: vehicle.type.trim(),
        price: Number(vehicle.price)
      };

      vehicles.push(newVehicle);
      return sendJson(res, 201, {
        message: "Vehicle added successfully",
        vehicle: newVehicle
      });
    } catch (error) {
      return sendJson(res, 400, { error: error.message || "Invalid request." });
    }
  }

  if (req.method === "GET" && pathname === "/about") {
    return sendHtml(
      res,
      200,
      `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>About</title></head>
<body>
  <h1>About Vehicle Management</h1>
  <p>This application demonstrates Node.js HTTP routing, JSON responses, request handling and FS static-file serving.</p>
  <p>Vehicle data is stored in an in-memory JavaScript array.</p>
</body>
</html>`
    );
  }

  if (req.method === "GET" && pathname === "/info") {
    return fs.readFile(infoFilePath, "utf8", (error, content) => {
      if (error) {
        return sendJson(res, 500, { error: "Unable to read public/info.html." });
      }
      sendHtml(res, 200, content);
    });
  }

  return sendJson(res, 404, { error: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
