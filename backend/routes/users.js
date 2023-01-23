const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db_connector");
const router = express.Router();

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.getUserByEmail(email)
        .then((user) => {
            console.log("user", user);

            // check email and password
            bcrypt
                .compare(password, user.password)
                .then((isCorrectPassword) => {
                    if (isCorrectPassword) {
                        const token = jwt.sign(email, "courses");
                        res.status(200).send({ user, token });
                    }
                })
                .catch((err) => console.error(err.message));
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/register", (req, res) => {
    db.createUser(req, res);
});

/* GET users listing. */
router.get("/", function(req, res, next) {
    res.send("respond with a resource");
});

module.exports = router;