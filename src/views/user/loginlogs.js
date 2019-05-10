import React, {Component} from 'react'
import {Modal, Form, Icon, Input} from 'antd';

import '../../css/views/loginlogs.css';

const $ = require('jquery');
window.$ = $;
$.DataTable = require('datatables.net-dt');

class LoginLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getLoginLogs: this.props.getLoginLogs,
      table: null,

      getLanguage:[],
      languageText: [],
    }
  }


  setData = async (e) => {
    await this.setState({
      getLoginLogs: e
    });
    // console.log("getLoginLogs e: ",this.state.getLoginLogs)
    const getLoginLogsDataTable = this.state.getLoginLogs;
    this.state.table.clear();
    this.pushUserDataInTable(getLoginLogsDataTable);
    this.state.table.draw()
  };

  pushUserDataInTable = (e) => {
    let j = 1;
    e.forEach(items => {
      let loginId = items._id
      let userId = items.userId
      let ipAddres = items.ip_address
      let loginTime = items.login_time
      this.state.table.row.add([j, loginId, userId, ipAddres, loginTime])
      j++
    })

  }


  setTable = () => {
    this.$el = $(this.el)
    this.state.table = this.$el.DataTable()
  }

  //MODAL POP UP
  success = () => {
    Modal.success({
      title: 'success',
    });
  }

  error = () => {
    Modal.error({
      title: 'This is an error message',
      content: 'some messages...some messages...',
    });
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  };

  componentDidMount() {
    this.setTable()
    this.getLanguage()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.path !== this.props.getLoginLogs) {
      this.setData(nextProps.getLoginLogs)
    }

    if(nextProps.language !== this.props.language){
      this.setlanguageText(nextProps.language)
    }
  }

  getLanguage = async () => {
    const res = await fetch(this.props.api+"/language",{
     method:'GET',
     headers: {
       "Content-Type": "application/json",
       "authentication": window.localStorage.getItem("session"),
     },
   })
   const response = await res.json()
    this.setState({
     getLanguage: response.data
    });
    console.log("getLanguage: ",response)
    this.setlanguageText(this.props.language)
  }


    setlanguageText = async (e) => {
     await this.setState({
       languageText: {
          number:'Number',
          logId:'Log ID',
          userId:'User ID',
          ipAddress:'Ip Address',
          loginTime:'Login Time',
       }
     })

     this.translateLanguage(e)
   }



 translateLanguage =  (e) =>{

   if(this.props.language == 'zh'){
       const languageKeys = Object.keys(this.state.languageText)
       let dynamicLanguageText = this.state.languageText

       for(let i = 0; i < languageKeys.length; i++){
         for(let j = 0; j < this.state.getLanguage.length; j++){
           if(this.state.languageText[languageKeys[i]] == this.state.getLanguage[j].keyword){
             dynamicLanguageText[languageKeys[i]] = this.state.getLanguage[j].zh
               this.setState({
               languageText:dynamicLanguageText
             })
           }
        }
      }
    }else{
   }
 }


  render() {
    return (
      <div className="login-logs-component">

        <div className="loginlogs-table">
          <table className="display" width="100%" ref={el => this.el = el}>
            <thead>
            <tr>
              <th>{this.state.languageText.number}</th>
              <th>{this.state.languageText.logId}</th>
              <th>{this.state.languageText.userId}</th>
              <th>{this.state.languageText.ipAddress}</th>
              <th>{this.state.languageText.loginTime}</th>
            </tr>
            </thead>
          </table>
        </div>
      </div>
    );
  }
}

export default LoginLogs;
