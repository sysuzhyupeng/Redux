/**
 * 
 * 简化demo 
 */

import {
	combineReducers
} from 'redux';

function reducer(state = {
	"hello": "world"
}, action) {
	switch (action.type) {
		case 'action1':
			return Object.assign({}, state, action);
		case 'action2':
			return Object.assign({}, state, action);
		case 'action3':
			return Object.assign({}, state, action);
		default:
			return state;
	}
}
const todoApp = combineReducers({
	reducer
});
export default todoApp;