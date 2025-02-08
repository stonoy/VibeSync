import React, { useRef, useState } from 'react'
import { customFetch } from '../utils'
import { toast } from 'react-toastify'

const Plan = () => {
  const [processing, setProssing] = useState(false)
  const [hasPaymentSucessful, setHasPaymentSuccessful] = useState(false)
  const orderIdRef = useRef()

  const verifyPayment = async() => {
    try {
      const resp = await customFetch.get(`/payment/verify/${orderIdRef.current}`)

      if (resp?.data?.paymentReceived == "successful"){
        setHasPaymentSuccessful(true)
      }
    } catch (error) {
      console.log(error?.response?.data?.msg)
      toast.error(error?.response?.data?.msg)
    }
  }

  const initiatePayment = async (theType) => {
    // console.log(type)
    setProssing(true)
    try {
      const resp = await customFetch.get(`/payment/initiate/${theType}`)

      // console.log(resp?.data)

      const {amount, key, id, notes: {name, email, type}} = resp?.data

      // set orderId for future use
      orderIdRef.current = id

      const options = {
        key, // Replace with your Razorpay key_id
        amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: type,
        description: 'Test Transaction',
        order_id: id, // This is the order_id created in the backend
        
        prefill: {
          name,
          email,
        },
        theme: {
          color: '#F37254'
        },
        handler: verifyPayment,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error?.response?.data?.msg)
    }
    setProssing(false)
  }

  return (
    <div>
      {
        hasPaymentSucessful ?
        <h1>Payment successful</h1>
        :
        <div className="flex w-full flex-col md:flex-row">
  <button disabled={processing} onClick={() => initiatePayment("gold")} className="card bg-amber-500 rounded-box text-primary-content grid h-32 flex-grow place-items-center">Gold</button>
  <div className="divider lg:divider-horizontal">OR</div>
  <button disabled={processing} onClick={() => initiatePayment("silver")} className="card bg-slate-500 rounded-box text-primary-content grid h-32 flex-grow place-items-center">Silver</button>
</div>
      }
    </div>
  )
}

export default Plan