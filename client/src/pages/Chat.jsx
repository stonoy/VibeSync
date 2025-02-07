import React from 'react'
import { ChatBox, ChatHead } from '../components'
import { useSelector } from 'react-redux'

const Chat = () => {
  
  return (
    <div className='flex gap-2'>
      <ChatHead/>
      <ChatBox/>
    </div>
  )
}

export default Chat