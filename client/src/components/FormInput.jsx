import React from 'react'

const FormInput = ({name, type, label, isRequired}) => {
    const required = isRequired ? "require":""
  return (
    <div className="form-control">
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
          <input type={type} name={name} placeholder={label} className="input input-bordered" required />
        </div>
  )
}

export default FormInput