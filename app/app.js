import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import Orders from "./Orders";
import Reports from "./Reports";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./style.css";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1>Dalviroo Restaurant Monitor</h1>
          <ul className="header">
            <li><NavLink to="/">HOME</NavLink></li>
            <li><NavLink to="/orders">ORDERS</NavLink></li>
            <li><NavLink to="/reports">REPORTS</NavLink></li>
          </ul>
          <div className="content">
				<Route exact path="/" component={Home}/>
				<Route path="/orders" component={Orders}/>
				<Route path="/reports" component={Reports}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
export default App;
