import React, { Component } from 'react'
import {Modal, Form, Icon,Input} from 'antd';

var $ = require('jquery');
window.$ = $;
$.DataTable = require('datatables.net-dt');

class AgentLoginLogs extends Component {
  constructor(props){
    super(props);
      this.state = {
        getLoginLogs:this.props.getLoginLogs,
        table:null
     }
  }


  setData = async (e) => {


    await this.setState({
      getLoginLogs:e
    })
    // console.log("getLoginLogs e: ",this.state.getLoginLogs)
    const getLoginLogsDataTable = this.state.getLoginLogs;
    this.state.table.clear();
    this.pushUserDataInTable(getLoginLogsDataTable);
    this.state.table.draw()
  }

  pushUserDataInTable = (e) => {
    let j=1;
    e.forEach(items => {
      let loginId  = items._id
      let userId = items.userId
      let ipAddres = items.ip_address
      let loginTime = items.login_time
      this.state.table.row.add([j,loginId,userId,ipAddres,loginTime])
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

  componentDidMount(){
    this.setTable()
    this.getLanguage()
    console.log('yeah')
    console.log(this.props.language)
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.path!==this.props.getLoginLogs){
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
         users:'Users',
         blockedUsers:'Blocked Users',
         reset:'Reset',
         addUser:'Add User',
         idUser:'ID',
         dateCreated:'Date Created',
         role:'Role',
         company:'Company',
         product:'Product',
         action:'Action',
         logs:'Logs',
         edit:'Edit',
         block:'Block',
         qrCodeId:'Qr ID',
         viewMerchant:'View Merchant',
         change:'change',
         balance:'Balance',

         email:'Email',
         username:'Username',
         password:'Password',
         firstname:'Firstname',
         lastname:'Lastname',
         middlename:'Middlename',
         gender:'Gender',
         role:'Role',
         birthdate:'Birthdate',
         status:'Status',
         company:'Company',
         product:'Product',
         rates:'Rates',
         notifyUrl:'Notify Url'
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



render(){
  return (
    <div className="agent-login-logs-component">
          <div className="payqr-table">
              <table className="display" width="100%" ref={el => this.el = el}>
                  <thead>
                    <tr>
                      <th>Number</th>
                      <th>Log ID</th>
                      <th>User ID</th>
                      <th>Ip Address</th>
                      <th>Login Time</th>
                    </tr>
                  </thead>
              </table>
          </div>
        {/* <h1>CHILD</h1> */}
      </div>
    );
   }
 }

 export default AgentLoginLogs;
