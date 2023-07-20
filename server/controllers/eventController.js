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
//consoe.log(Location)
const InitController = require('../controllers/initController');
const fs = InitController.fs;
const xml2js = InitController.xml2js;
const DOWNLOAD_DIR = InitController.DOWNLOAD_DIR;
const file_name = InitController.file_name;
const locationid = InitController.locationid;

EventDeleteAll = async (req, res) => {
    Event.deleteMany({
    }).then(()=>{
        res.send("delete all event")
        return;
    },error=>{
        res.contentType('text/plain')
        res.send(error);
        return;
    })
}

function filterevent(eventlist,locationid, data){
    var e = data//JSON.parse(data)
    var alleventlist = e.events.event;
    let i=0;
    eventlist = [];
    alleventlist.forEach(element => {
        if(locationid.includes(Number(element.venueid)))
        {        
            //console.log(element.predateE)            
            if(element.desce[0]=='')
                desc = "no description";
            else
                desc = element.desce[0]; 
            if(element.pricee[0]=='')
                p = "0";
            else
                p = element.pricee[0];            
            present = element.presenterorge[0]
            tit = element.titlee[0]            
            eventlist.push({eventId:Number(element.$.id), title:tit, datetime:element.predateE[0], description:desc,venue:Number(element.venueid), presenter:present, price:p })
            i++;
        }
    });
    //console.log(eventlist[0]);    
    //console.log(i);
    return eventlist;
    //console.log(eventlist);
  }

EventCreate = async (req, res) =>{
    var fileData = fs.readFileSync(DOWNLOAD_DIR+file_name, 'utf8');
    var parser = new xml2js.Parser();
    parser.parseString(fileData.substring(0, fileData.length),
    function (err, result) {

        var eventlist = []
        eventlist = filterevent(eventlist, locationid, result)
        var query = Event.find({});
        query.select("eventId");
        query.exec().then(results=>{
            if(results.length == 0)
            {
                let last = eventlist.length;
                let i=0;
                eventlist.forEach(element => {
                    var query2 = Location.findOne({locId:element.venue});
                    query2.select("_id");
                    query2.exec().then(location=>{
                        Event.create({
                            eventId:element.eventId,
                            title:element.title,
                            datetime:element.datetime,                            
                            description:element.description,
                            venue:location._id,
                            presenter:element.presenter,
                            price:element.price                
                        }).then(()=>{
                            i++;
                            //console.log(i)
                            //console.log(element);                            
                            if(i==last)
                            {
                                res.send("finish creating event")
                                return;
                            }
                        },error => {
                            //console.log(i);
                            //console.log("inerror 1")
                            res.contentType('text/plain')
                            //console.log(error)
                            res.send(error)
                            return;
                        })
                        
                    },error => {
                        res.contentType('text/plain')
                        res.send(error)
                        return;
                    })
                });
            }else
            {
                res.send("have already create event before");
                return;
            }

        },error => {
            res.contentType('text/plain')
            res.send(error)
            return;
        })
        //var response = JSON.stringify(eventlist);
        //res.send(response)
    }); 
}

EventCheck = async (req, res) =>{
    var query = Event.find({});
    query.select('-_id eventId title datetime description venue presenter price').populate('venue', '-_id locId name latitude longitude');
    query.exec().then(results =>{
        if(results.length==0)
        {
            res.send("no event");
            return;
        }
        else
        {
            res.contentType('text/plain')            
            var response = JSON.stringify(results, null, "\t")            
            res.send(response);
            return;
        }
    },error => {
        res.contentType('text/plain')
        res.send(error)
        return;
    });
}

EventCheckByLoc = async (req, res) =>{
    let locId = req.params['locId'];
    let loc = await Location.findOne({locId: locId});
    let locIdToFind = loc._id;
    var query = Event.find({venue: locIdToFind});
    query.select('-_id eventId title datetime description venue presenter price');
    query.exec().then(results =>{
        if(results.length==0)
        {
            res.send("no event");
            return;
        }
        else
        {
            res.contentType('text/plain')            
            var response = JSON.stringify(results, null, "\t")            
            res.send(response);
            return;
        }
    },error => {
        res.contentType('text/plain')
        res.send(error)
        return;
    });
}

EventCreateOne = async (req, res) =>{
    var query = Event.find();
    query.sort({eventId:-1}).select({eventId:1}); // sort desc, select eventId
    query.exec().then(listofeventid =>{
      var neweid
      if(listofeventid.length==0) // nothing in Event
        neweid = 1;
      else  
        neweid = listofeventid[0].eventId +1;  // as desc , 0 => the first one => the largest
      return neweid;
    }, error => {
        res.contentType('text/plain')
        res.send(error)
        return;
    }).then(neweventId =>{
        var query2 = Location.findOne({locId: parseInt(req.body['locId'])});
        query2.select("_id");
        query2.exec().then(location=>{
            if (location == null) {
                res.contentType('text/plain')
                res.send('location not exist');// return url of the event
                return;
            }
            Event.create({
                eventId:neweventId,
                title:req.body['title'],
                datetime:req.body['datetime'],
                description:req.body['description'],
                venue:location._id,
                presenter:req.body['presenter'],
                price:req.body['price']                
            }).then(()=>{
                res.contentType('text/plain')
                res.send("receive from and create event")
                return;
            },error => {
                res.contentType('text/plain')
                res.send(error)
                return;
            })

        },error => {
            res.contentType('text/plain')
            res.send(error)
            return;
        })    
    })
}

EventDeleteOne = async(req,res) =>{
    var query = Event.deleteOne({ eventId: req.body['eventId'] });
    query.exec().then(()=>{
        res.contentType('text/plain')
        res.send("receive and delete event")
        return;
    },error => {
        res.contentType('text/plain')
        res.send(error)
        return;
    })   
}

EventUpdate = async(req,res) => {
    var query = Location.findOne({ locId: req.body['locId'] });
    
    query.select("_id");
    query.exec().then(result =>{
        if (result == null) {
            res.contentType('text/plain')
            res.send('location not exist');// return url of the event
            return;
        }
        Event.findOneAndUpdate({ eventId: req.body['eventId'] }, {
            title: req.body['title'],
            venue: result._id,
            datetime: req.body['datetime'],
            description: req.body['description'],
            presenter: req.body['presenter'],
            price: req.body['price']
        }).exec().then(()=> {
                res.contentType('text/plain')
                res.send('receive and update event');// return url of the event
                return;
                
        }, err => {
            res.contentType('text/plain')
            res.send(err)
            return;
        })
      
    },error => {
      //console.log("erro 1")
      res.contentType('text/plain')
      res.send(error)
      return;
    })
}

module.exports = {
    EventDeleteAll,
    EventCreate,
    EventCheck,
    EventCreateOne,
    EventDeleteOne,
    EventUpdate,
    EventCheckByLoc
}