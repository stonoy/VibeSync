import React, { useEffect, useRef, useState } from 'react'
import { links, roles } from '../utils'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ImSpinner9 } from 'react-icons/im'
import { getSearchUsers, logout, logoutUser } from '../feature/user/userSlice'
import { FaPlus } from "react-icons/fa6";
import { removeMeFromChatActive } from '../feature/chat/chatSlice'


const Header = () => {
  const {userSubmitting, user:{avater, role}, userLoading, searchUsers} = useSelector(state => state.user)
  const [search, setSearch] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {chatId} = useParams()
  const timeOutId = useRef(null)

  const handleUserSearch = (e) => {
      const text = e.target.value
      setSearch(text)
      if (timeOutId.current){
        
        clearTimeout(timeOutId.current)
      }
  
      timeOutId.current = setTimeout(() => {
        // console.log(text)
        if (text){
          dispatch(getSearchUsers(text))
        }
      }, 1000)
  }
 

  const handleLogout = () => {
    // dispatch remove active api call then logout
    if (chatId){
      dispatch(removeMeFromChatActive(chatId)).then(() =>{
        dispatch(logoutUser()).then(({type}) => {
          if (type == "user/logout/fulfilled"){
            dispatch(logout())
            navigate("/login")
          }
        })
      })
    } else {
      dispatch(logoutUser()).then(({type}) => {
        if (type == "user/logout/fulfilled"){
          
          dispatch(logout())
          navigate("/login")
        }
      })
    }
    
  }

  return (
    <div className=" bg-neutral w-full">
  <div className='navbar mx-auto container p-2 relative md:p-4'>
  <div className="flex-1">
    <Link to="/" className="btn btn-ghost text-2xl">VibeSync</Link>
  </div>
  <div className="flex-none gap-2">
    
    <div className="form-control">
      <input type="text" value={search} onChange={handleUserSearch} placeholder="Search" className="input input-bordered w-24 md:w-auto" />
    </div>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className={`w-10 rounded-full border-4 ${roles[role]}`}>
          <img
            alt="Tailwind CSS Navbar component"
            src={avater} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        {links.map(({id, name, link}) => {
          
          return <li key={id} className='bg-base-200 border-b-2 border-slate-300 p-2 text-lg'><NavLink to={`${link}`} className={({ isActive }) => (isActive ? 'text-blue-500' : 'text-gray-200')}>{name}</NavLink></li>
        })}
        <button className='btn btn-ghost' onClick={handleLogout}>
          {
                  userSubmitting ? 
                  <span className='flex gap-1 items-center'>
                    <ImSpinner9 className='animate-spin' />
                    Logout
                  </span>
                  :
                  <span>Logout</span>
                }
        </button>
      </ul>
    </div>
  </div>
  </div>
  {
    search && <div className='w-24 absolute right-16 z-10 rounded-md bg-base-200 md:right-28 md:w-52'>
        {
          userLoading ?
          <h1 className=''>Loading...</h1>
          :
          <div className='flex flex-col gap-1 '>
            {
              searchUsers?.map(searchUser => <Link key={searchUser?._id} className='inline-block p-1 m-1 border-b-2 border-slate-300' to={`/profile/${searchUser?._id}`}>{searchUser?.name}</Link>)
            }
          </div>
        }
      </div>
  }
</div>
  )
}

export default Header