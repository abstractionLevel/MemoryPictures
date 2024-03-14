import { combineReducers } from 'redux';
import menuFolderReducer from './menuFolderReducer';

const rootReducer = combineReducers({
    menuFolder: menuFolderReducer, 
});

export default rootReducer;
