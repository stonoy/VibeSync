import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAge, setBio, setGender } from '../feature/user/userSlice'

const Basic = () => {
    const {profile:{gender, age, bio}} = useSelector(state => state.user)
    const dispatch = useDispatch()

  return (
    <div className='flex flex-col gap-4'>
        <div className='flex flex-col'>
        <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">Male</span>
                <input type="radio" name="Male"
            checked={gender == "Male"}
            onChange={() => dispatch(setGender("Male"))} className="radio checked:bg-blue-500" />
            </label>
        </div>
            
        <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">Female</span>
                <input type="radio" name="Female"
            checked={gender == "Female"}
            onChange={() => dispatch(setGender("Female"))} className="radio checked:bg-blue-500" />
            </label>
        </div>
        <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">Others</span>
                <input type="radio" name="Others"
            checked={gender == "Others"}
            onChange={() => dispatch(setGender("Others"))} className="radio checked:bg-blue-500" />
            </label>
        </div>
        </div>

        <label className="form-control w-full ">
            <div className="label">
                <span className="label-text">Bio</span>
                
            </div>
            <input type="text" value={bio} onChange={(e) => dispatch(setBio(e.target.value))} placeholder="write your bio..." className="input input-bordered w-full " />
</label>

        <div className='flex justify-between items-center'>
            <label>Age</label>
            <input type='number' className='w-14' value={age} onChange={(e) => dispatch(setAge(e.target.value))} />
        </div>
    </div>
  )
}

export default Basic