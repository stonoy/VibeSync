import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserSharedThoughts } from '../feature/thought/thoughtSlice'
import { OtherProfile, Profile, Thought } from '../components'

const ProfilePage = () => {
    // const {user:{_id}} = useSelector(state => state.user)
    const {thoughtLoading, userSharedThoughts} = useSelector(state => state.thought)
    const dispatch = useDispatch()
    const {userId} = useParams()
    // const navigate = useNavigate()

    useEffect(() => {
      
        dispatch(getUserSharedThoughts(userId))
    },[userId])
  return (
    <div className='flex flex-col gap-2 md:gap-4 md:flex-row'>
      {/* {profile} */}
      {
        
        <OtherProfile/>
      }
      <div className='border-x-2 border-slate-500 min-h-screen'>
          {
            !thoughtLoading ? 
            <>
              {
                userSharedThoughts?.map(thought => <Thought key={thought._id} {...thought} />)
              }
            </>
            :
            <h1>Loading...</h1>
          }
      </div>
      </div>
  )
}

export default ProfilePage