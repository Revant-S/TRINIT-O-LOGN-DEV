const mongoose = require("mongoose");
const Test = require("../DbModels/TestPaperModel");
const User = require("../DbModels/UserModel");
const { secret } = require("../Controllers/authControllers");
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
    const isAuthorized =
      user.takenTests.includes(testId) || user.eligibleTests.includes(testId);
    return isAuthorized;
  } catch (error) {
    console.error("Error checking user authorization:", error);
    return false;
  }
}

module.exports.createTest = async (req, res) => {
  const body = req.body;
  let resObj = {};
  const token = req.cookies.jwt;
  const decodedToken = jwt.verify(token, secret);
  const userId = decodedToken.id;
  try {
    const document = await Test.create(body);
    if (document.access === "Public") {
      const given = await giveTestToAll(document);
      resObj = given;
    } else {
      await User.updateOne(
        { _id: userId },
        { $addToSet: { eligibleTests: document._id } }
      );
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

module.exports.getParticularTest = async (req, res) => {
  try {
    const testId = req.params.testId;
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: "Invalid Test ID" });
    }
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, 'your-secret-key'); // Replace with your secret key
    const userId = decodedToken.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const isAuthorized = await isUserAuthorized(userId, testId);
    if (!isAuthorized) {
      return res.status(403).json({ error: "Unauthorized access to the test" });
    }
    const test = await Test.findById(testId)
      .populate({
        path: 'comments.userId',
        select: 'FirstName LastName', // Include only the required fields
      })
      .exec();
    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }
    res.json(test);
  } catch (error) {
    console.error("Error fetching test details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.upVotes = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.decode(token, secret);
    const userId = decodedToken.id;
    const response = req.body.response;
    const testId = req.body.testId;
    const user = await User.findById(userId);
    if (user.upvotedTests.includes(testId)) {
      return res
        .status(400)
        .json({ error: "You've already voted on this test." });
    }
    let updateField;
    if (response === "upvote") {
      updateField = {
        $inc: { upvotes: 1 },
        $addToSet: { upvotedTests: testId },
      };
    } else if (response === "downvote") {
      updateField = { $inc: { downvotes: 1 } };
    } else {
      return res
        .status(400)
        .json({ error: "Invalid response. Use 'upvote' or 'downvote'." });
    }
    const updatedTest = await Test.findByIdAndUpdate(testId, updateField, {
      new: true,
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { upvotedTests: testId },
    });

    res.json({ message: "Vote recorded successfully", updatedTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.comment = async (req, res) => {
  const { testId } = req.body;
  const { text } = req.body;
  const token = req.cookies.jwt;
  const decodedToken = jwt.decode(token, secret);
  const userId = decodedToken.id;

  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }
    test.comments.push({ userId, text });
    await test.save();

    return res
      .status(201)
      .json({ message: "Comment added successfully", test });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error adding comment: ${error.message}` });
  }
};

module.exports.AddAnalytics = async (req, res) => {
  try {
    const {
      userId,
      testId,
      marksScored,
      totalMarks,
      percentage,
      rank,
      totalTimeTaken,
      totalTimeAllocated,
      numQuestionsAttempted,
      unattemptedQuestions,
      incorrectAttempts,
      correctAttempts,
    } = req.body;
    const analyticsEntry = await Analytics.create({
      userId,
      testId,
      marksScored,
      totalMarks,
      percentage,
      rank,
      totalTimeTaken,
      totalTimeAllocated,
      numQuestionsAttempted,
      unattemptedQuestions,
      incorrectAttempts,
      correctAttempts,
    });
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    user.takenTests.push(testId);
    user.eligibleTests = user.eligibleTests.filter(
      (eligibleTestId) => eligibleTestId.toString() !== testId.toString()
    );
    const updatedUser = await user.save();
    res.json({ success: true, data: { analyticsEntry, updatedUser } });
  } catch (error) {
    console.error("Error adding analytics and updating user:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


module.exports.getAnalysis = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.decode(token, secret);
    const userId = decodedToken.id;
    const { testId } = req.params;
    const analyticsData = await Analytics.findOne({ userId, testId });
    if (!analyticsData) {
      return res.status(404).json({ success: false, error: 'Analytics data not found' });
    }

    res.json({ success: true, data: analyticsData });
  } catch (error) {
    console.error('Error getting analytics data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}