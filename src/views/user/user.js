import React, {Component} from 'react';
import {Modal, Table, Input} from 'antd';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LoginLogs from './loginlogs.js';
import AgentChild from './agentchild/agentchild.js';
// import Highlighter from 'react-highlight-words';
import '../../css/views/user.css';


const $ = require('jquery');
// window.$ = $;
// $.DataTable = require('datatables.net-dt');

const confirm = Modal.confirm;
const Search = Input.Search;

class UserChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLists: [],
      showUserList: [],
      getAgentUser: [],
      getLoginLogs: [],
      openViewUser:false,
      openViewUserLoginLogs: false,
      openEditUser: false,
      openAddUser: false,
      openViewAgentUser: false,

      addAge: "",
      addEmail: "",
      addFirstname: "",
      addLastname: "",
      addMiddlename: "",
      addRates: "10",
      addBirthdate: new Date(),
      addRole: "Merchant",
      addSex: "Male",
      addStatus: "Single",
      addUsername: "",
      addPassword: "",
      addCompanyName: "",
      addProductName: "",
      addNotifyUrl:'',
      addBirthdate:'',

      editId: "",
      editAge: "",
      editEmail: "",
      editFirstname: "",
      editLastname: "",
      editMiddlename: "",
      editRates: "10",
      editRole: "",
      Birthdate: "",
      editSex: "",
      editStatus: "",
      editUsername: "",
      editPassword: "********",
      editBirthdate: "",
      editCompanyName: '',
      editProductName: '',
      editNotifyUrl:'',

      viewId: null,
      viewAge: null,
      viewBalance: null,
      viewBirthdate: null,
      viewCreated: null,
      viewEmail: null,
      viewFirstname: null,
      viewLastname: null,
      viewMiddlename: null,
      viewRates: "10",
      viewSex: null,
      viewStatus: null,
      viewRole: null,
      viewUsername: null,

      table: null,
      loginLogsId: null,
      viewAgentChildTitle: null,
      viewAgentId: null,

      getLanguage:[],
      languageText: [],

      openPassword: false,
      formDynamicInputType: "password",
      formDyanamicIcon: "eye",
    };

  }

  //CRUD
  addUser = async () => {
    const res = await fetch(this.props.api + "/users", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session")
      },
      body: JSON.stringify({
        "firstname": this.state.addFirstname,
        "lastname": this.state.addLastname,
        "middlename": this.state.addMiddlename,
        "sex": this.state.addSex,
        "status": this.state.addStatus,
        "bday": this.state.bday,
        "age": this.state.addAge,
        "type": this.state.addRole,
        "adminId": this.props.userId,
        "email": this.state.addEmail,
        "product_name": this.state.addProductName,
        "notify_url":this.state.addNotifyUrl,
        "company_name": this.state.addCompanyName,
        "rates": this.state.addRates,
        "username": this.state.addUsername,
        "password": this.state.addPassword
      })
    });
    const response = await res.json();
    if (response.message === "success") {
      return true
    } else {
      return false
    }
  };
  getUser = async () => {
    const res = await fetch(this.props.api + "/users", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "authentication": window.localStorage.getItem("session"),
        "idmaster": this.props.userId,
        'type': this.props.userRole,
        'typeofblock': 'unblock'
      },
    });
    const response = await res.json();
    console.log("getuser: ",response)
    this.setState({
      userLists: response.data,
      showUserList: response.data
    });
  };
  getAgentUser = async (e) => {
    const res = await fetch(this.props.api + "/users", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "authentication": window.localStorage.getItem("session"),
        "idmaster": e,
        'type': "Agent",
        'typeofblock': 'unblock'

      },
    });
    const response = await res.json();
    this.setState({
      getAgentUser: response.data
    });
  };
  getUserLoginLogs = async (e) => {
    const res = await fetch(this.props.api + "/loginlogs", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session"),
        "id": e
      },

    });
    const response = await res.json();
    this.setState({
      getLoginLogs: response.data
    })
  };
  removeDataTableActionSort = () => {
    let x = $(this.el).children('thead').children('tr').children('th').last();
    $(x[0]).css('display', 'none');
    let y = $(this.el).children('thead').children('tr').append('<th>Action</th>')
  };
  confirmUserDelete = (x, y) => {
    let that = this;
    confirm({
      title: 'Do you want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
        that.blockUserModal(x, y);
      },
      onCancel() {
      },
    });
  };
  blockUser = async (x, y) => {
    const res = await fetch(this.props.api + "/users", {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "authentication": window.localStorage.getItem("session")
      },
      body: JSON.stringify({
        "id": x,
        "userType": y,
        "typeofblock": "block"
      })
    });
    const response = await res.json();
    if (response.message === "success") {
      return true
    } else {
      return false
    }
  };
  blockUserModal = (x, y) => {
    let result = this.blockUser(x, y);
    if (result) {
      this.success();
      this.getUser();
    } else {
      Modal.error({
        title: 'This is an error message',
        maskClosable: 'false'
      });
    }
  };
  closeAddUserModal = () => {
    this.setState({
      openAddUser: false
    })
  };
  editUser = async () => {

    console.log(this.state.editBirthdate)

    const res = await fetch(this.props.api + "/users", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session")
      },
      body: JSON.stringify({
        "id": this.state.editId,
        "firstname": this.state.editFirstname,
        "lastname": this.state.editLastname,
        "middlename": this.state.editMiddlename,
        "sex": this.state.editSex,
        "status": this.state.editStatus,
        "age": this.state.editAge,
        "type": this.state.editRole,
        "bday": this.state.editBirthdate,
        "email": this.state.editEmail,
        "rates": this.state.editRates,
        "notify_url":this.state.editNotifyUrl,
        "product_name": this.state.editProductName,
        "company_name": this.state.editCompanyName,
        "username": this.state.editUsername,
      })
    });
    const response = await res.json();
    if (response.message === "success") {
      return true
    } else {
      return false
    }
  };

  editUserPassword = async () => {
    // console.log("id: ",this.state.editId)
    // console.log("editPassword: ",this.state.editPassword)

    const res = await fetch(this.props.api + "/adminchangepass", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session")
      },
      body: JSON.stringify({
        "id": this.state.editId,
        "password":this.state.editPassword
      })
    });

    const response = await res.json();
    console.log("editUserPassword: ",response)
    if (response.message === "success") {
      return true
    } else {
      return false
    }
  };



  //CRUD MODAL
  editUserModal = async () => {

    if (await this.editUser()) {
      this.getUser();
      this.closeEditUserModal();
      this.success();
      this.getAgentUser(this.state.viewAgentId)
    } else {
      this.error()
    }
  };
  addUserModal = async () => {
    if(this.validateAddUser()){
      // if (await this.addUser()) {
      //   this.getUser()
      //   this.closeAddUserModal();
      //   this.success()
      // } else {
      //   this.error()
      // }
      console.log('mother!')
    }else{
      this.errorUser()
    }



    // if (await this.addUser()) {
    //   this.getUser()
    //   this.closeAddUserModal();
    // } else {
    //   this.error()
    // }
  }

  //VALIDATION
  validateAddUser = () =>{
    if(this.isEmptyOrSpaces(this.state.addEmail)){
      return false

    }else if(this.isEmptyOrSpaces(this.state.addUsername)){
      return false
    }else if(this.isEmptyOrSpaces(this.state.addFirstname)){
      return false
    }else if(this.isEmptyOrSpaces(this.state.addLastname)){
      return false
    }else if(this.isEmptyOrSpaces(this.state.addMiddlename)){
      return false
    }else if(this.isEmptyOrSpaces(this.state.addCompanyName)){
      return false
    }else if(this.isEmptyOrSpaces(this.state.addProductName)){
      return false
    }else{
      return true
    }
  }

  isEmptyOrSpaces = (e) =>{
    let pattern =/^ *$/
    return pattern.test(e);
  }

  //OPEN MODAL
  openViewAgentUserModal = (e) => {
    this.getAgentUser(e)
    this.setState({
      openViewAgentUser: true,
    })
  }
  openAddUserModal = () => {
    this.setState({
      openAddUser: true
    })
  }
  openViewUserLoginLogsModal = (e) => {
    this.getUserLoginLogs(e)
    this.setState({
      openViewUserLoginLogs: true,
    })
  }
  openEditUserModal = (e) => {

    this.setState({
      editId: e._id,
      editEmail: e.email,
      editFirstname: e.firstname,
      editLastname: e.lastname,
      editMiddlename: e.middlename,
      editRates: e.rates,
      editRole: e.type,
      editSex: e.sex,
      editStatus: e.status,
      editUsername: e.username,
      editBirthdate: this.dateConverterBirthday(e.bday),
      editProductName: e.product_name,
      editCompanyName: e.company_name,
      editNotifyUrl:e.notify_url,
      openEditUser: true,
    })

  }
  openViewUser = (e) => {
    this.setState({
      viewId: e._id,
      viewAge: e.age,
      viewBalance: e.balance,
      viewBirthdate: this.dateConverterBirthday(e.bday),
      viewCreated: this.dateConverter(e["created_at"]),
      viewEmail: e.email,
      viewFirstname: e.firstname,
      viewLastname: e.lastname,
      viewMiddlename: e.middlename,
      viewRates: e.rate,
      viewSex: e.sex,
      viewStatus: e.status,
      viewRole: e.type,
      viewUsername: e.username,
      openViewUser: true,
    })

  };
  //CLOSE MODAL
  closeViewAgentUserModal = () => {
    console.log('yeah')
    this.setState({
      openViewAgentUser: false
    })
  };
  closeViewUser = () => {
    this.setState({
      openViewUser: false,
    })
  };
  closeViewUserLoginLogs = () => {
    this.setState({
      openViewUserLoginLogs: false,
    })
  };
  closeEditUserModal = () => {
    this.setState({
      openEditUser: false
    })
  };
  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});

  };
  handleChangeSex = (e) => {
    this.setState({
      addSex: e.target.value
    })
  };
  handleChangeStatus = (e) => {
    this.setState({
      addStatus: e.target.value
    })
  };
  handleChangeRole = (e) => {
    this.setState({
      addRole: e.target.value
    })
  };

  handleChangeSexEdit = (e) => {
    console.log(e.target.value)
    this.setState({
      editSex: e.target.value
    })
  };
  handleChangeStatusEdit = (e) => {
    console.log(e.target.value)

    this.setState({
      editStatus: e.target.value
    })
  };
  handleChangeRoleEdit = (e) => {
    console.log(e.target.value)

    this.setState({
      editRole: e.target.value
    })
  };

  checkRolesForStatus = () => {
    if (this.props.userRole == 'Agent') {
      this.setState({
        addRole: 'User'
      })
    }
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
    let returnDate = "";

    if (month < 10 && day < 10) {
      returnDate = year + "-0" + month + "-0" + day;

    } else {
      if (month < 10 && day > 10) {
        returnDate = year + "-0" + month + "-" + day;
      } else if (month > 10 && day < 10) {
        returnDate = year + "-" + month + "-0" + day;
      } else {
        returnDate = year + "-" + month + "-" + day;
      }
    }
    return returnDate
  };

  tableSort = (a, b, str) => {
    if (!isNaN(a[str])) {
      return parseFloat(a[str]) - parseFloat(b[str]);
    } else {
      return a[str].localeCompare(b[str])
    }
  }

  revealPassword = () => {
    let {formDynamicInputType} = this.state;
    if (formDynamicInputType === "password") {
      this.setState({
        formDynamicInputType: "text",
        formDyanamicIcon: "eye-slash"
      })
    } else {
      this.setState({
        formDynamicInputType: "password",
        formDyanamicIcon: "eye"
      })
    }
  };
  success = () => {
    Modal.success({
      title: 'success',
    });
  };


  error = () => {
    Modal.error({
      title: 'This is an error message',
    });
  };

  errorUser = () => {
    Modal.error({
      title: 'Missing Input!',
      content: 'please fill all input fields'
    });
  };


  searchkeyWords = (keyWords) => {
    let newUserList = [];
    let {userLists} = this.state;
    if (keyWords.trim() === "" || keyWords.trim() === null || keyWords.trim() === undefined) {
      this.getUser();
    } else {
      for (let obj in userLists) {
        for (let item in userLists[obj]) {
          if (userLists[obj][item] != undefined) {
            let result=userLists[obj][item].toString().toLowerCase().includes(keyWords.toLowerCase());
            if(result){
              newUserList.push(userLists[obj]);
              break;
            }
          }
        }
      }
      this.setState({
        showUserList:newUserList
      })
    }
  };

  tableOnChange =(pagination, filters, sorter)=>{
    console.log('params', pagination, filters, sorter);
  };


    componentDidMount() {
      this.getUser();
      this.getLanguage();
      this.checkRolesForStatus();
      this.removeDataTableActionSort();
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

           name:'Name',

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
           notifyUrl:'Notify Url',

           viewLoginlogs:'View Login Logs',
           editUser:'Edit User',
           viewUser:'View User',
           addUser:'Add User',
           search:'Search'
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

   openPasswordModal = () => {
     this.setState({
       openPassword: true
     })
   }

   closePasswordModal = () => {
     this.setState({
       openPassword: false
     })
   }

   changePasswordModal = async () => {
     if (await this.editUserPassword()) {
       this.success();
       this.closePasswordModal()
     } else {
       this.error()
     }
   };



  render() {

    this.columns = [
      {title: 'No.', dataIndex: '', key: 'key', width: '20px',
        render: (text, record, index) => {return index + 1},},
      {title: this.state.languageText.idUser, dataIndex: '_id',sorter: (a, b) => this.tableSort (a, b,"_id")},
      {title: this.state.languageText.dateCreated, dataIndex: 'created_at',
        sorter: (a, b) => this.tableSort (a, b,"created_at"),
        render: (text, record, index) => {return this.dateConverter(record["created_at"])}},
      {title: this.state.languageText.role, dataIndex: 'type',
        filters: [{ text: 'Merchant', value: 'Merchant' }, { text: 'Agent', value: 'Agent' }],
        filterMultiple:false,
        onFilter: (value, record) => record.type.indexOf(value) === 0},
      {title: this.state.languageText.email, dataIndex: 'email'},
      {title:this.state.languageText.username, dataIndex: 'username',  sorter: (a, b) => this.tableSort (a, b,"username")},
      {title: this.state.languageText.product, dataIndex: 'product_name'},

      {title: this.state.languageText.company, dataIndex: 'company_name'},
       {
        title:this.state.languageText.action, dataIndex: 'operation', width: '285px',
        render: (text, record) => {
          return (
            <div style={{width: '270px'}}>
              <a onClick={() => this.openViewUserLoginLogsModal(record._id)}>{this.state.languageText.logs}</a>
              <a onClick={() => this.openEditUserModal(record)}>{this.state.languageText.edit}</a>
              <a onClick={() => this.confirmUserDelete(record._id, record.type)}>{this.state.languageText.block}</a>
              <a style={record.type === "Agent" ? {display: "inline-block"} : {display: "none"}}
                 onClick={() => this.openViewAgentUserModal(record._id)}>{this.state.languageText.viewMerchant}</a>
            </div>
          );
        },
      },
    ];

    let {showUserList} = this.state;
    return (
      <div className="user-component">
        <div className="user-container">
          <div className="user-btn-container flex-end">
            <Search placeholder={this.state.languageText.search} onSearch={(e) => this.searchkeyWords(e)} enterButton
                    style={{width: 260}}/>
            <div className="btn btn-primary btn-sm" onClick={()=>this.getUser()} style={{margin:"0 15px"}}>{this.state.languageText.reset}</div>
            <div className="btn btn-primary btn-sm" onClick={this.openAddUserModal}>{this.state.languageText.addUser}</div>
          </div>
          <div className="user-datatable">
          <Table columns={this.columns} dataSource={showUserList}
                 rowKey={record => record._id}
                 onChange={this.tableOnChange}
                 expandedRowRender={record =>
                     <ul>
                       <li><span className="user-view-span">{this.state.languageText.balance}:</span> {record.balance}</li>
                       <li><span className="user-view-span">{this.state.languageText.name}:</span> {record.firstname}</li>
                       <li><span className="user-view-span">{this.state.languageText.gender}:</span> {record.sex}</li>
                       <li><span className="user-view-span">{this.state.languageText.status}:</span> {record.status}</li>
                       <li><span className="user-view-span">{this.state.languageText.birthdate}:</span> {this.dateConverterBirthday(record.bday)}</li>
                     </ul>
                 }
            />
          </div>

          <Modal
               title={this.state.languageText.viewUser}
               visible={this.state.openViewUser}
               onOk={this.closeViewUser}
               onCancel={this.closeViewUser}
               maskClosable={true}>
               <div>
                 <div><strong>Id:</strong> {this.state.viewId} </div>
                 <div><strong>{this.state.languageText.dateCreated}</strong> {this.state.viewCreated} </div>
                 <div><strong>{this.state.languageText.role}</strong> {this.state.viewRole} </div>
                 <div><strong>{this.state.languageText.balance}</strong> {this.state.viewBalance} </div>
                 <div><strong>{this.state.languageText.rates}</strong> {this.state.viewRates}% </div>
                 <div><strong>{this.state.languageText.email}</strong> {this.state.viewEmail} </div>
                 <div><strong>{this.state.languageText.username}</strong> {this.state.viewUsername} </div>
                 <div><strong>{this.state.languageText.name}</strong> {this.state.viewFirstname}  {this.state.viewLastname}  {this.state.viewMiddlename}  </div>
                 <div><strong>{this.state.languageText.sex}</strong> {this.state.viewSex} </div>
                 <div><strong>{this.state.languageText.status}</strong> {this.state.viewStatus} </div>
                 <div><strong>{this.state.languageText.age}</strong> {this.state.viewAge} </div>
                 <div><strong>{this.state.languageText.birthday}</strong> {this.state.viewBirthdate} </div>
               </div>
             </Modal>

          <Modal
            title={this.state.languageText.addUser}
            visible={this.state.openAddUser}
            onOk={this.addUserModal}
            destroyOnClose={true}
            onCancel={this.closeAddUserModal}
            maskClosable={false}
            width={820}>
            <div>
              <div className="user-form">
                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.email}</strong></label>
                  <input type="text" className="form-control" placeholder ="Email" onChange={this.onChange} name="addEmail"/>

                  <label htmlFor=""><strong>{this.state.languageText.username}</strong></label>
                  <input type="text" className="form-control" placeholder="Username" onChange={this.onChange} name="addUsername"/>

                  <label htmlFor=""><strong>{this.state.languageText.password}</strong></label>
                  <input type="password" className="form-control" placeholder="Password" onChange={this.onChange}name="addPassword"/>
                </div>

                <div className="flex-around user-form-container">

                  <label htmlFor=""><strong>{this.state.languageText.firstname}</strong></label>
                  <input type="text" className="form-control" placeholder="Firstname" onChange={this.onChange} name="addFirstname"/>

                  <label htmlFor=""><strong>{this.state.languageText.lastname}</strong></label>
                  <input type="text" className="form-control" placeholder="Lastname" onChange={this.onChange} name="addLastname"/>

                  <label htmlFor=""><strong>{this.state.languageText.middlename}</strong></label>
                  <input type="text" className="form-control" placeholder="Middlename" onChange={this.onChange} name="addMiddlename"/>
                </div>

                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.gender}</strong></label>
                  <select className="form-control" onChange={this.handleChangeSex} value={this.state.addSex}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <label htmlFor=""><strong>{this.state.languageText.role}</strong></label>
                  <select className="form-control" onChange={this.handleChangeRole} value={this.state.addRole} style={this.props.userRole === "Admin" ? {display: "block"} : {display: "none"}}>
                    <option value="Merchant">Merchant</option>
                    <option value="Agent">Agent</option>
                  </select>

                  <select className="form-control" onChange={this.handleChangeRole} value={this.state.addRole} style={this.props.userRole === "Agent" ? {display: "block"} : {display: "none"}}>
                    <option value="User">User</option>
                  </select>
                </div>
                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.birthdate}</strong></label>
                  <input type="date" className="form-control" placeholder="Birthdate" name="addBirthdate" onChange={this.onChange}/>
                  <label htmlFor=""><strong>{this.state.languageText.status}</strong></label>

                  <select className="form-control" onChange={this.handleChangeStatus} value={this.state.addStatus}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.company}</strong></label>
                  <input type="text" className="form-control" placeholder="Company" name="addCompanyName"
                         onChange={this.onChange}/>

                  <label htmlFor=""><strong>{this.state.languageText.product}</strong></label>
                  <input type="text" className="form-control" placeholder="Product" name="addProductName"
                         onChange={this.onChange}/>
                </div>



                <div className="user-form-container flex-around">

                  <label htmlFor=""><strong>{this.state.languageText.rates}</strong></label>
                  <input  type="text" className="form-control" placeholder="Rates" name="addRates" onChange={this.onChange}/>

                  <div className="invisible-div"  style={this.state.addRole === "Agent" ? {display: "block",height:"10px",width:"320px"} : {display: "none"}} ></div>

                  <label  style={this.state.addRole === "Merchant" ? {display: "block"} : {display: "none"}} htmlFor=""><strong>{this.state.languageText.notifyUrl}</strong></label>
                  <input  style={this.state.addRole === "Merchant" ? {display: "block"} : {display: "none"}} type="text" className="form-control" placeholder="Notify Url" name="addNotifyUrl" onChange={this.onChange}/>

               </div>

              </div>
            </div>
          </Modal>

          <Modal
            title={"Agent: " + this.state.viewEmail}
            visible={this.state.openViewAgentUser}
            onOk={this.closeViewAgentUserModal}
            destroyOnClose={true}
            onCancel={this.closeViewAgentUserModal}
            maskClosable={true}
            width={1300}>
            <AgentChild api={this.props.api} getAgentUser={this.state.getAgentUser}
                        openEditUserModal={(e) => this.openEditUserModal(e)} openViewUser={(e) => this.openViewUser(e)}
                        openViewUserLoginLogsModal={(e) => this.openViewUserLoginLogsModal(e)}
                        confirmUserDelete={(e) => this.confirmUserDelete(e)} language={this.props.language} getLanguage={this.state.getLanguage} closeViewAgentUserModal={this.closeViewAgentUserModal}/>
          </Modal>

          <Modal title={this.state.languageText.viewLoginlogs}
            visible={this.state.openViewUserLoginLogs}
            onOk={this.closeViewUserLoginLogs}
            onCancel={this.closeViewUserLoginLogs}
            maskClosable={true} width={920}>
            <div>
              <LoginLogs api={this.props.api} getLoginLogs={this.state.getLoginLogs} language={this.props.language}/>
            </div>
          </Modal>

          <Modal
            title={this.state.languageText.editUser}
            visible={this.state.openEditUser}
            onOk={this.editUserModal}
            onCancel={this.closeEditUserModal}
            maskClosable={true}
            width={920}
            destroyOnClose={true}>
            <div>
              <div className="user-form">
                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.email}</strong></label>
                  <input type="email" className="form-control" placeholder="Email" onChange={this.onChange}
                         name="editEmail" value={this.state.editEmail}/>
                  <label htmlFor=""><strong>{this.state.languageText.username}</strong></label>
                  <input type="text" className="form-control" placeholder="Username" onChange={this.onChange}
                         name="editUsername" value={this.state.editUsername}/>
                  <label htmlFor=""><strong>{this.state.languageText.password}</strong></label>
                  <div>
                    <input type="password" className="form-control" placeholder="Password" onChange={this.onChange}
                           disabled/>
                    <div className="input-group-password">
                      <div className="input-change-passowrd" onClick={this.openPasswordModal}>{this.state.languageText.change}</div>
                    </div>
                  </div>

                </div>




                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.firstname}</strong></label>
                  <input type="text" className="form-control" placeholder="Firstname" onChange={this.onChange}
                         name="editFirstname" value={this.state.editFirstname}/>
                  <label htmlFor=""><strong>{this.state.languageText.lastname}</strong></label>
                  <input type="text" className="form-control" placeholder="Lastname" onChange={this.onChange}
                         name="editLastname" value={this.state.editLastname}/>
                  <label htmlFor=""><strong>{this.state.languageText.middlename}</strong></label>
                  <input type="text" className="form-control" placeholder="Middlename" onChange={this.onChange}
                         name="editMiddlename" value={this.state.editMiddlename}/>
                </div>

                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.gender}</strong></label>
                  <select className="form-control" onChange={this.handleChangeSexEdit} value={this.state.editSex}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <label htmlFor=""><strong>{this.state.languageText.role}</strong></label>
                  <select className="form-control" onChange={this.handleChangeRoleEdit} value={this.state.editRole}
                          style={this.state.editRole !== "User" ? {display: "block"} : {display: "none"}} disabled>
                    <option value="Merchant">Merchant</option>
                    <option value="Agent">Agent</option>
                  </select>

                  <select className="form-control" onChange={this.handleChangeRoleEdit} value={this.state.editRole}
                          style={this.state.editRole === "User" ? {display: "block"} : {display: "none"}}>
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.birthdate}</strong></label>
                  <input type="date" className="form-control" placeholder="Birthdate" onChange={this.onChange}
                         name="editBirthdate" value={this.state.editBirthdate}/>

                  <label htmlFor=""><strong>{this.state.languageText.status}</strong></label>
                  <select className="form-control" onChange={this.handleChangeStatusEdit} value={this.state.editStatus}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>

                <div className="flex-around user-form-container">
                  <label htmlFor=""
                         style={this.state.editRole === "Agent" ? {display: "none"} : {display: "block"}}><strong>{this.state.languageText.rates}</strong></label>
                  <input style={this.state.editRole === "Agent" ? {display: "none"} : {display: "block"}} type="text"
                         className="form-control" placeholder="Rates" onChange={this.onChange} name="editRates"
                         value={this.state.editRates}/>
               <label htmlFor=""
                      style={this.state.editRole === "Merchant" || this.state.editRole === "User" ? {display: "block"} : {display: "none"}}><strong>{this.state.languageText.notifyUrl}</strong></label>
                 <input style={this.state.editRole === "Merchant" | this.state.editRole === "User" ? {display: "block"} : {display: "none"}} type="text"
                        className="form-control" placeholder="Notify Url" onChange={this.onChange} name="editNotifyUrl"
                        value={this.state.editNotifyUrl}/>
                </div>

                <div className="flex-around user-form-container">
                  <label htmlFor=""><strong>{this.state.languageText.company}</strong></label>
                  <input type="text" className="form-control" placeholder="Company" name="editProductName"
                         onChange={this.onChange} value={this.state.editProductName}/>


                  <label htmlFor=""><strong>{this.state.languageText.product}</strong></label>
                  <input type="text" className="form-control" placeholder="Product" name="editCompanyName"
                         onChange={this.onChange} value={this.state.editCompanyName}/>
                </div>
              </div>
            </div>
          </Modal>



          <Modal
            title="Change Password"
            visible={this.state.openPassword}
            onOk={this.changePasswordModal}
            onCancel={this.closePasswordModal}
            maskClosable={true}>
            <div>
              <div>
                <input type={this.state.formDynamicInputType} className="form-control" placeholder="New Password"
                       onChange={this.onChange}  name="editPassword"/>
                <div className="input-group-password">
                  <FontAwesomeIcon className="user-icon-style input-group-password-icon"
                                   icon={this.state.formDyanamicIcon} onClick={this.revealPassword}/>
                </div>
              </div>

            </div>
          </Modal>

        </div>
      </div>

    );
  }
}

export default UserChild;
