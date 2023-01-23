const express = require('express');
const db = require("../db/db_connector")
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send({ title: 'Express' });
});

router.get("/subjects", (req, res) => {
    const user_id = req.query.id;

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
    const userid = req.body.userid;
    const subjectName = req.body.subjectName;
    db.signUpForACourse(userid, subjectName).then(enrollment => {
        res.send({ enrollment })
    })
})

module.exports = router;