import React, { Component } from 'react';
import '../../css/views/balancerequest.css';
import {Modal,Table, Form, Icon,Input} from 'antd';

var io =  require('socket.io-client')
const socket = io('https://api.payqr.cash/');
const Search = Input.Search;



var $ = require('jquery');
window.$ = $;
$.DataTable = require('datatables.net-dt');

class BalanceRequest extends Component {
  constructor(props){
    super(props);
      this.state = {
        balanceRequest:[],
        balanceRequestList:[],
        balanceApprove:[],
        balanceRevoke:[],
        table:null,
        getLanguage:[],
        languageText: [],
    }
  }

  //CRUD
  getBalanceRequest = async () => {
    const res = await fetch(this.props.api+"/adminbalance",{
       method:'GET',
       headers: {
         'Content-Type': 'application/json',
         "authentication": window.localStorage.getItem("session")
       },
     })
     const response = await res.json()
     console.log("getBalanceRequest: ",response)
         this.setState({
           balanceRequest: response.data,
           balanceRequestList:response.data
         });
  }

  searchkeyWords = (keyWords) => {
    let newUserList = [];
    let {balanceRequestList} = this.state;
    if (keyWords.trim() === "" || keyWords.trim() === null || keyWords.trim() === undefined) {
      this.getBalanceRequest();
    } else {
      for (let obj in balanceRequestList) {
        for (let item in balanceRequestList[obj]) {
          if (balanceRequestList[obj][item] != undefined) {
            let result=balanceRequestList[obj][item].toString().toLowerCase().includes(keyWords.toLowerCase());
            if(result){
              newUserList.push(balanceRequestList[obj]);
              break;
            }
          }
        }
      }
      this.setState({
        balanceRequest:newUserList
      })
    }
  };

  approveRequestBalance = async (e) =>{

    const res = await fetch(this.props.api+"/adminbalance",{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session")
      },
      // [transactionId,userId,requestBalance]
      body:JSON.stringify({
        "id": e._id,
        "user_id":e.user_id,
        "balance":e.balance
      })
    })

    const response = await res.json()

    console.log("approveRequestBalance",response)

    if (response.message == "success" ) {
        return true
    } else {
        return false
    }
  }


  revokeRequestBalance = async (e) =>{

    const res = await fetch(this.props.api+"/adminbalance",{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json',
        "authentication": window.localStorage.getItem("session")
      },
      // [transactionId,userId,requestBalance]
      body:JSON.stringify({
        "id": e._id,
        "user_id":e.user_id,
        "balance":e.balance
      })
    })

    const response = await res.json()
    console.log(response)
    if (response.message == "success" ) {
        return true
    } else {
        return false
    }
  }

  approveRequestBalanceModal = async (e) =>{
    if(await this.approveRequestBalance(e)){
      this.getBalanceRequest()
      this.success()
    }else{
      this.error()
    }
  }


  revokeRequestBalanceModal = async (e) =>{
    if(await this.revokeRequestBalance(e)){
      this.getBalanceRequest()
      this.success()
    }else{
      this.error()
    }
  }

  dateConverter = (e) => {
    let getUnix = new Date(e*1000)
    let str =getUnix.toString();
    let res = str.split(" ");
    let dateFormat = " "

    for(let i = 0; i < 5; i++){
     dateFormat = dateFormat + " " + res[i]
    }
    return dateFormat
  }

  pushUserDataInTable = (e) => {
    e.forEach(items => {
        let transactionId = items._id
        let userId = items.user_id
        let requestBalance = items.balance
        let requestDate = this.dateConverter(items.created_at)
        let status = items.status
        let actionButton = ''
        let requestBalanceArray = [transactionId,userId,requestBalance]

        if(status == 'Completed'){
         actionButton =  '<div class="actionBtn"><button class="btn btn-primary btn-sm revoke"  value="'+ requestBalanceArray +'" >Revoke</button>'
        }else{
          actionButton =  '<div class="actionBtn"><button class="btn btn-primary btn-sm approve" value="'+ requestBalanceArray +'" >Approve</button>'
        }

        this.state.table.row.add([transactionId,userId,requestBalance,requestDate,status,actionButton])
    })

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

  tableSort = (a, b, str) => {
    if (!isNaN(a[str])) {
      return parseFloat(a[str]) - parseFloat(b[str]);
    } else {
      return a[str].localeCompare(b[str])
    }
  }


  componentDidMount(){

    this.getBalanceRequest()
    // this.setTable()
    this.getLanguage()

    this.props.eventFunction('Balance Request')

    socket.on("balance", (data) => {

      let transactionId = data.balance._id
      let userId = data.balance.user_id
      let requestBalance = data.balance.balance
      let requestDate = data.balance.created_at
      let status = data.balance.status
      let actionButton = ''
      let requestBalanceArray = [transactionId,userId,requestBalance]

      if(status == 'Completed'){
       actionButton =  '<div class="actionBtn"><button class="btn btn-primary btn-sm revoke"  value="'+ requestBalanceArray +'" >Revoke</button>'
      }else{
        actionButton =  '<div class="actionBtn"><button class="btn btn-primary btn-sm approve" value="'+ requestBalanceArray +'" >Approve</button>'
      }

      this.state.table.row.add([transactionId,userId,requestBalance,requestDate,status,actionButton])


      this.state.table.draw()

   })

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
         transactionId:'Transaction ID',
         idUser:'User ID',
         requestBalance:'Request Balance',
         status:'Status',
         action:'Action',
         revoke:'Revoke',
         accept:'Accept',
         reset:'Reset',
         search:'Search'
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

  render(){

    this.AdminColumns = [
        {
          title: 'No.', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
            return index + 1
          }
        },
        {title: this.state.languageText.transactionId, dataIndex: '_id',sorter: (a, b) => this.tableSort (a, b,"_id")},
        {title: this.state.languageText.idUser, dataIndex: 'user_id',sorter: (a, b) => this.tableSort (a, b,"user_id")},
        {title: this.state.languageText.requestBalance, dataIndex: 'balance',sorter: (a, b) => this.tableSort (a, b,"balance")},
        {title: this.state.languageText.status, dataIndex: 'status',sorter: (a, b) => this.tableSort (a, b,"status")},
        {
          title: this.state.languageText.action, dataIndex: '', width: '285px',
          render: (text, record) => {
            return (
              <div style={{width: '270px'}}>
                <a style={record.status != "Completed" ? {display: 'inline'} :{display: 'none'} } onClick={() => this.approveRequestBalanceModal(record)}>{this.state.languageText.accept}</a>
                 <a style={record.status == "Completed" ? {display: 'inline'} :{display: 'none'}} onClick={() => this.revokeRequestBalanceModal(record)}>{this.state.languageText.revoke}</a>
              </div>
            );
          },
        },

      ];

    return (
      <div className="balance-request-container">
        <div className="balance-btn-container flex-end">
          <Search placeholder={this.state.languageText.search} onSearch={(e) => this.searchkeyWords(e)} enterButton
                  style={{width: 260}}/>
          <div className="btn btn-primary btn-sm" onClick={()=>this.getBalanceRequest()} style={{margin:"0 15px"}}>{this.state.languageText.reset}</div>
        </div>
        <div>
          <Table columns={this.AdminColumns} dataSource={this.state.balanceRequest} rowKey={record => record._id}/>
        </div>
      </div>
    );
  }
 }

 export default BalanceRequest;
