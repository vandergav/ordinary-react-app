const axios = require('axios');

const config = {
  headers: {
    'x-api-key': process.env.TECHTREK_API_KEY,
  },
};

exports.accountsView = (req, res) => {
  const data = req.body; // { custID: '8' }
  axios
    .post(
      'https://u8fpqfk2d4.execute-api.ap-southeast-1.amazonaws.com/techtrek2020/accounts/view',
      data,
      config
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.transactionView = (req, res) => {
  const data = req.body;
  axios
    .post(
      'https://u8fpqfk2d4.execute-api.ap-southeast-1.amazonaws.com/techtrek2020/transaction/view',
      data,
      config
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.users = (req, res) => {
  axios
    .post(
      'https://u8fpqfk2d4.execute-api.ap-southeast-1.amazonaws.com/techtrek2020/users',
      null,
      config
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.transactionAdd = (req, res) => {
  const data = req.body;
  axios
    .post(
      'https://u8fpqfk2d4.execute-api.ap-southeast-1.amazonaws.com/techtrek2020/transaction/add',
      data,
      config
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
