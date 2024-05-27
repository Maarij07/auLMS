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
          // console.log(createdClasses);

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
          console.log(joinedClasses);
        }

        // Fetch general classes
        // const generalClassesRef = collection(db, 'Classes');
        // const generalSnapshot = await onSnapshot(generalClassesRef);
        // const generalData = generalSnapshot.docs.map(doc => {
        //   const data = doc.data();
        //   const id = doc.id;
        //   return { id, ...data };
        // });
        // setGeneralClasses(generalData);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    console.log(createdClasses)
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

  if(!loggedInMail){
    return <div>Loading...</div>
  }

  if (user.currentUser||loggedInMail) {
    return (
      <BrowserRouter>
        <Routes>
          {classData?.map((item) => (
            <Route key={item.id} exact path={`/${item.id}`} element={<Main classData={item} />} />
          ))}
          <Route index element={<Home />} />
          <Route path='/call' element={<ZegoCloud />} />
          <Route path='/settings' element={<UserProfile />}></Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
