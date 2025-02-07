import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleInterests } from '../feature/user/userSlice'

const Interests = () => {
    const {profile:{interests}} = useSelector(state => state.user)
    const dispatch = useDispatch()
  return (
    <div className='flex flex-col'>
        {
            interests?.map(interest => {
                return (
                    
                    
                    <div className="form-control" key={interest?.id}>
  <label className="cursor-pointer label">
    <span className="label-text">{interest?.name}</span>
    <input type="checkbox" checked={interest?.isSelected} onChange={() => dispatch(handleInterests(interest?.id))} className="checkbox checkbox-success" />
  </label>
</div>
                    
                )
            })
        }
    </div>
  )
}

export default Interests