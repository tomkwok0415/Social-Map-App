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
import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Outlet } from "react-router-dom";
import { useNavigate, Navigate} from "react-router-dom";
import axios from 'axios';
import NavBar from '../components/NavBar' 
import { AuthStateContext, AuthDispatchContext, login } from "../contexts/Auth";

export default function AuthPage() {
    const { isLoggedIn } = useContext(AuthStateContext);
    const dispatch = useContext(AuthDispatchContext);
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [Warring, setWarring] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        initData();
    }, []);

    function PrivateRoute() {
        if (isLoggedIn) {
            return <Navigate to="/" />;
        }
        return <div></div>;
    }

    let createData = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: "http://localhost:8000/api/deletealllocation",
                withCredentials: true,
            }).then(({data}) => {
                console.log(data);
            })
        } catch(err) {
            console.log(err);
        }
        try {
            const response = await axios({
                method: 'get',
                url: "http://localhost:8000/api/location",
                withCredentials: true,
            }).then(({data}) => {
                console.log(data);
            })
        } catch(err) {
            console.log(err);
        }
        try {
            const response = await axios({
                method: 'get',
                url: "http://localhost:8000/api/deleteallevent",
                withCredentials: true,
            }).then(({data}) => {
                console.log(data);
            })
        } catch(err) {
            console.log(err);
        }
        try {
            const response = await axios({
                method: 'get',
                url: "http://localhost:8000/api/event",
                withCredentials: true,
            }).then(({data}) => {
                console.log(data);
            })
        } catch(err) {
            console.log(err);
        }
    }

    let initData = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: "http://localhost:8000/api/init",
                withCredentials: true,
            }).then(({data}) => {
                console.log(data);
            })
        } catch(err) {
            console.log(err);
        }
    }

    let LoginHandler = async () => {
        const formData = new FormData();
        formData.append('email', Username);
        formData.append('password', Password);
        const data = {
            username: Username,
            password: Password
        }
        try {
            const response = await axios({
                method: 'post',
                url: "http://localhost:8000/api/auth/login",
                data: data,
                withCredentials: true,
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
            }).then(({data}) => {
                console.log(data);
                if (data.status == '-1') {
                    setWarring("Wrong password or email");
                }
                if (data.status == '1') {
                    let username = data.result.username;
                    let isAdmin = data.result.isAdmin;

                    createData();

                    login(dispatch, username, isAdmin);
                    navigate("/");
                }

            })
        } catch(err) {
            console.log(err);
        }
   };
  
  return (
      <div>
        <PrivateRoute/>
        <NavBar/>
        <Container fluid>
          <Row></Row>
          <Row xs={8}>
          <Col></Col>
          <Col xs={6}>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter Username" onChange={(event)=>{
                      setUsername(event.target.value)
                    }}/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(event)=>{
                      setPassword(event.target.value)
                    }}/>
                </Form.Group>
                
                <Button variant="dark" onClick={LoginHandler}>
                    Login
                </Button>
                <p>{Warring}</p>
              </Form>
          </Col>
          <Col></Col>
          </Row>
        </Container>
      </div>
  );
}
