import React from 'react'
import moment from 'moment/moment'
import { FcLike } from "react-icons/fc";
import { FaShareSquare } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { roles } from '../utils';
import {useDispatch, useSelector} from "react-redux"
import { handleLike, shareAthought } from '../feature/thought/thoughtSlice';

const Thought = ({createdAt,_id, text,fromUserId, toUserId, shared, likes, revealed, isReveal, isShare}) => {
  const {thoughtSubmitting} = useSelector(state => state.thought)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const likeAThought = () => {
    dispatch(handleLike(_id)).then(() => {
      navigate(0)
    })
  }

  return (
    <div className="card  w-96 shadow-xl m-4 p-4 bg-neutral">
      {fromUserId && <div className='flex items-center'>
              <Link to={`/profile/${fromUserId?._id || fromUserId }`} tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar inline-block">
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
    <div className='flex gap-2'>
    <button onClick={likeAThought} disabled={thoughtSubmitting} className='flex gap-1 items-center text-lg'>
      <span>{likes}</span>
      <FcLike />
    </button>
    {
      isShare && <button onClick={() => dispatch(shareAthought(_id))} disabled={thoughtSubmitting} className='mx-2 text-lg'>
      <FaShareSquare />
  </button>
    }
    </div>
    {
      isReveal && <Link to={`/revealthought/${_id}`} className='inline-block text-green-500'>{revealed ? "Check" : "Reveal"}</Link>
    }
  </div>
</div>
  )
}

export default Thought