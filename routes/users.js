var express = require('express');
var router = express.Router();

const user = require('../controllers/usersController')

router.post("/register", user.createUser)
router.get("/", user.getLoginPage)
router.post("/login", user.login)
router.post("/loginpage", user.loginPage)

module.exports = router;
