import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { customFetch, interestOptions, readyForProfileUpdate } from "../../utils"
import { toast } from "react-toastify"

const initialState = {
    user: null,
    isLoggedIn: false,
    userLoading: false,
    userSubmitting: false,
    profile: {
        gender: "",
        age: 18,
        bio: "",
        interests: interestOptions
    },
    searchUsers: [],
}

export const loginUser = createAsyncThunk("user/login", 
    async (data, thunkAPI) => {
       
        try {
            const resp = await customFetch.post("/user/login", data)
            thunkAPI.dispatch(setTheUserProfile(resp?.data?.theUser))
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const registerUser = createAsyncThunk("user/register", 
    async (data, thunkAPI) => {
       
        try {
            const resp = await customFetch.post("/user/register", data)
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const logoutUser = createAsyncThunk("user/logout", 
    async (_, thunkAPI) => {
       
        try {
            const resp = await customFetch.post("/user/logout")

            

            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const updateProfile = createAsyncThunk("user/updateProfile", 
    async (_, thunkAPI) => {
        const {profile} = thunkAPI.getState().user

        const data = readyForProfileUpdate(profile)
       
        try {
            const resp = await customFetch.patch("/user/setprofile", data)
            return resp?.data?.msg
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getUser = createAsyncThunk("user/getUser", 
    async (_, thunkAPI) => {
       
        try {
            const resp = await customFetch.get("/user/getuser")
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

export const getSearchUsers = createAsyncThunk("user/getSearchUsers", 
    async (name, thunkAPI) => {
       
        try {
            const resp = await customFetch.get(`/user/searchusers/${name}`)
            return resp?.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.msg)
        }
    }
)

const userSlice = createSlice({
    name: "user",
    initialState: JSON.parse(localStorage.getItem("user")) || initialState,
    reducers: {
        logout: (state, action) => {
            
            localStorage.clear()
            return initialState
        },
        setGender: (state, {payload}) => {
            state.profile.gender = payload
        },
        setAge: (state, {payload}) => {
            if (payload < 18){return}
            state.profile.age = payload
        },
        setBio: (state, {payload}) => {
            state.profile.bio = payload
        },
        setTheUserProfile: (state, {payload}) => {
            state.profile.age = payload?.age
            state.profile.gender = payload?.gender
            state.profile.bio = payload?.bio

            if (payload?.interests){
                state.profile.interests = state.profile.interests.map(interest => {
                    if (payload.interests.includes(interest.name)){
                        return {...interest, isSelected: true}
                    }
                    return interest
                })
            }
        },
        handleInterests: (state, {payload}) => {
            state.profile.interests = state.profile.interests.map(interest => {
                if (interest.id == payload){
                    return {...interest, isSelected: !interest.isSelected}
                }
                return interest
            })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state, {payload}) => {
            state.userSubmitting = true
        }).addCase(loginUser.fulfilled, (state, {payload}) => {
            state.userSubmitting = false
            // state.token = payload.token
            state.user = payload?.theUser
            state.isLoggedIn = true
            localStorage.setItem("user", JSON.stringify(state))
            toast.success("logged In!")
        }).addCase(loginUser.rejected, (state, {payload}) => {
            state.userSubmitting = false
            toast.error(payload)
        }).addCase(registerUser.pending, (state, {payload}) => {
            state.userSubmitting = true
        }).addCase(registerUser.fulfilled, (state, {payload}) => {
            state.userSubmitting = false
        }).addCase(registerUser.rejected, (state, {payload}) => {
            state.userSubmitting = false
            toast.error(payload)
        }).addCase(logoutUser.pending, (state, {payload}) => {
            state.userSubmitting = true
        }).addCase(logoutUser.fulfilled, (state, {payload}) => {
            state.userSubmitting = false
        }).addCase(logoutUser.rejected, (state, {payload}) => {
            state.userSubmitting = false
            toast.error(payload)
        }).addCase(updateProfile.pending, (state, {payload}) => {
            state.userSubmitting = true
        }).addCase(updateProfile.fulfilled, (state, {payload}) => {
            state.userSubmitting = false
            toast.success(payload)
        }).addCase(updateProfile.rejected, (state, {payload}) => {
            state.userSubmitting = false
            toast.error(payload)
        }).addCase(getUser.pending, (state, {payload}) => {
            state.userLoading = true
        }).addCase(getUser.fulfilled, (state, {payload}) => {
            state.userLoading = false
            // state.token = payload.token
            state.user = payload?.theUser
            localStorage.setItem("user", JSON.stringify(state))
        }).addCase(getUser.rejected, (state, {payload}) => {
            state.userLoading = false
            toast.error(payload)
        }).addCase(getSearchUsers.pending, (state, {payload}) => {
            state.userLoading = true
        }).addCase(getSearchUsers.fulfilled, (state, {payload}) => {
            state.userLoading = false
            // state.token = payload.token
            state.searchUsers = payload?.users
            localStorage.setItem("user", JSON.stringify(state))
        }).addCase(getSearchUsers.rejected, (state, {payload}) => {
            state.userLoading = false
            toast.error(payload)
        })
    }
})

export const {logout, setTheUserProfile, setGender, setAge, handleInterests,setBio} = userSlice.actions

export default userSlice.reducer