import AppConstants from '../AppConstants';
import assign from 'object-assign';
// Example state tree:
// [
//     {
//         id: 'EynH-wT-l',
//         email: 'a@a',
//         display_name: 'Yan Yi',
//		   online: true
//     },
//     {
//         id: 'uid2',
//         email: 'b@b',
//         display_name: 'Cristina',
//		   online: false
//     }        
// ]

export default function users(state=[], action) {
    switch (action.type) {
        case AppConstants.INIT_USERS:
            return action.users;        
        case AppConstants.USER_ONLINE:
        	return state.map(user => 
        		user.id === action.id ? 
        		assign({}, user, {online: true}): user);
        case AppConstants.USER_OFFLINE:
        	return state.map(user => 
        		user.id === action.id ? 
        		assign({}, user, {online: false}): user);        	
        default:
            return state;
    }
}