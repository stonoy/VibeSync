import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { customFetch } from "../../utils"
import { toast } from "react-toastify"

const initialState = {
    thoughtLoading: false,
    thoughtSubmitting: false,
    userProfile: null,
    vibes: [],
    myThoughts: [],
    friendsSharedThoughts: [],
    userSharedThoughts: [],
    revealedThought: null
}

export const makeThought = createAsyncThunk("thought/makeThought",
    async(data, thunkAPI) => {
        
        try {
            const resp = await customFetch.post("thought/makethought", data)
            return resp?.data?.msg
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const revealThought = createAsyncThunk("thought/revealThought",
    async(thoughtId, thunkAPI) => {
        // console.log(thoughtId)
        try {
            const resp = await customFetch.patch(`/thought/revealAthought/${thoughtId}`)
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getFriendsSharedThoughts = createAsyncThunk("thought/friendsSharedThoughts",
    async(_, thunkAPI) => {
        try {
            const resp = await customFetch.get("/request/getfriendssharedthoughts")
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getUserSharedThoughts = createAsyncThunk("thought/getUserSharedThoughts",
    async(userId, thunkAPI) => {
        try {
            const resp = await customFetch.get(`/user/getprofile/${userId}`)
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getMyThoughts = createAsyncThunk("thought/getMyThoughts",
    async(_, thunkAPI) => {
        try {
            const resp = await customFetch.get(`/thought/mythoughts`)
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getThoughts = createAsyncThunk("thought/getThoughts",
    async(_, thunkAPI) => {
        try {
            const resp = await customFetch.get(`/thought/thoughts`)
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

const thoughtSlice = createSlice({
    name: "thought",
    initialState: JSON.parse(localStorage.getItem("thought")) || initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFriendsSharedThoughts.pending, (state, {payload}) => {
            state.thoughtLoading = true
        }).addCase(getFriendsSharedThoughts.fulfilled, (state, {payload}) => {
            state.thoughtLoading = false
            state.friendsSharedThoughts = payload?.friendsSharedThoughts
            localStorage.setItem("thought", JSON.stringify(state))
        }).addCase(getFriendsSharedThoughts.rejected, (state, {payload}) => {
            state.thoughtLoading = false
            toast.error(payload)
        }).addCase(getUserSharedThoughts.pending, (state, {payload}) => {
            state.thoughtLoading = true
        }).addCase(getUserSharedThoughts.fulfilled, (state, {payload}) => {
            state.thoughtLoading = false
            state.userProfile = payload?.user
            state.userSharedThoughts = payload?.userSharedThoughts
            localStorage.setItem("thought", JSON.stringify(state))
        }).addCase(getUserSharedThoughts.rejected, (state, {payload}) => {
            state.thoughtLoading = false
            toast.error(payload)
        }).addCase(getMyThoughts.pending, (state, {payload}) => {
            state.thoughtLoading = true
        }).addCase(getMyThoughts.fulfilled, (state, {payload}) => {
            state.thoughtLoading = false
            state.myThoughts = payload?.thoughts
            localStorage.setItem("thought", JSON.stringify(state))
        }).addCase(getMyThoughts.rejected, (state, {payload}) => {
            state.thoughtLoading = false
            toast.error(payload)
        }).addCase(getThoughts.pending, (state, {payload}) => {
            state.thoughtLoading = true
        }).addCase(getThoughts.fulfilled, (state, {payload}) => {
            state.thoughtLoading = false
            state.vibes = payload?.thoughts
            localStorage.setItem("thought", JSON.stringify(state))
        }).addCase(getThoughts.rejected, (state, {payload}) => {
            state.thoughtLoading = false
            toast.error(payload)
        }).addCase(makeThought.pending, (state, {payload}) => {
            state.thoughtSubmitting = true
        }).addCase(makeThought.fulfilled, (state, {payload}) => {
            state.thoughtSubmitting = false
            toast.success(payload)
        }).addCase(makeThought.rejected, (state, {payload}) => {
            state.thoughtSubmitting = false
            toast.error(payload)
        }).addCase(revealThought.pending, (state, {payload}) => {
            state.thoughtLoading = true
        }).addCase(revealThought.fulfilled, (state, {payload}) => {
            state.thoughtLoading = false
            state.revealedThought = payload?.thought
            localStorage.setItem("thought", JSON.stringify(state))
        }).addCase(revealThought.rejected, (state, {payload}) => {
            state.thoughtLoading = false
            toast.error(payload)
        })
    }
})

export default thoughtSlice.reducer