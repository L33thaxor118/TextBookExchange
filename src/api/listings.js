import { makeRequest } from '.';

const makeListingsRequest = (options = {}) => makeRequest({...options, endpoint: '/listings'});

const getListingById = id => makeListingsRequest({ method: 'GET', id });
const getAllListings = () => makeListingsRequest({ method: 'GET' });

const listingsApi = {
  get(options = {}) {
    const { id } = options;
    if (id) {
      return getListingById(id);
    } else {
      return getAllListings(); 
    }
  },
  create(listing = {}) {
    return makeListingsRequest({
      method: 'POST',
      params: listing
    });
  },
  update: (options = {}) => {
    const { id, ...listing } = options;
    return makeListingsRequest({ method: 'PUT', params: listing, id });
  },
  delete(options = {}) {
    const { id } = options;
    return makeListingsRequest({ method: 'DELETE', id });
  }
};

export default listingsApi;