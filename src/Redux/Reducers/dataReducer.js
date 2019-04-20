import { FETCH_TODOS } from "../Actions/types";

export default(state = {}, action) => {
  if (action.type === FETCH_TODOS) {
    return action.payload;
  } else {
    return state;
  }
};
