import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Modal, Form, Icon,Input} from 'antd';
import axios from 'axios';

import history from '../../../../history/history.js';
import '../../../../css/component/sidebar.css';
import Logo from '../../../../image/logo/PayQr_3.png';



class Sidebar extends Component {
  constructor(props){
    super(props);
      this.state = {
        openUserBalance:false,
        openUserCharge:false,
        openUserUpdatePhoto:false,
        chargeBalance:null,
        getLanguage:[],
        languageText: [],
        setImage:null,
        imageBlob:null,
        getUserInfoData:[]

     }
  }

  componentDidMount(){
    this.getUserInfo()
    this.getLanguage()
    this.getUserProfile()

  }

  componentWillReceiveProps(nextProps){

    if(nextProps.language !== this.props.language){
      console.log(nextProps.language)

      this.setlanguageText(nextProps.language)
    }
  }

  componentWillMount(){

  }

  //CRUD
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
    // console.log("getUserInfo: ",response)
  }

  userCharge = async () => {
    const res = await fetch(this.props.api+"/userbalance",{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'authentication':window.localStorage.getItem("session")
      },
      body:JSON.stringify({
        "user_id":this.props.userId,
        "balance":this.state.chargeBalance
      })
    })

    const response = await res.json()
    console.log("userCharge: ",response)

    if (response.message == "success" ) {
        return true
    } else {
        return false
    }
  }

  userUpdatePhoto = async () => {

    const formData = new FormData()
      formData.append(
        'userImage',
        this.state.imageBlob,
        this.state.imageBlob.name
      )

    const res = await axios.put(this.props.api+"/updateimage", formData, {
        headers: {
          'authentication':window.localStorage.getItem("session"),
          "Content-Type": "multipart/form-data",
          "userid":this.props.userId,
          }
       })

    if(res.status == 200){
      return true
    }else{
      return false

    }
  }





  getUserProfile = async () => {
    const res = await fetch(this.props.api + "/usergetinfo", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "authentication": window.localStorage.getItem("session"),
        "user_id": this.props.userId,
      },
    });
    const response = await res.json();
    // console.log("getUserProfile", response);


    this.setState({
      getUserInfoData: response.data
    });

    this.setImage(this.state.getUserInfoData.profile_img)
  }


  setImage = (e) => {

    this.setState({
      setImage:this.props.api+"/"+e
    })
  }

  tabChange=(headerTitle,url)=>{
    console.log(url)
  history.push(`/${url}`)
  this.props.onClickEvent(headerTitle)
  }

  // goToUserProfile = () => {
  //   history.push('/userprofile')
  // }

  //OPEN MODAL
  openUserBalanceModal = () =>{
    this.setState({
      openUserBalance:true
    })
  }
  openUserChargeModal = () =>{
    this.setState({
      openUserCharge:true
    })
  }

  openUserUpdatePhotoModal = () => {
    this.setState({
      openUserUpdatePhoto:true
    })
  }

  //CLOSE MODAL
  closeUserBalanceModal = () =>{
    this.setState({
      openUserBalance:false
    })
  }

  closeUserUpdatePhotoModal = () => {
    this.setState({
      openUserUpdatePhoto:false
    })
  }

  closeUserChargeModal = () =>{
    this.setState({
      openUserCharge:false
    })
  }


  //MODAL
  userChargeModal = async () => {
    if(await this.userCharge()){
      this.success()
      this.closeUserChargeModal()
    }else{
      this.error()
      this.closeUserChargeModal()
    }
  }


  userUpdatePhotoModal = async () => {
    if(await this.userUpdatePhoto()){
      this.closeUserUpdatePhotoModal()
      this.success()
      this.getUserProfile()
    }else{
      this.error()
    }
  }

  onChange = (e) =>{
  this.setState({[e.target.name]:e.target.value})
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
    this.setlanguageText(this.props.language)

  }

  setlanguageText = async (e) => {
     await this.setState({
       languageText: {
         orderManagement:'Order Management',
         depositManagement:'Deposit Flow Management',
         user:'User',
         balanceRequest:'Balance Request',
       }
     })

     this.translateLanguage(e)
   }

 translateLanguage = async (e) =>{
   if(this.props.language == 'zh'){
       const languageKeys = Object.keys(this.state.languageText)
       let dynamicLanguageText = this.state.languageText

       for(let i = 0; i < languageKeys.length; i++){
         for(let j = 0; j < this.state.getLanguage.length; j++){
           if(this.state.languageText[languageKeys[i]] == this.state.getLanguage[j].keyword){
             dynamicLanguageText[languageKeys[i]] = this.state.getLanguage[j].zh
              await this.setState({
               languageText:dynamicLanguageText
             })
           }
        }
      }
    }else{
  }
 }

 //POP UP
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

  blockPopup = () => {
    Modal.error({
      title: 'You are currently blocked!',
    });
  }



  previewFile = () => {
    let imageFile = document.getElementById('imageFile').files[0]

    this.setState({
      imageBlob:imageFile
    })



  }



  render(){
    return (
      <div className="sidenav">
        <div className="sidenav-container">
          <div className="logo-container">
            <div className="logo-content">
              <div className="logo">
                <img src={Logo} style={{width: "148px", height: "40px",marginLeft: "-12px"}} />
              </div>
            </div>
          </div>

          <div className="user-profile-container">
            <div className="flex-center">
              <div className="user-profile-img">
              <img src={this.state.setImage} alt=""/>
              <div className="edit-user-image-container">
                <FontAwesomeIcon onClick={this.openUserUpdatePhotoModal} className="edit-user-image user-icons"  icon="camera"/>
              </div>

              </div>
            </div>
            <div className="flex-center">
              <h6><span style={this.props.userBlocked ? {color:"red"} : {color:"white"}}> {this.props.userRole}</span> : <span className="user-sidebar-role">{this.props.userName}</span></h6>
            </div>
            {/* <div className="flex-center">
              <div  className="user-profile-role">
                <strong>Role: </strong><span style={this.props.userBlocked ? {color:"red"} : {color:"white"}}> {this.props.userRole}</span>
              </div>
            </div> */}

            <div style={this.props.userRole !== "Agent" ? {display:"block"} : {display:"none"}}>
              <div className="flex-center">
                <div className="user-icons flex-around" style={{width:"30%"}}>
                  {/* <FontAwesomeIcon className="user-icon-style"  icon="money-check" onClick={this.openUserBalanceModal}/> <span>|</span> */}
                  <FontAwesomeIcon className="user-icon-style" onClick={this.props.userBlocked ? this.blockPopup : ()=>this.tabChange("User Profile","userprofile")} icon="users-cog"/>  <span style={this.props.userRole === "Admin" ? {display:"none"} : {display:"block"}}>|</span>
                  <FontAwesomeIcon className="user-icon-style" icon="cash-register"  onClick={this.props.userBlocked ? this.blockPopup : this.openUserChargeModal} style={this.props.userRole === "Admin" ? {display:"none"} : {display:"block"}}/>
                </div>
              </div>
            </div>

            <div style={this.props.userRole === "Agent" ? {display:"block"} : {display:"none"}}>
              <div className="flex-center">
                <div className="user-icons flex-around" style={this.props.userRole === "Agent" ? {width:"30%"} : {width:"50%"} }>
                  <FontAwesomeIcon className="user-icon-style" onClick={()=>this.tabChange("User Profile","userprofile")} icon="users-cog"/>  <span style={this.props.userRole === "Admin" ? {display:"none"} : {display:"block"}}></span>
                </div>
              </div>
            </div>

          </div>

          <div className="sidenav-module-container">
            <div onClick={()=>this.tabChange("Order Management","order")} className={this.props.headerTitle==="Order Management" ? "selsectedSidebar" : "sidenav-content"} >
              <div className="sidenav-icon">
                <i  className="sidenav-icon-child">
                  <FontAwesomeIcon icon="donate"/>
                </i>
              </div>
              <div className="sidenav-text">{this.state.languageText.orderManagement}</div>
            </div>

            <div className="sidenav-content" onClick={()=>this.tabChange("Deposit Flow Management","deposit")}  className={this.props.headerTitle==="Deposit Flow Management" ? "selsectedSidebar" : "sidenav-content"} style={this.props.userRole === "Agent" || this.props.userRole === "Admin" || this.props.userRole === "Merchant" || this.props.userRole === "User" ? {display:"block"} : {display:"none"}}>
              <div className="sidenav-icon">
                <i className="sidenav-icon-child">
                  <FontAwesomeIcon icon="money-check-alt"/>
                </i>
              </div>
              <div className="sidenav-text">{this.state.languageText.depositManagement}</div>
            </div>

            <div className="sidenav-content" onClick={()=>this.tabChange("User","user")}  className={this.props.headerTitle==="User" ? "selsectedSidebar" : "sidenav-content"} style={this.props.userRole === "Admin" || this.props.userRole === "Agent"  ? {display:"block"} : {display:"none"}}>
              <div className="sidenav-icon">
                <i className="sidenav-icon-child">
                  <FontAwesomeIcon icon="user-edit"/>
                </i>
              </div>
              <div className="sidenav-text">{this.state.languageText.user}</div>
            </div>

            <div className="sidenav-content" onClick={()=>this.tabChange("Balance Request","balancerequest")}  className={this.props.headerTitle==="Balance Request" ? "selsectedSidebar" : "sidenav-content"} style={this.props.userRole === "Admin" ? {display:"block"} : {display:"none"}}>
              <div className="sidenav-icon">
                <i className="sidenav-icon-child">
                  <FontAwesomeIcon icon="money-check"/>
                </i>
              </div>
              <div className="sidenav-text">{this.state.languageText.balanceRequest}</div>
            </div>

          </div>
        </div>

        {/* ------ MODAL -------  */}

        <Modal
          title="Balance"
          visible={this.state.openUserBalance}
          onOk={this.closeUserBalanceModal}
          onCancel={this.closeUserBalanceModal}
          maskClosable={true}
          >
          <div>
          </div>
        </Modal>


          <Modal
            title="Charge"
            visible={this.state.openUserCharge}
            onOk={this.userChargeModal}
            onCancel={this.closeUserChargeModal}
            maskClosable={true}
            destroyOnClose={true}
            >
            <div>
              <div className="flex-start">

                <div>
                  <strong>
                    Currency Amount:
                  </strong>
                </div>
                <div>
                  <div className="flex-start">
                    <input type="text" className="form-control" style={{marginLeft: "30px"}} onChange={this.onChange} placeholder="Charge Balance" name="chargeBalance"/> <div> RMB</div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            title="Charge"
            visible={this.state.openUserUpdatePhoto}
            onOk={this.userUpdatePhotoModal}
            onCancel={this.closeUserUpdatePhotoModal}
            maskClosable={false}
            destroyOnClose={true}>
            <div>
              <input id="imageFile" type="file" onChange={this.previewFile}/>
            </div>
          </Modal>

      </div>
   );
   }
 }

 export default Sidebar;
