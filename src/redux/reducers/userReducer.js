import { authentication } from '../../utils/firebase';
import usersApi from '../../api/users';

export const SET_USER = 'textbook-exchange/user/SET_USER';
export const LOAD_INITIAL_STATE = 'textbook-exchange/user/LOAD_INITIAL_STATE';
export const CREATE_USER = {
  SUCCESS: 'textbook-exchange/user/CREATE_USER_SUCCESS',
  FAILURE: 'textbook-exchange/user/CREATE_USER_FAILURE',
};

export const LOGIN = {
  SUCCESS: 'textbook-exchange/user/LOGIN_SUCCESS',
  FAILURE: 'textbook-exchange/user/LOGIN_FAILURE',
};

export const SIGN_OUT = 'textbook-exchange/user/SIGN_OUT';

const initialState = {
  user: null,
  error: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_USER: {
      return {
        ...state,
        user: action.currentUser,
      };
    }
    case LOGIN.SUCCESS:
    case CREATE_USER.SUCCESS: {
      return {
        ...state,
        user: action.user,
        error: null,
      };
    }
    case LOGIN.FAILURE:
    case CREATE_USER.FAILURE: {
      return {
        ...state,
        user: null,
        error: action.error,
      };
    }
    case SIGN_OUT: {
      return initialState;
    }
    default: return state;
  }
};

export const setCurrentUser = user => ({
  type: SET_USER,
  currentUser: user,
});

export const loadUserState = () => dispatch => {
  return new Promise(resolve => {
    authentication.onAuthStateChanged(async firebaseUser => {
      try {
        if (firebaseUser) {
          const { user } = await usersApi.get({ id: firebaseUser.uid });
          dispatch(setCurrentUser(user));
        }
      } catch (error) {}

      resolve();
    });
  });
};

export const createUser = userObject => async dispatch => {
  try {
    const { email, password } = userObject;
    const { user } = await authentication.createUserWithEmailAndPassword(email, password);
    
    if (user) {
      const { user: createdUser } = await usersApi.create({
        ...userObject,
        firebaseId: user.uid,
      });

      dispatch({
        type: CREATE_USER.SUCCESS,
        user: createdUser,
      });
    }
  } catch (error) {
    dispatch({
      type: CREATE_USER.FAILURE,
      error,
    });
  }
};

export const login = ({ email, password }) => async dispatch => {
  try {
    const { user } = await authentication.signInWithEmailAndPassword(email, password);
    dispatch({
      type: LOGIN.SUCCESS,
      user,
    });
  } catch (error) {
    dispatch({
      type: LOGIN.FAILURE,
      error,
    });
  }
};

export const signOut = () => async dispatch => {
  await authentication.signOut();
  dispatch({ type: SIGN_OUT });
};