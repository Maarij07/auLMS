import React, { useEffect, useState } from 'react';
import { Sidebar } from '../index';
import { useLocalContext } from '../../context/context';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../../lib/firebase';
import { Tabs, Tab, Box, Typography, TextField, Button, Avatar } from '@mui/material';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const { loggedInMail } = useLocalContext();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (loggedInMail) {
                try {
                    const userRef = collection(db, 'Users');
                    const q = query(userRef, where("Email", "==", loggedInMail));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        setUserData({ id: userDoc.id, ...userDoc.data() });
                    } else {
                        console.log('No user data found');
                    }
                } catch (error) {
                    console.error('Error fetching user data: ', error);
                }
            }
        };

        fetchUserDetails();
    }, [loggedInMail]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const UserSettings = () => (
        <Box>
            {userData ? (
                <div>
                    <h2>User Settings</h2>
                    <TextField
                        label="Name"
                        value={userData.name || ''}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        label="Email"
                        value={userData.Email || ''}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        disabled
                    />
                    {/* Add more fields as needed */}
                    <Button variant="contained" color="primary">Save</Button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </Box>
    );

    const ClassSettings = () => (
        <Box>
            <h2>Class Settings</h2>
            {/* Add class settings fields here */}
            <p>Class settings form or fields go here</p>
        </Box>
    );

    return (
        <div className="flex">
            <Sidebar />
            <div className="sm:w-[75rem] sm:ml-[10.4rem]">
                <div className="sm:p-5 border-b-2">
                    <h1 className='text-[#032B44] font-semibold text-3xl'>Profile</h1>
                </div>
                <div className="flex sm:px-8 gap-4 sm:mt-[4rem]">
                    <div className="sm:w-[15rem] sm:h-[29rem] shadow-md shadow-black">
                        {userData ? (
                            <div className=' h-full flex flex-col py-6 gap-3 items-center'>
                                <Avatar sx={{ width: '5rem', height: '5rem' }}  />
                                <h2 className='font-semibold text-lg'>{userData.name}</h2>
                                <p>{userData.Email}</p>
                                <p>{userData.userId}</p>
                                <p>{userData?.city}</p>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    <div className="shadow-md shadow-black sm:h-[29rem] sm:w-[56rem]">
                        <p>Change user data form or fields here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
