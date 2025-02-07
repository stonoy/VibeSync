import React, { useRef, useState } from 'react'
import { Button } from '../components'
import { useParams } from 'react-router-dom'
import { makeThought } from '../feature/thought/thoughtSlice'
import { useSelector } from 'react-redux'

const MakeThought = () => {
    const {thoughtSubmitting} = useSelector(state => state.thought)
    const [text, setText] = useState("")
    const {toUserId} = useParams()

  return (
    <div className='w-full p-6 flex flex-col justify-center items-center'>
        <textarea name={"text"} value={text} onChange={(e) =>setText(e.target.value)} className="textarea textarea-accent resize-none w-2/3 h-40 mb-4 lg:w-1/3" placeholder="Write your message..."></textarea>
       
        <Button  style="accent" name="Send" isSubmitting={thoughtSubmitting} data={{text, toUserId}} handler={makeThought} after={() => setText("")}/>
       
    </div>
  )
}

export default MakeThought