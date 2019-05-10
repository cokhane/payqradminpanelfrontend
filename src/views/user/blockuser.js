import React, {Component} from 'react';
import {Modal, Form, Icon, Input, Table} from 'antd';

import '../../css/views/blockuser.css';


const $ = require('jquery');
window.$ = $;
$.DataTable = require('datatables.net-dt');

const confirm = Modal.confirm;
const Search = Input.Search;


class BlockUserChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getBlockedUser: null,
      table: null,
      getLanguage:[],
      languageText: [],
      userLists: [],
      showUserList: [],
    }
  }

  getBlockedUser = async () => {
    const res = await fetch(this.props.api + "/users", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "authentication": window.localStorage.getItem("session"),
        "idmaster": this.props.userId,
        'type': this.props.userRole,
        'typeofblock': 'block'
      },
    })
    const response = await res.json()
    console.log("getBlockedUser", response)
    this.setState({
      userLists: response.data,
      showUserList: response.data
    });
    //
    // const getBlockedUserDataTable = this.state.getBlockedUser;
    // this.state.table.clear();
    // this.pushUserDataInTable(getBlockedUserDataTable);
    // this.state.table.draw()
  }

  confirmUserDelete = (x, y) => {
    const deletePassFunction = this.blockUserModal
    confirm({
      title: 'Do you want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk() {
        deletePassFunction(x, y);
      },
      onCancel() {
      },
    });
  }

  blockUserModal = async (x, y) => {
    if (await this.blockUser(x, y)) {
      this.success()
      this.getBlockedUser()
    } else {
      Modal.error({
        title: 'This is an error message',
        maskClosable: 'false'
      });
    }
  }

  blockUser = async (x, y) => {
    console.log("id: ", x)
    console.log("type: ", y)
    const res = await fetch(this.props.api + "/users", {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "authentication": window.localStorage.getItem("session")
      },
      body: JSON.stringify({
        "id": x,
        "userType": y,
        "typeofblock": "unblock"
      })
    })
    const response = await res.json()
    console.log(response)

    if (response.message == "success") {
      return true
    } else {
      return false
    }

  }


  pushUserDataInTable = (e) => {
    var j = 1;
    e.forEach(items => {
      let id = items._id
      let created = this.dateConverter(items.created_at)
      let role = items.type
      let email = items.email
      let username = items.username
      let company = items.company_name
      let product = items.product_name
      let actionButton = '<div class="row"> <div class="col-sm-2 actionBtn"> <button class="btn btn-primary btn-sm unblock" value="' + id + '">Unblock</button> </div>'

      this.state.table.row.add([j, id, created, role, email, username, company, product, actionButton])
      j++;
    })
  }

  setTable = () => {
    this.$el = $(this.el)
    this.state.table = this.$el.DataTable()
    this.setButtonForTables()
  }

  setButtonForTables = () => {
    $(this.$el).on('click', 'tbody tr td .actionBtn .unblock', (event) => {
      event.stopPropagation();
      this.dynamicID = event.target.value


      for (let i = 0; i < this.state.getBlockedUser.length; i++) {
        if (this.dynamicID == this.state.getBlockedUser[i]._id) {
          this.confirmUserDelete(this.state.getBlockedUser[i]._id, this.state.getBlockedUser[i].type)
        }
      }
    });
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

  dateConverterBirthday = (e) => {
    let getUnix = new Date(e * 1000)

    let dateFormat = new Date(getUnix)
    let month = '' + (dateFormat.getMonth() + 1)
    let day = dateFormat.getDate()
    let year = dateFormat.getFullYear()
    let today = dateFormat.getDay()
    let returnDate = ""

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

    return returnDate
  }


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

  componentDidMount() {
    this.getBlockedUser()
    this.getLanguage()
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
   console.log("getLanguage",response)
    this.setState({
     getLanguage: response.data
    });
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
         email:'Email',
         username:'Username',
         company:'Company',
         product:'Product',
         action:'Action',
         logs:'Logs',
         edit:'Edit',
         unBlock:'Unblock',
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



 sort123 = (a, b, str) => {
     if (!isNaN(a[str])) {
       return parseFloat(a[str]) - parseFloat(b[str]);
     } else {
       return a[str].localeCompare(b[str])
     }
 }


  render() {

    this.columns = [
      {title: 'No.', dataIndex: '', key: 'key', width: '20px',
        render: (text, record, index) => {return index + 1},},
      {title: this.state.languageText.idUser, dataIndex: '_id',sorter: (a, b) => this.sort123 (a, b,"_id")},
      {title: this.state.languageText.dateCreated, dataIndex: 'created_at',
        sorter: (a, b) => this.sort123 (a, b,"created_at"),
        render: (text, record, index) => {return this.dateConverter(record["created_at"])}},
      {title: this.state.languageText.role, dataIndex: 'type',
        filters: [{ text: 'Merchant', value: 'Merchant' }, { text: 'Agent', value: 'Agent' }],
        filterMultiple:false,
        onFilter: (value, record) => record.type.indexOf(value) === 0},
      {title: this.state.languageText.email, dataIndex: 'email'},
      {title:this.state.languageText.username, dataIndex: 'username',  sorter: (a, b) => this.sort123 (a, b,"username")},
      {title: this.state.languageText.product, dataIndex: 'product_name'},
      
      {title: this.state.languageText.company, dataIndex: 'company_name'},
      {
        title:this.state.languageText.action, dataIndex: 'operation', width: '285px',
        render: (text, record) => {
          return (
            <div style={{width: '270px'}}>
              <a onClick={() => this.confirmUserDelete(record._id, record.type)}>{this.state.languageText.unBlock}</a>
            </div>
          );
        },
      },
    ];

    return (
      <div className="block-user-component">
        <div className="block-user-datatable">
          <Table columns={this.columns} dataSource={this.state.showUserList}
                 rowKey={record => record._id}
                 onChange={this.tableOnChange}
                 expandedRowRender={record =>
                     <ul>
                       <li>Balance: {record.balance}</li>
                       <li>Name: {record.firstname} {record.middlename} {record.lastname}</li>
                       <li>Gender: {record.sex}</li>
                       <li>Status: {record.status}</li>
                       <li>Age: {record.age}</li>
                       <li>Birthday: {this.dateConverter(record.bday)}</li>
                     </ul>
                 }
          />
        </div>
      </div>
    );
  }
}

export default BlockUserChild;
