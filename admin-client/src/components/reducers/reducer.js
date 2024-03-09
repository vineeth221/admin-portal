import { SET_EMAILS } from '../../components/types/type';

const initialState = {
    emails: [],
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_EMAILS:
        return { ...state, emails: action.payload };
      default:
        return state;
    }
  };
  
  export default reducer;