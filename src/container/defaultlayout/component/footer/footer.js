import React, { Component } from 'react';
import '../../../../css/component/footer.css';

class Footer extends Component {
  constructor(props){
    super(props);
      this.state = {
     }
  }

    render(){
      return (
        <div className="footer-component">
          <div  className="footer-text">
            &copy;2019 Admin Ryan Bakla Ulol Gago by @cokhane
          </div>
        </div>
     );
   }
 }

 export default Footer;
