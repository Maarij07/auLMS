import React, { useState, useEffect } from 'react';
import { useLocalContext } from '../../context/context';
import { Button, Dialog, Slide, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, Timestamp, query, collection, where, getDocs } from 'firebase/firestore';
import db, { storage } from '../../lib/firebase';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SubmissionForm = ({ classData, selectedAssignment, submissionDialog, setSubmissionDialog }) => {
    const { loggedInMail } = useLocalContext();
    const [file, setFile] = useState(null);
    const [members, setMembers] = useState([loggedInMail]);

    useEffect(() => {
        const fetchGroupMembers = async (assignmentType) => {
            if (assignmentType === 'Group') {
                const q = query(collection(db, `Classes/${classData.id}/Groups`), where("members", "array-contains", loggedInMail));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setMembers(doc.data().members);
                });
            }
        };
        if (selectedAssignment) {
            fetchGroupMembers(selectedAssignment.type);
        }
    }, [selectedAssignment, classData.id, loggedInMail]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let downloadURL = '';
        if (file) {
            const storageRef = ref(storage, `submissions/${selectedAssignment.assignmentNumber}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            await uploadTask;
            downloadURL = await getDownloadURL(storageRef);
        }

        const submissionId = `${loggedInMail}_${new Date().getTime()}`;
        const submissionRef = doc(db, `Classes/${classData.id}/Assignments/${selectedAssignment.assignmentNumber}/Submissions/${submissionId}`);
        const submissionData = {
            members,
            submissionFile: downloadURL,
            submittedAt: Timestamp.now(),
        };
        await setDoc(submissionRef, submissionData);

        setFile(null);
        setSubmissionDialog(false);
    };

    return (
        <Dialog fullScreen open={submissionDialog} onClose={() => setSubmissionDialog(false)} TransitionComponent={Transition}>
            <div className="flex w-full justify-between p-4 border-b-2 border-[#cfcecd] shadow-sm">
                <div className="joinClass cursor-pointer" onClick={() => setSubmissionDialog(false)}>
                    <Close />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col mt-[4rem] mx-[7rem] gap-4">
                <h1 className="text-3xl font-bold">Submit Assignment</h1>
                <input type="file" onChange={handleFileChange} required />
                <Button type="submit">Submit</Button>
            </form>
        </Dialog>
    );
};

export default SubmissionForm;
