import axios from "axios"
import { io } from "socket.io-client";

export const customFetch = axios.create({
    baseURL: location.hostname == "localhost" ? "http://localhost:8080/api" : "/api",
    withCredentials: true
})

export const startSocketConnection = () => {
    const baseUrl = location.hostname == "localhost" ? "http://localhost:8080" : ""

    return io(baseUrl)
}

export const links = [
    // {id: 1, name:"Create", link:"/makethought"},
    {id: 2, name:"Vibes", link:"/vibes"},
    {id: 3, name:"Friends", link:"/friends"},
    {id: 4, name:"Suggestions", link:"/suggestions"},
    {id: 5, name:"Reviews", link:"/reviews"},
    {id: 6, name:"Plan", link:"/plan"},
    {id: 7, name:"My_Thoughts", link:"/mythoughts"},
]

export const roles = {
    admin: "border-green-500",
    gold: "border-amber-500",
    silver: "border-stone-500"
}

export const interestOptions = [
    {id:1, name:"Hills", isSelected: false},
    {id:2, name:"Self", isSelected: false},
    {id:3, name:"Foodie", isSelected: false},
    {id:4, name:"Sea", isSelected: false},
    {id:5, name:"East", isSelected: false},
    {id:6, name:"North", isSelected: false},
    {id:7, name:"Sleep", isSelected: false},
    {id:8, name:"Active", isSelected: false},
    {id:9, name:"Independent", isSelected: false},
    {id:10, name:"Home", isSelected: false},
]

export const readyForProfileUpdate = (profile) => {
    const interests = profile.interests.reduce((total, interest) => {
        if (interest.isSelected){
            total = [...total, interest.name]
        }
        return total
    }, [])

    return {
        interests,
        age: profile.age,
        gender: profile.gender,
        bio: profile.bio
    }
}