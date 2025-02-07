import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { revealThought } from '../feature/thought/thoughtSlice'
import { Thought } from '../components'

const RevealThought = () => {
    const {thoughtId} = useParams()
    const dispatch = useDispatch()
    const {thoughtLoading,revealedThought} = useSelector(state => state.thought)
    const navigate = useNavigate()

    useEffect(() => {
        
        dispatch(revealThought(thoughtId)).then(({type}) => {
            if (type == "thought/makeThought/rejected"){
                navigate("/")
            }
        })
    }, [])

  return (
    <div className='border-x-2 border-slate-500 min-h-screen flex flex-col  items-center w-full'>
        {
            thoughtLoading || !revealThought ?
            <h1>Loading...</h1>
            :
            <Thought {...revealedThought}/>
        }
    </div>
  )
}

export default RevealThought