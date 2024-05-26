import React, { useEffect, useState } from 'react'
import { useLocalContext } from '../../context/context'
import db from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Assignment } from '@mui/icons-material';

const Assignments = ({ classData }) => {
    const { loggedInMail } = useLocalContext();
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const assignmentRef = collection(db, `Classes/${classData.id}/Assignments`);
        const unsubscribe = onSnapshot(assignmentRef, (querySnapshot) => {
            const documentsData = [];
            querySnapshot.forEach((doc) => {
                documentsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setAssignments(documentsData);
        });

        return () => unsubscribe();
    }, [classData.id]);

    return (
        <>
            {assignments.map((item) => (
                <div key={item.id} className="w-full bg-white sm:my-2 sm:p-4 border-2 rounded-md">
                    <div className="flex gap-4 sm:pb-4 items-center">
                        <Assignment />
                        <div className="">
                            <p className='text-sm'>{item.assignmentName}</p>
                        </div>
                    </div>
                    <a target='_blank' rel="noopener noreferrer" href={item.downloadURL} className="border-2 w-[22rem] flex gap-4 items-center rounded-md p-2">
                        <img src="/doc-img.png" alt="" width={28} />
                        <p>Attached File: <span className='text-decoration-line: underline'>{item.fileName || 'File'}</span> </p>
                    </a>
                </div>
            ))}
        </>
    );
}

export default Assignments;
