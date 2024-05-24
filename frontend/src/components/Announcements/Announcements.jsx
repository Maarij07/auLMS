import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Avatar } from '@mui/material';
import { Document, Page } from 'react-pdf';
import db from '../../lib/firebase';

const Announcements = ({ classData }) => {
    const [announcement, setAnnouncement] = useState([]);

    useEffect(() => {
        if (classData) {
            const announcementRef = collection(db, `announcments/classes/${classData.id}`);
            const unsubscribe = onSnapshot(announcementRef, (querySnapshot) => {
                const documentsData = [];
                // console.log(querySnapshot);
                querySnapshot.forEach((doc) => {
                    documentsData.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setAnnouncement(documentsData);
            });
            // console.log(announcement)
            return () => unsubscribe();
        }
    }, [classData]);

    console.log(announcement);

    return (
        <div className='flex flex-col gap-3'>
            {announcement.map((item) => (
                <div key={item.id} className="w-full bg-white sm:p-4 border-2 rounded-md">
                    <div className="flex gap-4 sm:pb-4 items-center">
                        <Avatar style={{ width: 35, height: 35 }} />
                        <div className="">
                            <p className='text-sm'>{item.sender}</p>
                            {/* <p className=''>{item.text}</p> */}
                        </div>
                    </div>
                    {/* <img src={item.imageUrl} alt={item.text} width={200} /> */}
                    <a target='_blank' href={item.imageUrl} className="border-2 w-[22rem] flex gap-4 items-center rounded-md p-2">
                        <img src="/doc-img.png" alt="" width={28} />
                        <p>Attached File: <span className='text-decoration-line: underline'>{item.text}</span> </p>
                    </a>
                </div>
            ))}
        </div>
    );
};

export default Announcements;
