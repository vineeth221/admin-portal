import { SET_EMAILS, SET_EMAIL_COUNT } from '../../components/types/type';

const initialState = {
  emails: [],
  emailCount: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMAILS:
      return {
        ...state,
        emails: action.payload,
      };
    case SET_EMAIL_COUNT:
      return {
        ...state,
        emailCount: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
