import {createSlice} from '@reduxjs/toolkit';

export const usersSlice=createSlice({
    name: 'users',
    initialState: {
        currentUser:null,
        uid:null
    },
    reducers:{
        setUser:(users,action)=>{
            users.currentUser= action.payload
        },
        setUid: (users, action) => {
            users.uid = action.payload;
        }
    }
})

export const {setUser,setUid} = usersSlice.actions;

export const SelectUsers = state=> state.users;
export const SelectUid = state => state.users.uid;

export default usersSlice.reducer;