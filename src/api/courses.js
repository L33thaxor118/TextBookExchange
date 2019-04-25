import { makeRequest } from '.';

const makeCourseRequest = (options = {}) => makeRequest({...options, endpoint: '/courses'});

const coursesApi = {
  get(options = {}) {
    const { subject, courseNumber } = options;
    return makeCourseRequest({
      method: 'GET',
      params: {
        subject,
        course_num: courseNumber,
      },
    });
  }
};

export default coursesApi;