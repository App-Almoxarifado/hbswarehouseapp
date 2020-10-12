const  express = require('express');
const router = express.Router();
const controller = require("../controllers/index-controller");

//INDEX
router.get("/", controller.getIndex);

module.exports = router;