import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getThoughts } from '../feature/thought/thoughtSlice'
import { Thought } from '../components'

const Vibes = () => {
    const {thoughtLoading, vibes} = useSelector(state => state.thought)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getThoughts())
    },[])

  return (
    <div className='border-x-2 border-slate-500 min-h-screen flex flex-col  items-center w-full'>
        <h1>Vibes</h1>
          {
            !thoughtLoading ? 
            <>
              {
                vibes?.map(thought => <Thought key={thought._id} {...thought} isReveal={true}/>)
              }
            </>
            :
            <h1>Loading...</h1>
          }
      </div>
  )
}

export default Vibes