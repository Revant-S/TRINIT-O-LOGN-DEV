const mongoose = require("mongoose");
const zod = require("zod");
const bcrypt = require("bcrypt");

const EmailScheme = zod.string().email();

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: String,
    Email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            (value) => EmailScheme.safeParse(value).success,
            "Please enter a valid email address",
        ],
    },
    Age: {
        type: Number,
        required: true,
        min: [1, "Age must be a positive number"],
    },
    Gender: {
        type: String,
        required: true,
        lowercase: true,
    },
    Mobile: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        minlength: [10, "Password must be at least 10 characters long"],
        required: true,
    },
    LoggedIn: {
        type: Boolean,
        default: false,
    },
    takenTests: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
        default: [],
    },
    createdTests: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
        default: [],
    },
    eligibleTests: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
        default: [],
    }
});

UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(5);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});

UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ Email: email });

    if (!user) {
        throw Error("Incorrect Email");
    }

    if (user.LoggedIn) {
        return "LoggedIn";
    }

    const auth = await bcrypt.compare(password, user.Password);

    if (auth) {
        user.LoggedIn = true;
        await user.save();
        return user;
    }

    throw Error("Incorrect Password");
};


const User = mongoose.model("user", UserSchema);

module.exports = User;
