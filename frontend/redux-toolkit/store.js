import {configureStore}from '@reduxjs/toolkit'
import userDataSlice from './userDataReducer';
import adminDataSlice from './adminDataReducer'
import allUsersData from './allUsersDataReducer'

const store=configureStore({
    reducer:{
        userData:userDataSlice,
        adminData:adminDataSlice,
        users:allUsersData
    }
})

export default store;