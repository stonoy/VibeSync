import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getChatHeads } from '../feature/chat/chatSlice'
import SingleChatHead from './SingleChatHead'
import { useParams } from 'react-router-dom'

const ChatHead = () => {
  const {chatLoading, chatHeads} = useSelector(state => state.chat)
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const {chatId} = useParams()

  useEffect(() => {
    dispatch(getChatHeads())
  },[chatId])

  if (chatLoading){
    return <h1>Loading...</h1>
  }

  if (chatHeads.length == 0){
    return <h1>No chats to show</h1>
  }

  return (
    <div className='w-1/4 flex flex-col gap-2 rounded-sm border-r-2 border-slate-500 min-h-screen'>
      {
        chatHeads?.map((head,i) => <SingleChatHead key={i} {...head} userId={user._id}/>) 
      }
    </div>
  )
}

export default ChatHead