import React, { useEffect, useRef, useState } from 'react'
import { getLastSeen, getTheChat, msgReceiveViaSocket, removeMeFromChatActive } from '../feature/chat/chatSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { GoDotFill } from 'react-icons/go'
import { toast } from 'react-toastify'
import moment from "moment"

const ChatBox = () => {
  // const [text, setText] = useState("")
  const textRef = useRef(null)
  const {chatLoading, theChat, lastSeen, chatSubmitting} = useSelector(state => state.chat)
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const {chatId} = useParams()
  const {socket,onlineFriendId}= useOutletContext()
  const [busy, setBusy] = useState(false)
  const bottomRef = useRef()

  const participants = theChat?.participants
  const messages = theChat?.messages
  const recipientUser = participants?.find(participant => participant._id != user?._id)
  const userId = recipientUser?._id
  const isOnline = onlineFriendId.includes(userId)



  useEffect(() => {
    dispatch(getTheChat(chatId)).then(({payload}) => {
      // when page render scroll bottom of the messages
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });

      const participantsI = payload?.theChat?.participants
  
      const recipientUserI = participantsI?.find(participant => participant._id != user?._id)
      const userIdI = recipientUserI?._id

      if (!userIdI){
        toast.error("pls relogin")
        return
      }
      if (socket){
        
        socket.emit("joinroom", ({toUserId: userIdI, fromUserId: user?._id}))
  
        socket.on("receiveMessage", (data) => {
          const {chatId, newMsg} = data
          dispatch(msgReceiveViaSocket({chatId, newMsg}))
          setBusy(false)
          // when page render scroll bottom of the messages
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        });
  
        socket.on("receiveError", () => {
          
        })
      }
  
      
    })

    return () => {
      // dispatch remove active api call
      dispatch(removeMeFromChatActive(chatId))

      // socket off
      if (socket){
        socket.off("receiveMessage")
      socket.off("receiveError")
      }
    }

  },[chatId, socket])



  // useEffect(() => {
    
  // }, [chatId, socket])

  if (chatLoading){
    return <h1>Loading...</h1>
  }

 

  

  const handleSendMsg = () => {
    const text = textRef.current.value
    if (!text){return}

    if(socket){

      socket.emit("sendMessage", ({toUserId: userId, fromUserId: user?._id, text, chatId}))
      setBusy(true)
    }
  }

 

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <div className='flex gap-2 p-5 border-b border-gray-600'>
      <h1 className="">{recipientUser?.name}</h1>
      {isOnline ? <GoDotFill className='text-green-500 ' /> : lastSeen ? <span>{moment(lastSeen).format('MMMM Do YYYY, h:mm:ss a')}</span> : ""}
      {(!isOnline && !lastSeen) && <button disabled={chatSubmitting} className='p-1' onClick={() => dispatch(getLastSeen(userId))}>last seen</button>}
      </div>
      <div className="flex-1 overflow-scroll p-5">
        {/* chat messages here */}
        {theChat?.messages?.map((msg, index) => {
          // console.log(msg)
          const {sender, text, seen} = msg
          return (
            <div
              key={index}
              className={
                "chat " +
                (sender != user?._id ? "chat-end" : "chat-start")
              }
            >
              <div className="chat-header">
                {/* {`${msg.firstName}  ${msg.lastName}`} */}
                <time className="text-xs opacity-50">{moment(msg?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</time>
              </div>
              <div className="chat-bubble">{text}</div>
              <div className="chat-footer opacity-50">{seen ? "seen" : "delivered"}</div>
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          // value={text}
          // onChange={(e) => setText(e.target.value)}
          ref={textRef}
          className="flex-1 border border-gray-500 text-white rounded p-2"
        ></input>
        <button disabled={busy} onClick={handleSendMsg} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox