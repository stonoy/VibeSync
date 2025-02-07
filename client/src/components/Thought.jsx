import React from 'react'
import moment from 'moment/moment'
import { FcLike } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { roles } from '../utils';

const Thought = ({createdAt,_id, text,fromUserId, toUserId, shared, likes, revealed, isReveal}) => {
  return (
    <div className="card  w-96 shadow-xl m-4 p-4 bg-neutral">
      {fromUserId && <div className='flex items-center'>
              <Link to={`/profile/${fromUserId?._id}`} tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar inline-block">
                      <div className={`w-10 rounded-full border-4 ${roles[fromUserId?.role]}`}>
                        <img
                          alt="Tailwind CSS Navbar component"
                          src={fromUserId?.avater} />
                      </div>
                    </Link>
                    <span className='m-1 capitalize text-neutral-content text-xl font-semibold'>{fromUserId?.name || toUserId?.name}</span>
            </div>}
  <div className="p-4 bg-base-100 rounded-md">
    {text}
  </div>
  <div className='mt-2 flex justify-between items-center'>
    <button className='flex gap-1 items-center text-lg'>
      <span>{likes}</span>
      <FcLike />
    </button>
    {
      isReveal && <Link to={`/revealthought/${_id}`} className='inline-block text-green-500'>{revealed ? "Check" : "Reveal"}</Link>
    }
  </div>
</div>
  )
}

export default Thought