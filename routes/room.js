const express = require("express");
const router = express.Router();

const room = require("../controllers/roomsController")
const restrict = require("../middlewares/restrict")

router.post("/room", restrict, room.createRoom)
router.post("/join", restrict, room.joinRoom)
router.get("/room", restrict, room.listRoom)
router.delete("/room/:id", restrict, room.deleteRoom)

module.exports = router