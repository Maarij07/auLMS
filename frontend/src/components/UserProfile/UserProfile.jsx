import React, { useState } from 'react'
import { Sidebar } from '../index';
import { useLocalContext } from '../../context/context';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import db from '../../lib/firebase';

const UserProfile = () => {
    const [userData, setUserData] = useState([]);
    const { loggedInMail } = useLocalContext();
    const userRef = collection(db, `Users`);
    const unsubscribe = onSnapshot(userRef, (querySnapshot) => {
        const documentsData = [];
        querySnapshot.forEach((doc) => {
            documentsData.push({
                id: doc.id,
                ...doc.data()
            });
        });
        setUserData(documentsData);
        return () => unsubscribe();
    });
    console.log(userData);
    userData.forEach((id)=>{
        if (id==loggedInMail)
        console.log(id);
    })
    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full sm">
                <div className="sm:p-5 border-b-2">
                    <h1 className='text-[#032B44] font-semibold text-3xl'>Settings</h1>
                </div>
                <div className="flex sm:px-8 gap-4 sm:mt-[4rem]">
                    <div className="sm:w-[15rem] sm:h-[29rem] shadow-md shadow-black ">CurrentName</div>
                    <div className="shadow-md shadow-black sm:h-[29rem] sm:w-[56rem]">changeField</div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile