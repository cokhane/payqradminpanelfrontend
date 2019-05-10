import React, { Component } from 'react'
import '../../css/views/payqr.css';
import {Modal, Icon,Form,Input,Table} from 'antd';
import jwt from 'jsonwebtoken';


var $ = require('jquery');
window.$ = $;
$.DataTable = require('datatables.net-dt');

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Search = Input.Search;

class DepositFlow extends Component {

  constructor(props){
    super(props);
      this.state = {
        getqr:[],
        getqrList:[],
        getUserId:null,
        openViewPayqr:false,
        openAddPayqr:false,
        openAddViewPayqr:false,
        viewPayqrQrCode:null,
        viewPayqrQrName:null,
        viewPayqrQrPrice:null,

        addPayqrName:null,
        addPayqrPrice:'1',

        addPayqrViewName:null,
        addPayqrViewId:null,
        addPayqrViewPrice:null,
        addPayqrViewQrCode:null,
        table:null,

        getLanguage:[],
        languageText: [],
     };
  }

  componentDidMount(){
    this.getQr()
    this.getLanguage()
    this.props.eventFunction('Deposit Flow Management')

    console.log("deposit: ", this.props.userBlocked)
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.language !== this.props.language){
      console.log(nextProps.language)
      this.setlanguageText(nextProps.language)
    }
  }

  //CRUD
  getQr = async  () =>{
   const res = await fetch(this.props.api+"/qr",{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
        "id":this.props.userId,
        "type":this.props.userRole,
        "token": this.props.token,
        "authentication": window.localStorage.getItem("session")
      },
    })

    const response = await res.json()
    console.log("getQr: ",response)
    if (response.message == "success" ) {
      if(this.props.userRole == "Agent"){
        let agentResponse = response.data
        for(let i = 0; i < agentResponse.length; i++){
          for(let j = 0; j < agentResponse[i].qrcodesinfo.length; j++){
            this.state.getqr.push(agentResponse[i].qrcodesinfo[j])
          }
        }
      }else{
        this.setState({
          getqr: response.data,
          getqrList: response.data
        });
      }
    }
  }

  addPayqr = async () =>{
    const res = await fetch(this.props.api+"/qr",{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        "token": this.props.token,
        "userid":this.props.userId,
        "authentication": window.localStorage.getItem("session")
      },
      body:JSON.stringify({

        "name": this.state.addPayqrName,
        "price":this.state.addPayqrPrice,
        "type":"QR_TYPE_DYNAMIC"
      })
    })
    const response = await res.json()
    // console.log("addPayqr  ", response)
    if (response.message == "success" ) {
        this.setState({
          addPayqrViewName:response.data.qr_name,
          addPayqrViewId:response.data.qr_id,
          addPayqrViewPrice:response.data.qr_price,
          addPayqrViewQrCode:response.data.qr_code,
        })
        return true
    } else {
        return false
    }
  }

  // pushUserDataInTable = (e) => {
  //   e.forEach(items => {
  //       let id = items.qr_id
  //       let name = items.qr_name
  //       let price = items.qr_price
  //       let dateCreated = this.dateConverter(items.created_at)
  //       let actionButton = '<div class="actionBtn"><button class="btn btn-primary btn-sm view" value="' + id + '">View</button>'
  //         this.state.table.row.add([id,name,price,dateCreated,actionButton])
  //   })
  //   this.setButtonForTables()
  // }
  //
  // setButtonForTables = () => {
  // $(this.$el).on('click', 'tbody tr td .actionBtn .view', (event) => {
  //   event.stopPropagation();
  //   this.dynamicID = event.target.value
  //   for(let i = 0; i < this.state.getqr.length; i++){
  //       if(this.dynamicID == this.state.getqr[i].qr_id){
  //         this.openViewPayqr(this.state.getqr[i])
  //       }
  //     }
  //   });
  // }
  //
  // setTable = () => {
  //   this.$el = $(this.el)
  //   this.state.table = this.$el.DataTable()
  // }


  //ONCHANGE
  handleChangeaddPayqrPrice = async (e) => {
    await this.setState({
      addPayqrPrice:e.target.value
    })
  }
  onChange = (e) => {
      this.setState({[e.target.name]: e.target.value})
  };


  //POPUP
  success = () => {
    Modal.success({
      title: 'success',
    });
  }

  error = () => {
    Modal.error({
      title: 'error',
    });
  }

  blockPopup = () => {
    Modal.error({
      title: 'You are currently blocked!',
    });
  }

  //MODAL
  addPayqrModal = async () => {
    if(await this.addPayqr()){
      this.getQr();

      this.closeAddPayqrModal()
      this.openAddViewPayQr()
    }else{
      this.error()
      this.closeAddPayqrModal()
    }
  }

  //CLOSE MODAL
  closeViewPayqr = () => {
    this.setState({
      openViewPayqr: false,
    })
  }

  closeAddPayqrModal = () => {
    this.setState({
      openAddPayqr: false
    })
  }

  closeAddViewPayqrModal = () => {
    this.setState({
      openAddViewPayqr: false
    })
  }

  //OPEN MODAL
  openAddViewPayQr = (x) =>{
    this.setState({
      openAddViewPayqr: true
    })
  }

  openViewPayqr = (x) => {
    this.setState({
      openViewPayqr: true,
      viewPayqrQrCode: x.qr_code,
      viewPayqrQrName: x.qr_name,
      viewPayqrQrPrice: x.qr_price,
      openViewPayqr:true
    })
  }

  openAddPayqrModal = () => {
    this.setState({
      openAddPayqr: true
    })
  }

  //CONVERTER
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


  //TABLE FEATURE
  tableSort = (a, b, str) => {
    if (!isNaN(a[str])) {
      return parseFloat(a[str]) - parseFloat(b[str]);
    } else {
      return a[str].localeCompare(b[str])
    }
  }

  searchkeyWords = (keyWords) => {
    let newUserList = [];
    let {getqrList} = this.state;

    if (keyWords.trim() === "" || keyWords.trim() === null || keyWords.trim() === undefined) {
      this.getQr();
    } else {
      for (let obj in getqrList) {
        for (let item in getqrList[obj]) {
          if (getqrList[obj][item] != undefined) {
            let result=getqrList[obj][item].toString().toLowerCase().includes(keyWords.toLowerCase());
            if(result){
              newUserList.push(getqrList[obj]);
              break;
            }
          }
        }
      }
      this.setState({
        getqr:newUserList
      })
    }
  };


  //LANGUAGE
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
       payqrId:'Qr ID',
       name:'Name',
       price:'Price',
       dateCreated:'Date Created',
       action:'Action',
       reset:'Reset',
       view:'View',
       name:'Name',
       viewPayqr:'View PayQr',
       search:'Search',
       addPayqr:'Add Payqr'
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
  render(){
    this.AdminColumns = [
      {
        title: 'No.', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
          return index + 1
        }
      },
      {title: this.state.languageText.payqrId, dataIndex: 'qr_id',sorter: (a, b) => this.tableSort (a, b,"qr_id")},
      {title:this.state.languageText.name, dataIndex: 'qr_name', sorter: (a, b) => this.tableSort (a, b,"qr_name")},
      {title: this.state.languageText.price, dataIndex: 'qr_price', sorter: (a, b) => this.tableSort (a, b,"qr_price")},
      {title: this.state.languageText.dateCreated, dataIndex: 'created_at', sorter: (a, b) => this.tableSort (a, b,"created_at"),
      render:(text, record, index)=>{
        return this.dateConverter(record.created_at)
      }
      },
      {
        title: this.state.languageText.action, dataIndex: 'operation', width: '285px',
        render: (text, record) => {
          return (
            <div style={{width: '270px'}}>
              <a onClick={ this.props.userBlocked ? this.blockPopup : () => this.openViewPayqr(record)}>{this.state.languageText.view}</a>
            </div>
          );
        },
      },
  ];

  return (
    <div className="payqr-component">

      <div className="payqr-container">
        <div className="payqr-btn-container flex-end">
            <Search placeholder={this.state.languageText.search} onSearch={(e) => this.searchkeyWords(e)} enterButton style={{width: 260}}/>
            <div className="btn btn-primary btn-sm" onClick={()=>this.getQr()} style={{margin:"0 15px"}}>{this.state.languageText.reset}</div>
          <button className="btn btn-primary btn-sm" style={this.props.userRole === "Admin" || this.props.userRole === "Agent" ? {display:"none"} : {display:"block"}} onClick={this.props.userBlocked ? this.blockPopup : this.openAddPayqrModal} disabled={this.props.userBalance == '0.00' ? "true" : ""}>{this.state.languageText.addPayqr}</button>
        </div>
        <div>
          <Table columns={this.AdminColumns} dataSource={this.state.getqr} rowKey={record => record._id} />
        </div>

        <Modal
          title={this.state.languageText.viewPayqr}
          visible={this.state.openViewPayqr}
          onOk={this.closeViewPayqr}
          onCancel={this.closeViewPayqr}
          maskClosable={true}>
          <div>
            <div>{this.state.languageText.name}: {this.state.viewPayqrQrName}</div>
            <div>{this.state.languageText.price}: {this.state.viewPayqrQrPrice}</div>
            <img src={this.state.viewPayqrQrCode} alt=""/>
          </div>
        </Modal>

        <Modal
          title={this.state.languageText.addPayqr}
          visible={this.state.openAddPayqr}
          onOk={this.addPayqrModal}
          onCancel={this.closeAddPayqrModal}
          maskClosable={false}
          destroyOnClose={true}>
          <div>
            <Form className="login-form">
                   <input type="text" className="form-control" placeholder="Payqr Name" name="addPayqrName"onChange={this.onChange} />
               <div>
              <div className="flex-start">
                <select className="form-control"  onChange={this.handleChangeaddPayqrPrice} value={this.state.addPayqrPrice}>
                  <option value="1">1</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="5000">5000</option>
                </select>
                <div style={{padding:"10px"}}><strong>RMB</strong></div>
              </div>

              </div>
           </Form>
          </div>
        </Modal>

        <Modal
          title="Added New Payqr Succes!"
          visible={this.state.openAddViewPayqr}
          onOk={this.closeAddViewPayqrModal}
          onCancel={this.closeAddViewPayqrModal}
          maskClosable={true}>
          <div>
            <div>{this.state.languageText.name}: {this.state.addPayqrViewName}</div>
            <div>{this.state.languageText.price}: {this.state.addPayqrViewPrice}</div>
            <img src={this.state.addPayqrViewQrCode} alt=""/>
          </div>
        </Modal>
      </div>
    </div>
    );
  }
}

 export default DepositFlow;
