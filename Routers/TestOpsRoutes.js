const { Router } = require("express");
const testOps = require("../Controllers/TestOps");
const router = Router();

router.post("/createtest", testOps.createTest);
router.get("/mytests", testOps.getTests);
router.get("/:testId", testOps.getParticularTest);
router.post("/upvote" , testOps.upVotes);
router.post("/comment" , testOps.comment);
module.exports = router;
