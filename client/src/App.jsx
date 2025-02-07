import React from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import { Chat, FriendPage, HomeLayOut, Landing, LoginPage, MakeThought, MyThoughts, Plan, ProfilePage, Register, RevealThought, Reviews, Suggestions, UpdateProfile, Vibes } from './pages'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayOut/>,
    children: [
      {
        index: true,
        element:<Landing/>
      },
      {
        path: "profile/:userId",
        element: <ProfilePage/>,
      },
      {
        path: "vibes",
        element: <Vibes/>,
      },
      {
        path: "friends",
        element: <FriendPage/>,
      },
      {
        path: "suggestions",
        element: <Suggestions/>,
      },
      {
        path: "reviews",
        element: <Reviews/>,
      },
      {
        path: "plan",
        element: <Plan/>,
      },
      {
        path: "mythoughts",
        element: <MyThoughts/>,
      },
      {
        path: "makethought/:toUserId",
        element: <MakeThought/>,
      },
      {
        path: "revealthought/:thoughtId",
        element: <RevealThought/>,
      },
      {
        path: "chat/:chatId",
        element: <Chat />,
      },
      {
        path: "updateprofile",
        element: <UpdateProfile />
      }
    ]
  },
  {
    path: "/login",
    element:<LoginPage/>,
  },
  {
    path: "/register",
    element:<Register/>,
  },
])

const App = () => {
  return (<RouterProvider router={router} />);
}

export default App