import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./feature/user/userSlice"
import thoughtReducer from "./feature/thought/thoughtSlice"
import friendReducer from "./feature/friend/friendSlice"
import chatReducer from "./feature/chat/chatSlice"

export const store = configureStore({
    reducer : {
        user: userReducer,
        thought: thoughtReducer,
        friend: friendReducer,
        chat: chatReducer,
    }
})