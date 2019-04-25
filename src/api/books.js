import { makeRequest } from '.';

const makeBooksRequest = (options = {}) => makeRequest({...options, endpoint: '/books'});

const getBookById = id => makeBooksRequest({ method: 'GET', id });
const getAllBooks = () => makeBooksRequest({ method: 'GET' });

const getBookBySubject = (subject, courseNumber) => makeBooksRequest({
  method: 'GET',
  params: {
    subject,
    course_num: courseNumber,
  },
});

const booksApi = {
  get(options = {}) {
    const { id, subject, courseNumber } = options;

    if (id) {
      return getBookById(id);
    } else if (subject || courseNumber) {
      return getBookBySubject(subject, courseNumber);
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
  update: (options) => {
    const { id, ...book } = options;
    return makeBooksRequest({ method: 'PUT', params: book, id });
  },
  delete: id => makeBooksRequest({ method: 'DELETE', id }),
};

export default booksApi;