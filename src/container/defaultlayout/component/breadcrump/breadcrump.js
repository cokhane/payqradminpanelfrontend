import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import history from '../../../../history/history.js';
import '../../../../css/component/breadcrump.css';

class Breadcrump extends Component {
  constructor(props){
    super(props);
      this.state = {
        balance:"0.00",
        icon:'exclamation',
        icon2:'check',

        message: '',
        notiftype: '',
        time: '',

        notifbluedot:'none',
        limit:0,

        headerTitle:null,

        notifdata: [],
        dropdownClick:false
     }
  }

  componentDidMount(){
    this.props.eventFunction('User Profile')

  }

  componentWillReceiveProps(nextProps){
    if(nextProps.headerTitle !== this.props.headerTitle){
      this.setHeaderTitle(nextProps.headerTitle)
    }
  }

  setHeaderTitle = (e) => {
    this.setState({
      headerTitle:e
    })
  }

  render(){
    return (
      <div className="breadcrump-container">
        <div className="breadcrump-header">
          <div className="breadcrump-flex flex-start">
            <div>
              <FontAwesomeIcon onClick={this.openUserUpdatePhotoModal} className="user-icons" icon="home"/>
            </div>
            <div className="breadcrump-header-text"><span>/</span> {this.props.headerTitle}</div>
          </div>
          <h3 className="breadcrump-text">{this.props.headerTitle}</h3>

        </div>
      </div>
    );
  }
}

export default Breadcrump;
