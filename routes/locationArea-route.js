const express = require("express");
const router = express.Router();
const controller = require("../controllers/locationArea-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

router.get("/rentalareas", controller.getList);

module.exports = router;