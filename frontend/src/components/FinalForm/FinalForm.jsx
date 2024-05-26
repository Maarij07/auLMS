import React, { useState, useEffect } from 'react';
import { useLocalContext } from '../../context/context';
import { Button, Dialog, FormControl, InputLabel, MenuItem, Select, Slide, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import img1 from '../../assets/assignment1.svg';
import img2 from '../../assets/assignment2.svg';
import db, { storage } from '../../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, doc, Timestamp, setDoc } from 'firebase/firestore'; // Imports for firestore

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const FinalForm = ({classData}) => {
    const { finalDialog, setFinalDialog, loggedInMail } = useLocalContext();
    const [finalName, setFinalName] = useState('');
    const [marks, setMarks] = useState('');
    const [deadline, setDeadline] = useState('');
    const [type, setType] = useState('Individual');
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let downloadURL = '';
        if (file) {
            const storageRef = ref(storage, `finals/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            await uploadTask;

            downloadURL = await getDownloadURL(storageRef);
        }

        // Add assignment data to Firestore
        const assignmentRef = doc(db, `Classes/${classData.id}/Finals/paper`);
        const assignmentData = {
            finalName,
            marks,
            deadline,
            type,
            downloadURL,
        };
        await setDoc(assignmentRef, assignmentData);

        // Clear form fields after submission
        setFinalName('');
        setMarks('');
        setDeadline('');
        setType('Individual');
        setFile(null);
        setFinalDialog(false)
    };

    return (

        <Dialog fullScreen open={finalDialog} onClose={() => setFinalDialog(false)} TransitionComponent={Transition}>
            <div className="flex w-full justify-between p-4 border-b-2 border-[#cfcecd] shadow-sm" >
                <div className="joinClass cursor-pointer" onClick={() => setFinalDialog(false)}>
                    <Close />
                </div>
                {/* <Button onClick={() => { }} className='font-bold' variant="contained" color="primary">
                            Assign
                        </Button> */}
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col mt-[4rem] mx-[7rem] gap-4'>
                <h1 className='text-3xl font-bold'>Upload Final paper</h1>
                <TextField
                    label="final Name"
                    value={finalName}
                    onChange={(e) => setFinalName(e.target.value)}
                    required
                />
                <TextField
                    label="Marks"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    type="number"
                    required
                />
                <TextField
                    label="Deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
                <FormControl>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value="Individual">Individual</MenuItem>
                        <MenuItem value="Group">Group</MenuItem>
                    </Select>
                </FormControl>
                <input type="file" onChange={handleFileChange} />
                <Button type="submit">Submit</Button>
            </form>
        </Dialog>
    );
}

export default FinalForm

