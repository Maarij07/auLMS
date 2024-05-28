import React, { useEffect, useState } from 'react';
import db from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { List, ListItem, ListItemText } from '@mui/material';

const ViewSubmissions = ({ classData, assignmentNumber }) => {
    const [submissions, setSubmissions] = useState([]);

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
                                    <p>Submitted At: {submission.submittedAt.toDate().toString()}</p>
                                    <a target='_blank' rel="noopener noreferrer" href={submission.submissionFile}>View Submission</a>
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
