const  express = require('express');
const router = express.Router();
const controller = require("../controllers/planning-controller");


//INDEX
router.get("/",controller.get);

module.exports = router;