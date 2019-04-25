import { makeRequest } from '.';

const makeUsersRequest = (options = {}) => makeRequest({...options, endpoint: '/users'});

const getUserById = id => makeUsersRequest({ method: 'GET', id });
const getAllUser = () => makeUsersRequest({ method: 'GET' });

const usersApi = {
  get(options = {}) {
    const { id } = options;
    if (id) {
      return getUserById(id);
    } else {
      return getAllUsers();
    }
  },
  create(user = {}) {
    return makeUsersRequest({
      method: 'POST',
      params: user
    });
  },
  update: (options = {}) => {
    const { id, ...user } = options;
    return makeUsersRequest({ method: 'PUT', params: user, id });
  },
  delete: id => makeUsersRequest({ method: 'DELETE', id }),
};

export default usersApi;