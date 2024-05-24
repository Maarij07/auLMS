import React from 'react'
import ClassCard from '../ClassCard/ClassCard'
import { onSnapshot, doc, collection, query, getDoc } from 'firebase/firestore';
import { useLocalContext } from '../../context/context';
import { useState, useEffect } from 'react';
import db from '../../lib/firebase';

export default function Classes() {
  const { loggedInMail } = useLocalContext();
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (loggedInMail) {
          const createdClassesRef = collection(db, `UserClasses/${loggedInMail}/createdClasses`);
          let unsubscribe = onSnapshot(createdClassesRef, (querySnapshot) => {
            const documentsData = [];
            // console.log(querySnapshot.docs);
            querySnapshot.forEach((doc) => {
              documentsData.push({
                id: doc.id,
                ...doc.data()
              });
            });
            setCreatedClasses(documentsData);
          });
          console.log(createdClasses);

          // Fetch user's joined classes
          const joinedClassesRef = collection(db, `UserClasses/${loggedInMail}/joinedClasses`);
          unsubscribe = onSnapshot(joinedClassesRef, (querySnapshot) => {
            const documentsData = [];
            // console.log(querySnapshot.docs);
            querySnapshot.forEach((doc) => {
              documentsData.push({
                id: doc.id,
                ...doc.data()
              });
            });
            setJoinedClasses(documentsData);
          });
          // console.log(joinedClasses);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    // console.log(createdClasses)
    fetchClasses();
  }, [loggedInMail]);

  useEffect(() => {
    const fetchClassData = async () => {
      const classCodes = [...createdClasses, ...joinedClasses];
      // console.log(classCodes);
      const classDataPromises = classCodes.map(async (id) => {
        const ID = id.id;
        const classDocRef = doc(db, `Classes/${ID}`);
        const classDocSnapshot = await getDoc(classDocRef);
        if (classDocSnapshot.exists()) {
          return { id: ID, ...classDocSnapshot.data() };
        }
      });
      const resolvedClassData = await Promise.all(classDataPromises);
      setClassData(resolvedClassData.filter(Boolean));
    };
    // console.log(classData);
    fetchClassData();
  }, [createdClasses, joinedClasses]);

  return (
    <div className="overflow-hidden sm:w-[54.5rem] px-6 py-4 gap-6 justify-around flex flex-wrap ">
      {classData.map((item) => (
        <ClassCard key={item.id} classData={item} />
      ))}
    </div>
  )
}
