import React, { Component } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';

import Navbar from './core/Navbar';
import Extend from './core/Extend';
// import Chatbot from './core/chatbot/Chatbot';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Table from 'react-bootstrap/Table';

import { Bar } from 'react-chartjs-2';

export default class TransactionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      custID: '',
      users: [],
      allTransactions: [],
      userOutwardTransactions: [],
      userInwardTransactions: [],
      userExpenditure: [],
      userReceive: [],
      userExpenditureChartData: [],
      userReceiveChartData: [],
      overallAverageExpenditure: [], //divided by number of users
      overallAverageExpenditureChartData: [],
    };
  }

  componentDidMount() {
    this.setState({ custID: sessionStorage.getItem('custID') }, async () => {
      await this.getUsers();
      await this.getAllTransactions();
      await this.getUserOutwardTransactions();
      await this.getUserInwardTransactions();
      await this.getUserExpenditure();
      await this.getUserReceive();
      await this.getUserExpenditureChartData();
      await this.getUserReceiveChartData();
      await this.getOverallAverageExpenditure();
      await this.getOverallAverageExpenditureChartData();
    });
  }

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
      console.log('TransactionHistory-getUsers err: ' + err);
      if (err.message === 'Request failed with status code 401') {
        toast.error('Access token expired. Please sign out and login again');
      }
    }
  };

  getAllTransactions = async () => {
    const custID = this.state.custID;
    const data = { custID };
    try {
      const res = await axios.post('/api/transaction/view', data, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.status === 200) {
        const allTransactions = res.data;
        this.setState({ allTransactions });
      }
    } catch (err) {
      console.log('TransactionHistory-getAllTransactions err: ' + err);
      if (err.message === 'Request failed with status code 401') {
        toast.error('Access token expired. Please sign out and login again');
      }
    }
  };

  getUserOutwardTransactions = async () => {
    const allTransactions = this.state.allTransactions;
    const userOutwardTransactions = allTransactions.filter(
      (transaction) => transaction.custID === parseInt(this.state.custID)
    );
    this.setState({ userOutwardTransactions });
  };

  getUserInwardTransactions = async () => {
    const allTransactions = this.state.allTransactions;
    const userInwardTransactions = allTransactions.filter(
      (transaction) => transaction.payeeID === parseInt(this.state.custID)
    );
    this.setState({ userInwardTransactions });
  };

  getUserExpenditure = async () => {
    let userExpenditure = [0, 0, 0, 0, 0, 0];
    const userOutwardTransactions = this.state.userOutwardTransactions;
    userOutwardTransactions.forEach((transaction) => {
      const payee = this.state.users.find(
        (user) => transaction.payeeID === user.custID
      );
      transaction['payeeName'] = payee.firstName + ' ' + payee.lastName;
      switch (transaction.expensesCat) {
        case 'Insurance':
          userExpenditure[0] += transaction.amount;
          break;
        case 'Transport':
          userExpenditure[1] += transaction.amount;
          break;
        case 'Food':
          userExpenditure[2] += transaction.amount;
          break;
        case 'Entertainment':
          userExpenditure[3] += transaction.amount;
          break;
        case 'Shopping':
          userExpenditure[4] += transaction.amount;
          break;
        default:
          userExpenditure[5] += transaction.amount;
      }
    });
    this.setState({ userExpenditure });
  };

  getUserReceive = async () => {
    let userReceive = [0, 0, 0, 0, 0, 0];
    const userInwardTransactions = this.state.userInwardTransactions;
    userInwardTransactions.forEach((transaction) => {
      const payer = this.state.users.find(
        (user) => transaction.custID === user.custID
      );
      transaction['payerName'] = payer.firstName + ' ' + payer.lastName;
      switch (transaction.expensesCat) {
        case 'Insurance':
          userReceive[0] += transaction.amount;
          break;
        case 'Transport':
          userReceive[1] += transaction.amount;
          break;
        case 'Food':
          userReceive[2] += transaction.amount;
          break;
        case 'Entertainment':
          userReceive[3] += transaction.amount;
          break;
        case 'Shopping':
          userReceive[4] += transaction.amount;
          break;
        default:
          userReceive[5] += transaction.amount;
      }
    });
    this.setState({ userReceive });
  };

  getUserExpenditureChartData = async () => {
    const userExpenditureChartData = {
      labels: [
        'Insurance',
        'Transport',
        'Food',
        'Entertainment',
        'Shopping',
        'Others',
      ],
      datasets: [
        {
          label: 'Expenses',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          data: this.state.userExpenditure,
        },
      ],
    };
    this.setState({ userExpenditureChartData });
  };

  getUserReceiveChartData = async () => {
    const userReceiveChartData = {
      labels: [
        'Insurance',
        'Transport',
        'Food',
        'Entertainment',
        'Shopping',
        'Others',
      ],
      datasets: [
        {
          label: 'Expenses',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          data: this.state.userReceive,
        },
      ],
    };
    this.setState({ userReceiveChartData });
  };

  getOverallAverageExpenditure = async () => {
    let overallAverageExpenditure = [0, 0, 0, 0, 0, 0];
    const allTransactions = this.state.allTransactions;
    allTransactions.forEach((transaction) => {
      switch (transaction.expensesCat) {
        case 'Insurance':
          overallAverageExpenditure[0] += transaction.amount;
          break;
        case 'Transport':
          overallAverageExpenditure[1] += transaction.amount;
          break;
        case 'Food':
          overallAverageExpenditure[2] += transaction.amount;
          break;
        case 'Entertainment':
          overallAverageExpenditure[3] += transaction.amount;
          break;
        case 'Shopping':
          overallAverageExpenditure[4] += transaction.amount;
          break;
        default:
          overallAverageExpenditure[5] += transaction.amount;
      }
    });
    overallAverageExpenditure = overallAverageExpenditure.map(
      (expenditure) => expenditure / this.state.users.length
    );
    this.setState({ overallAverageExpenditure });
  };

  getOverallAverageExpenditureChartData = async () => {
    const overallAverageExpenditureChartData = {
      labels: [
        'Insurance',
        'Transport',
        'Food',
        'Entertainment',
        'Shopping',
        'Others',
      ],
      datasets: [
        {
          label: 'Expenses',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          data: this.state.overallAverageExpenditure,
        },
      ],
    };
    this.setState({ overallAverageExpenditureChartData });
  };

  render() {
    return (
      <>
        <ToastContainer />
        <Extend />
        <Navbar />
        <Jumbotron fluid>
          <Container>
            <h2 className="display-4">Outflows Transaction History</h2>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Payment To</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Is eGift?</th>
                  <th>Message</th>
                  <th>Expenses Category</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userOutwardTransactions.map((transaction) => (
                  <tr key={Math.random()}>
                    <td>{transaction.payeeName}</td>
                    <td>{Date(transaction.dateTime)}</td>
                    <td>${transaction.amount}</td>
                    <td>{transaction.eGift ? 'Yes' : 'No'}</td>
                    <td>{transaction.message}</td>
                    <td>{transaction.expensesCat}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h2 className="display-4">Inflows Transaction History</h2>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Payment From</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Is eGift?</th>
                  <th>Message</th>
                  <th>Expenses Category</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userInwardTransactions.map((transaction) => (
                  <tr key={Math.random()}>
                    <td>{transaction.payerName}</td>
                    <td>{Date(transaction.dateTime)}</td>
                    <td>${transaction.amount}</td>
                    <td>{transaction.eGift ? 'Yes' : 'No'}</td>
                    <td>{transaction.message}</td>
                    <td>{transaction.expensesCat}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h1>Expenses Breakdown by Category</h1>
            <Bar
              data={this.state.userExpenditureChartData}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: true,
              }}
            />
            <h1>All Users' Average Expenses Breakdown by Category</h1>
            <Bar
              data={this.state.overallAverageExpenditureChartData}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: true,
              }}
            />
            <h1>Inflows Breakdown by Category</h1>
            <Bar
              data={this.state.userReceiveChartData}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: true,
              }}
            />
            {/* <Chatbot /> */}
          </Container>
        </Jumbotron>
      </>
    );
  }
}
