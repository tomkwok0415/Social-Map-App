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
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AuthPage from './layouts/AuthPage'
import HomePage from './layouts/HomePage'
import AuthProvider from './contexts/Auth'
import CreateUserForm from './components/Admin/CreateUserForm'
import UpdateUserForm from './components/Admin/UpdateUserForm'
import Home from './components/Home'
import MapView from './components/MapView'
import TableView from './components/TableView'


import logo from './logo.svg';
import './App.css';
import UserList from './components/Admin/UserList';
import SingleMap from './components/SingleMap';
import EventList from './components/Admin/EventList';
import CreateEventForm from './components/Admin/CreateEventForm'
import UpdateEventForm from './components/Admin/UpdateEventForm'


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomePage/>}>
            <Route index element={<Home/>} />
            <Route path="map" >
                <Route path=":locId" element={<SingleMap /> } />
            </Route>
            
            <Route exact path="/mapview" element={<MapView/>}></Route>
            <Route exact path="/tableview" element={<TableView/>}></Route>

            <Route exact path="/admin">
              <Route index element={<UserList/>} />
              <Route path="user">
                <Route index element={<UserList/>} />
                <Route path=":userId" element={<UpdateUserForm/>} />
                <Route path="create" element={<CreateUserForm/>} />
              </Route>
              <Route path="event">
                <Route index element={<EventList/>} />
                <Route path=":eventId" element={<UpdateEventForm/>} />
                <Route path="create" element={<CreateEventForm/>} />
              </Route>
            </Route>
          </Route>
          <Route exact path="/user" element={<UserList/>}></Route>
          <Route exact path="/auth" element={<AuthPage/>}></Route>
          <Route
            exact path="*"
            element={
            <main>
                <p>There's nothing here!</p>
            </main>
            }
          />
        </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
