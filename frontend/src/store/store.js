import { configureStore } from "@reduxjs/toolkit";
import usersReducer from './userSlice.js';

export default configureStore({
    reducer:{
        users: usersReducer,
        uid: (state = null, action) => {
            switch (action.type) {
                case 'SET_UID':
                    return action.payload;
                default:
                    return state;
            }
        }
    }
})