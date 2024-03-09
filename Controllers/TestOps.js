const mongoose = require("mongoose");
const Test = require("../DbModels/TestPaperModel");
const User = require("../DbModels/UserModel");
const jwt = require("jsonwebtoken");
const cookie = require("cookies");
const cookieParser = require("cookie-parser");
async function giveTestToAll(document) {
    const testId = document._id;
    try {
        await User.updateMany({}, { $addToSet: { eligibleTests: testId } });
        return true;
    } catch (error) {
        return false
    }

}


module.exports.createTest = async (req,res)=>{
    const body = req.body;
    let resObj={};
    try {
        const document = await Test.create(body);
        if (document.access === "Public") {
            const given = await giveTestToAll(document);
            resObj = given;
        }
        resObj.testStatus = "Test Made Sucessfully!";
        res.json({resObj});
    } catch (error) {
        res.json({msg : "some error occured"});
    }
}

module.exports.getTests = async (req,res)=>{
    try {
        const token = req.cookies.jwt;  
        const decodedToken = jwt.verify(token, 'your_secret_key'); 
        const userId = decodedToken.userId;
        const user = await User.findById(userId)
          .populate('eligibleTests')
          .populate('takenTests')
          .populate('createdTests');
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const eligibleTests = user.eligibleTests.map(test => test._id);
        const testTaken = user.takenTests.map(test => test._id);
        const createdTests = user.createdTests.map(test => test._id);
        res.json({
          eligibleTests,
          testTaken,
          createdTests
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}