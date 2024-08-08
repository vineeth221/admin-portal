import { SET_EMAILS ,SET_EMAIL_COUNT, UPDATE_EMAIL_COUNT, SET_NEW_EMAILS} from '../../components/types/type';

export const setEmails = (emails) => ({
    type: SET_EMAILS,
    payload: emails,
  });

  export const setEmailCount = (count) => ({
    type: SET_EMAIL_COUNT,
    payload: count,
  });

// actions/action.js


export const setNewEmails = (newEmails) => ({
  type: SET_NEW_EMAILS,
  payload: newEmails,
});


  