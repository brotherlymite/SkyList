import React, {useEffect, useState} from "react";
import {  SkynetClient } from 'skynet-js';

const dataDomain = "localHost";
const portal = window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;
const client = new SkynetClient(portal);

function Login() {
  
    //STATES FOR MYSKY AND LOGGEDIN
    const [mySky, setMySky] = useState();
    const [loggedIn, setLoggedIn] = useState(null);

    const handleMySkyLogin = async () => {
        const status = await mySky.requestLoginAccess();
        setLoggedIn(status);
        window.location.href = '/#/mylist';
    };

    useEffect(() => {

        // INITIALISE MYSKY
        const initMySky = async () => {
          try {
            const mySky = await client.loadMySky(dataDomain);
            const loggedIn = await mySky.checkLogin();
            setMySky(mySky);
            setLoggedIn(loggedIn);
          } catch (e) {
            console.error.apply(e);
          }
        };
        
        //IF USER SUCCESSFULLY LOGGED IN REDIRECT TO MYLIST PAGE
        if(loggedIn)
        {
          window.location.href = '/#/mylist';
        }
    
        initMySky();
      }, [loggedIn]);

  return (
    <div style={{margin:"auto" ,width:"50%", height:"50%" ,textAlign:"center", paddingTop:"20vh" }}>
      <h2 style={{fontSize: "65px", fontWeight: "bold",padding:"20px"}}>Sky List</h2>
      <button onClick={handleMySkyLogin} className='login-button'>Login with My Sky</button>
    </div>
  );
}
export default Login;