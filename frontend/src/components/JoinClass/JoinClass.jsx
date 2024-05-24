import React, { useState } from 'react';
import { useLocalContext } from '../../context/context';
import { Avatar, Button, Dialog, Slide, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { SelectUsers } from '../../store/userSlice';
import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import db from '../../lib/firebase';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const JoinClass = () => {
    const currentUser = useSelector(SelectUsers);
    const { joinClassDialog, setJoinClassDialog, loggedInUser, loggedInMail } = useLocalContext();
    const [classCode, setClassCode] = useState('');
    const [error, setError] = useState(false);
    const [joinedData, setJoinedData] = useState(null);
    const [classExists, setClassExists] = useState(false);


    // console.log(loggedInUser.email);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const classRef = doc(db, `Classes/${classCode}`);
            const classDoc = await getDoc(classRef);

            if (classDoc.exists() && classDoc.data().owner !== loggedInUser.email) {
                const classData = classDoc.data();
                console.log(classData);
                setJoinedData(classData);
                setClassExists(true);
                setError(false);

                const encodedEmail = loggedInUser.email.replace(/\./g, '_');
                const membersUpdate = {
                    [`members.${encodedEmail}`]: true
                };
                await updateDoc(classRef, membersUpdate);


                // Update the user's joined classes
                const userJoinedClassRef = doc(db, `UserClasses/${loggedInUser.email}/joinedClasses/${classCode}`);
                const time = Timestamp.fromDate(new Date());
                await setDoc(userJoinedClassRef, {
                    name: classData.className,
                    joinedAt: time.seconds
                });
                setJoinClassDialog(false);
            } else {
                setError(true);
                setClassExists(false);
            }
        } catch (error) {
            console.error("Error joining class:", error);
            setError(true);
            setClassExists(false);
        }
    };


    return (
        <div>
            <Dialog
                fullScreen
                open={joinClassDialog}
                onClose={() => setJoinClassDialog(false)}
                TransitionComponent={Transition}
            >
                <div className="flex flex-col items-center">
                    <div className="flex w-full justify-between p-4 border-b-2 border-[#cfcecd] shadow-sm">
                        <div className="joinClass cursor-pointer" onClick={() => setJoinClassDialog(false)}>
                            <Close />
                        </div>
                        <Button onClick={handleSubmit} className='font-bold' variant="contained" color="primary">
                            Join
                        </Button>
                    </div>
                    <div className="border-2 rounded-md mt-4 container w-[24rem] sm:w-[33rem] p-4">
                        <p className='text-sm sm:text-lg mb-[0.8rem]'>
                            You're currently signed in as {currentUser?.currentUser?.email}
                        </p>
                        <div className="flex justify-between">
                            <div className="flex">
                                <Avatar src={currentUser?.currentUser?.photo} />
                                <div className="ml-4">
                                    <div className="text-sm sm:text-lg font-bold">{currentUser?.currentUser?.name}</div>
                                    <div className="text-[#5f6368] text-sm sm:text-lg overflow-hidden text-ellipsis">{currentUser?.currentUser?.email}</div>
                                </div>
                            </div>
                            <Button variant='outlined' color='primary'>
                                Logout
                            </Button>
                        </div>
                    </div>
                    <div className="border-2 rounded-md mt-4 container w-[33rem] p-4">
                        <div className="text-[1.25rem] font-semibold color-[#3c4043]">
                            Class Code
                        </div>
                        <div>
                            Ask Your Teacher for the class code, then enter it here.
                        </div>
                        <div className="mt-2 flex flex-col sm:flex-row sm:gap-6">
                            <TextField
                                id="outlined-basic"
                                label="Class Code"
                                value={classCode}
                                onChange={(e) => setClassCode(e.target.value)}
                                error={error}
                                helperText={error && "No class was found or you are the creator"}
                                variant="outlined"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default JoinClass;
