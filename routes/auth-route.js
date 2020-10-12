const express = require('express');
const router = express.Router();
const controller = require("../controllers/auth-controller");

//INDEX
router.get("/register", controller.get);
router.post("/register", controller.register);
router.post("/authenticate", controller.authenticate);

module.exports = router;