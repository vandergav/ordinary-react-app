import React, { Component } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';

import Message from './Message';
import './Chatbot.css';

import { ArrowsAngleContract } from 'react-bootstrap-icons';
import { ArrowsAngleExpand } from 'react-bootstrap-icons';

export default class Chatbot extends Component {
  constructor(props) {
    super(props);

    this.messagesEnd = null;
    this.talkInput = null;

    this.state = {
      messages: [],
      showBot: true,
    };
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    if (this.talkInput) this.talkInput.focus();
  }

  df_text_query = async (text) => {
    let says = {
      speaks: 'me',
      msg: {
        text: {
          text: text,
        },
      },
    };
    this.setState({ messages: [...this.state.messages, says] }); // update own message in local state
    const data = {
      text,
      userID: sessionStorage.getItem('custID'),
    };
    try {
      const res = await axios.post('/api/df_text_query', data, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('accessToken')}`,
        },
      });
      for (let msg of res.data.fulfillmentMessages) {
        says = {
          speaks: 'bot',
          msg,
        };
        this.setState({ messages: [...this.state.messages, says] });
      }
    } catch (err) {
      console.log('Chatbot df_text_query err: ' + err);
      if (err.message === 'Request failed with status code 401') {
        toast.error('Access token expired. Please sign out and login again');
      }
    }
  };

  show = () => {
    this.setState({ showBot: true });
  };

  hide = () => {
    this.setState({ showBot: false });
  };

  renderMessages = (stateMessages) => {
    if (stateMessages) {
      return stateMessages.map((message, i) => (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      ));
    } else {
      return null;
    }
  };

  handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.df_text_query(e.target.value);
      e.target.value = ''; // Reset text input. Not using state
    }
  };

  render() {
    if (this.state.showBot) {
      return (
        <>
          <ToastContainer />
          <div className="chatbot-body">
            <Navbar bg="light">
              <Navbar.Brand>Chatbot</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link onClick={this.hide}>
                  <ArrowsAngleContract />
                </Nav.Link>
              </Nav>
            </Navbar>
            <div
              id="chatbot"
              // className="chatbot-messages"
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'white',
                overflow: 'auto',
              }}
            >
              {this.renderMessages(this.state.messages)}
              <div
                ref={(el) => {
                  this.messagesEnd = el;
                }}
                // className="chatbot-messages-bottom"
                style={{
                  float: 'left',
                  clear: 'both',
                }}
              ></div>
            </div>
            <div className="col-sm-12">
              <Form.Control
                // className="chatbot-input-text"
                style={{
                  margin: 0,
                  paddingLeft: '1%',
                  paddingRight: '1%',
                  width: '98%',
                }}
                type="text"
                placeholder="type a message"
                ref={(el) => {
                  this.talkInput = el;
                }}
                onKeyPress={this.handleInputKeyPress}
              />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <ToastContainer />
          <div className="chatbot-body" style={{ height: 40 }}>
            <Navbar bg="light">
              <Navbar.Brand>Chatbot</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link onClick={this.show}>
                  <ArrowsAngleExpand />
                </Nav.Link>
              </Nav>
            </Navbar>
          </div>
          <div
            ref={(el) => {
              this.messagesEnd = el;
            }}
            className="chatbot-messages-bottom"
          ></div>
        </>
      );
    }
  }
}
