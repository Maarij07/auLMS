import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SelectUsers } from './store/userSlice';
import { ClassCard, Home, Login, Signup, ZegoCloud, ForgotPassword, UserProfile, PageNotFound } from './components/index';
import { useLocalContext } from './context/context';
import { onSnapshot, doc, collection, getDoc } from 'firebase/firestore';
import db from './lib/firebase';
import { Main } from './components/index';

function App() {
  const user = useSelector(SelectUsers);
  const { loggedInMail } = useLocalContext();
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (loggedInMail) {
          // Fetch user's created classes
          const createdClassesRef = collection(db, `UserClasses/${loggedInMail}/createdClasses`);
          const unsubscribe = onSnapshot(createdClassesRef, (querySnapshot) => {
            const documentsData = [];
            querySnapshot.forEach((doc) => {
              documentsData.push({
                id: doc.id,
                ...doc.data()
              });
            });
            setCreatedClasses(documentsData);
          });

          // Fetch user's joined classes
          const joinedClassesRef = collection(db, `UserClasses/${loggedInMail}/joinedClasses`);
          onSnapshot(joinedClassesRef, (querySnapshot) => {
            const documentsData = [];
            querySnapshot.forEach((doc) => {
              documentsData.push({
                id: doc.id,
                ...doc.data()
              });
            });
            setJoinedClasses(documentsData);
          });
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [loggedInMail]);

  useEffect(() => {
    const fetchClassData = async () => {
      const classCodes = [...createdClasses, ...joinedClasses];
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

    fetchClassData();
  }, [createdClasses, joinedClasses, user]);

  return (
    <BrowserRouter>
      <Routes>
        {user.currentUser ? (
          <>
            <Route path='/settings' element={<UserProfile />} />
            <Route index element={<Home />} />
            <Route path='/call' element={<ZegoCloud />} />
            <Route path='*' element={<PageNotFound />} />
            <Route exact path={`/class/:newId`} element={<Main />} />
          </>
        ) : (
          <>
            <Route index element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
