const {Router} = require("express")
const authControllers = require("../Controllers/authControllers")
const router = Router()

// Student Signup
router.post("/signup",authControllers.signup)
//student login
router.post("/login",authControllers.login)
router.post("/logout",authControllers.logout)

module.exports = router