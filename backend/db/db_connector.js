const Pool = require("pg").Pool;
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "courses",
    password: "1162",
    port: 5432,
});

/**
 * Add new user :
this function must receive a user object and includes a name password and email
you should hash the password before saving it
using insert statement in SQL add a new user and return the user
if there are errors return an empty user = null
*/
const createUser = (req, res) => {
    var fullname = req.body.fullName;
    var email = req.body.email;
    var password = req.body.password;

    const saltRounds = 10

    bcrypt
        .hash(password, saltRounds)
        .then(hash => {
            var user = {
                'name': fullname,
                email,
                'password': hash
            }
            if (getUserByEmail(user.email) != null) {
                pool.query(
                    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [user.name, user.email, user.password],
                    (error, results) => {
                        if (error) {
                            throw error;
                        }
                        res.send(user)
                    }
                );
            } else {
                res.status(403).send("User already exists")
            }

        })
        .catch(err => console.error(err.message))
        // Hash password

};

// Get user by email
// this function receives an email as an argument and returns a user object
const getUserById = async(id) => {
    return await pool.query("SELECT * FROM users WHERE user_id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        return results.rows;
    });
};

// Get user by id
// this function receives an id as an argument and returns a user object
const getUserByEmail = async(email) => {
    return new Promise(function(resolve, reject) {
        pool.query("SELECT * FROM users WHERE email = $1", [email], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.rows[0]);
        })
    });
};

const getUserEnrollment = async(id) => {
    return new Promise(function(resolve, reject) {
        pool.query("SELECT c.course_id, c.name, u.user_id, c.subject_id FROM courses c INNER JOIN users u ON C.user_id = u.user_id WHERE u.user_id = $1 ", [id], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.rows);
        })
    });
};

// Sign up for a course
// this function adds a new row to the courses table
// each course must have exactly 22 students in the same course (id and name)
// else add a new row with a new course name and a new course id
// the function receives a userid and subject name
// write an SQL statement to locate the subject id from the subject table and
// add a new row based on the id that you received from the statement
const signUpForACourse = async(userid, subjectName) => {
    await pool.query(
        "SELECT FROM subjects WHERE subject = $1", [subjectName],
        (error, results) => {
            if (error) {
                throw error;
            }
            var subjectId = results.rows[0].id;

            pool.query("SELECT * FROM courses where subject_id = $1", [subjectId], (err, studentCount) => {
                if (error) {
                    throw errow
                }

                if (studentCount.rows.length < 21) {
                    return new Promise(function(resolve, reject) {
                        pool.query("INSERT INTO courses (user_id, subject_id, name) VALUES ($1, $2, $3)", [userid, subjectId, subjectName], (err, result) => {
                            if (err)
                                return reject(err);
                            resolve(result.rows[0]);
                        })
                    });
                } else {
                    return new Promise(function(resolve, reject) {
                        pool.query("INSERT INTO courses (user_id, subject_id, name) VALUES ($1, $2, $3)", [userid, subjectId, subjectName + " i"], (err, result) => {
                            if (err)
                                return reject(err);
                            resolve(result.rows[0]);
                        })
                    });
                }
            })


        }
    );
};

// Delete user course
// the function receives a userid and subject name
// write an SQL statement to locate the subject id from the subject table and
// delete the row from the subject table using the delete statement
//  */
const deleteSubject = async(userid, subjectname) => {
    pool.query(
        "SELECT FROM subjects WHERE name = $1", [subjectname],
        (error, results) => {
            if (error) {
                throw error;
            }
            var subjectId = results.rows[0].id;
            pool.query(
                "DELETE FROM courses WHERE user_id = $1 and subject_id = $2", [userid, subjectId],
                (error, results) => {
                    if (error) {
                        throw error;
                    }
                    res.send(results);
                }
            );
        }
    );
};


const getSubjects = () => {
    return new Promise(function(resolve, reject) {
        pool.query("SELECT * FROM subjects ", (err, result) => {
            if (err)
                return reject(err);
            resolve(result.rows);
        })
    });
};


module.exports = {
    getUserById,
    getUserByEmail,
    signUpForACourse,
    deleteSubject,
    createUser,
    getSubjects,
    getUserEnrollment
};