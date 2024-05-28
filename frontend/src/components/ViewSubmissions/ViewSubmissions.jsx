import React, { useEffect, useState } from 'react';
import db from '../../lib/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { List, ListItem, ListItemText, TextField, Button } from '@mui/material';

const ViewSubmissions = ({ classData, assignmentNumber, totalMarks }) => {
    const [submissions, setSubmissions] = useState([]);
    const [marks, setMarks] = useState({});
    const [lateSubmissions, setLateSubmissions] = useState([]);
    const [marksError,setMarksError]=useState();

    useEffect(() => {
        const submissionRef = collection(db, `Classes/${classData.id}/Assignments/${assignmentNumber}/Submissions`);
        const unsubscribe = onSnapshot(submissionRef, (querySnapshot) => {
            const submissionsData = [];
            querySnapshot.forEach((doc) => {
                submissionsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setSubmissions(submissionsData);
        });

        return () => unsubscribe();
    }, [classData.id, assignmentNumber]);

    useEffect(() => {
        // Check for late submissions
        const lateSubmissionsData = submissions.filter(submission => {
            const submittedAt = new Date(submission.submittedAt);
            const deadline = new Date(submission.deadline);
            return submittedAt && deadline && submittedAt > deadline;
        });
        setLateSubmissions(lateSubmissionsData);
    }, [submissions]);

    const handleMarkChange = (submissionId, e) => {
        setMarksError(null);
        const newMarks = { ...marks };
        newMarks[submissionId] = e.target.value;
        if(parseInt(newMarks[submissionId] )>(parseInt(totalMarks))){
            setMarksError("Invalid Marks")
        }else if(parseInt(newMarks[submissionId])<0){
            setMarksError("Invalid Marks")
        }else{
            setMarks(newMarks);
        }
    };

    const handleMarkSubmission = async (submissionId) => {
        const submissionRef = doc(db, `Classes/${classData.id}/Assignments/${assignmentNumber}/Submissions/${submissionId}`);
        const updatedSubmissionData = {
            ...submissions.find(submission => submission.id === submissionId),
            marks: parseInt(marks[submissionId], 10)
        };
        await setDoc(submissionRef, updatedSubmissionData, { merge: true });
    };

    return (
        <div className="flex flex-col mt-[4rem] mx-[7rem] gap-4">
            <h1 className="text-3xl font-bold">View Submissions</h1>
            <List>
                {submissions.map((submission) => (
                    <ListItem key={submission.id} className="border-b">
                        <ListItemText
                            primary={`Submitted by: ${submission.members.join(', ')}`}
                            secondary={
                                <>
                                    {/* {console.log(submission.submittedAt.toDate().toString())} */}
                                    <p>Submitted At: <span style={{ color: new Date(submission.submittedAt) > new Date(submission.deadline) ? 'red' : 'inherit' }}>{submission.submittedAt.toDate().toString()}</span></p>
                                    <a target='_blank' rel="noopener noreferrer" href={submission.submissionFile}>View Submission</a>
                                    <div className='flex gap-2'>
                                        <TextField
                                            label="Marks"
                                            type="number"
                                            value={marks[submission.id] || ''}
                                            onChange={(e) => handleMarkChange(submission.id, e)}
                                            error={marksError}
                                        />
                                        <TextField
                                            label="Total Marks"
                                            type="number"
                                            value={totalMarks}
                                            disabled
                                        />
                                        <Button onClick={() => handleMarkSubmission(submission.id)}>Submit Marks</Button>
                                    </div>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ViewSubmissions;
