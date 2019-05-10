import React, {Component} from 'react';
import {Tabs} from 'antd';
import BlockUserChild from './blockuser.js'
import UserChild from './user.js';
import '../../css/views/userparent.css';

const TabPane = Tabs.TabPane;

class UserParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabNumber: "1",
    }
  }

  callback = (key) => {
    this.setState({
      tabNumber: key
    });
  };

  componentDidMount() {
    this.props.eventFunction('User')
  }





  render() {
    return (
      <div className="user-parent-component">
        <Tabs ActiveKey={this.state.tabNumber} onChange={(e) => this.callback(e)}>
          <TabPane tab="Users" key="1">
            {this.state.tabNumber === "1" &&
            <UserChild api={this.props.api} token={this.props.token} userId={this.props.userId}
                       userRole={this.props.userRole} language={this.props.language}/>
            }
          </TabPane>
          <TabPane tab="Block Users" key="2">
            {this.state.tabNumber === "2" &&
            <BlockUserChild api={this.props.api} token={this.props.token} userId={this.props.userId}
                            userRole={this.props.userRole} language={this.props.language}/>}
          </TabPane>
        </Tabs>
      </div>
    );
  }

}

export default UserParent;
