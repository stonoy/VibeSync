import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { customFetch } from "../../utils"
import { toast } from "react-toastify"

const initialState = {
    friendLoading: false,
    friendSubmitting: false,
    suggestions: [],
    reviews: [],
    friends: []
}

export const makeRequest = createAsyncThunk("friend/makeRequest",
    async (data, thunkAPI) => {
        try {
            const resp = await customFetch.post(`/request/initiate/${data?.status}/${data?._id}`)

            thunkAPI.dispatch(getSuggestions())

            return resp?.data?.msg
        } catch (error) {
            
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const reviewRequest = createAsyncThunk("friend/reviewRequest",
    async (data, thunkAPI) => {
        try {
            const resp = await customFetch.patch(`/request/review/${data?.status}/${data?._id}`)

            thunkAPI.dispatch(getReview())

            return resp?.data?.msg
        } catch (error) {
            
           return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getSuggestions = createAsyncThunk("friend/getSuggestions", 
    async (_, thunkAPI) => {
        try {
            const resp = await customFetch.get("/request/suggestions")
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg) 
        }
    }
)

export const getReview = createAsyncThunk("friend/getReview", 
    async (_, thunkAPI) => {
        try {
            const resp = await customFetch.get("/request/review")
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg) 
        }
    }
)

export const getFriends = createAsyncThunk("friend/getFriends", 
    async (_, thunkAPI) => {
        try {
            const resp = await customFetch.get("/request/friends")
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg) 
        }
    }
)

const friendSlice = createSlice({
    name: "friend",
    initialState: JSON.parse(localStorage.getItem("friend")) || initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSuggestions.pending, (state, {payload}) => {
            state.friendLoading = true
        }).addCase(getSuggestions.fulfilled, (state, {payload}) => {
            state.friendLoading = false
            state.suggestions = payload?.suggestions
            localStorage.setItem("friend", JSON.stringify(state))
        }).addCase(getSuggestions.rejected, (state, {payload}) => {
            state.friendLoading = false
            toast.error(payload)
        }).addCase(makeRequest.pending, (state, {payload}) => {
            state.friendSubmitting = true
        }).addCase(makeRequest.fulfilled, (state, {payload}) => {
            state.friendSubmitting = false
            toast.success(payload)
        }).addCase(makeRequest.rejected, (state, {payload}) => {
            state.friendSubmitting = false
            toast.error(payload)
        }).addCase(reviewRequest.pending, (state, {payload}) => {
            state.friendSubmitting = true
        }).addCase(reviewRequest.fulfilled, (state, {payload}) => {
            state.friendSubmitting = false
            toast.success(payload)
        }).addCase(reviewRequest.rejected, (state, {payload}) => {
            state.friendSubmitting = false
            toast.error(payload)
        }).addCase(getReview.pending, (state, {payload}) => {
            state.friendLoading = true
        }).addCase(getReview.fulfilled, (state, {payload}) => {
            state.friendLoading = false
            state.reviews = payload?.requestToReview
            localStorage.setItem("friend", JSON.stringify(state))
        }).addCase(getReview.rejected, (state, {payload}) => {
            state.friendLoading = false
            toast.error(payload)
        }).addCase(getFriends.pending, (state, {payload}) => {
            state.friendLoading = true
        }).addCase(getFriends.fulfilled, (state, {payload}) => {
            state.friendLoading = false
            state.friends = payload?.friends
            localStorage.setItem("friend", JSON.stringify(state))
        }).addCase(getFriends.rejected, (state, {payload}) => {
            state.friendLoading = false
            toast.error(payload)
        })
    }
})

export default friendSlice.reducer