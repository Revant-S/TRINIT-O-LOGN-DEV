const mongoose = require("mongoose");
const Test = require("../DbModels/TestPaperModel");
const User = require("../DbModels/UserModel");
const {secret} = require("../Controllers/authControllers");
const jwt = require("jsonwebtoken");
const cookie = require("cookies");
const cookieParser = require("cookie-parser");
async function giveTestToAll(document) {
  const testId = document._id;
  try {
    await User.updateMany({}, { $addToSet: { eligibleTests: testId } });
    return true;
  } catch (error) {
    return false;
  }
}
async function isUserAuthorized(userId, testId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw Error("User not found");
    }
    const isAuthorized = user.takenTests.includes(testId) || user.eligibleTests.includes(testId);
    return isAuthorized;
  } catch (error) {
    console.error("Error checking user authorization:", error);
    return false;
  }
}

module.exports.createTest = async (req, res) => {
  const body = req.body;
  let resObj = {};
  try {
    const document = await Test.create(body);
    if (document.access === "Public") {
      const given = await giveTestToAll(document);
      resObj = given;
    }
    resObj.testStatus = "Test Made Sucessfully!";
    res.json({ resObj });
  } catch (error) {
    res.json({ msg: "some error occured" });
  }
};

module.exports.getTests = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.id;
    const user = await User.findById(userId)
      .populate("eligibleTests")
      .populate("takenTests")
      .populate("createdTests");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const eligibleTests = user.eligibleTests.map((test) => test._id);
    const testTaken = user.takenTests.map((test) => test._id);
    const createdTests = user.createdTests.map((test) => test._id);
    res.json({
      eligibleTests,
      testTaken,
      createdTests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports.getParticularTest =  async (req, res) => {
  try {
    const testId = req.params.testId;
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: "Invalid Test ID" });
    }
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const isAuthorized = await isUserAuthorized(userId, testId);
    if (!isAuthorized) {
      return res.status(403).json({ error: "Unauthorized access to the test" });
    }
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }
    res.json(test);
  } catch (error) {
    console.error("Error fetching test details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


