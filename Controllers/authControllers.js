const mongoose = require("mongoose");
const User = require("../DbModels/UserModel");
const jwt = require("jsonwebtoken");
const cookie = require("cookies");
const cookieParser = require("cookie-parser");
const DayinMin = 24 * 60 * 60;
const secret = "Secret1234";

function tokenize(id) {
  return jwt.sign({ id }, secret, {
    expiresIn: 3 * DayinMin,
  });
}

function HanddleError(err) {
  const returnmessage = {};
  if (err.errors) {
    const errobjects = Object.values(err.errors);
    for (const iterator of errobjects) {
      const p = iterator.properties;
      returnmessage[p.path] = p.message;
    }
  }

  if (err.code == 11000) {
    returnmessage["duplicate"] = "This Email is already registered";
  }
  console.log(err.code);
  return returnmessage;
}
function HanddleError2(err) {
  if (err.message === "Incorrect Email") {
    return { error: "Incorrect Email" };
  }
  return { error: "Incorrect Password" };
}
async function addPublicTestsToUser(userId) {
  try {
    const publicTests = await Test.find({ access: 'Public' });
    await User.findByIdAndUpdate(userId, { $addToSet: { eligibleTests: { $each: publicTests.map(test => test._id) } } });
    return true;
  } catch (error) {
    console.error('Error adding public tests to user:', error);
    return false;
  }
}
module.exports.signup = async (req, res) => {
  const UserDetail = req.body;
  try {
    const user = await User.create(UserDetail);
    const token = tokenize(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    await addPublicTestsToUser(user._id)
    res.json({ msg: "You Are Sucessfully Registered" });
  } catch (error) {
    // const Error =
    const Error = HanddleError(error);
    res.json({ Error });
  }
};


module.exports.login = async (req, res) => {
  const body = req.body;
  const Email = body.Email;
  const Password = body.Password;
  try {
    const p = await User.login(Email, Password);
    if (p === "LoggedIn") {
      res.json({ msg: "You Are Already LoggedIn In One Device" });
      return;
    }
    const token = tokenize(p._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ msg: "You are logged in" });
  } catch (error) {
    const ErrorMsg = HanddleError2(error);
    res.status(400).json({ ErrorMsg });
    console.log(error);
  }
};
module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, secret);

    const user = await User.findOneAndUpdate(
      { _id: decoded.id },
      { $set: { LoggedIn: false } },
      { new: true }
    );

    if (user) {
      res.cookie("jwt", "", { expires: new Date(0), httpOnly: true });
      return res.json({ message: "Logout successful" });
    } else {
      return res.status(404).json({ error: "User not found or already logged out" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.secret = secret;