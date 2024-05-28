import React, { useEffect } from 'react'
import TopBar from '../TopBar/TopBar'
import { Avatar, TextField, Button, Menu, Dialog, DialogActions, DialogTitle, Select, MenuItem, InputLabel, FormControl, DialogContent, Slide } from '@mui/material'
import { useState } from 'react';
import { storage } from '../../lib/firebase';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { useLocalContext } from '../../context/context';
import { collection, deleteDoc, doc, setDoc, Timestamp, addDoc, onSnapshot, query, where, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import db from '../../lib/firebase';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoMdMore } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { SelectUsers, SelectUid, setUid } from '../../store/userSlice';
import { AiOutlinePieChart } from "react-icons/ai";
import { IoExitOutline } from "react-icons/io5";
import Announcements from '../Announcements/Announcements';
import People from '../People/People';
import Groups from '../Groups/Groups';
import { FaPlus } from "react-icons/fa6";
import AssignmentForm from '../AssignmentForm/AssignmentForm';
import QuizForm from '../QuizForm/QuizForm';
import MidsForm from '../MidsForm/MidsForm';
import FinalForm from '../FinalForm/FinalForm';
import ProjectForm from '../ProjectForm/ProjectForm';
import { MainTabs } from '../index';
import { FaExchangeAlt } from "react-icons/fa";
import { CiViewTable } from "react-icons/ci";
import ClassWork from '../ClassWork/ClassWork';

