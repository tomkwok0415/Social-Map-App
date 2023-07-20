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
    const [Title, setTitle] = useState("");
    const [EventTime, setEventTime] = useState("");
    const [LocationID, setLocationID] = useState("");
    const [Description, setDescription] = useState("");
    const [Presenter, setPresenter] = useState("");
    const [Price, setPrice] = useState("");
  const [loading, setLoading] = useState(false)
  let navigate = useNavigate();
  let params = useParams();

//   useEffect(()=>{
//     fetchUser();
//   },[])

//   const fetchUser = async () => {
//         setLoading(true);
//         await axios({
//             method: "get",
//             withCredentials: true,
//             url: `http://localhost:8000/api/user/${params.userId}`,
//         }).then(({data})=>{
//             setUsername(data.username);
//             // setPassword(data.password)
//         })
//         setLoading(false);
//     }

    let saveEvent = async () => {

        const data = {
            title: Title,
            locId: LocationID,
            datetime: EventTime,
            description: Description,
            presenter: Presenter,
            price: Price,
            eventId: params.eventId
        }

        try {
        await axios({
            method: "post",
            url: `http://localhost:8000/api/updateevent`,
            data: data,
            withCredentials: true,
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
        }).then(({data})=>{
            alert(data)
            navigate("/admin/event");
        });
        //console.log(response)
        } catch(error) {
        //console.log(error)
        }
    };

    let deleteEvent = async () => {
        const data = {
            eventId: params.eventId
        }

        try {
            await axios({
            method: "delete",
            withCredentials: true,
            url: `http://localhost:8000/api/event`,
            data: data,
            }).then(({data})=>{
                console.log(data)
                navigate("/admin/event");
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
                    <h3>Update event</h3>
                </Row>
            <Row>
            <Form>
            <Form.Group className="mb-3" controlId="">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={Title} onChange={(event)=>{
                  setTitle(event.target.value)
                }}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="">
                <Form.Label>Event time</Form.Label>
                <Form.Control type="text" value={EventTime} onChange={(event)=>{
                  setEventTime(event.target.value)
                }}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="">
                <Form.Label>location ID</Form.Label>
                <Form.Control type="number" value={LocationID} onChange={(event)=>{
                  setLocationID(event.target.value)
                }}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="">
                <Form.Label>Event description</Form.Label>
                <Form.Control type="text" value={Description} onChange={(event)=>{
                  setDescription(event.target.value)
                }}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="">
                <Form.Label>Event presenter</Form.Label>
                <Form.Control type="text" value={Presenter} onChange={(event)=>{
                  setPresenter(event.target.value)
                }}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="">
                <Form.Label>Event price</Form.Label>
                <Form.Control type="text" value={Price} onChange={(event)=>{
                  setPrice(event.target.value)
                }}/>
            </Form.Group>

            <Button variant="dark" onClick={saveEvent}>Save</Button>
            <Button variant="red" onClick={deleteEvent}>Delete</Button>
        </Form>
            </Row>
        </Container>
        </div>
    );
}
