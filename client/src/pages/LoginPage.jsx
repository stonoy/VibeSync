import React, { useRef } from 'react'
import { FormInput } from '../components'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../feature/user/userSlice'
import { ImSpinner9 } from 'react-icons/im'

const LoginPage = () => {
  const {userSubmitting} = useSelector(state => state.user)
    const formRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData(formRef.current)
        const data = Object.fromEntries(formData)

        // console.log(data)
        dispatch(loginUser(data)).then(({type}) => {
          if (type == "user/login/fulfilled"){
            
            navigate("/")
          }
        })
    }

  return (
    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row lg:justify-between">
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">Login now!</h1>
      <p className="py-6">
        Welcome to VibeSync
      </p>
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <form ref={formRef} onSubmit={handleSubmit} className="card-body">
        <FormInput name="email" label="Email" type="text" isRequired={true} />
        <FormInput name="password" label="Password" type="password" isRequired={true} />
        <button className='btn btn-ghost' disabled={userSubmitting}>
                          {
                                  userSubmitting ? 
                                  <span className='flex gap-1 items-center'>
                                    <ImSpinner9 className='animate-spin' />
                                    Login
                                  </span>
                                  :
                                  <span>Login</span>
                                }
                        </button>
        <p>new here <Link to="/register" className='underline text-neutral'>register</Link></p>
      </form>
      
    </div>
  </div>
</div>
  )
}

export default LoginPage