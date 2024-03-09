// src/components/store.js

import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from './components/reducers/reducer';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;