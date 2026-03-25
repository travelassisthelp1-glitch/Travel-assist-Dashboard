import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB if URI is provided
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err);
    }
  } else {
    console.warn("MONGODB_URI not provided. Using in-memory fallback for demo purposes.");
  }

  const BookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    passportInfo: String,
    travelDate: String,
    tripType: String,
    origin: String,
    destination: String,
    seatType: String,
    seatNumber: String,
    seatLocation: String,
    notes: String,
    status: { type: String, default: "New" },
    createdAt: { type: Date, default: Date.now }
  });

  const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

  // In-memory fallback
  let inMemoryBookings: any[] = [
    {
      _id: "1",
      name: "John Doe",
      phone: "+1234567890",
      email: "john@example.com",
      passportInfo: "A1234567",
      travelDate: "2026-04-15",
      tripType: "One Way",
      origin: "New York",
      destination: "Paris",
      seatType: "Business",
      seatNumber: "12A",
      seatLocation: "Window",
      notes: "Window seat preferred",
      status: "New",
      createdAt: new Date()
    },
    {
      _id: "2",
      name: "Jane Smith",
      phone: "+0987654321",
      email: "jane@example.com",
      passportInfo: "B9876543",
      travelDate: "2026-05-20",
      tripType: "Round Trip",
      origin: "London",
      destination: "Tokyo",
      seatType: "Economy",
      seatNumber: "34C",
      seatLocation: "Aisle",
      notes: "Vegetarian meal",
      status: "Contacted",
      createdAt: new Date()
    }
  ];

  // API Routes
  app.post("/api/bookings", async (req, res) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await Booking.create(req.body);
      } else {
        inMemoryBookings.push({
          ...req.body,
          _id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          status: req.body.status || "New"
        });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const data = await Booking.find().sort({ createdAt: -1 });
        res.json(data);
      } else {
        res.json([...inMemoryBookings].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.put("/api/bookings/:id", async (req, res) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await Booking.updateOne({ _id: req.params.id }, req.body);
      } else {
        const index = inMemoryBookings.findIndex(p => p._id === req.params.id);
        if (index !== -1) {
          inMemoryBookings[index] = { ...inMemoryBookings[index], ...req.body };
        }
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await Booking.deleteOne({ _id: req.params.id });
      } else {
        inMemoryBookings = inMemoryBookings.filter(p => p._id !== req.params.id);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v4 uses '*'
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
