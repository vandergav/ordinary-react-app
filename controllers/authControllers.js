const axios = require('axios');

const { signAccessToken, signRefreshToken } = require('../helpers/jwtHelpers');

exports.login = (req, res) => {
  const data = req.body;
  const config = {
    headers: {
      'x-api-key': process.env.TECHTREK_API_KEY,
    },
  };
  axios
    .post(
      'https://u8fpqfk2d4.execute-api.ap-southeast-1.amazonaws.com/techtrek2020/login',
      data,
      config
    )
    .then(async (response) => {
      const accessTokenData = await signAccessToken(response.data.custID);
      const refreshTokenData = await signRefreshToken(response.data.custID);
      res.send({
        userDetails: response.data,
        accessTokenData,
        refreshTokenData,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
