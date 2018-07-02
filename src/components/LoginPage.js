import React from 'react';
import { connect } from 'react-redux';
import { startLogin } from '../actions/auth';
import axios from "axios";
import {Redirect} from "react-router-dom";

class LoginPage extends React.Component{
  constructor(props){
    super(props);

    console.log(props);

    this.state = {
      email : "",
      password : "",
      error: ""
    }
  }

  onEmailChange = (e) => {
    const email = e.target.value;
    
    this.setState({
      email
    });
  }

  onPasswordChange = (e) => {
    const password = e.target.value;
    
    this.setState({
      password
    });
  }

  onSubmit = (e) => {
    console.log()
    e.preventDefault();

    const email = this.state.email;
    const password = this.state.password;
  
    if(!email || !password){
      this.setState({
        error: "Please enter an email and password"
      })
    }
    else{  
      axios({
        method: "post",
        url: "/users/login",
        data: {
          email,
          password
        } 
      })
      .then((response) => {
        console.log(response);
        
        //Clear error
        this.setState({error: ""});
        
        //Update Auth State
        
        //Redirect to main page
        this.props.history.push("/");

        // console.log("New auth token:", response.hea)
        // response.data
      })
      .catch((e) => {
        this.setState({
          error: "Sorry! We can't find a user with that e-mail and password combination."
        })
      });
    }
  }

  render(){
    return (
      <form onSubmit={this.onSubmit}>
        {this.state.error && <p>{this.state.error}</p>}
        <input type="email" value={this.state.email} placeholder="Email" onChange={this.onEmailChange}/>
        <input type="password" value={this.state.password} placeholder="Password" onChange={this.onPasswordChange}/>
        <button>Login</button>
      </form>
    );
  }
}

export default LoginPage

// export const LoginPage = ({ startLogin }) => (
//   <div className="box-layout">
//     <div className="box-layout__box">
//       <h1 className="box-layout__title">Boilerplate</h1>
//       <p>Tag line for app.</p>
//       <button className="button" onClick={startLogin}>Login with Google</button>
//     </div>
//   </div>
// );

// const mapDispatchToProps = (dispatch) => ({
//   startLogin: () => dispatch(startLogin())
// });

//export default connect(undefined, mapDispatchToProps)(LoginPage);
