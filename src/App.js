import React, { Component } from 'react';
import {Router, Route, Switch} from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';




import {
  //SIDEBAR
  faAlignJustify,
  faDolly ,
  faCommentDollar,
  faMoneyCheckAlt,
  faDonate,
  faClipboard,
  faUserEdit,
  faCogs,
  // USER PROFILE
  faUsersCog,
  faMoneyCheck,
  faCashRegister,
  // SOCIAL
  fafacebook,
  //NOTIFY
  faEnvelope,
  faBell,
  faDollarSign,
  //Header
  faYenSign,
  faSnowflake,
  //NOTIFY
  faExclamation,
  faCheck,
  //FORM
  faEye,
  faEyeSlash,
  //HEADER
  faLanguage,
  faGlobe,
  faSignInAlt,
  faHome,
  //SIDEBAR
  faCamera


} from '@fortawesome/free-solid-svg-icons';

import DefaultLayout from './container/defaultlayout/defaultlayout.js';
import Login from './container/login/login.js';
import history from './history/history.js';

import './css/global.css'
import 'bootstrap/dist/css/bootstrap.min.css';


library.add(
  faAlignJustify,
  faDolly,
  faCommentDollar,
  faMoneyCheckAlt,
  faDonate,
  faClipboard,
  faUserEdit,
  faCogs,
  faUsersCog,
  faMoneyCheck,
  faCashRegister,
  faEnvelope,
  faBell,
  faDollarSign,
  faYenSign,
  faSnowflake,
  faExclamation,
  faCheck,
  faEye,
  faEyeSlash,
  faLanguage,
  faCamera,
  faGlobe,
  faSignInAlt,
  faHome
);

class App extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="App">
        <Router history={history}>
         <Switch>
           <Route exact path="/login" name="Login" component={Login} />
           <Route path="/" name="Home" component={DefaultLayout} />
         </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
