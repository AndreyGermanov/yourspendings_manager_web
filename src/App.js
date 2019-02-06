import React, { Component } from 'react';
import './App.css';
import backend from "./backend/Backend"

class App extends Component {
  render() {
      const formData = new FormData()
      formData.append("username","user");
      formData.append("password","111111")
    return (
          <p>
              <p onClick={()=> {
                  backend.request("/login",{
                      method: 'POST',
                      body: formData,
                      credentials: 'include'
                  }, (response) => {
                      console.log(response)
                  });
              }}>LogIn,</p>
            <p onClick={()=> {
              console.log("ON CLICK");
                backend.request("/api/shops",{
                    method:'GET',credentials:'include'
                }, (response) => {
                    console.log(response);
                    if (response.status !== 401) {
                        response.json().then(json => {
                            console.log(json)
                        })
                    }
                })}
            }>Get data,</p>
              <p onClick={()=> {
                  backend.request("/logout",{
                      method:'POST',credentials:'include'
                  }, (response) => {
                    console.log(response)
                  })}
              }>Logout</p>

          </p>
    );
  }
}

export default App;
