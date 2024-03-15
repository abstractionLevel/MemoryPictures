
import { CLICK_MENU } from '../actions/menuFolderActions';

const initialState = {
    isOpen: false,
};

const menuFolderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CLICK_MENU:
            return { ...state, isOpen: !state.isOpen };
        default:
            return state;
    }
};

export default menuFolderReducer;
