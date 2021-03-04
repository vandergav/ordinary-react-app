import React, { Component } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';

import Datetime from 'react-datetime';

import Navbar from './core/Navbar';
import Extend from './core/Extend';
// import Chatbot from './core/chatbot/Chatbot';

import { PatchQuestionFill } from 'react-bootstrap-icons';
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import { BoxArrowRight } from 'react-bootstrap-icons';

export default class AddTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      custID: '',
      balanceAmount: 0.0,
      users: [],
      payees: {},

      amountToSend: 0.0,
      expensesCat: '',
      payeeID: '',

      dateTime: new Date(),
      message: '',
      eGift: false,

      amountToSendError: '',
      expensesCatError: '',
      payeeIDError: '',
      error: '',
    };
  }

  componentDidMount() {
    this.setState({ custID: sessionStorage.getItem('custID') }, async () => {
      await this.checkTotalLinkedAmountBalance();
      await this.getUsers();
      await this.getPayees();
      await this.checkAmountToSend(this.state.amountToSend);
      await this.checkExpensesCat(this.state.expensesCat);
      await this.checkPayeeID(this.state.payeeID);
    });
  }

  checkTotalLinkedAmountBalance = async () => {
    let custID = this.state.custID;
    const data = { custID };
    try {
      const res = await axios.post('/api/accounts/view', data, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.status === 200) {
        let accounts = res.data;
        let balanceAmount = 0.0;
        accounts.forEach((account) => {
          if (account.linked) {
            balanceAmount += parseFloat(account.availableBal);
          }
        });
        this.setState({ balanceAmount });
      }
    } catch (err) {
      console.log('AddTransaction-checkTotalLinkedAmountBalance err: ' + err);
      if (err.message === 'Request failed with status code 401') {
        toast.error('Access token expired. Please sign out and login again');
      }
    }
  };

  getUsers = async () => {
    try {
      const res = await axios.post('/api/users', null, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.status === 200) {
        let users = res.data;
        this.setState({ users });
      }
    } catch (err) {
      console.log('TransactionHistory-getUser err: ' + err);
      if (err.message === 'Request failed with status code 401') {
        toast.error('Access token expired. Please sign out and login again');
      }
    }
  };

  getPayees = async () => {
    const users = this.state.users;
    let payees = {};
    for (let user of users) {
      payees[user.custID] = '';
    }
    this.setState({ payees });
  };

  checkAmountToSend = async (amountToSend) => {
    if (amountToSend < 0) {
      this.setState({
        amountToSendError: 'Please set amount to send more than 0.',
      });
    } else if (amountToSend > this.state.balanceAmount) {
      this.setState({
        amountToSendError:
          'You cannot transfer this amount to send as it exceeds your linked account balances!',
      });
    } else {
      this.setState({ amountToSendError: '', amountToSend: amountToSend });
    }
  };

  handleAmountToSendChange = (e) => {
    let amount = parseFloat(e.target.value);
    this.checkAmountToSend(amount);
  };

  checkExpensesCat = async (expensesCat) => {
    if (expensesCat.length === 0) {
      this.setState({ expensesCatError: 'Please fill in Expenses Category!' });
    } else {
      this.setState({ expensesCatError: '', expensesCat });
    }
  };

  handleExpensesCatChange = (e) => {
    let expensesCat = e;
    this.checkExpensesCat(expensesCat);
  };

  checkPayeeID = async (payeeID) => {
    if (isNaN(payeeID) || payeeID === '') {
      this.setState({ payeeIDError: 'Please fill in payeeID!' });
    } else if (payeeID === this.state.custID) {
      this.setState({
        payeeIDError:
          'You cannot transfer to yourself! Please enter valid payeeID!',
      });
    } else {
      payeeID = parseInt(payeeID);
      if (!(payeeID in this.state.payees)) {
        this.setState({ payeeIDError: "PayeeID doesn't exist!" });
      } else {
        this.setState({ payeeIDError: '', payeeID: payeeID });
      }
    }
  };

  handlePayeeIDChange = (e) => {
    let payeeID = e.target.value;
    this.checkPayeeID(payeeID);
  };

  handleMessageChange = (e) => {
    this.setState({ message: e.target.value });
  };

  handleCheckBoxChange = (e) => {
    if (e.target.checked) {
      this.setState({ [e.target.name]: true });
    } else {
      this.setState({ [e.target.name]: false });
    }
  };

  handleDateTimePickerChange = (moment, name) => {
    let date = moment.toDate();
    this.setState({ dateTime: date });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (
      this.state.payeeIDError.length > 0 ||
      this.state.amountToSendError.length > 0 ||
      this.state.expensesCatError.length > 0
    ) {
      this.setState({
        error: 'Please rectify all errors before submiting the transaction!',
      });
    } else {
      this.setState({ error: '' });

      let expensesCat;
      this.expensesCat == 'Others'
        ? (expensesCat = '')
        : (expensesCat = this.expensesCat);

      var data = {
        custID: parseInt(this.state.custID),
        payeeID: this.state.payeeID,
        dateTime: this.state.dateTime,
        amount: this.state.amountToSend,
        eGift: this.state.eGift,
        message: this.state.message,
        expensesCat,
      };
      alert(JSON.stringify(data));
      try {
        const res = await axios.post(`/api/transaction/add`, data, {
          headers: {
            Authorization: `Basic ${localStorage.getItem('accessToken')}`,
          },
        });
        if (res.status === 200) {
          alert('res.data: ' + JSON.stringify(res.data));
        }
      } catch (err) {
        console.log('err: ' + err);
        this.setState({
          error:
            'There is an error in submitting your transaction! Please check with the bank!',
        });
        if (err.message === 'Request failed with status code 401') {
          toast.error('Access token expired. Please sign out and login again');
        }
      }
    }
  };

  popover = () => (
    <Popover>
      <Popover.Title>Your Customer ID</Popover.Title>
      <Popover.Content>{this.state.custID}</Popover.Content>
    </Popover>
  );

  _expensesCategories = [
    'Food',
    'Entertainment',
    'Insurance',
    'Transport',
    'Shopping',
    'Others',
  ];

  render() {
    return (
      <>
        <ToastContainer />
        <Extend />
        <Navbar />
        <Jumbotron fluid>
          <Container>
            <h2 className="display-4">Add Transaction</h2>
            <div className="card">
              <div className="card-body">
                <Form onSubmit={this.handleSubmit}>
                  <Form.Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Payee ID{' '}
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          placement="right"
                          overlay={this.popover()}
                        >
                          <PatchQuestionFill />
                        </OverlayTrigger>{' '}
                        {this.state.payeeIDError ? (
                          <OverlayTrigger
                            trigger={['hover', 'focus']}
                            placement="right"
                            overlay={
                              <Tooltip>{this.state.payeeIDError}</Tooltip>
                            }
                          >
                            <ExclamationCircleFill style={{ color: 'red' }} />
                          </OverlayTrigger>
                        ) : null}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="payeeID"
                        placeholder="Enter Payee ID"
                        onChange={this.handlePayeeIDChange}
                        defaultValue={this.state.payeeID}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Date</Form.Label>
                      <Datetime
                        onChange={(moment) =>
                          this.handleDateTimePickerChange(moment, 'date')
                        }
                        value={this.state.dateTime}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Expenses Category{' '}
                        {this.state.expensesCatError ? (
                          <OverlayTrigger
                            trigger={['hover', 'focus']}
                            placement="right"
                            overlay={
                              <Tooltip>{this.state.expensesCatError}</Tooltip>
                            }
                          >
                            <ExclamationCircleFill style={{ color: 'red' }} />
                          </OverlayTrigger>
                        ) : null}
                      </Form.Label>
                      <DropdownButton
                        variant="secondary"
                        title={
                          this.state.expensesCat
                            ? this.state.expensesCat
                            : 'Select a category'
                        }
                        onSelect={this.handleExpensesCatChange}
                      >
                        {this._expensesCategories.map((expensesCat) => (
                          <Dropdown.Item eventKey={expensesCat}>
                            {expensesCat}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>
                        Amount To Send{' '}
                        {this.state.amountToSendError ? (
                          <OverlayTrigger
                            trigger={['hover', 'focus']}
                            placement="right"
                            overlay={
                              <Tooltip>{this.state.amountToSendError}</Tooltip>
                            }
                          >
                            <ExclamationCircleFill style={{ color: 'red' }} />
                          </OverlayTrigger>
                        ) : null}
                      </Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                          <InputGroup.Text>$</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="number"
                          name="amountToSend"
                          placehoder="Enter Amount To Send"
                          onChange={this.handleAmountToSendChange}
                          defaultValue={this.state.amountToSend}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Gift?</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="eGift"
                        onChange={this.handleCheckBoxChange}
                        checked={this.state.eGift}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        type="textarea"
                        name="message"
                        placehoder="Enter Message"
                        onChange={this.handleMessageChange}
                        defaultValue={this.state.message}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="2" style={{ textAlign: 'center' }}>
                      <Form.Label>
                        Add Transaction{' '}
                        {this.state.error ? (
                          <OverlayTrigger
                            trigger={['hover', 'focus']}
                            placement="right"
                            overlay={<Tooltip>{this.state.error}</Tooltip>}
                          >
                            <ExclamationCircleFill style={{ color: 'red' }} />
                          </OverlayTrigger>
                        ) : null}
                      </Form.Label>
                      <Button variant="success" type="submit">
                        Submit <BoxArrowRight style={{ color: 'white' }} />
                      </Button>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </div>
            </div>
            {/* <Chatbot /> */}
          </Container>
        </Jumbotron>
      </>
    );
  }
}
