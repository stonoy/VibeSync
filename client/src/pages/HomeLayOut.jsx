import React, { createContext, useContext, useEffect, useState } from 'react'
import { Header } from '../components'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { customFetch, startSocketConnection } from '../utils'
import { toast } from 'react-toastify'
import { getUser } from '../feature/user/userSlice'
// import { doJoinRoom } from '../feature/chat/chatSlice'



const HomeLayOut = () => {
  const {isLoggedIn, user} = useSelector(state => state.user)
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)
  const [onlineFriendId, setOnlineFriendId] = useState([])
  const dispatch = useDispatch()
  // const [joinRoom, setJoinRoom] = useState(0)

  

  useEffect(() => {
    const newSocket = startSocketConnection()
    console.log("isLoggedIn")
    if (!isLoggedIn){
      navigate("/login")
    } else {
      
      // fetch all online friends
      customFetch.get("/request/getonlinefriends").then((resp) => {
        setOnlineFriendId(resp?.data?.friendsWhoROnline)
      }).catch((error) => {
        toast.error(error?.response?.data?.msg)
      })

    setSocket(newSocket)
    

    newSocket.emit("connectSocket", ({userId: user._id}))

    newSocket.on("userOnline", (onlineFriendId) => {
      // add a online friend
      setOnlineFriendId(prev => [...prev, onlineFriendId])
    })

    newSocket.on("userOffline", (offlineFriendId) => {
      // console.log(offlineFriendId)
        // remove an offline friend
        setOnlineFriendId(prev => {
          return prev.filter(onlineUserId => onlineUserId != offlineFriendId)
        })
    })

   
    }

    return () => {
      newSocket.disconnect()
    }
  },[])

  useEffect(() => {
    
    
    
  },[])

  if (!isLoggedIn){
    return <h1>login to continue</h1>
  }

  return (
    
      <main>
      <Header/>
      <section className='container mx-auto p-4 md:p-6'>
        <Outlet context={{socket, onlineFriendId}}/>
      </section>
    </main>
  )
}

export default HomeLayOut