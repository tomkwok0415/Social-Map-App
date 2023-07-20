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
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

export default function LocationFavList(){
    const history = useNavigate();
  
    let marker1 = [{
      locId:0
    }];
  
    const click = (lat,lng,name,id) => {
        history(`map/${id}`, {
        state:{
          lat: lat,
          lng: lng,
          name: name,
          id: id
          // label: label
        }
      });
    }
  
    const [location, setlocation] = useState([]);

    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = async () => {
        setLoading(true);
        try {
            await axios({
                method: "get",
                withCredentials: true,
                url: `http://localhost:8000/api/favloc`,
            }).then(({data})=>{
                if (data.status == 1) {
                    setlocation(data.result)
                }
            });
        } catch(error) {
            //console.log(error)
        }
        setTimeout(setLoading(false), 3000);
    }

    if (loading) {
        return <p>
            loading
        </p>
    }
  
    return(
      <div>
        <br/>
        <ListGroup defaultActiveKey="#link1">
            <ListGroup.Item href="#link1">
                Favourite Location
            </ListGroup.Item>
            {location.length != 0? (location.map((marker, index) => (<ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    onClick={() => click(marker.latitude,marker.longitude, marker.name, marker.locId)} key={index} align="center" scope="col"> <td>{marker.name}</td> 
                </ListGroup.Item>))) : (<></>)} 
        </ListGroup>
      </div>
    );
  }