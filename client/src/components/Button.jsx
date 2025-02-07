import React from 'react'
import { ImSpinner9 } from "react-icons/im";
import { useDispatch } from 'react-redux';

const Button = ({style, name, isSubmitting, handler, data, after=() => {}}) => {
  const dispatch = useDispatch()
  

  const handleClick = () => {
    dispatch(handler(data)).then(() => after())
  }
  return (
    <button className={`btn btn-${style}`} onClick={handleClick}>
      {
        isSubmitting ? 
        <span>
          <ImSpinner9 className='animate-spin' />
          {name}
        </span>
        :
        <span>{name}</span>
      }
    </button>
  )
}

export default Button