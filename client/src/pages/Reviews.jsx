import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Friend } from '../components'
import { getReview } from '../feature/friend/friendSlice'

const Reviews = () => {
  const {friendLoading,reviews} = useSelector(state => state.friend)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getReview())
  },[])

  if (friendLoading){
    return <h1>Loading...</h1>
  }

  if (reviews.length < 1){
    return <h1>No Friend Reviews to show</h1>
  }
  return (
    <div className='border-x-2 border-slate-500 min-h-screen flex flex-col  items-center w-full'>
      <h1>Friend Request Review</h1>
      {
        reviews.map(review => <Friend key={review._id} {...review} fullPage={true} isReview={true}/>)
      }
    </div>
  )
}

export default Reviews