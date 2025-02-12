const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require("dotenv")
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const AuthRoutes = require("./routes/Auth")
const eventRoutes = require("./routes/Events")

const app = express();
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:5173", "https://event-beta-lovat.vercel.app"];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});
dotenv.config()
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://panchalbrijesh0707:lkbykGirkObNBsCG@cluster0.2qxykrj.mongodb.net/eventmanage?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

io.on('connection', (socket) => {
    console.log('User connected');
    
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  
  const PORT = process.env.PORT || 5000;

  app.use("/api/auth",AuthRoutes)
  app.use("/api/event",eventRoutes(io))
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });