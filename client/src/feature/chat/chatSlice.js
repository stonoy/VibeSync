import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { customFetch } from "../../utils"
import { toast } from "react-toastify"


const initialState = {
    lastSeen: "",
    chatHeads: [],
    theChat: null,
    chatLoading: false,
    chatSubmitting: false,
    // joinRoom: 0,
}

export const getLastSeen = createAsyncThunk("chat/getLastSeen",
    async (userId, thunkAPI) => {
        
        try {
            const resp = await customFetch.get(`/user/getlastseen/${userId}`)
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const removeMeFromChatActive = createAsyncThunk("chat/removeMeFromChatActive",
    async (chatId, thunkAPI) => {
        
        try {
            const resp = await customFetch.patch(`/chat/removeactive/${chatId}`)
            return resp?.data?.msg
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getChatHeads = createAsyncThunk("chat/getChatHeads",
    async (_, thunkAPI) => {
        try {
            const resp = await customFetch.get("/chat/getmychats")
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getTheChat = createAsyncThunk("chat/getTheChat",
    async (chatId, thunkAPI) => {
        try {
            const resp = await customFetch.get(`/chat/getthechat/${chatId}`)
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

const chatSlice = createSlice({
    name: "chat",
    initialState: JSON.parse(localStorage.getItem("chat")) || initialState,
    reducers: {
        msgReceiveViaSocket: (state, {payload}) => {
            const {chatId, newMsg} = payload
            console.log(chatId, newMsg)
            // search in the chatHeads and update the last message
            state.chatHeads =  state.chatHeads.map(head => {
                if (head.chatId == chatId){
                    return {...head, lastMessage: newMsg}
                }
                return head
            })

            // push new message in theChat messages only when theChat(present chat body) id is same as new message chat id(else, new message received from anyone can come to the chatbox, though u r chatting with some other friend)
            if (state.theChat._id == chatId){
                state.theChat.messages = [...state.theChat.messages, newMsg]
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getChatHeads.pending, (state, {payload}) => {
            state.chatLoading = true
        }).addCase(getChatHeads.fulfilled, (state, {payload}) => {
            state.chatLoading = false
            state.chatHeads = payload?.myChats
            localStorage.setItem("chat", JSON.stringify(state))
        }).addCase(getChatHeads.rejected, (state, {payload}) => {
            state.chatLoading = false
            toast.error(payload)
        }).addCase(getTheChat.pending, (state, {payload}) => {
            state.chatLoading = true
        }).addCase(getTheChat.fulfilled, (state, {payload}) => {
            state.chatLoading = false
            state.theChat = payload?.theChat
            state.lastSeen = ""
            localStorage.setItem("chat", JSON.stringify(state))
        }).addCase(getTheChat.rejected, (state, {payload}) => {
            state.chatLoading = false
            toast.error(payload)
        }).addCase(removeMeFromChatActive.pending, (state, {payload}) => {
            state.chatLoading = true
        }).addCase(removeMeFromChatActive.fulfilled, (state, {payload}) => {
            state.chatLoading = false
            
        }).addCase(removeMeFromChatActive.rejected, (state, {payload}) => {
            state.chatLoading = false
            toast.error(payload)
        }).addCase(getLastSeen.pending, (state, {payload}) => {
            state.chatSubmitting = true
        }).addCase(getLastSeen.fulfilled, (state, {payload}) => {
            state.chatSubmitting = false
            state.lastSeen = payload?.offlineUser?.updatedAt
            localStorage.setItem("chat", JSON.stringify(state))
        }).addCase(getLastSeen.rejected, (state, {payload}) => {
            state.chatSubmitting = false
            toast.error(payload)
        })
    }
})

export const {msgReceiveViaSocket} = chatSlice.actions

export default chatSlice.reducer