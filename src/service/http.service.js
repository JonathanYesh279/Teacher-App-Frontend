import Axios from 'axios';

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/';

const axios = Axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
});

export const httpService = {
  get(endpoint, data) {
    return ajax(endpoint, 'GET', data);
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data);
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data);
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data);
  },
};

async function ajax(endpoint, method = 'GET', data = null) {
  try {
    const headers = {};
    const token = sessionStorage.getItem('loginToken');

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await axios({
      url: endpoint,
      method,
      data,
      params: method === 'GET' ? data : null,
      headers,
    });

    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      if (endpoint !== 'auth/login') {
        sessionStorage.removeItem('teacher');
        sessionStorage.removeItem('loginToken');
        window.location.href = '/login';
        return;
      }
    }
    throw err;
  }
}
