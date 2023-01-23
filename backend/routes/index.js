var express = require('express');
var db = require("../db/db_connector")
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send({ title: 'Express' });
});

router.get("/subjects", (req, res) => {
    var user_id = req.query.id;

    db.getUserEnrollment(user_id)
        .then((userEnrollment) => {
            console.log("user", userEnrollment);
            db.getSubjects().then(subjects => {
                res.send({ subjects, userEnrollment })
            }).catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/enrollemnt", (req, res) => {
    var userid = req.body.userid;
    var subjectName = req.body.subjectName;
    db.signUpForACourse(userid, subjectName).then(enrollment => {
        res.send({ enrollment })
    })
})

module.exports = router;