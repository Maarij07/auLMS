import React, { useState } from 'react'
import { auth } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const checkEducationalEmail = (email) => {
        const educationalDomains = ["edu", "au", "school"];
        const domain = email.substring(email.lastIndexOf("@") + 1);
        return educationalDomains.some(eduDomain => domain.includes(eduDomain));
    };

    const handleReset = (e) => {
        e.preventDefault();
        if (!checkEducationalEmail(email)) {
            setError("Please use an educational email");
        } else {
            sendPasswordResetEmail(auth, email);
        }

    }

    return (
        <form onSubmit={handleReset} className="w-full h-screen flex flex-col items-center gap-4 justify-center">
            <h3 className='font-extrabold font-["Open_Sans"] text-[1.4rem] sm:text-[3.3rem] text-[#032B44]'>Forgotten Password</h3>
            <p className='w-[30rem] text-center'>Don't Worry, enter your email and we'll send you the password reset email right away</p>
            {error && <div className='sm:w-[22rem] border-2 rounded-full font-semibold text-white bg-[#f53939] border-[#eb4848] py-2 px-4 '>{error}</div>}
            <input className=' sm:w-[22rem] border-2 rounded-full py-2 px-4' name='email' required type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            <button className='w-[13.5rem] sm:w-[22rem] rounded-full py-2 font-bold bg-gradient-to-r from-[#032B44] via-[#205475] to-[#052F48] text-white'>Send Email</button>
            <p className='w-[30rem] text-center'>Back to <Link to='/' className='text-blue-800 font-semibold'> Login</Link></p>
        </form>
    )
}

export default ForgotPassword;