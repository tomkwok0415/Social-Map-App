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
import React, { useContext } from 'react';
import AdminSideBar from '../components/SideBar'
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { Outlet, Navigate } from "react-router-dom";
import { AuthStateContext } from "../contexts/Auth";
import { Link } from "react-router-dom";  
import NavBar from '../components/NavBar' 
import SideBar from '../components/SideBar'


export default function Home() {
  const { isLoggedIn, isAdmin } = useContext(AuthStateContext);
  function PrivateRoute() {
    console.log(isLoggedIn);
    if (!isLoggedIn) {
        return <Navigate to="/auth" />;
    }
    return <div></div>;
  }
  return (
      <div>
        <PrivateRoute />
        <NavBar/>
        <Container fluid>
            <Row>
            <Col xs={2}>
                <SideBar />
            </Col>
            <Col xs={10}>
                <Outlet/>
            </Col>
            </Row>
        </Container>
      </div>
  );
}
