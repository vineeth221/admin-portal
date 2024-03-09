import { SET_EMAILS } from '../../components/types/type';

export const setEmails = (emails) => ({
    type: SET_EMAILS,
    payload: emails,
  });
  