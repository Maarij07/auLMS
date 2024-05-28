import React, { useEffect, useState } from 'react';
import { Sidebar } from '../index';
import { useLocalContext } from '../../context/context';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import db from '../../lib/firebase';
import { Tabs, Tab, Box, Typography, TextField, Button, Avatar, List, ListItem, ListItemText } from '@mui/material';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const { loggedInMail } = useLocalContext();
    const [activeTab, setActiveTab] = useState(0);
    const [createdClasses, setCreatedClasses] = useState([]);
    const [joinedClasses, setJoinedClasses] = useState([]);
    const [classData, setClassData] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (loggedInMail) {
                try {
                    const userRef = collection(db, 'Users');
                    console.log(loggedInMail)
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

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if (loggedInMail) {
                    const createdClassesRef = collection(db, `UserClasses/${loggedInMail}/createdClasses`);
                    const unsubscribeCreated = onSnapshot(createdClassesRef, (querySnapshot) => {
                        const documentsData = [];
                        querySnapshot.forEach((doc) => {
                            documentsData.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        });
                        setCreatedClasses(documentsData);
                    });

                    const joinedClassesRef = collection(db, `UserClasses/${loggedInMail}/joinedClasses`);
                    const unsubscribeJoined = onSnapshot(joinedClassesRef, (querySnapshot) => {
                        const documentsData = [];
                        querySnapshot.forEach((doc) => {
                            documentsData.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        });
                        setJoinedClasses(documentsData);
                    });

                    return () => {
                        unsubscribeCreated();
                        unsubscribeJoined();
                    };
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, [loggedInMail]);

    useEffect(() => {
        const fetchClassData = async () => {
            const classCodes = [...createdClasses, ...joinedClasses];
            const classDataPromises = classCodes.map(async (id) => {
                const ID = id.id;
                const classDocRef = doc(db, `Classes/${ID}`);
                const classDocSnapshot = await getDoc(classDocRef);
                if (classDocSnapshot.exists()) {
                    return { id: ID, ...classDocSnapshot.data() };
                }
            });
            const resolvedClassData = await Promise.all(classDataPromises);
            setClassData(resolvedClassData.filter(Boolean));
        };

        fetchClassData();
    }, [createdClasses, joinedClasses]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleUpdate = async () => {
        try {
            if (loggedInMail && userData) {
                const userRef = doc(db, 'Users', userData.id);
                await updateDoc(userRef, {
                    name: userData.name,
                    city: userData.city
                });
                console.log('User data updated successfully');
            }
        } catch (error) {
            console.error('Error updating user data: ', error);
        }
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
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        value={userData.Email || ''}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        disabled
                    />
                    <TextField
                        label="RegID"
                        value={userData.userId || ''}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        disabled // Make it unchangeable
                    />
                    <TextField
                        label="City"
                        value={userData.city || ''}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                    />
                    {/* Add more fields as needed */}
                    <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </Box>
    );
    console.log(classData);

    const ClassSettings = () => (
        <Box>
            <h2>Class Settings</h2>
            <div className="sm:h-[55vh] overflow-hidden">
                <List>
                    {classData.map((classItem) => (
                        <ListItem key={classItem.id} className='border-2 sm:my-[0.5rem]'>
                            <ListItemText primary={classItem.className} />
                        </ListItem>
                    ))}
                </List>
            </div>
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
                                <Avatar sx={{ width: '5rem', height: '5rem' }} />
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
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="User Settings" />
                            <Tab label="Class Settings" />
                        </Tabs>
                        <Box p={3}>
                            {activeTab === 0 && <UserSettings />}
                            {activeTab === 1 && <ClassSettings />}
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
