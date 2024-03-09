const { Router } = require("express");
const testOps = require("../Controllers/TestOps");
const router = Router();

router.post("/createtest", testOps.createTest);
router.get("/mytests", testOps.getTests);
router.get("/:testId", testOps.getParticularTest);

module.exports = router;
