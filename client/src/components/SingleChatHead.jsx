import React from 'react'
import { customFetch, roles } from '../utils'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { GoDotFill } from 'react-icons/go'
import { useSelector } from 'react-redux'

const SingleChatHead = ({participants, lastMessage, userId}) => {
    
    const recipientUser = participants.find(user => user._id != userId)
    const navigate = useNavigate()
    const {onlineFriendId}= useOutletContext()

    const {_id, name, role, avater} = recipientUser

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
    <div onClick={handleChat} className='border-b-2 border-slate-500 p-2'>
        <div>
        <div className='flex gap-1 items-center'>
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className={`w-10 rounded-full border-4 ${roles[role]}`}>
                          <img
                            alt="Tailwind CSS Navbar component"
                            src={avater} />
                        </div>
                      </div>
                      {isOnline && <GoDotFill className='text-green-500 ' /> }
                      <span className='m-1 capitalize text-neutral-content '>{name}</span>
        </div>
         
    </div>
    <p className={`${!lastMessage?.seen && "font-semibold text-lg text-red-300"}`}>{lastMessage?.text.slice(0,10)}...</p>
        </div>
  )
}

export default SingleChatHead