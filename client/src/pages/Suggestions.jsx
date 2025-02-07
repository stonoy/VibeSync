import React from 'react'
import { Friend } from '../components'
import { useSelector } from 'react-redux'

const Suggestions = () => {
  const {suggestions} = useSelector(state => state.friend)

  if (suggestions.length < 1){
    return <h1>No Friend Suggestions to show</h1>
  }
  return (
    <div className='border-x-2 border-slate-500 min-h-screen flex flex-col  items-center w-full'>
      <h1>Friend Suggestions</h1>
      {
        suggestions?.map(suggestion => <Friend key={suggestion._id} {...suggestion} fullPage={true}/>)
      }
    </div>
  )
}

export default Suggestions