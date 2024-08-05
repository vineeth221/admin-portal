import { SET_EMAILS ,SET_EMAIL_COUNT, UPDATE_EMAIL_COUNT} from '../../components/types/type';

export const setEmails = (emails) => ({
    type: SET_EMAILS,
    payload: emails,
  });

  export const setEmailCount = (count) => ({
    type: SET_EMAIL_COUNT,
    payload: count,
  });

  // actions/action.js
// export const updateEmailCount = (count) => ({
//   type: UPDATE_EMAIL_COUNT,
//   payload: count,
// });

  