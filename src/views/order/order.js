import React, {Component} from 'react'
import { Input, Table} from 'antd';
import {CSVLink} from "react-csv";

import '../../css/views/order.css';


const Search = Input.Search;

class OrderManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getUserId: null,
      getOrder: [],
      getOrderList:[],
      getOrderExport: [],
      dateFrom: '',
      dateTo: '',
      orderStatus: '',
      qrId: '',
      checkerPush: '',
      getLanguage:[],
      languageText: [],
    }
  }

  componentDidMount() {
    this.getOrder()
    this.getLanguage()
    this.props.eventFunction('Order Management');
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.language !== this.props.language){
      this.setlanguageText(nextProps.language)
    }
  }

  //CRUD
  getOrder = async  () =>{
    const res1 = await fetch(this.props.api+"/getordersave",{
      method:'GET',
      headers: {
        "Content-Type": "application/json",
        "userid":this.props.userId,
        "token": this.props.token,
        "authentication": window.localStorage.getItem("session")
    },
  })
    const response1 = Object.assign({},await res1.json());
    const res = await fetch(this.props.api+"/getorder",{
      method:'GET',
      headers: {
        "Content-Type": "application/json",
        "userid":this.props.userId,
        "token": this.props.token,
        'type': this.props.userRole,
        "authentication": window.localStorage.getItem("session")
      },
  })
    const response = Object.assign({},await res.json());

    for(let items in response.data){
      response.data[items].status = this.convertOrderStatus(response.data[items].status)
      response.data[items].created_at = this.dateConverter(response.data[items].created_at)

    }


    let userTypeRoleArray = []
    if (response.message == "success" ) {
      if(this.props.userRole == "Agent" ){
        for(let i = 0; i < response.data.length; i++){
          for(let j = 0; j < response.data[i].orderinfo.length; j++ ){
            let children = Object.assign({},{"username":response.data[i].username},{"type":response.data[i].type} ,response.data[i].orderinfo[j]);
             this.state.getOrder.push(children)
          }
          userTypeRoleArray = []
        }
        const getOrderDataTableAgent = this.state.getOrder;

      }else{
        this.setState({
          getOrder: response.data,
          getOrderList:response.data
        });
        const getOrderDataTable = this.state.getOrder;

      }
    }
  }

  getFilteredOrder = async () => {

    const res = await fetch(this.props.api + "/orderbydate", {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'authentication': window.localStorage.getItem("session"),
      'userid':this.props.userId,
      'type':this.props.userRole,
      'datefrom': this.state.dateFrom,
      'dateto': this.state.dateTo
      },
    })
    const response = await res.json()

    console.log(response)
    for(let items in response.data){
      response.data[items].status = this.convertOrderStatus(response.data[items].status)
      response.data[items].created_at = this.dateConverter(response.data[items].created_at)

    }

    let userTypeRoleArray = []
    if (response.message == "success" ) {
      if(this.props.userRole == "Agent" ){
        for(let i = 0; i < response.data.length; i++){
          for(let j = 0; j < response.data[i].orderinfo.length; j++ ){
            let children = Object.assign({},{"username":response.data[i].username},{"type":response.data[i].type} ,response.data[i].orderinfo[j]);
             this.state.getOrder.push(children)
          }
          userTypeRoleArray = []
        }
        const getOrderDataTableAgent = this.state.getOrder;

      }else{
        this.setState({
          getOrder: response.data,
          getOrderList:response.data
        });
        const getOrderDataTable = this.state.getOrder;

      }
    }

  }


  //CONVERTER
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

  convertOrderStatus = (e) => {
    let dynamic = null;
    if (e === "WAIT_RECEIVED") {
      return "Pending Transaction"
    } else if (e === "TRADE_RECEIVED") {
      return  "Transaction Complete"
    } else if (e === "TRADE_EXPIRED") {
      return  "Trading Close"
    } else {
      dynamic = "DATA UNKNOWN";
      return dynamic
    }
  };

  createExportDate =  () => {
    this.setState({
      getOrderExport: this.state.getOrder
    });
  };


  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});

  };

  // date from on change
  dateOnchange = (e) => {
    this.setState({[e.target.name]: e.target.value});
    // console.log(e.target.value)
  }

  handleChange = (e) => {
    this.state.orderStatus = e;
  };

  //TABLE FEATURE
  tableSort = (a, b, str) => {
    if (!isNaN(a[str])) {
      return parseFloat(a[str]) - parseFloat(b[str]);
    } else {
      return a[str].localeCompare(b[str])
    }
  }

  tableSortUsername = (a,b) => {
    let stringA =a['userinfo'][0].username
    let stringB = b["userinfo"][0].username
    return stringA.localeCompare(stringB)
  }

  tableSortType = (a,b) => {
    let stringA =a['userinfo'][0].type
    let stringB = b["userinfo"][0].type
    return stringA.localeCompare(stringB)
  }

  usernameRecord = (e) => {
    if(e.length != 0) {
       return e[0].username
     } else {
        return "No Data"
    }
  }

  typeRecord = (e) => {
    if(e.length != 0) {
       return e[0].type
     } else {
        return "No Data"
    }
  }

  searchkeyWords = (keyWords) => {
    let newUserList = [];
    let {getOrderList} = this.state;
    if (keyWords.trim() === "" || keyWords.trim() === null || keyWords.trim() === undefined) {
      this.getOrder();
    } else {
      for (let obj in getOrderList) {
        for (let item in getOrderList[obj]) {
          if (getOrderList[obj][item] != undefined) {
            let result=getOrderList[obj][item].toString().toLowerCase().includes(keyWords.toLowerCase());
              if(typeof getOrderList[obj][item] == 'object'){
                for(let itemObj in getOrderList[obj][item] ){
                  for(let itemObjInside in getOrderList[obj][item][itemObj] ){
                    if(getOrderList[obj][item][itemObj][itemObjInside] != undefined){
                      let  result=getOrderList[obj][item][itemObj][itemObjInside].toString().toLowerCase().includes(keyWords.toLowerCase());
                      if(result){
                        newUserList.push(getOrderList[obj]);
                        break;
                      }
                    }
                    }
                  }
                }

            if(result){
              newUserList.push(getOrderList[obj]);
              break;
            }
          }
        }
      }
      console.log(newUserList)
      this.setState({
        getOrder:newUserList
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
       qrCodeId:'Qr ID',
       qrStatus:'Qr Status',
       dateFrom:'Date From',
       dateTo:'Date To',
       qrId:'Qr ID',
       username:'Username',
       commodity:'Commodity',
       role:'Role',
       commodity:'Commodity',
       unitPrice:'Unit Price',
       buyer:'Buyer',
       orderTime:'Order Time',
       orderStatus:'Order Status',
       amountActuallyPaid:'Amount Paid',
       exportSheetFile:'Export Sheet File',
       reset:'Reset',
       status:'Status',
       search:'Search'
     }
   })
   this.translateLanguage(e)
  }

  translateLanguage = async (e) =>{
   // console.log(e)
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


  //ryan function

  filterData = async () => {
      await this.getFilteredOrder()
  }




  render() {
  this.AdminColumns = [
      {
        title: 'No.', dataIndex: '', key: 'key', width: '20px', render: (text, record, index) => {
          return index + 1
        }
      },
      {title:this.state.languageText.qrId, dataIndex: 'qr_id', sorter: (a, b) => this.tableSort (a, b,"qr_id")},

      {title: this.state.languageText.username, dataIndex: 'username', sorter: (a, b) =>  this.tableSortUsername (a, b),  render:(text, record, index)=>{
          return this.usernameRecord(record["userinfo"])

      }},

      {title:this.state.languageText.role, dataIndex: 'type', sorter: (a, b) =>  this.tableSortType (a, b), render:(text, record, index)=>{
        return this.typeRecord(record["userinfo"])
       }},
      {title: this.state.languageText.commodity, dataIndex: 'qr_name',  sorter: (a, b) => this.tableSort (a, b,"qr_name")},


      {title: this.state.languageText.unitPrice, dataIndex: 'qr_price', sorter: (a, b) => this.tableSort (a, b,'qr_price')},
      {title:  this.state.languageText.buyer, dataIndex: 'payer_nick',sorter: (a, b) => this.tableSort (a, b,'payer_nick')},

      {title:  this.state.languageText.orderTime,dataIndex: 'created_at', sorter: (a, b) => this.tableSort (a, b,"created_at")},

      {title:  this.state.languageText.status,  dataIndex: 'status', sorter: (a, b) => this.tableSort (a, b,"status")},
      {title:  this.state.languageText.amountActuallyPaid, dataIndex: 'real_price', width: "80px", sorter: (a, b) => this.tableSort (a, b,"real_price")},
    ];

    let {getOrder} = this.state;
    return (
      <div className="order-component">
          <div className="order-btn-container flex-between">

            <div  className="flex-around">
              <div className="order-form flex-around">
                <label htmlFor=""><strong>{this.state.languageText.dateFrom}</strong></label>
                <input type="date" className="form-control" placeholder="Date From" name="dateFrom" onChange={this.dateOnchange}/>
              </div>

              <div className="order-form flex-around">
                <label htmlFor=""><strong>{this.state.languageText.dateTo}</strong></label>
                <input type="date" className="form-control" placeholder="Date To" name="dateTo" onChange={this.dateOnchange}/>
              </div>

              <div onClick={this.filterData} style={{marginLeft:"10px"}} className="filter-button flex-start">
                  <div className="btn btn-primary btn-sm">Filter</div>
              </div>

              <div  onClick={this.createExportDate} style={{marginLeft:"10px"}} className="filter-button flex-start">
                <CSVLink data={this.state.getOrderExport}>
                  <div className="btn btn-primary btn-sm">{this.state.languageText.exportSheetFile}</div>
                </CSVLink>
              </div>
            </div>

            <div>
              <Search placeholder={this.state.languageText.search} onSearch={(e) => this.searchkeyWords(e)} enterButton
                      style={{width: 260}}/>
              <div className="btn btn-primary btn-sm" onClick={()=>this.getOrder()} style={{margin:"0 15px"}}>{this.state.languageText.reset}</div>
            </div>

          </div>

          <div className="order-table">
            <Table columns={this.AdminColumns} dataSource={getOrder}
                   rowKey={record => record._id}
            />
          </div>


      </div>
    );
  }
}

export default OrderManagement;
