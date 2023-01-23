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

const createUser = (req, res) => {
    const fullname = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;

    const saltRounds = 10

    bcrypt
        .hash(password, saltRounds)
        .then(hash => {
            const user = {
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


const getUserById = async(id) => {
    return await pool.query("SELECT * FROM users WHERE user_id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        return results.rows;
    });
};


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


const signUpForACourse = async(userid, subjectName) => {
    await pool.query(
        "SELECT FROM subjects WHERE subject = $1", [subjectName],
        (error, results) => {
            if (error) {
                throw error;
            }
            const subjectId = results.rows[0].id;

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


const deleteSubject = async(userid, subjectname) => {
    pool.query(
        "SELECT FROM subjects WHERE name = $1", [subjectname],
        (error, results) => {
            if (error) {
                throw error;
            }
            const subjectId = results.rows[0].id;
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