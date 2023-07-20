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
import React from 'react';
import ReactDOM from 'react-dom/client';
import Table from 'react-bootstrap/Table';
import SearchInput, {createFilter} from 'react-search-input'
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useMatch, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useLoadScript, GoogleMap, MarkerF, OverlayView } from '@react-google-maps/api';
import axios from 'axios';
import { ListGroup, Row, Col, Container, Button, Badge } from 'react-bootstrap';


export default function SingleMap() {
    const [Comment, setComment] = useState("");

    let marker1 = [{
      _id:0
    }];
  
    //defining parameter
    const previous = useLocation();
    let name = previous.state.name;
    let lat = previous.state.lat;
    let lng = previous.state.lng;
    let label = previous.state.label;
    let id = previous.state.id;
    let comments = previous.state.comments;
  
    //use for storing database
    const [Event, setEvent] = useState([]);
    const [Location, setLocation] = useState([]);
  
    const center = useMemo(() => ({ lat:lat, lng:lng}));
    // const box = ({lat: 22.391810, lng: 113.976771});
    const { isLoaded } = useLoadScript({
      googleMapsApiKey : "YOURS_KEY_HERE"
    });
  
    

    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = async () => {
        setLoading(true);
        axios.get(`http://localhost:8000/api/checkevent/${id}`,{
        }).then(
        (result, err)=> {
            console.log(result.data)
            setEvent(result.data)
        }
        );

        axios.get(`http://localhost:8000/api/location/${id}`,{
        }).then(
        (result, err)=> {
            console.log(result.data)
            setLocation(result.data)
        }
        );
        setLoading(false);
    }

    if (!isLoaded || loading) {
        return <p>
            loading
        </p>
    }

    let addFavLoc = async () => {
        const data = {
            locId: id,
        }
        try {
            await axios({
            method: "post",
            withCredentials: true,
            url: `http://localhost:8000/api/user/loc`,
            data: data
            }).then(({data})=>{
                if (data.status == 1) {
                    alert("added to fav location!!!");
                }
            });
        } catch(error) {
            //console.log(error)
        }
    };

    let addComment = async () => {
        const data = {
            locId: id,
            commentcontent: Comment
        }

        try {
            await axios({
            method: "post",
            withCredentials: true,
            url: `http://localhost:8000/api/addcomment`,
            data: data,
            }).then(({data})=>{
                console.log(data)
                //navigate("/admin/event");
            });
        } catch(error) {
            //console.log(error)
        }
    };

  console.log(Event)
  
    return (
          <div>
            <Container>
                <Row>
                    <Col sm={9}></Col>
                    <Col sm={3}>
                    <Button onClick={addFavLoc}>
                        Add to favourite location
                    </Button>
                    </Col>
                </Row>
            </Container>
              <h2> You are at {name} now </h2>
              <GoogleMap zoom={18} center={center} mapContainerStyle={{width:'600px', height:"600px"}}>
                    <MarkerF position={{lat: lat, lng: lng}} label={label}/>      
              </GoogleMap>
              {/* <table border = "1" className="table table-bordered text-center"> */}
              <br/>
              <Table striped bordered hover>
              <thead>
                <tr>
                  <th colSpan="100%">
                    Event
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Event id</td>
                  <td>Title</td>
                  <td>Description</td>
                  <td>DateTime</td>
                  <td>Presenter</td>
                  <td>Price</td>
                </tr>         
                {Event.length != 0? (Event.map((event, index) => (<tr><td>{event.eventId}</td><td>{event.title}</td><td>{event.description}</td><td>{event.datetime}</td><td>{event.presenter}</td><td>{event.price}</td></tr>))) : (<></>)} 
              </tbody>
            </Table>
            <br/>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <th colSpan="100%">
                    Other comments
                  </th>
                </tr>
                <tr>
                <td>Username</td>
                <td>Comment</td>
                </tr>
                  {Location.length != 0? (Location.comments.map((comment, index) => (<tr><td>{comment.username}</td><td>{comment.commentcontent}</td></tr>))) : (<></>)} 
              </tbody>
            </Table>
            <form>
              <textarea value={Comment} style={{width:"75%", height:"200px"}} onChange={(event)=>{
                  setComment(event.target.value)
                }}>
              </textarea >
              <br/>
              <Button onClick={addComment}>Push comment</Button>
            </form>        
          </div>    
    );
  }
