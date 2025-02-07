import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyThoughts } from '../feature/thought/thoughtSlice'
import { Thought } from '../components'

const MyThoughts = () => {
    const {thoughtLoading, myThoughts} = useSelector(state => state.thought)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMyThoughts())
    },[])

  return (
    <div className='border-x-2 border-slate-500 min-h-screen flex flex-col  items-center w-full'>
        <h1>MY Thoughts</h1>
          {
            !thoughtLoading ? 
            <>
              {
                myThoughts?.map(thought => <Thought key={thought._id} {...thought} />)
              }
            </>
            :
            <h1>Loading...</h1>
          }
      </div>
  )
}

export default MyThoughts