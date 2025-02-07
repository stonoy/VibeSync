import React from 'react'
import { useSelector } from 'react-redux'
import { roles } from '../utils'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa6'
import { FaRegPenToSquare } from "react-icons/fa6";

const OtherProfile = () => {
  const {user} = useSelector(state => state.user)
    const {userProfile, thoughtLoading} = useSelector(state => state.thought)
  return (
    <div>
        <div className='flex items-center'>
        <Link to={`/profile/${userProfile?._id}`} tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar inline-block">
                <div className={`w-10 rounded-full border-4 ${roles[userProfile?.role]}`}>
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={userProfile?.avater} />
                </div>
              </Link>
              <span className='m-1 capitalize text-neutral-content text-xl font-semibold'>{userProfile?.name}</span>
      </div>
      <div className='mt-2'>
        Interests {userProfile?.interests.map((interest,i) => <p key={i}>- {interest}</p>)}
      </div>
      <div className="form-control mx-2 text-xl rounded-full  p-0.5">
      <Link to={`/makethought/${userProfile?._id}`}><FaPlus/></Link>
      {userProfile?._id == user?._id && <Link to="/updateprofile"><FaRegPenToSquare/></Link>}
    </div>
    </div>
  )
}

export default OtherProfile