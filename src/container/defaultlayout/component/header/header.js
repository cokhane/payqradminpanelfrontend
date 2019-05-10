import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Layout, Menu, Breadcrumb, Icon ,Dropdown, Modal} from 'antd';

import history from '../../../../history/history.js';
import '../../../../css/component/header.css';

import moment from 'moment';

// for the socket client notification
var io =  require('socket.io-client')
const socket = io('https://api.payqr.cash/');

var $ = require('jquery');
window.$ = $;

class Header extends Component {
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

        headerTitle:this.props.headerTitle,

        notifdata: [],
        dropdownClick:false
     }
  }

  gotoLogin = () => {
    window.localStorage.setItem("session",'');
    this.success()
    history.push('/login')
  }

  //POP UP
  success = () => {
    Modal.success({
      title: 'Success',
      maskClosable:'false'
    });
  }

  getUserInfo = async () => {
    const res = await fetch(this.props.api+"/usergetinfo",{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
        'authentication':window.localStorage.getItem("session"),
        'user_id':this.props.userId
      },
    })

    const response = await res.json()

    try{

      var decimal = response.data.balance.toFixed(2)
      if(decimal == null || decimal < 0 ){
        this.setState({
          balance:'0.00'
        })
      }else{
        decimal = decimal
        this.setState({
          balance:decimal
        })
      }
      this.props.userBalanceFunction(this.state.balance)
    }catch(err){
      history.push('/login')
    }
  }

  //display all NOTIFICATIONS

  displayNotification =  (e) => {
    e.data.forEach(items => {
          let notifType = items.NotifType
          let message = items.Message
          let time = items.created_at
          let userNotifId = items.UserId
          let datas;

          if(this.props.userRole=='Admin' && notifType != 'Balance_Approved' && notifType != 'Balance_Cancelled'){
                this.setState({
                  message: message,
                  notiftype: notifType,
                  time: time
                });

                if(notifType == 'Balance_Approved' || notifType == 'Balance_Received'){
                      datas = {icon_no: 'nofiy-icon2 icon', icon: this.state.icon2, message: this.state.message, time: this.state.time};
                }else {
                      datas = {icon_no: 'nofiy-icon icon', icon: this.state.icon, message: this.state.message, time: this.state.time};
                }

                this.state.notifdata.push(datas);
                this.setState({
                  notifdata: this.state.notifdata
                });
          }else if(this.props.userId==userNotifId && notifType != 'Balance_Request'){
                this.setState({
                  message: message,
                  notiftype: notifType,
                  time: time
                });

                if(notifType == 'Balance_Approved' || notifType == 'Balance_Received'){
                      datas = {icon_no: 'nofiy-icon2 icon', icon: this.state.icon2, message: this.state.message, time: this.state.time};
                }else {
                      datas = {icon_no: 'nofiy-icon icon', icon: this.state.icon, message: this.state.message, time: this.state.time};
                }

                this.state.notifdata.push(datas);
                this.setState({
                  notifdata: this.state.notifdata
                });
          }

    })
  }


  // get all notif in a api req
  getNotification = async () =>{
    const res = await fetch(this.props.api+"/notif",{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
        'authentication':window.localStorage.getItem("session"),
        'type':this.props.userRole,
        'userid':this.props.userId,
        'limits':this.state.limit
      },
    })

    const response = await res.json()
    if(response.data != null){
      if(response.data.length!=0){
            if(response.unseenNotifCount>0){
              this.setState({
                notifbluedot: "block"
              });
            }

            try {
              this.displayNotification(response)
            } catch (e) {

            }
      }else {
      }
    }
  }

  //add more nitif
  addMoreNotif = async () => {

    await this.setState({
      limit: this.state.limit + 5
    });
    this.getNotification()
  }

  //display none blue notif dot1
  displayNotifdot = async () =>{
    this.setState({
      notifbluedot: "none",
      dropdownClick: !this.state.dropdownClick
    });

    const res = await fetch(this.props.api+"/notif",{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authentication':window.localStorage.getItem("session"),
        'type':this.props.userRole,
        'userid':this.props.userId
      },
    })
    const response = await res.json()
  }


  //for popup allert
  warning = () => {
    Modal.error({
      title: 'No more to view',
      content: 'this are all the notifications . . .',
    });
  }


  languageEnglish = (e) => {
  this.props.languageOnClickEvent(e)
  window.localStorage.setItem("lang",e);

  }

  componentDidMount(){
      this.getNotification()
      this.getUserInfo()

         socket.on("notification", (data) => {
            let notifType = data.notification.NotifType
            let message = data.notification.Message
            let time = data.notification.created_at
            let userNotifId = data.notification.UserId
            let datas;

            if(this.props.userRole=='Admin' && notifType != 'Balance_Approved' && notifType != 'Balance_Cancelled'){
                  this.setState({
                    message: message,
                    notiftype: notifType,
                    time: time
                  });

                  if(notifType == 'Balance_Approved' || notifType == 'Balance_Received'){
                        datas = {icon_no: 'nofiy-icon2 icon', icon: this.state.icon2, message: this.state.message, time: this.state.time};
                  }else {
                        datas = {icon_no: 'nofiy-icon icon', icon: this.state.icon, message: this.state.message, time: this.state.time};
                  }

                  this.state.notifdata.unshift(datas);
                  this.setState({
                    notifdata: this.state.notifdata
                  });

                  this.setState({
                    notifbluedot: "block"
                  });

            }else if(this.props.userId==userNotifId && notifType != 'Balance_Request'){
                  this.setState({
                    message: message,
                    notiftype: notifType,
                    time: time
                  });

                  if(notifType == 'Balance_Approved' || notifType == 'Balance_Received'){
                        datas = {icon_no: 'nofiy-icon2 icon', icon: this.state.icon2, message: this.state.message, time: this.state.time};
                  }else {
                        datas = {icon_no: 'nofiy-icon icon', icon: this.state.icon, message: this.state.message, time: this.state.time};
                  }

                  this.state.notifdata.unshift(datas);
                  this.setState({
                    notifdata: this.state.notifdata
                  });

                  this.setState({
                    notifbluedot: "block"
                  });
            }
        })

      //socket for approve balance
      socket.on("approvedBalance", (data) => {
          if(this.props.userId== data.approvedBalance.userid){
            this.setState({
              balance: data.approvedBalance.balance.toFixed(2)
            });
          }
      })
      //socket for cancelled balance
      socket.on("cancelledRequest", (data) => {
          if(this.props.userId== data.cancelledRequest.userid){
            this.setState({
              balance: data.cancelledRequest.balance.toFixed(2)
            });
          }
      })
      //socket for transaction complete
      socket.on("transactionReceived", (data) => {
          if(this.props.userId== data.transactionReceived.adminid && this.props.userRole=="Admin"){
            this.setState({
              balance: data.transactionReceived.adminbalance.toFixed(2)
            });
          }else if(this.props.userId== data.transactionReceived.userid){
            this.setState({
              balance: data.transactionReceived.userbalance.toFixed(2)
            });
          }
      })
  }


    render(){
      const menu = (
            <Menu>
              <Menu.Item>
                <div onClick={this.gotoLogin}>Logout</div>
              </Menu.Item>
            </Menu>
          );

      const menuLanguage = (
            <Menu>
              <Menu.Item  >
                <div onClick={(e) => this.languageEnglish("en")}>English</div>
              </Menu.Item>
              <Menu.Item>
                <div  onClick={(e) => this.languageEnglish("zh")}>Chinise</div>
              </Menu.Item>
            </Menu>
          );


      return (
        <div className="header-container">
          <div className="flex-end">
            <div className="header-icon flex-around">
              <div className="user-balance">
                <FontAwesomeIcon className="icon" icon="yen-sign"/><span>{this.state.balance}</span>
              </div>
              <div>
                <div className="dropdown" onClick={this.displayNotifdot} >
                  <FontAwesomeIcon className="icon " icon="bell"/>
                  <div className="notification-dot2" style={this.state.notifbluedot === "none" ? {display:"none"} : {display:"block"}}></div>
                </div>
                <div className={this.state.dropdownClick ? "dropdown-content-block" : "dropdown-content" }>
                  <div className="dropdown-container flex-center">
                    <div className="dropdown-notification">NOTIFICATIONS <span>
                    </span></div>
                  </div>

                  <div className="notification-container">
                    {
                      this.state.notifdata.map(( item, index ) => (
                        <div className="flex-start" key={index}>
                          <div className="nofiy-icon-container">

                            <FontAwesomeIcon className={item.icon_no} icon={item.icon} />
                          </div>
                          <div className="notify-message">
                            {item.message}
                            <br/>
                            <span className="notify-time">{moment.unix(item.time).fromNow()}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>

                  <div onClick={this.addMoreNotif} className="dropdown-viewall-container flex-center">
                    <div className="dropdown-notification">View More <span>
                        <FontAwesomeIcon className="icon" icon="envelope"/>
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <div>
                <Dropdown overlay={menuLanguage}>
                <a>
                 <FontAwesomeIcon className="icon" icon="globe"/>
                </a>
              </Dropdown>
              </div>

              <div>
                <Dropdown overlay={menu}>
                <a>
                 <FontAwesomeIcon className="icon" icon="sign-in-alt"/>
                </a>
                </Dropdown>
              </div>

            </div>
          </div>
        </div>
     );
   }
 }

 export default Header;
