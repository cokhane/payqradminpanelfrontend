import React, {Component} from 'react'
import {Modal, Form, Icon, Input} from 'antd';


const $ = require('jquery');
window.$ = $;
$.DataTable = require('datatables.net-dt');

const confirm = Modal.confirm;


class AgentChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openViewUser: false,
      openViewUserLoginLogs: false,

      viewId: null,
      viewAge: null,
      viewBalance: null,
      viewCreated: null,
      viewEmail: null,
      viewFirstname: null,
      viewLastname: null,
      viewMiddlename: null,
      viewRates: null,
      viewSex: null,
      viewStatus: null,
      viewRole: null,
      viewUsername: null,


      editAge: null,
      editEmail: null,
      editFirstname: null,
      editLastname: null,
      editMiddlename: null,
      editRates: null,
      editRole: null,
      editSex: null,
      editStatus: null,
      editUsername: null,
      editPassword: null,
      editBirthdate: null,


      getAgentUser: this.props.getAgentUser,
      table: null,

      getLoginLogs: [],
      getLanguage:this.props.getLanguage,
      languageText: [],

    }
  }

  //CRUD
  getUserLoginLogs = async () => {
    console.log(this.state.viewId)
    const res = await fetch(this.props.propsApi + "/loginlogs", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session"),
        "id": this.state.viewId
      },

    })
    const response = await res.json()
    this.setState({
      getLoginLogs: response.data
    })
  }


  pushUserDataInTable = (e) => {
    var j = 1;
    e.forEach(items => {
      let id = items._id
      let created = this.dateConverter(items.created_at)
      let role = items.type
      let email = items.email
      let username = items.username
      let product = items.product_name
      let company = items.company_name
      // let actionButton = '<div class="actionBtn"><button class="btn btn-primary btn-sm view" value="' + id + '">View</button> <button class="btn btn-danger btn-sm block" value="' + id + '">Block</button></div> '
      let actionButton = `
        <div class="row">
          <div class="col-sm-2 actionBtn"> <button class="btn btn-primary btn-sm view" value=${id}>${this.state.languageText.view} </button></div>
          <div class="col-sm-2 actionBtn"> <button class="btn btn-primary btn-sm logs" value=${id}>${this.state.languageText.logs}</button></div>
          <div class="col-sm-2 actionBtn"> <button class="btn btn-primary btn-sm edit" value=${id}>${this.state.languageText.edit}</button></div>
          <div class="col-sm-2 actionBtn"> <button class="btn btn-primary btn-sm block" value=${id}>${this.state.languageText.block}</button></div>
      </div>
      `
      this.state.table.row.add([j, id, created, role, email, username, product, company, actionButton])
      j++;
    })
  }

  //SET DATA TABLES
  setData = async (e) => {
    await this.setState({
      getAgentUser: e
    })
    const getAgentUserDataTable = this.state.getAgentUser;
    this.state.table.clear();
    this.pushUserDataInTable(getAgentUserDataTable);
    this.state.table.draw()
  }

  setTable = () => {
    this.$el = $(this.el)
    this.state.table = this.$el.DataTable()
    this.setButtonForTables()
  }

  setButtonForTables = () => {
    $(this.$el).on('click', 'tbody tr td .actionBtn .view', (event) => {
      event.stopPropagation();
      this.dynamicID = event.target.value
      for (let i = 0; i < this.state.getAgentUser.length; i++) {
        if (this.dynamicID === this.state.getAgentUser[i]._id) {
          this.props.openViewUser(this.state.getAgentUser[i]);
          this.props.closeViewAgentUserModal()
          console.log(this.props)

        }
      }
    });

    $(this.$el).on('click', 'tbody tr td .actionBtn .logs', (event) => {
      event.stopPropagation();
      this.dynamicID = event.target.value
      this.props.openViewUserLoginLogsModal(this.dynamicID)
      this.props.closeViewAgentUserModal()



    });

    $(this.$el).on('click', 'tbody tr td .actionBtn .edit', (event) => {
      event.stopPropagation();
      this.dynamicID = event.target.value
      for (let i = 0; i < this.state.getAgentUser.length; i++) {
        if (this.dynamicID == this.state.getAgentUser[i]._id) {
          this.props.openEditUserModal(this.state.getAgentUser[i])
          this.props.closeViewAgentUserModal()

        }
      }
    });

    $(this.$el).on('click', 'tbody tr td .actionBtn .block', (event) => {
      event.stopPropagation();
      this.dynamicID = event.target.value

      for (let i = 0; i < this.state.getAgentUser.length; i++) {
        if (this.dynamicID == this.state.getAgentUser[i]._id) {
          this.props.confirmUserDelete(this.state.getAgentUser[i]._id, this.state.getAgentUser[i].type)
        }
      }
      // this.props.confirmUserDelete(this.dynamicID)
    });
  }

  editUser = async () => {
    console.log(this.state.viewId)
    const res = await fetch(this.props.propsApi + "/users", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session")
      },
      body: JSON.stringify({
        "id": this.state.viewId,
        "firstname": this.state.editFirstname,
        "lastname": this.state.editLastname,
        "middlename": this.state.editMiddlename,
        "sex": this.state.editSex,
        "status": this.state.editStatus,
        "age": this.state.editAge,
        "type": this.state.editRole,
        "email": this.state.editEmail,
        "rates": this.state.editRates,
        "username": this.state.editUsername,
      })
    })
    const response = await res.json()
    if (response.message == "success") {
      return true
    } else {
      return false
    }
  }

  //MODAL
  editUserModal = async () => {
    if (await this.editUser()) {
      this.closeEditUserModal();
      this.success()
    } else {
      this.error()
    }
  }

  closeEditUserModal = () => {
    this.setState({
      openEditUser: false
    })
  }

  blockUserModal = async (e) => {
    if (await this.blockUser(e)) {
      this.success()
      this.closeViewUser()
    } else {
      Modal.error({
        title: 'This is an error message',
        maskClosable: 'false'
      });
    }
  }

  dateConverter = (e) => {
    let getUnix = new Date(e * 1000)
    let str = getUnix.toString();
    let res = str.split(" ");
    let dateFormat = " "

    for (let i = 0; i < 5; i++) {
      dateFormat = dateFormat + " " + res[i]
    }
    return dateFormat
  }


  //OPEN MODAL
  openViewUserLoginLogsModal = () => {
    this.getUserLoginLogs()
    this.setState({
      openViewUserLoginLogs: true,
      openViewUser: false
    })
  }

  openEditUserModal = (e) => {
    this.setState({
      editAge: null,
      editEmail: this.state.viewEmail,
      editFirstname: this.state.viewFirstname,
      editLastname: this.state.viewLastname,
      editMiddlename: this.state.viewMiddlename,
      editRates: this.state.viewRates,
      editRole: this.state.viewRole,
      editSex: this.state.viewSex,
      editStatus: this.state.viewStatus,
      editUsername: this.state.viewUsername,
      editPassword: '*********',
      editBirthdate: '01-02-1994',
      openEditUser: true,
      openViewUser: false
    })
  };


  //CLOSE MODAL
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

  confirmUserDelete = (e) => {
    const deletePassFunction = this.blockUserModal;
    confirm({
      title: 'Do you want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
        deletePassFunction(e);
      },
      onCancel() {
      },
    });
  };

  //MODAL POP UP
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

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  };

  handleChangeSexEdit = (e) => {
    this.setState({
      editSex: e.target.value
    })
  };

  handleChangeStatusEdit = (e) => {
    this.setState({
      editStatus: e.target.value
    })
  };

  handleChangeRoleEdit = (e) => {
    this.setState({
      editRole: e.target.value
    })
  };

  componentDidMount() {

    this.setTable()
    this.setlanguageText(this.props.language)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.path !== this.props.getAgentUser) {
      this.setData(nextProps.getAgentUser)
    }
  }



    setlanguageText = async (e) => {
      console.log(e)
     await this.setState({
       languageText: {
         users:'Users',
         blockedUsers:'Blocked Users',
         reset:'Reset',
         addUser:'Add User',
         idUser:'ID',
         dateCreated:'Date Created',
         role:'Role',
         email:'Email',
         username:'Username',
         company:'Company',
         product:'Product',
         action:'Action',
         view:'View',
         logs:'Logs',
         edit:'Edit',
         block:'Block',
         qrCodeId:'Qr ID',
         viewMerchant:'View Merchant',
       }
     })

     this.translateLanguage(e)
   }



 translateLanguage =  (e) =>{
   console.log("user: ", e)

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
      <div className="agent-child-component">
        <div className="agent-child">
          <table className="display" width="100%" ref={el => this.el = el}>
            <thead>
            <tr>
              <th>No.</th>
              <th>{this.state.languageText.idUser}</th>
              <th style={{width: "330px"}}> {this.state.languageText.dateCreated}</th>
              <th>{this.state.languageText.role}</th>
              <th>{this.state.languageText.emai}</th>
              <th>{this.state.languageText.username}</th>
              <th>{this.state.languageText.product}</th>
              <th>{this.state.languageText.company}</th>
              <th style={{width: "600px"}}>{this.state.languageText.action}</th>
            </tr>
            </thead>
          </table>
        </div>

      </div>
    );
  }
}

export default AgentChild;
