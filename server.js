const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI (replace with your own credentials)
// const mongoURI =
//   "mongodb+srv://janardhank134:OI3pWU8nyCyZEOwc@cluster1.lmzjd.mongodb.net/?retryWrites=true&w=majority&appName=cluster1";

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MONGODB_URI is not defined in the environment variables.");
  process.exit(1); // Exit the application if the URI is not set
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Note Schema
const noteSchema = new mongoose.Schema({
  content: String,
  uniqueId: String,
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set creation time
  },
});

// Create TTL index on the `createdAt` field to delete notes after 30 seconds (30 seconds = 30)
noteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 });

const Note = mongoose.model("Note", noteSchema);

// API to create a note
app.post("/api/notes", async (req, res) => {
  const { content } = req.body;
  const uniqueId = Math.random().toString(36).substr(2, 9); // Generate unique ID

  const note = new Note({
    content,
    uniqueId,
  });

  try {
    await note.save();
    res.status(201).json({ message: "Note created", uniqueId });
  } catch (err) {
    res.status(500).json({ message: "Error creating note" });
  }
});

// API to retrieve a note by unique ID
// app.get("/api/notes/:uniqueId", async (req, res) => {
//   const { uniqueId } = req.params;
//   try {
//     const note = await Note.findOne({ uniqueId });
//     if (!note) {
//       return res.status(404).json({ message: "Note not found" });
//     }
//     res.json(note);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching note" });
//   }
// });

//module.exports = app;

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
