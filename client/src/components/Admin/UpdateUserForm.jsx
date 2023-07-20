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
import React, { useEffect, useState, useContext } from 'react';
import { Row, Container, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

export default function UpdateUserForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true)
  let navigate = useNavigate();
  let params = useParams();

  useEffect(()=>{
    fetchUser();
  },[])

  const fetchUser = async () => {
        setLoading(true);
        await axios({
            method: "get",
            withCredentials: true,
            url: `http://localhost:8000/api/user/${params.userId}`,
        }).then(({data})=>{
            setUsername(data.username);
            // setPassword(data.password)
        })
        setLoading(false);
    }

    let saveUser = async () => {

        const data = {
            username: username,
            password: password,
        }

        if (username.length >20 || username.length <4){
            alert("Wrong username format!");
            return 0;
        }
    
        if (password.length >20 || password.length <4){
            alert("Wrong password format!");
            return 0;
        }

        try {
        await axios({
            method: "put",
            url: `http://localhost:8000/api/user/${params.userId}`,
            data: data,
            withCredentials: true,
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
        }).then(({data})=>{
            console.log(data)
            navigate("/admin/user");
        });
        //console.log(response)
        } catch(error) {
        //console.log(error)
        }
    };

    let deleteUser = async () => {
        try {
            await axios({
            method: "delete",
            withCredentials: true,
            url: `http://localhost:8000/api/user/${params.userId}`,
            }).then(({data})=>{
                console.log(data)
                navigate("/admin/user");
            });
        } catch(error) {
            //console.log(error)
        }
    };

    if (loading) {
        return (
            <span>loading</span>
        )
    }

    return (
        <div>
            <Container>
                <Row>
                    <h3>Update user</h3>
                </Row>
            <Row>
            <Form>
                <Form.Group className="mb-3" controlId="">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={username} placeholder={username} onChange={(event)=>{
                    setUsername(event.target.value)
                    }}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" value={password} placeholder="password"onChange={(event)=>{
                    setPassword(event.target.value)
                    }}/>
                </Form.Group>
                <Button variant="dark" onClick={saveUser}>Save</Button>
                <Button variant="red" onClick={deleteUser}>Delete</Button>
            </Form>
            </Row>
        </Container>
        </div>
    );
}
