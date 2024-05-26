import React, { useState } from 'react';
import { useLocalContext } from "../../context/context";
import { Button, Dialog, DialogActions, TextField } from '@mui/material';
import { v4 as uuidV4 } from 'uuid';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import db from '../../lib/firebase';

const createClass = () => {
    const { createClassDialog, setCreateClassDialog, loggedInMail, loggedInUser } = useLocalContext();
    const [className, setClassName] = useState('');
    const [creditHours, setCreditHours] = useState('');
    const [courseName, setCourseName] = useState('');

    const addClass = (e) => {
        e.preventDefault();
        const id = uuidV4();
        const modifiedEmail = loggedInMail.replace(/\./g, "_");
        const classData = {
            owner: loggedInMail,
            className: className,
            creditHours: creditHours,
            courseName: courseName,
            teacher: loggedInUser.displayName,
            id: id,
            assignmentNo:0,
            quizNo:0,
            posts:0,
            call:null,
            members:{[modifiedEmail]:true},
            assignmentWeightage:0,
            quizWeightage:0,
            midsWeightage:0,
            finalWeightage:0,
            projectWeightage:0
        };
        const time= Timestamp.fromDate(new Date());
        const mainDoc = doc(db, `UserClasses/${loggedInMail}`);
        const childDoc = doc(mainDoc, `createdClasses/${id}`);
        const classDoc={
            name:courseName,
            CreatedAt:time.seconds
        }
        setDoc(childDoc, classDoc);
        const classRef=doc(db,`Classes/${id}`)
        setDoc(classRef,classData)
        setCreateClassDialog(false);
    }
    return (
        <div className="">
            <Dialog
                onClose={() => setCreateClassDialog(false)}
                aria-labelledby="customized-dialog-title"
                open={createClassDialog}
                maxWidth="lg"
            >
                <div className="form p-4">
                    <h2 className='font-bold'>Create Class</h2>
                    <div className="p-4 flex flex-col gap-2">
                        <TextField id="filled-basic" value={courseName} onChange={(e) => setCourseName(e.target.value)} label="Course Name *" variant='filled' className='w-[15rem] sm:w-[30rem]' />
                        <TextField id="filled-basic" value={className} onChange={(e) => setClassName(e.target.value)} label="Class Name *" variant='filled' className='w-[15rem] sm:w-[30rem]' />
                        <TextField id="filled-basic" value={creditHours} onChange={(e) => setCreditHours(e.target.value)} label="Credit Hours" variant='filled' className='w-[15rem] sm:w-[30rem]' />
                    </div>
                    <DialogActions>
                        <Button onClick={addClass} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    )
}

export default createClass;