import React from 'react';
import {connect} from "react-redux";
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import DashboardPage from '../components/DashboardPage';
import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import MainApp from "../components/MainApp";

export const history = createHistory();

class AppRouter extends React.Component{
  constructor(props){
    super(props);

    //console.log(props)

    props.dispatch({
      type: "ON_INIT"
    });
  }

  render(){
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route component={MainApp}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect()(AppRouter);