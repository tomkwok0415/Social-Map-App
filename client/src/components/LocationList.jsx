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
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';


export default function LocationList(){

    let marker1 = [{
      locId:0
    }];
  
    const history = useNavigate();
    const click = (lat,lng,name,label,id) => {
        history(`map/${id}`, {
        state:{
          lat: lat,
          lng: lng,
          name: name,
          label: label,
          id:id
        }
      });
    }
  
    const [location, setlocation] = useState(marker1);
    const [search, setsearch] = useState("");
    const [, updateState] = useState();

    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = async () => {
        setLoading(true);
        await fetch('http://localhost:8000/api/checklocation ').then(res => res.json()).then(
            result => setlocation(result)
        ); 
        setTimeout(setLoading(false), 3000);
    }
  
    if (loading) {
        return <p>
            loading
        </p>
    }
  
    const nextChar = (c,index) =>{
      let i = (parseInt(c, 36) + index ) % 36;
      return (!i * 10 + i).toString(36);
    }
  
    const locationshow = (marker,index,search) => {
        if(search != ""){
          if(nextChar("A",index).toLowerCase().includes(search.toLowerCase()))
            return (<ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    onMouseDown={()=>click(marker.latitude,marker.longitude, marker.name,nextChar("A",index), marker.locId)} key={index} align="center" scope="col"> <td>{nextChar("A",index)} : {marker.name}</td> 
                    </ListGroup.Item>
                    );
          else if(marker.name.toLowerCase().includes(search.toLowerCase()))
            return (<ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    onMouseDown={()=>click(marker.latitude,marker.longitude, marker.name,nextChar("A",index), marker.locId)} key={index} align="center" scope="col"> <td>{nextChar("A",index)} : {marker.name}</td> 
                </ListGroup.Item>);
        }
        else
          return (<ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    onMouseDown={()=>click(marker.latitude,marker.longitude, marker.name,nextChar("A",index), marker.locId)} key={index} align="center" scope="col"> <td>{nextChar("A",index)} : {marker.name}</td> 
                </ListGroup.Item>);
      }
  
    //const forceUpdate = useCallback(() => updateState({}), []);
  
    return(
      <div>
        <label>Search Location:</label>
        <br/>
        <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search Location..."
              className="me-2"
              aria-label="Search Location..."
              onChange={(e)=>setsearch(e.target.value)}
            />
        </Form>
        <br/>
        <ListGroup defaultActiveKey="#link1">
            <ListGroup.Item href="#link1">
                All Location
            </ListGroup.Item>
            {location[0].locId? (location.map((marker, index) => (locationshow(marker,index,search)))) : (<></>)} 
        </ListGroup>
      </div>
    );
  }