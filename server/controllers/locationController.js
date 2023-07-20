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

const Location = require('../db/models/locationSchema');
//console.log(Location)
const InitController = require('./initController');
const fs = InitController.fs;
const xml2js = InitController.xml2js;
const DOWNLOAD_DIR = InitController.DOWNLOAD_DIR;
const file_name2 = InitController.file_name2;
const locationid = InitController.locationid;

LocationDeleteAll = async (req, res) =>{
    Location.deleteMany({
    }).then(()=>{
        res.send("delete all location")
        return;
    },error=>{
        res.contentType('text/plain')
        res.send(error);
    })
}

function filterlocation(locationlist, locationid, data){     

    //var e = JSON.parse(data)     
    //console.log(locationid)
    var e = data
    var alllocationlist = e.venues.venue;     
    let i=0;
    locationlist = [];     
    //console.log(alllocationlist.length);
    alllocationlist.forEach(element => {
        //if(i==13) console.log(element);         
        let t = Number(element.$.id);      
        //console.log("id:"+t+" i:" + i + " target:" +locationid[i])   
        if(locationid.includes(t))
        {                         
            locationlist.push({locId:Number(element.$.id), name:element.venuee[0], latitude:Number(element.latitude), longitude:Number(element.longitude) })             
            i++;
        }         
    });  
    //console.log(i)
    //console.log(locationlist);   
    return locationlist; 
 }

 LocationCreate = async (req, res) =>{
    var fileData = fs.readFileSync(DOWNLOAD_DIR+file_name2, 'utf8');
    var parser = new xml2js.Parser();
    parser.parseString(fileData.substring(0, fileData.length),
    function (err, result) {
        var locationlist = []
        locationlist = filterlocation(locationlist, locationid, result)
        
        var query = Location.find({});
        query.select("locId");
        query.exec().then(results=>{
            if(results.length==0)
            {
                //res.send("testing");
                let i=0;
                let last = locationlist.length
                locationlist.forEach(element => {
                                                            
                    Location.create({
                        locId : element.locId,
                        name : element.name,
                        latitude: element.latitude,
                        longitude: element.longitude,
                        Comment: []
                    }).then(()=>{                        
                        i++
                        //console.log(i);
                        if(i==last)
                        {
                            res.send("finish create location");
                            return;
                        }
                    },(err, e) => {
                        if (err)
                        { 
                            //console.log("error 2");
                          res.send(err);
                        }
                        else
                          res.send("Ref: " + e);
                    });
                });
                //res.send("finish creating")
            }
            else
            {         
                res.send("have already create location");
                return;
            }
        },(err, e) => {
            if (err)
            {    
            //console.log("error 1");
              res.send(err);
            }
            else
              res.send("Ref: " + e);
        });
    }); 
}

LocationDeleteOne = async (req, res) =>{
    Location.deleteOne({ locId: req.params['locId'] }).then(() =>{      
        res.contentType('text/plain');
        res.send("event delete successfully"); //204 NO Cotent => send meassage cannot see "event delete successfully"
        return;
      }, error => {
          res.contentType('text/plain')
          res.send(error);
      })
}

LocationFindAll = async (req, res) =>{
    var query = Location.find({});
    query.select('-_id locId name latitude longitude').populate('comments', '-_id userId username commentcontent commentdatetime');
    query.exec().then(results=>{    
        
      //if (results == null) {
      if (results.length == 0) {
        res.contentType('text/plain')
        res.status(404).send("no location");
        return;
      }else {
          res.contentType('text/plain')
          //console.log(results);
          var response = JSON.stringify(results, null, "\t")            
          res.status(200).send(response);
          return;
      } }, error => {
      res.contentType('text/plain')
      res.send(error)
      return;
    },error => {
      res.contentType('text/plain')
      res.send(error)
      return;
    })
}

LocationFinadOne = async (req, res) =>{
    var query = Location.findOne({locId:req.params['locId']});
    query.select('-_id locId name latitude longitude').populate('comments', '-_id userId username commentcontent commentdatetime');;
    query.exec().then(results=>{            
      //if (results == null) {
      if (results == null) {
        res.contentType('text/plain')
        res.status(404).send("no location");
        return;
      }else {
          res.contentType('text/plain')
          //console.log(results);
          var response = JSON.stringify(results, null, "\t")            
          res.status(200).send(response);
          return;
      } }, error => {
      res.contentType('text/plain')
      res.send(error)
      return;
    },error => {
      res.contentType('text/plain')
      res.send(error)
      return;
    })
}


module.exports = {
    LocationDeleteAll,
    LocationCreate,
    LocationDeleteOne,
    LocationFindAll,
    LocationFinadOne
}