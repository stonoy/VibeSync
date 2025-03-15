import React, { useEffect, useRef, useState } from 'react'
import { getChatHeads, getLastSeen, getTheChat, msgReceiveViaSocket, removeMeFromChatActive } from '../feature/chat/chatSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { GoDotFill } from 'react-icons/go'
import { toast } from 'react-toastify'
import moment from "moment"

const ChatBox = () => {
  const [isTyping, setIsTyping] = useState(false)
  const textRef = useRef(null)
  const bottomRef = useRef(null)
  const chatBoxRef = useRef(null)
  const {chatLoading, theChat, lastSeen, chatSubmitting} = useSelector(state => state.chat)
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const {chatId} = useParams()
  const {socket,onlineFriendId}= useOutletContext()
  const [busy, setBusy] = useState(false)
  

  const participants = theChat?.participants
  const messages = theChat?.messages
  const recipientUser = participants?.find(participant => participant._id != user?._id)
  const userId = recipientUser?._id
  const isOnline = onlineFriendId.includes(userId)

  // console.log(chatId)

  useEffect(() => {
    dispatch(getTheChat(chatId)).then(({payload}) => {
      
      // get the chat heads
      dispatch(getChatHeads()).then(() => {
        // when page render scroll bottom of the messages
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      })

      

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
        chatBoxRef.current?.classList.add("border-4", "border-blue-500", "animate-pulse", "duration-1000")

        setTimeout(() => {
          chatBoxRef.current?.classList.remove("border-4", "border-blue-500", "animate-pulse", "duration-1000")
        },1000)
        });

        socket.on("send_show_typing", ({chatId:chatIdReceived, fromUserId}) => {
          
          if (user._id != fromUserId && chatId == chatIdReceived){
            setIsTyping(true)

            setTimeout(() => {setIsTyping(false)}, 1500)
          }
        })
  
        socket.on("receiveError", () => {
          // do it later...
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
      socket.off("send_show_typing")
      }
    }

  },[chatId, socket])



  // useEffect(() => {
   
  // }, [])

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

    textRef.current.value = ""
  }

 const handleShowTyping = () => {
  socket.emit("show_typing", ({toUserId: userId, fromUserId: user?._id, chatId}))
 }

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <div className='flex gap-2 p-5 border-b border-gray-600'>
      <h1 className="">{recipientUser?.name}</h1>
      {isOnline ? <GoDotFill className='text-green-500 ' /> : lastSeen ? <span>{moment(lastSeen).format('MMMM Do YYYY, h:mm:ss a')}</span> : ""}
      {(!isOnline && !lastSeen) && <button disabled={chatSubmitting} className='p-1' onClick={() => dispatch(getLastSeen(userId))}>last seen</button>}
      {isTyping && <span className='p-1 rounded-lg text-white bg-green-700'>typing...</span>}
      </div>
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-5">
        {/* chat messages here */}
        {theChat?.messages?.map((msg, index) => {
          // console.log(msg)
          const {sender, text, seen} = msg
          return (
            <div
              key={index}
              className={
                "chat " +
                (sender == user?._id ? "chat-end" : "chat-start")
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
        {/*
        moved to top ->
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-success text-base-content opacity-50">
              typing...
            </div>
          </div>
        )} */}
        <div ref={bottomRef}></div>
      </div>
      <div className="p-2 border-t border-gray-600 flex items-center gap-1 md:p-4 md:gap-2">
        <input
          // value={text}
          onChange={handleShowTyping}
          ref={textRef}
          className=" border w-full border-gray-500 text-white rounded p-2 md:flex-1"
        ></input>
        <button disabled={busy} onClick={handleSendMsg} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox