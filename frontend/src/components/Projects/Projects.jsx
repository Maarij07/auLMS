import React, { useEffect, useState } from 'react'
import { useLocalContext } from '../../context/context';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '../../lib/firebase';
import { QuizRounded } from '@mui/icons-material';
import { Paper } from '@mui/material';

const Projects = ({ classData }) => {
    const { loggedInMail } = useLocalContext();
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const projectRef = collection(db, `Classes/${classData.id}/Projects`);
        const unsubscribe = onSnapshot(projectRef, (querySnapshot) => {
            const documentsData = [];
            querySnapshot.forEach((doc) => {
                documentsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setProjects(documentsData);
        });
        return () => unsubscribe();
    }, [classData.id]);
    return (
        <>
            {projects.map((item) => (
                <div key={item.id} className="w-full bg-white sm:my-2 sm:p-4 border-2 rounded-md">
                    <div className="flex gap-4 sm:pb-4 items-center">
                        <Paper />
                        <div className="">
                            <p className='text-sm'>{item.midsName}</p>
                        </div>
                    </div>
                    <a target='_blank' rel="noopener noreferrer" href={item.downloadURL} className="border-2 w-[22rem] flex gap-4 items-center rounded-md p-2">
                        <img src="/doc-img.png" alt="" width={28} />
                        <p>Attached File: <span className='text-decoration-line: underline'>{item.fileName || 'File'}</span> </p>
                    </a>
                </div>
            ))}
        </>
    )
}

export default Projects