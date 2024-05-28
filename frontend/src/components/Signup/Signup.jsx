import React, { useState } from 'react';
import { useLocalContext } from '../../context/context';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { useAuth0 } from '@auth0/auth0-react';
import { FaGoogle } from "react-icons/fa";
import db, { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const provider = new GoogleAuthProvider();
    const { login } = useLocalContext();
    const { user, loginWithRedirect } = useAuth0();
    const [userCredentials, setUserCredentials] = useState({});
    const [error, setError] = useState('');
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    auth.languageCode = 'it';

    const checkEducationalEmail = (email) => {
        const educationalDomains = ["edu", "ac", "school"];
        const domain = email.substring(email.lastIndexOf("@") + 1);
        return educationalDomains.some(eduDomain => domain.includes(eduDomain));
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const email = user.email;

                if (!checkEducationalEmail(email)) {
                    setError("Please use an educational email");
                } else {
                    dispatch(setUser({ id: user.uid, email: user.email, photo: user.photoURL, name: user.displayName }));
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData;
                const credential = GoogleAuthProvider.credentialFormError(error);
            });
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch(setUser({ id: user.uid, email: user.email,displayName:userCredentials.userName,regId: userCredentials.studentId }));
            const mainDoc=doc(db,`Users/${user.email}`)
            const docData={
                userId:userCredentials.studentId,
                email:user.email,
                name:userCredentials.userName,
                password:userCredentials.password
            }
            setDoc(mainDoc,docData);
            navigate('/');
        }
        else {
            dispatch(setUser(null))
        }
    })

    const handleCredentials = (e) => {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value })
    }

    const handleSignup = (e) => {
        e.preventDefault();
        setError("")
        const email = userCredentials.email;

        if (!checkEducationalEmail(email)) {
            setError("Please use an educational email");
        } else {
            createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
                .then(()=>{

                })
                .catch((error) => {
                    setError(error.message)
                });
        }
    };

    return (
        // <div className="flex">
        //     <div className="w-1/2 flex items-center justify-center">
        //         <img src={'/banner.png'} alt="AIR" className='w-full h-full object-cover' />
        //     </div>

        // </div>
        <div className="flex items-center justify-center">
            <div className="h-screen flex flex-col items-center justify-center gap-[2rem] ">
                <div className=" flex flex-col items-center">
                    <h3 className='font-extrabold font-["Open_Sans"] text-[1.8rem] sm:text-[3.3rem] text-[#032B44]'>AU Classroom</h3>
                    <h2 className='font-bold text-[1.5rem] sm:text-4xl text-black opacity-90'>Sign Up </h2>
                </div>
                <form className='flex flex-col gap-3 w-[22rem]'>

                    {error && <div className='border-2 rounded-sm font-semibold text-white bg-[#eb4848] border-[#eb4848] py-2 px-4 '>
                        {error}</div>}
                    <div className="flex gap-4 sm:w-[21.6rem] justify-between">
                        <div className="">
                            {/* <label className='font-bold '>User Name:</label> */}
                            <input className='border-2 rounded-full py-2 px-4 w-[10.5rem] ' name='userName' required type="text" placeholder='User Name' onChange={(e) => { handleCredentials(e) }} />
                        </div>
                        <div className="">
                            {/* <label className='font-bold '>Student ID:</label> */}
                            <input className='border-2 rounded-full py-2 px-4 w-[10.5rem]' name='studentId' required type="text" placeholder='Student ID' onChange={(e) => { handleCredentials(e) }} />
                        </div>
                    </div>

                    <div className="flex items-center justify-center sm:flex-col">
                        {/* <label className='font-bold '>Email Address:</label> */}
                        <input className='border-2 rounded-full  w-[22rem] py-2 px-4' name='email' required type="email" placeholder='Email' onChange={(e) => { handleCredentials(e) }} />
                    </div>
                    <div className="flex sm:flex-col">
                        {/* <label className='font-bold '>Password:</label> */}
                        <input className="border-2 rounded-full  w-[22rem] py-2 px-4" name='password' required type="password" placeholder='Password' onChange={(e) => { handleCredentials(e) }} />
                    </div>
                    <button onClick={(e) => { handleSignup(e) }} type="submit" className="rounded-full py-2 font-bold  bg-gradient-to-r from-[#032B44] via-[#205475] to-[#052F48] text-white">SIGN UP</button>
                    <p className='mx-auto text-gray-500 text-sm sm:text-lg font-bold'>OR</p>
                    <button className='flex gap-4 text-lg rounded-full items-center justify-center text-red-500 font-bold' onClick={handleGoogleLogin}><FaGoogle />Login With Google</button>
                </form>
                <div className=" text-sm ">
                    <p>Already have an account? <Link className='text-blue-800 font-semibold text-decoration-line: underline'  to="/"> Login</Link> </p>
                </div>
            </div>
        </div>
    );
}