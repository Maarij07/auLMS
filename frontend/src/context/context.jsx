import { createContext, useState,useContext,useEffect } from "react";
import {auth,provider } from '../lib/firebase';

const AddContext = createContext();

export function useLocalContext(){
    return useContext(AddContext);
}
export function ContextProvider({children}){
    const [createClassDialog,setCreateClassDialog]=useState(false);
    const [joinClassDialog, setJoinClassDialog] = useState(false);
    const [loggedInUser,setLoggedInUser] = useState(null);
    const [loggedInMail,setLoggedInMail] = useState(null);
    const [callClass,setCallClass] = useState(null);
    const [assignmentDialog,setAssignmentDialog]=useState(false);
    const [quizDialog,setQuizDialog]=useState(false);
    const [midsDialog,setMidsDialog]=useState(false);
    const [finalDialog,setFinalDialog]=useState(false);
    const [projectDialog,setProjectDialog]=useState(false);
    const [submissionDialog,setSubmissionDialog] = useState(false);
    
    const login =()=>{
        auth.signInWithPopup(provider);
    };

    useEffect(()=>{
        const unsubscribe =auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                setLoggedInMail(authUser.email);
                setLoggedInUser(authUser)
            }
            else{
                setLoggedInUser(null);
                setLoggedInMail(null);
            }
        });

        return()=>{
            unsubscribe();
        }
    },[])

    const value = { 
        createClassDialog, 
        setCreateClassDialog, 
        joinClassDialog, 
        setJoinClassDialog,
        login,
        loggedInMail,
        setLoggedInMail,
        loggedInUser,
        setLoggedInUser,
        callClass,
        setCallClass,
        assignmentDialog,
        setAssignmentDialog,
        quizDialog,
        setQuizDialog,
        midsDialog,
        setMidsDialog,
        finalDialog,
        setFinalDialog,
        projectDialog,
        setProjectDialog,
        submissionDialog,
        setSubmissionDialog
     };

    return <AddContext.Provider value={value} >{children}</AddContext.Provider>;
}
