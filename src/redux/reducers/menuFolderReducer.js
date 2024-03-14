
import { OPEN_MENU, CLOSE_MENU } from '../actions/menuFolderActions';

const initialState = {
    isOpen: false,
};

const menuFolderReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_MENU:
            return { ...state, isOpen: true };
        case CLOSE_MENU:
            return { ...state, isOpen: false };
        default:
            return state;
    }
};

export default menuFolderReducer;
