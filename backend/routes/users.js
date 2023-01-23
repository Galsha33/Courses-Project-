var express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var db = require("../db/db_connector");
var router = express.Router();

router.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    db.getUserByEmail(email)
        .then((user) => {
            console.log("user", user);

            // check email and password
            bcrypt
                .compare(password, user.password)
                .then((isCorrectPassword) => {
                    if (isCorrectPassword) {
                        var token = jwt.sign(email, "courses");
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