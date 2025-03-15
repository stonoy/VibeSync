import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { roles } from '../utils'
import Thought from '../components/Thought'
import { getFriendsSharedThoughts } from '../feature/thought/thoughtSlice'
import { getSuggestions } from '../feature/friend/friendSlice'
import { Friend, Profile } from '../components'
import { getUser } from '../feature/user/userSlice'

const Landing = () => {
  
  const {thoughtLoading, friendsSharedThoughts} = useSelector(state => state.thought)
  const {friendLoading, suggestions} = useSelector(state => state.friend)
  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(getFriendsSharedThoughts())
      dispatch(getUser())
      dispatch(getSuggestions())
  },[])

  return (
    <div className='flex flex-col gap-2 md:gap-4 md:flex-row'>
      {/* {profile} */}
      <Profile/>
      <div className='border-x-2 border-slate-500 min-h-screen'>
          {
            !thoughtLoading ? 
            <>
              {
                friendsSharedThoughts?.map(thought => <Thought key={thought._id} {...thought} />)
              }
            </>
            :
            <h1>Loading...</h1>
          }
      </div>
      <div>
          {
            !friendLoading ?
            <>
              {
                suggestions?.map(suggestion => <Friend key={suggestion._id} {...suggestion} isReview={false} fullPage={false} />)
              }
            </>
            :
            <h1>Loading...</h1>
          }
      </div>
    </div>
  )
}

export default Landing