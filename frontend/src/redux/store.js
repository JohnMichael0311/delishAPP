import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import { thunk } from 'redux-thunk';  // Correct way to import redux-thunk
import foodReducer from './reducers/foodReducer';

const rootReducer = combineReducers({
  food: foodReducer,  // combine the foodReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));  // apply middleware for async actions

export default store;
