import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        navigate('/')
    },[])
  return (
    <div className='text-center text-xl'>PageNotFound</div>
  )
}

export default PageNotFound