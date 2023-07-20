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
import React, { useReducer, createContext, useEffect } from "react";
import axios from 'axios';

export const AuthStateContext = createContext();
export const AuthDispatchContext = createContext();

const authInitState = {
  isLoggedIn: false,
  isAdmin: false,
  username: 'Guest',
};

function reducer(state, action) {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
        let username = action.username;
        let isAdmin = action.isAdmin;
        console.log(action)
        return {
            isLoggedIn: true,
            isAdmin: isAdmin,
            username: username,
        };
        case 'LOGOUT':
        return {
            isLoggedIn: false,
            isAdmin: false,
            user: 'Guest',
        };
        default:
        throw new Error();
    };
};

export function login(dispatch, username, isAdmin) {
    return dispatch({
        type: "LOGIN_SUCCESS",
        username: username,
        isAdmin: isAdmin,
    });
};

export function logout(dispatch) {
    return dispatch({
        type: "LOGOUT",
    });
};

export default function AuthProvider({children}) {
    const [state, dispatch] = useReducer(reducer, authInitState);

    const vaildateSession = async () => {
        try {
            await axios({
                method: "post",
                withCredentials: true,
                url: `http://localhost:8000/api/auth/validate`,
            }).then(({data}) => {
                console.log(data);
                if (data.status == -1) {
                    dispatch({
                        type: "LOGOUT",
                    });
                }
                if (data.status == '1') {
                    console.log("hi" + data.result.isAdmin)
                    let username = data.result.username;
                    let isAdmin = data.result.isAdmin;
                    login(dispatch, username, isAdmin);
                }
            });
        } catch(error) {
            //console.log(error)
        }
    }

    useEffect(() => {
        vaildateSession();
    }, []);

    return (
        <AuthDispatchContext.Provider value={dispatch}>
            <AuthStateContext.Provider value={state}>
                {children}
            </AuthStateContext.Provider>
        </AuthDispatchContext.Provider>
    );
}