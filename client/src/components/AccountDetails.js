import React, { Component } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';

import Navbar from './core/Navbar';
import Extend from './core/Extend';
// import Chatbot from './core/chatbot/Chatbot';

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

export default class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      custID: '',
      accounts: [],
    };
  }

  componentDidMount() {
    this.setState({ custID: this.props.match.params.id }, () => {
      this.checkAmountBalance();
    });
  }

  checkAmountBalance = async () => {
    const custID = this.state.custID;
    const data = { custID };
    try {
      const res = await axios.post('/api/accounts/view', data, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.status === 200) {
        const accounts = res.data;
        this.setState({ accounts });
      }
    } catch (err) {
      console.log('AccountDetails-checkAmountBalance err: ' + err);
      if (err.message === 'Request failed with status code 401') {
        toast.error('Access token expired. Please sign out and login again');
      }
    }
  };

  render() {
    return (
      <>
        <ToastContainer />
        <Extend />
        <Navbar />
        <Jumbotron fluid>
          <Container>
            <h2 className="display-4">Account Details</h2>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>
                    <h5>Account Name</h5>
                  </th>
                  <th>
                    <h5>Account Number</h5>
                  </th>
                  <th>
                    <h5>Account Balance (SGD)</h5>
                  </th>
                  <th>
                    <h5>Is Linked?</h5>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.accounts.map((account, i) => (
                  <tr key={i}>
                    <td>{account.accountName}</td>
                    <td>{account.accountNumber}</td>
                    <td>${account.availableBal}</td>
                    <td>{account.linked ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* <Chatbot /> */}
          </Container>
        </Jumbotron>
      </>
    );
  }
}
