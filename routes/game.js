const express = require("express")
const router = express.Router()

const game = require('../controllers/game')
const restrict = require('../middlewares/restrict')

router.post("/play/:id", restrict, game.game)

module.exports = router