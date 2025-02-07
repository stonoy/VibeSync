import React from 'react'
import { customFetch, roles } from '../utils'
import Button from './Button'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { GoDotFill } from "react-icons/go";

const FriendAccepted = ({_id, name, role, bio, avater}) => {
  const {onlineFriendId}= useOutletContext()
  const navigate = useNavigate()

  const handleChat = async () => {
    try {
      const resp = await customFetch.post(`/chat/handlechat/${_id}`)
      const chatId = resp?.data?.theChat?._id

      navigate(`/chat/${chatId}`)
    } catch (error) {
      toast.error(error?.response?.data?.msg)
    }
  }

  const isOnline = onlineFriendId.includes(_id)
  return (
    <div className={`flex justify-between items-center gap-2 bg-base-200 shadow-lg m-2 rounded-md`}>
        <div>
        <Link to={`/profile/${_id}`} className="block">
        <div className='flex gap-1 items-center'>
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className={`w-10 rounded-full border-4 ${roles[role]}`}>
                          <img
                            alt="Tailwind CSS Navbar component"
                            src={avater} />
                        </div>
                      </div>
                      {isOnline && <GoDotFill className='text-green-500 ' />}
                      <span className='m-1 capitalize text-neutral-content '>{name}</span>
        </div>
         
    </Link>
    <p>{bio || "Hi, I m using VibeSync..."}</p>
        </div>
        <button className='btn btn-ghost' onClick={handleChat}>Chat</button>
        </div>
  )
}

export default FriendAccepted