
const config = require('../config/index');

function axios(data) {
  if (!data.params) {
    data.params = {};
  }
  return new Promise((resove, reject) => {
    var u = config.host + data.url;
    wx.request({
      url: u,
      data: data.params,
      method: data.type,
      header: { "Content-Type": "application/json" },
      success: res => {
        const result = res.data;
        resove(result);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

const ArticleAPI = {
  findBySamples: params => axios({ params: params, url: '/article/findBySamples', type: 'POST' }),
  findByPage: params => axios({ params: params, url: '/article/findByPage', type:'GET' }),
  findReadLog: params => axios({ params: params, url: '/article/findReadLog', type: 'GET' }),
  findById: params => axios({ params: params, url: '/article/findById', type: 'GET' })
};

const UserAPI = {
  register: params => axios({ params: params, url: '/user/account/register', type: 'POST' }),
  login: params => axios({ params: params, url: '/user/account/login', type: 'POST' }),
  saveUserInfo: params => axios({ params: params, url: '/user/saveUserInfo', type: 'POST' })
};

const IntegralAPI = {
  addIntegral: params => axios({ params: params, url: '/integral/addIntegral', type: 'GET' }),
  checkIntegral: params => axios({ params: params, url: '/integral/checkIntegral', type: 'GET' })
};
module.exports = {
  ArticleAPI,
  UserAPI,
  IntegralAPI
};
