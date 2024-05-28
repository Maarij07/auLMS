import React, { useEffect, useState } from 'react';
import { useLocalContext } from '../../context/context';
import db from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Assignment } from '@mui/icons-material';
import { Button, Dialog, Slide } from '@mui/material';
import { Close } from '@mui/icons-material';
import SubmissionForm from '../SubmissionForm/SubmissionForm';
import ViewSubmissions from '../ViewSubmissions/ViewSubmissions';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Assignments = ({ classData }) => {
    const { loggedInMail, submissionDialog, setSubmissionDialog } = useLocalContext();
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [viewSubmissionsDialog, setViewSubmissionsDialog] = useState(false);
    const [assignmentNumber, setAssignmentNumber] = useState('');
    const [totalMarks, setTotalMarks] = useState(0);

    useEffect(() => {
        const assignmentRef = collection(db, `Classes/${classData.id}/Assignments`);
        const unsubscribe = onSnapshot(assignmentRef, (querySnapshot) => {
            const documentsData = [];
            querySnapshot.forEach((doc) => {
                const assignmentData = {
                    id: doc.id,
                    ...doc.data()
                };
                documentsData.push(assignmentData);
                if (assignmentData.marks) {
                    setTotalMarks(assignmentData.marks);
                }
            });
            setAssignments(documentsData);
        });

        return () => unsubscribe();
    }, [classData.id]);

    const openSubmissionDialog = (assignment) => {
        setSelectedAssignment(assignment);
        setSubmissionDialog(true);
    };

    const openViewSubmissionsDialog = (assignmentNum) => {
        setAssignmentNumber(assignmentNum);
        setViewSubmissionsDialog(true);
    };

    return (
        <>
            {assignments.map((item) => (
                <div key={item.id} className="w-full bg-white sm:my-2 sm:p-4 border-2 rounded-md">
                    <div className="flex w-full gap-4 justify-between sm:pb-4 items-center">
                        <div className='flex gap-4 items-center'>
                            <Assignment />
                            <div>
                                <p className='text-sm'>{item.assignmentName}</p>
                                <p className='text-sm'>{item.type}</p>
                            </div>
                        </div>
                        <div className='text-right flex flex-col gap-2'>
                            <p className='text-sm'>{item.marks} points</p>
                            <p className='text-sm'>{item.deadline}</p>
                        </div>
                    </div>
                    <div className="flex justify-between w-full">
                        <a target='_blank' rel="noopener noreferrer" href={item.downloadURL} className="border-2 w-[22rem] flex gap-4 items-center rounded-md p-2">
                            <img src="/doc-img.png" alt="" width={28} />
                            <p>Instructions: <span className='text-decoration-line: underline'>{item.fileName || 'File'}</span></p>
                        </a>
                        {classData.owner === loggedInMail ? (
                            <Button onClick={() => openViewSubmissionsDialog(item.assignmentNumber)} variant="contained" color="primary">
                                View Submissions
                            </Button>
                        ) : (
                            <Button onClick={() => openSubmissionDialog(item)} variant="contained" color="primary">
                                Submit Assignment
                            </Button>
                        )}
                    </div>
                </div>
            ))}

            <SubmissionForm
                classData={classData}
                selectedAssignment={selectedAssignment}
                submissionDialog={submissionDialog}
                setSubmissionDialog={setSubmissionDialog}
            />

            <Dialog fullScreen open={viewSubmissionsDialog} onClose={() => setViewSubmissionsDialog(false)} TransitionComponent={Transition}>
                <div className="flex w-full justify-between p-4 border-b-2 border-[#cfcecd] shadow-sm">
                    <div className="joinClass cursor-pointer" onClick={() => setViewSubmissionsDialog(false)}>
                        <Close />
                    </div>
                </div>
                <ViewSubmissions classData={classData} totalMarks={totalMarks} assignmentNumber={assignmentNumber} />
            </Dialog>
        </>
    );
};

export default Assignments;
