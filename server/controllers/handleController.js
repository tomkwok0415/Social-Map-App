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
const Event = require('../db/models/eventSchema');
const Location = require('../db/models/locationSchema');
const User = require('../db/models/userSchema');
const Comment = require('../db/models/commentSchema');

//consoe.log(Location)
const InitController = require('./initController');
const fs = InitController.fs;
const xml2js = InitController.xml2js;
const DOWNLOAD_DIR = InitController.DOWNLOAD_DIR;
const file_name = InitController.file_name;
const locationid = InitController.locationid;

//getAllCommentByEventId = 

addNewComment = async (req,res) =>{
    console.log(req.body['commentcontent'])
    // req.body['locID'];
    // req.body['userId'];
    // req.body['commentcontent'];
    var query = User.findOne({userId:Number(req.session.userId)});
    query.select("_id");
    query.exec().then(user=>{
        Comment.create({
            commentcontent: req.body['commentcontent'],
            userId:user._id,
            username: req.session.username,
            commentdatetime: new Date()
        }).then(()=>{
            var query2 = Comment.findOne({userId:user._id, commentcontent: req.body['commentcontent']})
        //});
            query2.select("_id");
            query2.exec().then(result=>{
                    //var query3 = Location.findOne();
                    var query3 = Location.findOne({locId:Number(req.body['locId'])})
                    query3.select("comments");
                    query3.exec().then(result2=>{
                        console.log(typeof result2);
                        console.log(typeof result2.comments);
                        result2.comments.push(result._id)
                        Location.findOneAndUpdate({locId:Number(req.body['locId'])},{
                        comments: result2.comments
                        }).then(()=>{
                            res.contentType('text/plain')
                            res.send("comment create and update success")
                            
                        },error => {
                            console.log("error 1")
                            res.contentType('text/plain')
                            res.send(error)
                            return;
                        })
                    },error => {
                        console.log("error 2")
                        res.contentType('text/plain')
                        res.send(error)
                        return;
                    })
                         
            },error => {
                console.log("error 3")
                res.contentType('text/plain')
                res.send(error)
                return;
            })     
        },error => {
            console.log("error 4")
            res.contentType('text/plain')
            res.send(error)
            return;
        })
    },error => {
        console.log("error 5")
        res.contentType('text/plain')
        res.send(error)
        return;
    })        
}

module.exports = {
    addNewComment
}