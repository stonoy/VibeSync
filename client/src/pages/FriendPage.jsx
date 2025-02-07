import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFriends } from '../feature/friend/friendSlice'
import { FriendAccepted } from '../components'

import { useOutletContext } from 'react-router-dom'

const FriendPage = () => {
  const {friendLoading,friends} = useSelector(state => state.friend)
  const dispatch = useDispatch()
  // const {socket} = useOutletContext()

  // console.log(socket)

  

  useEffect(() => {
    dispatch(getFriends())
  },[])

  if (friendLoading){
    return <h1>Loading...</h1>
  }

  if (friends.length < 1){
    return <h1>No Friend to show</h1>
  }
  return (
    <div className='border-x-2 border-slate-500 min-h-screen flex flex-col  items-center w-full'>
      <h1>Friends</h1>
      {
        friends?.map(friend => <FriendAccepted key={friend?._id} {...friend}/>)
      }
    </div>
  )
}

export default FriendPage