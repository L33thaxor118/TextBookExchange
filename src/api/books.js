import { makeRequest } from '.';

const makeBooksRequest = (options = {}) => makeRequest({...options, endpoint: '/books'});

const getBookById = id => makeBooksRequest({ method: 'GET', id });
const getAllBooks = () => makeBooksRequest({ method: 'GET' });

const booksApi = {
  get(options = {}) {
    const { id } = options;

    if (id) {
      return getBookById(id);
    } else {
      return getAllBooks();
    }
  },
  create(book = {}) {
    return makeBooksRequest({
      method: 'POST',
      params: book
    });
  },
  update: (book = {}) => makeBooksRequest({ method: 'PUT', params: book }),
  delete: id => makeBooksRequest({ method: 'DELETE', id }),
};

export default booksApi;