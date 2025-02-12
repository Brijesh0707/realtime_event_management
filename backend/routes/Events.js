const express = require("express");
const { authenticateToken } = require("../middleware/auth.middle");
const { createEvent, getEvents, attendEvent, getUserJoinedEvents } = require("../controllers/Event.controller");

const router = express.Router();

module.exports = (io) => {
  router.post("/events", authenticateToken, (req, res) => createEvent(req, res, io));
  router.get("/events", getEvents);
  router.post("/events/:id/attend", authenticateToken, (req, res) => attendEvent(req, res, io));
  router.get("/events/joined", authenticateToken, getUserJoinedEvents);
  return router;
};
