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
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate, Navigate, Link} from "react-router-dom";
import { AuthStateContext, AuthDispatchContext, logout } from "../contexts/Auth";

export default function NavBar() {
    const { isLoggedIn, isAdmin, username } = useContext(AuthStateContext);
    const dispatch = useContext(AuthDispatchContext);

    const navigate = useNavigate();

    async function logoutHandler() {
        try {
            const response = await axios({
                method: 'post',
                url: "http://localhost:8000/api/auth/logout",
                withCredentials: true,
            }).then(({data}) => {
                console.log(data);
                if (data.status == '1') {
                    logout(dispatch);
                    navigate('/auth')
                }
            })
        } catch(err) {
            console.log(err);
        }
    }

    function ActionDropdown() {
        console.log(isLoggedIn + " " + isAdmin)
        if (isLoggedIn&&isAdmin) {
            return <NavDropdown title={"Hello Admin"} id="basic-nav-dropdown">
                        <NavDropdown.Item>
                            <Link to={`/admin/user`}>
                                Manage User
                            </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            <Link to={`/admin/event`}>
                                Manage Event
                            </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item onClick={logoutHandler}>
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>;
        } else if (isLoggedIn) {
            return <NavDropdown title={"Hello " + username} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={logoutHandler}>
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>;
        }
        return <Nav.Item >
                    <Link to={`/auth`}>
                            Hello Human
                    </Link>
                </Nav.Item>;
    }

    return (
        <div className='navContainer'>
            <Navbar bg="light" expand="sm" className='navContainer'>
            <Container>
                <Navbar.Brand>Social Event Map</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                    </Nav>
                </Navbar.Collapse> */}

                <ActionDropdown/>
            </Container>
            </Navbar>
        </div>
    );
}