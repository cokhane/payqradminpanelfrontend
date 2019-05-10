import React, { Component } from 'react';

class Settings extends Component{
  constructor(props){
    super(props);
    this.state = {
      rates:null
    }
  }

  render(){
    return(
      <div className="settings-component">
        <h1>SETTINGS</h1>
      </div>
    );
  }
}

export default Settings;
