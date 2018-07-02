import axios from "axios";

export const persistToken = store => next => action => {

    switch(action.type) {
  
        case "ON_INIT":
          console.log("GOT THE INIT EVENT");

          if(localStorage.getItem("AUTH-TOKEN")){
            console.log("There is an authorization token");
          
            axios({
              url: "/users/me/token",
              headers: { "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjM1MjIzMWNiNGYwOTI5YjhjMGRhMTQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTMwNDk1MDUyLCJleHAiOjE1MzEwOTk4NTJ9.2wjmrENBwlzxFDZTS6kL8if5LBFIh0aFa3hcIWxGwIk"}
            })
              .then((response) => {
                console.log("IT WORKED");
                console.log(response);
              
              })
              .catch((e) => {
                console.log("IT DIDN'T WORK");
                console.log(e);
              });
          }
          else{
            console.log("There is not an authorization token");
          }



        // verify the token first
        // fetch('your.api.com/verify-token', {
        //   body: JSON.stringify({
        //     token: localStorage.getItem('TOKEN')
        //   })
        // })
        // .then((response) => {
        //   if(response.ok) {
        //     // if you also want to refresh your token, do it here
        //     // dispatch a new action with the token
        //     next({
        //       type: RECEIVE_TOKEN,
        //       token: localStorage.getItem('TOKEN')
        //     });
        //   }
        // });
       break;
  
      case "RECEIVE_TOKEN":
        localStorage.setItem('TOKEN', action.token);
        break;
    }
  
    return next(action);
  };