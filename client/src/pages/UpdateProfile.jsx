import React, { useState } from 'react'
import { Basic, Interests } from '../components'
import { Link, useNavigate } from 'react-router-dom'
import { updateProfile } from '../feature/user/userSlice'
import { useDispatch } from 'react-redux'

const UpdateProfile = () => {
  const [showBasic, setShowBasic] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleUpdateProfile = () => {
    dispatch(updateProfile()).then(({type}) => {
      if (type == "user/updateProfile/fulfilled"){
        navigate("/")
      }
    })
  }

  return (
    <div className='w-2/3 md:w-1/2 mx-auto'>
      <h1 className='w-fit mx-auto mb-4'>Update Profile</h1>
      <div className=''>
        <button  onClick={() => setShowBasic(true)} className={`btn w-1/2 ${showBasic ? 'btn-secondary' : 'btn-primary'}`}>Basic</button>
        <button onClick={() => setShowBasic(false)} className={`btn w-1/2 ${!showBasic ? 'btn-secondary' : 'btn-primary'}`}>Interests</button>
      </div>
      <div>
        {
          showBasic ?
          <Basic/>
          :
          <Interests />
        }
      </div>
      <div className='mt-4'>
        <Link to="/"  className={`btn w-1/2 btn-ghost`}>Skip</Link>
        <button onClick={handleUpdateProfile} className={`btn w-1/2 btn-accent'}`}>Update</button>
      </div>
    </div>
  )
}

export default UpdateProfile