import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../assets/NavbarDataset.css';
import { Menu } from "antd";

/**
 * The Navbar shown to logged-in users. Currently the only user is 'abc'.
 */
class Comp extends Component {
  render() {
    return (
      <Menu
        mode="horizontal"
        theme="light"
      >
        <Menu.Item>
          <Link to='/'>Blueno</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/u/${this.props.user}`}>Overview</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/u/${this.props.user}/upload`}>Upload</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/u/${this.props.user}/preprocess`}>Preprocessing</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/u/${this.props.user}/annotate`}>Annotate</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/u/${this.props.user}/train`}>Train</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default Comp;
