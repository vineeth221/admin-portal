import { SET_EMAILS ,SET_EMAIL_COUNT} from '../../components/types/type';

export const setEmails = (emails) => ({
    type: SET_EMAILS,
    payload: emails,
  });

  export const setEmailCount = (count) => ({
    type: SET_EMAIL_COUNT,
    payload: count,
  });
  