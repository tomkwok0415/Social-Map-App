 /**
* CSCI2720/ESTR2106 Course Project
* A Social Map of Events
*
* We declare that the assignment here submitted is original
* except for source material explicitly acknowledged,
* and that the same or closely related material has not been
* previously submitted for another course.
* We also acknowledge that we are aware of University policy and
* regulations on honesty in academic work, and of the disciplinary
* guidelines and procedures applicable to breaches of such
* policy and regulations, as contained in the website.
*
* University Guideline on Academic Honesty:
*   http://www.cuhk.edu.hk/policy/academichonesty
* Faculty of Engineering Guidelines to Academic Honesty:
*   https://www.erg.cuhk.edu.hk/erg/AcademicHonesty
*
* Student Name: Chow Pak Ho, Kwok Ho Cheung, Lai Chak Yan, Leung Wai Pan, Mak Tsz Ho
* Student ID  : 1155144753,1155136168,1155144577,1155144757,1155141820
* Date        : 17/12/2022
*/ 
const session = require('express-session');
const { validate } = require('../db/models/userSchema');
const User = require('../db/models/userSchema');
const crypto = require('crypto');

createUser = async (req, res) => {
    let parmUsername = req.body['username'];
    let parmPassword = req.body['password'];

    if ((parmUsername === null||parmUsername === undefined) || (parmPassword === null||parmPassword === undefined)) {
        res.
        send('missing field');
        return;
    }

    if ((parmUsername >20 ||parmUsername <4) || (parmPassword >20 ||parmPassword <4)) {
        res.
        send('Wrong format in either username or password');
        return;
    }

    let isAdmin = false;
    if (parmUsername === "admin" && parmPassword === "admin") {
        isAdmin = true;
    }

    parmPassword = crypto.createHash('sha256').update(parmPassword).digest('base64');

    let lastUser = await User.find({}).sort({userId: -1}).limit(1);
    let lastUserId = 0;
    if (lastUser.length > 0) {
        lastUserId = lastUser[0].userId;
    }


    User.create({
        userId: lastUserId+1,
        username: parmUsername,
        password: parmPassword,
        favouriteLoc: [],
        isAdmin: isAdmin
    }, (err, user) => {
        if (err) {
            console.log(err);
            res
            .status(501)
            .type('text/pain')
            .send("database error");
            return;
        }
        //console.log(user);
        if (user !== null && user !== undefined) {
            res
            .status(201)
            .send(user);
            return;
        }
        res
        .status(300)
        .send('user creation error');
    });
}

verifyUser = async (req, res) => {
    let parmUsername = req.body['username'];
    let parmPassword = req.body['password'];

    if ((parmUsername === null||parmUsername === undefined) || (parmPassword === null||parmPassword === undefined)) {
        res.
        send('missing field');
        return;
    }

    parmPassword = crypto.createHash('sha256').update(parmPassword).digest('base64');

    User
    .findOne({username: parmUsername, password: parmPassword})
    .exec((err, user) => {
        if (err) {
            console.log(err);
            res
            .status(501)
            .type('text/pain')
            .send("database error");
            return;
        }
        if (user !== null && user !== undefined) {
            req.session.username = user.username;
            req.session.userId = user.userId;
            req.session.isAdmin = user.isAdmin;
            
            let result = {
                status: 1,
                result: user,
            }

            res
            .status(201)
            .send(result);
            return;
        }
        let result = {
            status: -1,
            result: 'wrong username or password'
        }
        res
        .status(200)
        .send(result);
    })
}

logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        
        let result = {
            status: 1,
            result: 'logout successfully'
        }
        res
        .send(result);
    });
}

validateUser = (req, res) => {
    if (req.session.username) {
        let result = {
            status: 1,
            result: {
                username: req.session.username,
                isAdmin: req.session.isAdmin,
            }
        };

        res
        .send(result);
        return;
    }

    let result = {
        status: -1,
        result: 'invalid session'
    }
    res
    .send(result);
}

module.exports = {
    createUser,
    verifyUser,
    logoutUser,
    validateUser,
}