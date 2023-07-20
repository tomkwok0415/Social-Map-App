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
import { ListGroup, Row, Col, Container, Button, Badge } from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function UserList() {
    const [users, setUsers] = useState([])
  
    useEffect(()=>{
        fetchUsers() 
    },[])
  
    const fetchUsers = async () => {
        await axios({
            method: "get",
            withCredentials: true,
            url: `http://localhost:8000/api/user`,
        }).then(({data})=>{
            console.log(data)
            setUsers(data)
        })
    }
    
    return (
        <div>
          <Container>
          <Row>
            <Col sm={9}>User management</Col>
            <Col sm={3}>
              <Link to={`/admin/user/create`}>
                Create new user
              </Link>
            </Col>
          </Row>
          <Row>
          <ListGroup as="ol" numbered>                
            {users.map((user) => (
              <Link to={`/admin/user/${user.userId}`} key={user.userId}>
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{user.username}</div>
                </div>
              </ListGroup.Item>
            </Link>
            ))}
          </ListGroup>
          </Row>
        </Container>
        </div>
    );
  }
  