import React from 'react'
import { roles } from '../utils'
import { Link } from 'react-router-dom'
import Button from './Button'
import { makeRequest, reviewRequest } from '../feature/friend/friendSlice'

const Friend = ({_id, name, role, avater,bio,fromUserId, isReview, fullPage}) => {
  const handler = isReview ? reviewRequest : makeRequest

  if (isReview){
    //  In case of review, i need to send request(interested) -> _id not user-> _id
    // when it is request it fetches request obj and in that obj fromUserId -> user's _id, name, role, bio is present
     name = fromUserId?.name
     role = fromUserId?.role
     bio = fromUserId?.bio
  }

  return (
    <div className={`${fullPage && "flex justify-between items-center gap-2"} w-64 bg-base-200 shadow-lg m-2 rounded-md md:w-96`}>
        <div>
        <Link to={`/profile/${_id}`} className="block">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className={`w-10 rounded-full border-4 ${roles[role]}`}>
                          <img
                            alt="Tailwind CSS Navbar component"
                            src={avater} />
                        </div>
                      </div>
         <span className='m-1 capitalize text-neutral-content '>{name}</span>
    </Link>
    {fullPage && <p>{bio || "Hi, I m using VibeSync..."}</p>}
        </div>

    {
      isReview ?
      <>
        <div className='flex mt-1 p-1 gap-2'>
        <Button style="accent" name="Accept" data={{_id, status: "accepted"}} handler={handler}/>
        <Button style="error" name="Reject" data={{_id, status: "rejected"}} handler={handler}/>
    </div>
      </>
      :
      <>
        <div className='flex mt-1 p-1 gap-2'>
        <Button style="accent" name="Interested" data={{_id, status: "interested"}} handler={handler}/>
        <Button style="error" name="Cancel" data={{_id, status: "cancel"}} handler={handler}/>
    </div>
      </>
    }
    </div>
  )
}

export default Friend