import axios from 'axios';

const baseUri = 'https://uofi-book-exchange-backend.herokuapp.com';

export const makeRequest = (options = {}) => {
  const { id, method, endpoint, params } = options;
  
  const methodType = method.toLowerCase();
  const payload = methodType === 'get' ? { params } : params;
  let fullEndpoint = baseUri + endpoint;

  if (id) {
    fullEndpoint += `/${id}`;
  }

  return axios[methodType](fullEndpoint, payload).then(({ data }) => data);
};