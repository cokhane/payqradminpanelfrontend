import React, { Component } from 'react';
import {Redirect,Router, Route, Switch} from 'react-router-dom';
import routes from '../../routes/routes.js'
import history from '../../history/history.js'
import '../../css/defaultlayout.css';
import jwt from 'jsonwebtoken';

// Components

import Sidebar from './component/sidebar/sidebar.js'
import Header from './component/header/header.js'
import Footer from './component/footer/footer.js'
import Breadcrump from './component/breadcrump/breadcrump.js'

//https://api.payqr.cash

class DefaultLayout extends Component {
  constructor(props){
    super(props);
    this.state={
      userRole:null,
      userName:null,
      userId:null,
      userBlocked:null,
      userProfileImage:null,
      headerTitle:'Order Management',
      token:'0c8058112a1139fea537d50820b237f2',
      api:'https://api.payqr.cash',
      language:window.localStorage.getItem('lang'),
      userBalance:null,

    }
  }

  onClickEvent=(headerTitle)=>{
    this.setState({
      headerTitle
    })
  }

  languageOnClickEvent= (e)=>{
     this.setState({
      language:e
    })
  }

  eventFunction = async (e) => {
    await this.setState({
      headerTitle:e
    })
  }

  userBalanceFunction = (e) => {
    this.setState({
      userBalance:e
    })
  }






  checkValidToken = () => {
    const checkToken = window.localStorage.getItem("session");
    const key = "secretkey"

    try{
      const verifyToken = jwt.verify(checkToken, key)

    }catch(err){
      history.push('/login')
    }
  }

  getUserToken = () => {

    const checkToken = window.localStorage.getItem("session");
    if(checkToken !== "null"){
      this.checkUserRole(checkToken)
    }
  }


  checkUserRole = async (e) => {

    try{
      const tokenDecode = jwt.decode(e)
      // console.log(tokenDecode)

        await this.setState({
          userRole:tokenDecode.user.type,
          userId:tokenDecode.user._id,
          userBlocked:tokenDecode.user.block,
          userName:this.firstLetterUppercase(tokenDecode.user.firstname)
          // + " " + this.firstLetterUppercase(tokenDecode.user.lastname)
        })
    }catch(err){
      history.push('/login')
    }


  }

  firstLetterUppercase = (e) => {
    return e.charAt(0).toUpperCase() + e.slice(1);
  }

  setUserImage = async (e) => {
     await this.setState({
      userProfileImage:e
    })

    console.log(e)
  }


  componentDidMount(){
    this.checkValidToken()
  }

  componentWillMount(){
    this.getUserToken()
  }

    render(){
      return (
        <div className="defaultlayout-content">
          <div className="defaultlayout-container">
            <div className="defaultlayout-sidebar">
              <Sidebar  api={this.state.api} userBlocked={this.state.userBlocked} userName={this.state.userName} userRole={this.state.userRole} userId={this.state.userId} onClickEvent={this.onClickEvent} headerTitle={this.state.headerTitle} language={this.state.language} userProfileImage={this.state.userProfileImage}/>
            </div>
            <div className="defaultlayout-header">
            <Header userBalanceFunction={(e) => this.userBalanceFunction(e)} userBlocked={this.state.userBlocked} userRole={this.state.userRole} userId={this.state.userId} api={this.state.api} headerTitle={this.state.headerTitle} languageOnClickEvent={(e) => this.languageOnClickEvent(e)}/>
            </div>
              <Breadcrump  eventFunction={(e) => this.eventFunction(e)} headerTitle={this.state.headerTitle} />
            <div>
            </div>
            <div className="defaultlayout-dynamic">
               <div className="defaultlayout-dynamic-parent">
                 <Router history={history}>
                   <Switch>
                     {routes.map((route, idx) => {
                        return route.component ?
                        (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                            <route.component {...props} setUserImage={this.setUserImage} token={this.state.token} userBlocked={this.state.userBlocked}  eventFunction={(e) => this.eventFunction(e)} userId={this.state.userId} userRole={this.state.userRole} api={this.state.api} language={this.state.language} userBalance={this.state.userBalance}/>
                          )} />)
                          : (null);
                       },
                      )}
                      <Redirect from="/" to="/order" />
                   </Switch>
                  </Router>
               </div>
               <div className="defaultlayout-footer">
                 <Footer/>
               </div>
            </div>

          </div>

        </div>
     );
   }
 }

 export default DefaultLayout;
