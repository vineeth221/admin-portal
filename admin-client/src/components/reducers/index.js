// src/reducers/index.js
import { combineReducers } from 'redux';
import emailReducer from './emailReducer';

const rootReducer = combineReducers({
  email: emailReducer,
  // Add other reducers if needed
});

export default rootReducer;
