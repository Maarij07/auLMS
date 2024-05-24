import React, { useEffect, useState } from 'react';
import { useLocalContext } from '../../context/context';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { FaGoogle } from "react-icons/fa";
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

export default function SignIn() {
    const dispatch = useDispatch();
    const provider = new GoogleAuthProvider();
    const [isLoading, setIsLoading] = useState(false);
    const { loggedInUser, setLoggedInUser } = useLocalContext();
    const [userCredentials, setUserCredentials] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(setUser({ id: user.uid, email: user.email, photo: user.photoURL, name: user.displayName }));
            } else {
                dispatch(setUser(null));
            }
        });
    }, [dispatch]);

    const checkEducationalEmail = (email) => {
        const educationalDomains = ["edu", "au", "school"];
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
                setError(error.message);
                const email = error.customData;
                const credential = GoogleAuthProvider.credentialFormError(error);
            });
    };

    const handleCredentials = (e) => {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    };

    const handlePasswordReset = () => {
        const email = prompt('Please enter your email');
        sendPasswordResetEmail(auth, email);
        alert('Email sent! Check your inbox for password reset instruction');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        const email = userCredentials.email;

        if (!checkEducationalEmail(email)) {
            setError("Please use an educational email");
        } else {
            signInWithEmailAndPassword(auth, email, userCredentials.password)
                .catch((error) => {
                    setError(error.message);
                });
        }
    };

    return (
        <>
            <div className="flex items-center justify-center">
                <div className="h-screen flex flex-col items-center justify-center gap-[0.2rem] w-1/2">
                    <div className="flex sm:relative sm:bottom-16 flex-col items-center">
                        <h3 className='font-extrabold font-["Open_Sans"] text-[1.4rem] sm:text-[3.3rem] text-[#032B44]'>AU Classroom</h3>
                        <h2 className='font-bold sm:text-3xl text-[1rem] text-black opacity-90'>Welcome Back</h2>
                    </div>
                    <form className='items-center flex flex-col gap-2 w-[22rem]'>
                        {error && <div className='border-2 rounded-full font-semibold text-white bg-[#f53939] border-[#eb4848] py-2 px-4 '>
                            {error}</div>}
                        <div className="flex sm:flex-col">
                            {/* <label className='font-bold '>Email Address:</label> */}
                            <input className='w-[22rem] border-2 rounded-full py-2 px-4' name='email' required type="email" placeholder='Email' onChange={handleCredentials} />
                        </div>
                        <div className="flex sm:flex-col">
                            {/* <label className='font-bold '>Password:</label> */}
                            <input className="w-[22rem] border-2 rounded-full py-2 px-4" name='password' required type="password" placeholder='Password' onChange={handleCredentials} />
                        </div>
                        <button onClick={handleLogin} type="submit" className=" w-[13.5rem] sm:w-[22rem] rounded-full py-2 font-bold bg-gradient-to-r from-[#032B44] via-[#205475] to-[#052F48] text-white">Log in</button>
                        <Link to='/forgotPassword' className='underline cursor-pointer font-medium text-blue-800 text-right'>Forgot Password?</Link>
                        <p className='mx-auto text-gray-500 text-xl font-bold'>OR</p>
                        <button className='flex gap-4 rounded-full items-center justify-center text-red-500 font-bold' onClick={handleGoogleLogin}><FaGoogle />Login With Google</button>
                    </form>
                    <div className="mt-4">
                        <p className="text-[0.9rem] sm:text-[1.2rem]">Don't have an account? <Link className='text-blue-800 font-semibold' to="/signup"> Signup</Link> </p>
                    </div>
                </div>
            </div>
        </>
    );
}
