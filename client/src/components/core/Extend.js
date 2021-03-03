import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';

import { Modal, Button } from 'react-bootstrap';

const Extend = () => {
  const [show, setShow] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const expiryTs = localStorage.getItem('accessTokenExpiry');
      const expiry = new Date(expiryTs * 1000);
      const now = Date.now();
      const remainingMilliSeconds = Math.floor((expiry - now) / 1000) * 1000;
      const remainingSeconds = remainingMilliSeconds / 1000;
      setCounter(remainingSeconds);
      counter === 10 && setShow(true);
      counter === 1 && setShow(false);
    }, 1000);
  }, [counter]);

  const handleExtend = async () => {
    const data = {
      refreshToken: localStorage.getItem('refreshToken'),
    };
    try {
      const res = await axios.post('/api/refresh-tokens', data, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.data.message === 'Unauthorized')
        toast.error('Refresh token invalid');
      else if (res.status === 200) {
        axios
          .post('/api/delete-refresh-token', data, {
            headers: {
              Authorization: `Basic ${localStorage.getItem('accessToken')}`,
            },
          })
          .then((response) => {
            console.log(
              'delete-refresh-token response: ' + JSON.stringify(response)
            );
          })
          .catch((error) => {
            console.log('delete-refresh-token error: ' + error);
          });
      }
      localStorage.setItem('accessToken', res.data.accessTokenData.token);
      localStorage.setItem('refreshToken', res.data.refreshTokenData.token);
      localStorage.setItem('accessTokenExpiry', res.data.accessTokenData.exp);
      toast.success('Token successfully refreshed');
      setShow(false);
    } catch (err) {
      console.log('Navbar-handleExtend err: ' + err);
      if (err.message === 'Request failed with status code 401') {
        toast.error('Access token expired. Please sign out and login again');
      }
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <ToastContainer />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center' }}>
          Would you like to refresh your token?
          <br />
          {counter} {counter === 1 ? 'second' : 'seconds'} remaining
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExtend}>
            Extend
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Extend;