const Main = () => {
    const [mainData, setMainData] = useState({});
    // console.log(mainData.assignmentWeightage);
    // const members = mainData.members;
    const members = {};
    const memberEmails = Object.keys(members);
    const memberNos = memberEmails.length;
    console.log(memberEmails.length);
    const navigate = useNavigate();
    const { newId } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, 'Classes'), where("id", '==', `${newId}`))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // console.log(mainData);
                setMainData(doc.data());
                console.log(doc.id, " => ", doc.data());
            });
        }
        // console.log(mainData);
        fetchData();
    }, [newId])

    useEffect(() => {
        console.log(mainData);
    }, [mainData])

    const { loggedInMail, loggedInUser, setCallClass, callClass, setAssignmentDialog, setMidsDialog, setFinalDialog, setProjectDialog, setQuizDialog } = useLocalContext();
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState();
    const [file, setFile] = useState(null);
    const [editOpen, setEditOpen] = useState(false)
    const [gradeOpen, setGradeOpen] = useState(false)
    const currentUser = useSelector(SelectUsers);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const currentMail = currentUser.currentUser.email
    const classOwnerMail = mainData.owner
    const classId = mainData.id

    //classdata
    // const [className, setClassName] = useState(mainData?.className);
    const [className, setClassName] = useState('');
    // const [courseName, setCourseName] = useState(mainData.courseName);
    const [courseName, setCourseName] = useState('');
    // const [creditHours, setCreditHours] = useState(mainData.creditHours);
    const [creditHours, setCreditHours] = useState('');
    // const [assignmentWeightage, setAssignmentWeightage] = useState(mainData.assignmentWeightage);
    const [assignmentWeightage, setAssignmentWeightage] = useState('');
    // const [quizWeightage, setQuizWeightage] = useState(mainData.quizWeightage);
    const [quizWeightage, setQuizWeightage] = useState('');
    // const [midsWeightage, setMidsWeightage] = useState(mainData.midsWeightage);
    const [midsWeightage, setMidsWeightage] = useState('');
    // const [finalWeightage, setFinalWeightage] = useState(mainData.finalWeightage);
    const [finalWeightage, setFinalWeightage] = useState('');
    // const [projectWeightage, setProjectWeightage] = useState(mainData.projectWeightage);
    const [projectWeightage, setProjectWeightage] = useState('');
    const [totalWeightage, setTotalWeightage] = useState(0);
    const [disabled, setDisabled] = useState(true);
    // const [postCount, setPostCount] = useState(mainData.posts);
    const [postCount, setPostCount] = useState('');
    const [assignmentEl, setAssignmentEl] = useState(null);
    const [callLink, setCallLink] = useState(null);
    // const [assignmentCount, setAssignmentCount] = useState(mainData.assignmentNo);
    const [assignmentCount, setAssignmentCount] = useState('');
    // const [quizCount, setQuizCount] = useState(mainData.quizNo);
    const [quizCount, setQuizCount] = useState('');
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);
    const [transferEmail, setTransferEmail] = useState('');

    const handleTransferDialogOpen = () => {
        setTransferDialogOpen(true);
    };

    const handleTransferDialogClose = () => {
        setTransferDialogOpen(false);
    };

    const handleCloseAssignment = () => setAssignmentEl(null);
    console.log(postCount);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }
    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) {
            console.error("No file selected for upload");
            return;
        }

        console.log("Reference created");
        const fileName = file.name;
        const uploadFile = ref(storage, `files/${file.name}`);
        const uploadPost = uploadBytesResumable(uploadFile, file);
        setShowInput(false);


        uploadPost.on(
            'state_changed',
            null,  // We ignore progress updates for now
            (error) => {
                console.error('Error uploading file:', error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadPost.snapshot.ref);
                    console.log('File available at', downloadURL);

                    // Use setPostCount to update the state correctly
                    setPostCount((prevCount) => {
                        const newCount = prevCount + 1;
                        const mainDoc = doc(db, 'announcments/classes');
                        const childDoc = doc(mainDoc, `${mainData.id}/${newCount}`);
                        const time = Timestamp.fromDate(new Date());
                        const docData = {
                            timestamp: time.seconds,
                            imageUrl: downloadURL,
                            fileName: fileName,
                            text: inputValue,
                            sender: loggedInMail
                        };

                        setDoc(childDoc, docData)
                            .then(() => {
                                console.log('Document successfully written!');
                            })
                            .catch((error) => {
                                console.error('Error writing document:', error);
                            });
                        const reDoc = doc(db, `Classes/${mainData.id}`)
                        const refData = {
                            posts: newCount
                        }
                        updateDoc(reDoc, refData);
                        return newCount;  // Return the updated count
                    });
                    const id = mainData.id;
                    const mainDoc = doc(db, `CreatedClasses/${loggedInMail}`);
                    const childDoc = doc(mainDoc, `classes/${id}`);
                    const docData = {
                        posts: postCount
                    }
                    setDoc(childDoc, docData, { merge: true });
                    show();
                } catch (error) {
                    console.error('Error getting download URL:', error);
                }
            }
        );
    };

    const handleAssignment = () => {
        handleCloseAssignment();
        setAssignmentDialog(true);
    }

    const handleDelete = async (e) => {
        await deleteDoc(doc(db, `Classes/${classId}`))
        navigate('/');
        console.log("delete command sent");
    }
    const editClass = (e) => {
        e.preventDefault();
        const id = mainData.id;
        const mainDoc = doc(db, `Classes/${id}`);
        // const childDoc = doc(mainDoc, `classes/${id}`);
        const docData = {
            owner: loggedInMail,
            className: className,
            creditHours: creditHours,
            courseName: courseName,
            teacher: loggedInUser.displayName,
            testObject: {
                name1: "helo",
                name2: "by"
            },
            id: id
        };
        updateDoc(mainDoc, docData, { merge: true });
        setEditOpen(false);
        navigate('/');
    }
    useEffect(() => {
        function calculateTotal() {
            setTotalWeightage(parseInt(assignmentWeightage) + parseInt(quizWeightage) + parseInt(midsWeightage) + parseInt(finalWeightage) + parseInt(projectWeightage))
            // console.log(totalWeightage);
            if (totalWeightage == 100) setDisabled(false)
            // else setDisabled(true);
        }
        calculateTotal();
    }, [assignmentWeightage, quizWeightage, midsWeightage, finalWeightage, projectWeightage])

    const gradeClass = (e) => {
        e.preventDefault()
        const id = mainData.id;
        const mainDoc = doc(db, `Classes/${id}`);
        const docData = {
            assignmentWeightage: assignmentWeightage,
            quizWeightage: quizWeightage,
            midsWeightage: midsWeightage,
            finalWeightage: finalWeightage,
            projectWeightage: projectWeightage
        }
        setDoc(mainDoc, docData, { merge: true });
        // setAssignmentWeightage(0);
        // setQuizWeightage(0);
        // setMidsWeightage(0);
        // setFinalWeightage(0);
        // setProjectWeightage(0);
        setGradeOpen(false);
    }

    const leaveClass = async (e) => {
        e.preventDefault();

        try {
            const userJoinedClassRef = doc(db, `UserClasses/${loggedInMail}/joinedClasses/${mainData.id}`);

            await deleteDoc(userJoinedClassRef);

            const classRef = doc(db, `Classes/${mainData.id}`);
            const classDoc = await getDoc(classRef);

            if (classDoc.exists()) {
                // Get the current members array
                const currentMembers = classDoc.data().members;
                const modifiedEmail = loggedInMail.replace(/\./g, "_");
                console.log(modifiedEmail);
                console.log(currentMembers[modifiedEmail]);

                // // Remove the user's email from the members array
                delete currentMembers[modifiedEmail];

                // // Update the class document with the modified members array
                await updateDoc(classRef, { members: currentMembers });

                console.log("Class left successfully");
                navigate('/');
            } else {
                console.error("Class document does not exist");
            }
        } catch (error) {
            console.error("Error leaving class:", error);
        }
    };

    const transferClass = async () => {
        try {
            const classRef = doc(db, `Classes/${classId}`);

            const classSnap = await getDoc(classRef);

            if (classSnap.exists()) {
                const currentData = classSnap.data();

                // Update the owner and members
                await updateDoc(classRef, {
                    owner: transferEmail,
                    [`members.${transferEmail}`]: currentData.members[loggedInMail],
                    [`members.${loggedInMail}`]: deleteDoc()
                });

                setTransferDialogOpen(false);
                navigate('/');
            } else {
                console.error("No such document!");
            }
        } catch (error) {
            console.error("Error transferring class:", error);
        }
    };

    useEffect(() => {
        const callRef = collection(db, `Classes`);
        const unsubscribe = onSnapshot(callRef, (querySnapshot) => {
            const documentsData = [];
            // setCallLink(querySnapshot.docs[0]._document.data.value.mapValue.fields.call.stringValue);
            // console.log(querySnapshot.docs);
            querySnapshot.forEach((doc) => {
                documentsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            // console.log(documentsData);
            const filteredArray = documentsData.filter(doc => doc.id === mainData.id);
            // setCreatedClasses(filteredArray
            console.log(filteredArray);

        });
        return () => unsubscribe();
    }, [])
    const show = () => {
        var a = document.getElementById("a");
        var b = document.getElementById("b");
        a.style.display = "none";
        b.style.display = "block";
        console.log("show called")

    }
    const hide = async () => {
        var a = document.getElementById("a");
        var b = document.getElementById("b");
        a.style.display = "block";
        b.style.display = "none";
        console.log("hide called")
        const mail = '221803@students.au.edu.pk'
        const qRef = collection(db, `JoinedClasses/${mail}/classes`);
        const q = query(qRef, where("owner", "!=", `${mainData.owner}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        })
    }

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuOptionClick = (dialogSetter) => {
        dialogSetter(true);
        setMenuOpen(false);
    };

    const tabs = [
        {
            id: 'announcements', title: 'Announcements',
            content: <div className="flex flex-col gap-4 overflow-hidden">
                <div className="flex-grow flex border-2 cursor-pointer border-[#1174b1] py-6 h-[4rem] sm:h-[8rem] items-center gap-4 p-4 rounded-md shadow-md shadow-black" onClick={() => setShowInput(true)}>
                    <div id="a" className='w-full' style={{ display: 'none' }}>
                        <TextField
                            multiline
                            label="Announce Something to your class"
                            variant='filled'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className='w-full p-4'
                        />
                        <div className="flex justify-between sm:mt-[1.2rem]">
                            <input onChange={handleChange} type="file" color='primary' variant="outlined" />
                            <div className="flex">
                                <Button onClick={show}>Cancel</Button>
                                <Button onClick={handleUpload} color='primary' variant='contained'>Post</Button>
                            </div>
                        </div>
                    </div>
                    <div onClick={hide} id='b' className="w-full">
                        <Avatar />
                        <p>Announce Something to your Class</p>
                    </div>

                </div>
                <div className="w-full flex flex-col gap-2 sm:w-[53rem] "><Announcements mainData={mainData} />
                </div>
            </div>
        },
        { id: 'classWork', title: 'Classwork', content: <ClassWork classData={mainData} /> },
        {
            id: 'people', title: `Students (${memberNos})`, content:
                <div className="flex flex-col gap-4 overflow-hidden">
                    <div className="w-full flex flex-col gap-2 sm:w-[53rem] ">
                        <People classData={memberEmails} />
                    </div>
                </div>
        },
        { id: 'group', title: 'Group', content: <Groups classData={mainData} /> },
    ];

    return (
        <div className="sm:w-full w-[35rem]">
            <TopBar />
            <div className="flex mt-[6rem] flex-col gap-6  items-center pt-[1.2rem] w-full ">
                <div className="rounded-md bg-gradient-to-r from-[#07314B] via-[#1f5374] to-[#1174b1] text-white w-[30rem] sm:w-[70rem] sm:h-[11rem] flex justify-between p-6">
                    <div>
                        <h1 className='font-bold text-3xl sm:text-4xl'>{mainData.courseName}</h1>
                        <h1 className='mt-[0.2rem]'>{mainData.className} {mainData.section}</h1>
                        <h2 className='font-bold text-sm mt-3'>Class Code:</h2>
                        <h2>{mainData.id}</h2>
                    </div>
                    {currentMail === classOwnerMail ? (
                        <div className="text-4xl cursor-pointer">
                            <IoMdMore onClick={handleClick} />
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => setGradeOpen(true)}><AiOutlinePieChart />&nbsp;Grading</MenuItem>
                                <MenuItem onClick={() => setEditOpen(true)}><GoPencil />&nbsp;Edit Class</MenuItem>
                                <MenuItem onClick={handleTransferDialogOpen}><FaExchangeAlt />&nbsp;Transfer Class</MenuItem>
                                <MenuItem onClick={() => { }}><CiViewTable />&nbsp;Mark Sheet</MenuItem>
                                <MenuItem onClick={handleDelete}><MdDeleteOutline />&nbsp;Delete Class</MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <div className="text-4xl cursor-pointer">
                            <IoMdMore onClick={handleClick} />
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => { }}><CiViewTable />&nbsp;Mark Sheet</MenuItem>
                                <MenuItem onClick={leaveClass}><IoExitOutline />&nbsp;Leave Class</MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row sm:px-[8rem] gap-4 w-full">
                    <div className="flex flex-col gap-2 sm:w-[14rem]">
                        <div className="border-2 p-4 rounded-md">
                            <h1 className='text-md font-semibold'>Upcoming</h1>
                            <p>No Work Due</p>
                        </div>
                        <div className="border-2 p-4 flex flex-col items-center gap-2 rounded-md">
                            <h1 className='text-md font-semibold'>AU Meet</h1>
                            {mainData.call ? (
                                <Link onClick={() => setCallClass(mainData.id)} to={mainData.call} className='bg-gradient-to-r from-[#07314B] via-[#1f5374] to-[#1174b1] text-white font-bold text-lg text-center px-3 py-2 rounded-md w-[10rem]'>Join Now</Link>
                            ) : (
                                <Link to='/call' onClick={() => setCallClass(mainData.id)} className='bg-gradient-to-r from-[#07314B] via-[#1f5374] to-[#1174b1] text-white font-bold text-lg text-center px-3 py-2 rounded-md w-[10rem]'>Create Now</Link>
                            )}
                        </div>
                    </div>
                    <MainTabs tabs={tabs} />
                </div>
            </div>
            {mainData.owner === loggedInMail && <button onClick={handleMenuClick} className='rounded-full shadow-xl font-extralight border-2 text-3xl p-3 fixed bottom-7 right-7' ><FaPlus /></button>}
            {menuOpen && (
                <div className=' bg-[#f0f0f0] w-[10rem] absolute bottom-[3.7rem] right-[3.6rem]'>
                    <MenuItem onClick={() => handleMenuOptionClick(setAssignmentDialog)}>Assignments</MenuItem>
                    <MenuItem onClick={() => handleMenuOptionClick(setQuizDialog)}>Quizzes</MenuItem>
                    <MenuItem onClick={() => handleMenuOptionClick(setMidsDialog)}>Mids</MenuItem>
                    <MenuItem onClick={() => handleMenuOptionClick(setFinalDialog)}>Finals</MenuItem>
                    <MenuItem onClick={() => handleMenuOptionClick(setProjectDialog)}>Projects</MenuItem>
                </div>
            )}
            <Dialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                aria-labelledby='dialog-title'
            >
                <div className="form p-4">
                    <h2 className='font-bold'>Edit Class</h2>
                    <div className="p-4 flex flex-col gap-2">
                        <TextField id="filled-basic" value={courseName} onChange={(e) => setCourseName(e.target.value)} label="Course Name *" variant='filled' className='w-[30rem]' />
                        <TextField id="filled-basic" value={className} onChange={(e) => setClassName(e.target.value)} label="Class Name *" variant='filled' className='w-[30rem]' />
                        <TextField id="filled-basic" value={creditHours} onChange={(e) => setCreditHours(e.target.value)} label="Credit Hours" variant='filled' className='w-[30rem]' />
                    </div>
                    <DialogActions>
                        <Button onClick={editClass} color="primary">
                            Edit
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
            <Dialog
                open={gradeOpen}
                onClose={() => setGradeOpen(false)}
                aria-labelledby='dialog-title'
            >
                <div className="form p-4">
                    <h2 className='font-bold'>Grading System (Total 100%)</h2>
                    <div className="p-4 flex flex-col gap-2">
                        <TextField id="filled-basic" value={assignmentWeightage} onChange={(e) => setAssignmentWeightage(e.target.value)} label="Assignment Weightage(%)" variant='filled' className='w-[30rem]' />
                        <TextField id="filled-basic" value={quizWeightage} onChange={(e) => setQuizWeightage(e.target.value)} label="Quiz Weightage(%)" variant='filled' className='w-[30rem]' />
                        <TextField id="filled-basic" value={midsWeightage} onChange={(e) => setMidsWeightage(e.target.value)} label="Mids Weightage(%)" variant='filled' className='w-[30rem]' />
                        <TextField id="filled-basic" value={finalWeightage} onChange={(e) => setFinalWeightage(e.target.value)} label="Final Weightage(%)" variant='filled' className='w-[30rem]' />
                        <TextField id="filled-basic" value={projectWeightage} onChange={(e) => setProjectWeightage(e.target.value)} label="Project Weightage(%)" variant='filled' className='w-[30rem]' />
                    </div>
                    <DialogActions>
                        <Button onClick={gradeClass} disabled={disabled} color="primary">
                            Grade
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
            <Dialog open={transferDialogOpen} onClose={handleTransferDialogClose}>
                <DialogTitle>Transfer Class Ownership</DialogTitle>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="transfer-label">Select Member</InputLabel>
                    <Select
                        labelId="transfer-label"
                        id="transfer-select"
                        value={transferEmail}
                        onChange={(e) => setTransferEmail(e.target.value)}
                    >
                        {memberEmails.map((email) => (
                            <MenuItem key={email} value={email}>
                                {members[email]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <DialogActions>
                    <Button onClick={handleTransferDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={transferClass} color="primary">
                        Transfer
                    </Button>
                </DialogActions>
            </Dialog>
            <AssignmentForm classData={mainData} />
            <QuizForm classData={mainData} />
            <MidsForm classData={mainData} />
            <FinalForm classData={mainData} />
            <ProjectForm classData={mainData} />
        </div>
    );
}

export default Main