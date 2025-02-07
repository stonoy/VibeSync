import React from 'react'
import { useSelector } from 'react-redux'
import { roles } from '../utils'
import { Link } from 'react-router-dom'

const Profile = () => {
    const {user, userLoading} = useSelector(state => state.user)
    
    if (userLoading){
      return <h1>Loading...</h1>
    }

    if (!user){
      return <h1>No User</h1>
    }

    const {_id, avater, role, name, interests} = user
  return (
    <div>
        <div className='flex items-center'>
        <Link to={`/profile/${_id}`} tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar inline-block">
                <div className={`w-10 rounded-full border-4 ${roles[role]}`}>
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={avater} />
                </div>
              </Link>
              <span className='m-1 capitalize text-neutral-content text-xl font-semibold'>{name}</span>
      </div>
      <div className='mt-2'>
        Interests {interests?.map((interest,i) => <p key={i}>- {interest}</p>)}
      </div>
    </div>
  )
}

export default Profile