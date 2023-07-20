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

//const User = require('../db/models/locationSchema');
const fs = require('fs');
const https = require('https');//For accessing https url we need this module instead of http.
const xml2js = require('xml2js');//Required for xml parsing.
const file_name = 'data.xml'//This will be the name of file we will be generating.
const file_name2 = 'data2.xml'
const DOWNLOAD_DIR =__dirname+'/';
var locationid = [3110031, 36310035, 50110014, 76810048, 87210045, 87310051, 87410030, 87510008, 87616551, 87810041];

function download(url, filename, cb) {
    var file_url= url;
    var file =fs.createWriteStream(DOWNLOAD_DIR +filename,{'flags': 'w'});
    const request = https.get(file_url, function(response) {                    
        response.pipe(file);
        //response.pipe(file).on('close', callback);
        file.on("finish", () => {
            file.close(cb);
            //console.log("Download Completed");
        });
    });
}


LocationidInit = (req, res) =>{    
    download('https://www.lcsd.gov.hk/datagovhk/event/events.xml', file_name);    
    download('https://www.lcsd.gov.hk/datagovhk/event/venues.xml', file_name2);  
    var fileData = fs.readFileSync(DOWNLOAD_DIR+file_name2, 'utf8');
    var fileData2 = fs.readFileSync(DOWNLOAD_DIR +file_name, 'utf8');
    var parser = new xml2js.Parser();
    parser.parseString(fileData.substring(0, fileData.length),
    function (err, result) {
        //console.log(result)//Here you will get data in json format.
        var venuelist = result.venues.venue;
        venueid = []
        venuelist.forEach(element => {
            //console.log(Number(element.latitude))
            if(Number(element.latitude)!=0)
                venueid.push({locId:Number(element.$.id), eventNum: 0})
        });
        //console.log(venueid.length);
        var parser2 = new xml2js.Parser();
        parser2.parseString(fileData2.substring(0, fileData2.length),
        function (err, result) {
            var ev_list = result.events.event;
            ev_list.forEach(element => {
                venueid.forEach(e => {                    
                    if(Number(element.venueid)== e.locId)
                    {                        
                        e.eventNum++;
                    }
                });                
            });
            newvenueid = []
            venueid.forEach(element => {
                if(element.eventNum >= 3) newvenueid.push(element)                
            });                    
            newvenueid.sort((a, b) => parseFloat(b.eventNum) - parseFloat(a.eventNum));            
            locationid = []            
            for(let i=0; i<10; i++)
            {
                locationid.push(newvenueid[i].locId)             
            }
            res.send("init success")
            return;
        }); 
    }); 
}



module.exports = {
    LocationidInit,
    locationid,
    fs,
    https,
    xml2js,
    file_name,
    file_name2,
    DOWNLOAD_DIR
}