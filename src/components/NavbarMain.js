import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

const styles = {
  rightMenuItem: {
    float: 'right',
  },
};

class Comp extends Component {
  render() {
    return (
      <Menu mode="horizontal" theme="dark">
        <Menu.Item>
          <Link to="/">Blueno</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={'/annotator'}>Annotate ELVOs (beta)</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/trainer`}>Train ELVOs (beta)</Link>
        </Menu.Item>
        <Menu.Item style={styles.rightMenuItem}>
          <Link to={`/u/abc`}>Sign in (alpha)</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default Comp;
