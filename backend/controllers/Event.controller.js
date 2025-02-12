const EventModel = require("../models/Event.model");



exports.createEvent = async (req, res, io) => {
  try {
    const event = new EventModel({
      ...req.body,
      creator: req.user.userId,
      attendees: [],
    });

    await event.save();
    io.emit("newEvent", event);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error creating event" });
  }
};


exports.getEvents = async (req, res) => {
  try {
    const events = await EventModel.find()
      .populate("creator", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};


exports.attendEvent = async (req, res, io) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.attendees.includes(req.user.userId)) {
      event.attendees.push(req.user.userId);
      await event.save();
      io.emit("eventUpdated", event);
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error updating attendance" });
  }
};

exports.getUserJoinedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const joinedEvents = await EventModel.find({ attendees: userId }).sort({ date: 1 });

    res.json(joinedEvents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching joined events" });
  }
};

