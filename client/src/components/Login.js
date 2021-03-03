import React, { Component } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';

import { Person } from 'react-bootstrap-icons';
import { Lock } from 'react-bootstrap-icons';
import { BoxArrowRight } from 'react-bootstrap-icons';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Group8',
      password: 'DeZeYBsY1CRcacw',
    };
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    try {
      const res = await axios.post('/api/login', data);
      if (res.status === 200) {
        sessionStorage.setItem('isLoggedIn', true);
        sessionStorage.setItem('custID', res.data.userDetails.custID);
        localStorage.setItem('accessToken', res.data.accessTokenData.token);
        localStorage.setItem('refreshToken', res.data.refreshTokenData.token);
        localStorage.setItem('accessTokenExpiry', res.data.accessTokenData.exp); // jwt
        this.props.history.replace(`/home/${res.data.userDetails.custID}`);
      }
    } catch (err) {
      console.log(err);
      toast.error(`${err}`);
    }
  };

  loginForm = () => (
    <Form className="text-center" onSubmit={this.handleSubmit}>
      <Form.Row className="justify-content-sm-center">
        <Form.Group as={Col} sm="4">
          <Form.Label className="lead">Username</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>
                <Person />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              name="username"
              onChange={this.handleChange('username')}
              defaultValue={this.state.username}
            ></Form.Control>
          </InputGroup>
        </Form.Group>
      </Form.Row>
      <Form.Row className="justify-content-sm-center">
        <Form.Group as={Col} sm="4">
          <Form.Label className="lead">Password</Form.Label>
          <InputGroup className="mb-5">
            <InputGroup.Prepend>
              <InputGroup.Text>
                <Lock />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="password"
              name="password"
              onChange={this.handleChange('Password')}
              defaultValue={this.state.password}
            ></Form.Control>
          </InputGroup>
        </Form.Group>
      </Form.Row>
      <Form.Row className="justify-content-sm-center">
        <Form.Group as={Col} md="4">
          <Button variant="success" type="submit" className="btn-block">
            Submit <BoxArrowRight style={{ color: 'white' }} />
          </Button>
        </Form.Group>
      </Form.Row>
    </Form>
  );

  render() {
    return (
      <>
        <ToastContainer />
        {this.loginForm()}
      </>
    );
  }
}
