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

const User = require('../db/models/userSchema');
const Location = require('../db/models/locationSchema');
const crypto = require('crypto');

findFavLocation = async (req, res) => {
    console.log("findFavLocation")
    if (req.session.userId == null) {
        let result = {
            status: -1,
            result: "not found",
        }

        res
        .status(404)
        .send(result);
        return;
    }
    User
    .findOne({userId: req.session.userId})
    .populate('favouriteLoc')
    .exec((err, user) => {
        if (err) {
            console.log(err);
            res
            .status(501)
            .type('text/pain')
            .send("database error");
            return;
        }
        console.log(user)
        if (user !== null || user !== undefined) {
            let user_deep_copy = JSON.parse(JSON.stringify(user));

            let result = {
                status: 1,
                result: user_deep_copy.favouriteLoc == null ? []:user_deep_copy.favouriteLoc,
            }
            console.log(result)
            res
            .status(200)
            .send(result);
            return;
        }

        let result = {
            status: -1,
            result: "not found",
        }

        res
        .status(404)
        .send(result);
    });
}


addFavLocation = async (req, res) => {
    let locId = req.body['locId'];
    let loc = await Location.findOne({locId: locId});
    console.log(loc);
    let locIdToAdd = loc._id;
    User
    .findOne({userId: req.session.userId})
    .exec((err, user) => {
        if (err) {
            console.log(err);
            res
            .status(501)
            .type('text/pain')
            .send("database error");
            return;
        }
        if (user !== null || user !== undefined) {
            console.log(user);
            user.favouriteLoc.push(locIdToAdd);
            user.save();

            let user_deep_copy = JSON.parse(JSON.stringify(user));

            let result = {
                status: 1,
                result: user_deep_copy,
            }
            res
            .status(200)
            .send(result);
            return;
        }
        let result = {
            status: -1,
            result: "not found",
        }

        res
        .status(404)
        .send(result);
    });
    
}

findAllUser = (req, res) => {
    User
    .find()
    //.populate('favouriteLoc')
    .exec((err, users) => {
        if (err) {
            console.log(err);
            res
            .status(501)
            .type('text/pain')
            .send("database error");
            return;
        }
        res
        .send(users);
    })
}

findUser = (req, res) => {
    let paramUserId = req.params['userId'];
    User
    .findOne({userId: paramUserId})
    //.populate('favouriteLoc')
    .exec((err, user) => {
        if (err) {
            console.log(err);
            res
            .status(501)
            .type('text/pain')
            .send("database error");
            return;
        }
        res
        .send(user);
    })
}

deleteUser = (req, res) => {
    let paramUserId = req.params['userId'];
    User
    .deleteOne({userId: paramUserId})
    //.populate('favouriteLoc')
    .exec((err, result) => {
        if (err) {
            console.log(err);
            res
            .status(501)
            .type('text/pain')
            .send("database error");
            return;
        }
        console.log(result);
        if (result !== null || result !== undefined) {
            if (result.deletedCount === 0) {
                res
                .status(404)
                .send("not found");
                return;
            }
        }
        res
        .status(204)
        .send();
    })
}

updateUser = (req, res) => {
    let paramUserId = req.params['userId'];
    let parmUsername = req.body['username'];
    let parmPassword = req.body['password'];
    let hash;

    User
    .findOne({userId: paramUserId})
    //.populate('favouriteLoc')
    .exec((err, user) => {
        if (err) {
            console.log(err);
            res
            .status(501)
            .type('text/pain')
            .send("database error");
            return;
        }

        console.log(user);
        if (user !== null || user !== undefined) {

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

            hash = crypto.createHash('sha256').update(parmPassword).digest('base64');

            user.username = parmUsername;
            user.password = parmPassword;
            user.save();

            let user_deep_copy = JSON.parse(JSON.stringify(user));

            let result = {
                status: 1,
                result: user_deep_copy,
            }
            res
            .status(200)
            .send(result);
            return;
        }

        let result = {
            status: -1,
            result: "not found",
        }

        res
        .status(404)
        .send(result);
    })
}

module.exports = {
    findAllUser,
    findUser,
    deleteUser,
    updateUser,
    addFavLocation,
    findFavLocation,
}
