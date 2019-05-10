import React, {Component} from 'react';
import '../../css/views/userprofile.css';
import {Modal, Form, Icon, Input} from 'antd';


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getUserInfo: "",
      formDynamicInputType1: "password",
      formDyanamicIcon1: "eye",
      formDynamicInputType2: "password",
      formDyanamicIcon2: "eye",
      formDynamicInputType3: "password",
      formDyanamicIcon3: "eye",

      userEmail: "",
      userUsername: "",
      userPassword: "",
      userLastname: "",
      userFirstname: "",
      userMiddlename: "",
      userSex: "",
      userRole: "",
      userBirthdate: "",
      userStatus: "",
      userCompany: " ",
      userProduct: "",
      userRates: "",
      userBalance: "",
      userId: "",
      userToken:"",
      userNotify:" ",

      openPassword: false,

      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",

      getLanguage:[],
      languageText: [],
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
      getUserInfo: response.data
    });

    this.setThisUserInfo(this.state.getUserInfo)
  }

  setThisUserInfo = (e) => {
    this.setState({
      userEmail: e.email,
      userUsername: e.username,
      userPassword: "*******",
      userLastname: e.lastname,
      userFirstname: e.firstname,
      userMiddlename: e.middlename,
      userSex: e.sex,
      userRole: e.type,
      userBirthdate:this.dateConverterBirthday(e.bday),
      userStatus: e.status,
      userCompany: e.company_name,
      userProduct: e.product_name,
      userRates: e.rates,
      userBalance: e.balance,
      userId: e.userId,
      userToken:this.props.token,
      userNotify:e.notify_url
    })
  };

  revealPassword = (e) => {
    console.log(e, "alyulol");
    let {formDynamicInputType1, formDynamicInputType2, formDynamicInputType3} = this.state;
    if (e === "1") {
      if (formDynamicInputType1 === "password") {
        this.setState({
          formDynamicInputType1: "text",
          formDyanamicIcon1: "eye-slash"
        })
      } else {
        this.setState({
          formDynamicInputType1: "password",
          formDyanamicIcon1: "eye"
        })
      }
    } else if (e === "2") {
      if (formDynamicInputType2 === "password") {
        this.setState({
          formDynamicInputType2: "text",
          formDyanamicIcon2: "eye-slash"
        })
      } else {
        this.setState({
          formDynamicInputType2: "password",
          formDyanamicIcon2: "eye"
        })
      }
    } else {
      if (formDynamicInputType3 === "password") {
        this.setState({
          formDynamicInputType3: "text",
          formDyanamicIcon3: "eye-slash"
        })
      } else {
        this.setState({
          formDynamicInputType3: "password",
          formDyanamicIcon3: "eye"
        })
      }
    }

  };

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
    // console.log(e.target.value)
  };


  openPasswordModal = () => {
    this.setState({
      openPassword: true
    })
  };


  handleChangeSexuser = (e) => {
    this.setState({
      userSex: e.target.value
    })
  };

  handleChangeStatusEdit = (e) => {
    this.setState({
      userStatus: e.target.value
    })
  };

  handleChangeRoleuser = (e) => {
    this.setState({
      userRole: e.target.value
    })
  };


  dateConverter = (e) => {
    let getUnix = new Date(e * 1000);
    let str = getUnix.toString();
    let res = str.split(" ");
    let dateFormat = " ";

    for (let i = 0; i < 5; i++) {
      dateFormat = dateFormat + " " + res[i]
    }
    return dateFormat
  };

  dateConverterBirthday = (e) => {
    let getUnix = new Date(e * 1000);
    let dateFormat = new Date(getUnix);
    let month = '' + (dateFormat.getMonth() + 1);
    let day = dateFormat.getDate();
    let year = dateFormat.getFullYear();
    let today = dateFormat.getDay();
    let returnDate = "";

    if (month < 10 && today < 10) {
      returnDate = year + "-0" + month + "-0" + today;

    } else {
      if (month < 10 && today > 10) {
        returnDate = year + "-0" + month + "-" + today;
      } else if (month > 10 && today < 10) {
        returnDate = year + "-" + month + "-0" + today;
      } else {
        returnDate = year + "-" + month + "-" + today;
      }
    }
    // console.log(returnDate);
    return returnDate
  };

  openPasswordModal = () => {
    this.setState({
      openPassword: true
    })
  };

  closePasswordModal = () => {
    this.setState({
      openPassword: false
    })
  };

  editUser = async () => {
    console.log(this.state.userEmail);
    console.log(this.props.userId);
    console.log(this.props.api);
    const res = await fetch(this.props.api + "/editmyprofile", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session")
      },
      body: JSON.stringify({
        "id": this.props.userId,

      })
    });
    const response = await res.json();
    console.log(response);
    if(response.message === "success") {
      return true
    } else {
      return false
    }
  };

  editUserModal = async () => {

    if (await this.editUser()) {
      this.success();
      this.getUserProfile()
      // console.log(this.state.viewAgentId)
    } else {
      this.error()
    }
  };

  changePassword = async () => {

    const res = await fetch(this.props.api + "/updatepassword", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session")
      },
      body: JSON.stringify({
        "userid": this.props.userId,
        "newpassword": this.state.newPassword,
        "oldpassword": this.state.oldPassword,
      })
    });
    const response = await res.json();
    console.log(response);
    if (response.message === "success") {
      return true
    } else {
      return false
    }
  };

  changePasswordModal = async () => {
    let {newPassword,newPasswordConfirm}=this.state;
    if (newPassword === newPasswordConfirm) {
      if (await this.changePassword()) {
        this.getUserProfile();
        this.success();
        this.closePasswordModal()
      } else {
        this.error()
      }

    } else {
      this.errorConfirm()
    }
  };

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
    console.log(e.target.value)
  };

  success = () => {
    Modal.success({
      title: 'success',
    });
  };

  error = () => {
    Modal.error({
      title: 'This is an error message',
      content: 'some messages...some messages...',
    });
  };

  errorConfirm = () => {
    Modal.error({
      title: 'New password incorrect!',
    });
  };

  componentDidMount() {
    this.getUserProfile()
    this.getLanguage()
  }

  componentWillMount(){
  }

  componentWillReceiveProps(nextProps){
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
   // console.log("getLanguage",response)
    this.setState({
     getLanguage: response.data
    });
    this.setlanguageText(this.props.language)
  }


    setlanguageText = async (e) => {
     await this.setState({
       languageText: {
         editProfile:'Edit Profile',
         email:'Email',
         username:'Username',
         password:'Password',
         change:'Change',
         firstname:'Firstname',
         lastname:'Lastname',
         middlename:'Middlename',
         gender:'Gender',
         role:'Role',
         birthdate:'Birthdate',
         status:'Status',
         company:'Company',
         product:'Product',
         token:'Token',
         userId:'User ID',
         change:'change',
         changePassword:'Change Password',
         oldPassword:'Old Password',
         newPassword:'New Password',
         confirmPassword:'Confirm Password'

       }
     })

     this.Language(e)
   }

   Language =  (e) =>{

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
      <div className="userprofile-component">
          <div className="flex-start">

            <div  style={{marginTop: "30px"}} className="user-card">
              <h3>{this.state.languageText.editProfile}</h3>

              <div className="user-form">
                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.email}</strong></label>
                  <input type="text" className="form-control" placeholder="Email" onChange={this.onChange}
                         name="userEmail" value={this.state.userEmail} disabled/>
                  <label htmlFor=""><strong>{this.state.languageText.username}</strong></label>
                  <input type="text" className="form-control" placeholder="Username" onChange={this.onChange}
                         name="userUsername" value={this.state.userUsername } disabled/>
                  <label htmlFor=""><strong>{this.state.languageText.password}</strong></label>
                  <div>
                    <input type="password" className="form-control" placeholder="Password" onChange={this.onChange}
                           name="userPassword" value={this.state.userPassword} disabled/>
                    <div className="input-group-password">
                      <div className="input-change-passowrd" onClick={this.openPasswordModal}>{this.state.languageText.change}</div>
                    </div>
                  </div>


                </div>

                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.firstname}</strong></label>
                  <input type="text" className="form-control" placeholder="Firstname" onChange={this.onChange}
                         name="userFirstname" value={this.state.userFirstname} disabled/>
                  <label htmlFor=""><strong>{this.state.languageText.lastname}</strong></label>
                  <input type="text" className="form-control" placeholder="Lastname" onChange={this.onChange}
                         name="userLastname" value={this.state.userLastname} disabled/>
                  <label htmlFor=""><strong>{this.state.languageText.middlename}</strong></label>
                  <input type="text" className="form-control" placeholder="Middlename" onChange={this.onChange}
                         name="userMiddlename" value={this.state.userMiddlename} disabled/>
                </div>

                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.gender}</strong></label>
                  <select className="form-control" onChange={this.handleChangeSexuser} value={this.state.userSex} disabled>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <label htmlFor=""><strong>{this.state.languageText.role}</strong></label>
                  <select className="form-control" onChange={this.handleChangeRoleuser} value={this.state.userRole}
                          disabled>
                    <option value="Merchant">Merchant</option>
                    <option value="Agent">Agent</option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>

                  <label htmlFor=""><strong>{this.state.languageText.status}</strong></label>
                  <select className="form-control" onChange={this.handleChangeStatusEdit} value={this.state.editStatus} disabled>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>

                </div>


                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.birthdate}</strong></label>
                  <input type="date" className="form-control" placeholder="Birthdate" onChange={this.onChange}
                         name="userBirthdate" value={this.state.userBirthdate} disabled/>

                  <label htmlFor=""><strong>{this.state.languageText.company}</strong></label>
                  <input type="text" className="form-control" placeholder="Company" name="userCompany"
                         onChange={this.onChange} value={this.state.userCompany} disabled/>

                  <label htmlFor=""><strong>{this.state.languageText.product}:</strong></label>
                  <input type="text" className="form-control" placeholder="Product" name="userProduct"
                         onChange={this.onChange} value={this.state.userProduct} disabled/>
                </div>



                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.token}</strong></label>
                  <input type="text" className="form-control" placeholder="Token" name="userToken" onChange={this.onChange} value={this.state.userToken} disabled/>

                  <label htmlFor=""><strong>{this.state.languageText.userId}</strong></label>
                  <input type="text" className="form-control" placeholder="User ID" name="userId" onChange={this.onChange} value={this.props.userId} disabled/>


                  <div   style={this.state.userRole  == "Admin" || this.state.userRole == "Agent" ? {display:"block"} : {display:"none"}} className="invisbile-block"></div>
                  <label  htmlFor="" style={this.state.userRole == "Merchant" || this.state.userRole == "User" ? {display:"block"} : {display:"none"}}><strong>Notify Url</strong></label>
                  <input  style={this.state.userRole  == "Merchant" || this.state.userRole == "User" ? {display:"block"} : {display:"none"}} type="text" className="form-control" placeholder="User ID" name="userId" onChange={this.onChange} value={this.state.userNotify} disabled/>


                </div>

              </div>


            </div>
          </div>

        <Modal
          title={this.state.languageText.changePassword}
          visible={this.state.openPassword}
          onOk={this.changePasswordModal}
          onCancel={this.closePasswordModal}
          maskClosable={true}
        >
          <div>
            <div>
              <input type={this.state.formDynamicInputType1} className="form-control" placeholder={this.state.languageText.oldPassword}
                     onChange={this.onChange} name="oldPassword" value={this.state.oldPassword}/>
              <div className="input-group-password">
                <FontAwesomeIcon className="user-icon-style input-group-password-icon"
                                 icon={this.state.formDyanamicIcon1} onClick={(e) => this.revealPassword("1")}/>
              </div>

            </div>
            <div>
              <input type={this.state.formDynamicInputType2} className="form-control" placeholder={this.state.languageText.newPassword}
                     onChange={this.onChange} name="newPassword" value={this.state.newPassword}/>
              <div className="input-group-password">
                <FontAwesomeIcon className="user-icon-style input-group-password-icon"
                                 icon={this.state.formDyanamicIcon2} onClick={(e) => this.revealPassword("2")}/>

              </div>
            </div>

            <div>
              <input type={this.state.formDynamicInputType3} className="form-control" placeholder={this.state.languageText.confirmPassword}
                     onChange={this.onChange} name="newPasswordConfirm" value={this.state.newPasswordConfirm}/>
              <div className="input-group-password">
                <FontAwesomeIcon className="user-icon-style input-group-password-icon"
                                 icon={this.state.formDyanamicIcon3} onClick={(e) => this.revealPassword("3")}/>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default UserProfile;
