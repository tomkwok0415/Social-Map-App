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

export default function Map() {
    const history = useNavigate();
  
    let marker1 = [{
      locId:0
    }];
  
    const [location, setlocation] = useState("");
    const center = useMemo(() => ({ lat:22.38136, lng: 114.18990}));
    const box = ({lat: 22.391810, lng: 113.976771});
    const { isLoaded } = useLoadScript({
      googleMapsApiKey : "YOURS_KEY_HERE"
    });

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
  
    if (!isLoaded && loading) {
      return <p>
        loading
      </p>
    }
  
    const click = (lat,lng,name,label,id,comments) => {
      history(`map/${id}`, {
        state:{
          lat: lat,
          lng: lng,
          name: name,
          label: label,
          id: id,
          comments: comments
        }
      });
    }
   
    console.log(location);
    const nextChar = (c,index) =>{
      let i = (parseInt(c, 36) + index ) % 36;
      return (!i * 10 + i).toString(36);
    }
  
    return (
        <GoogleMap zoom={11} center={center} mapContainerStyle={{width:'1200px', height:"600px"}}>
              {location.length != 0? (location.map((marker, index) => <MarkerF key={index} onMouseDown={()=>click(marker.latitude,marker.longitude, marker.name,nextChar("A",index), marker.locId, marker.comments)} position={{lat: marker.latitude, lng: marker.longitude}} label={nextChar("A",index)}/>)) : (<></>)}
        </GoogleMap>
    );
  }
