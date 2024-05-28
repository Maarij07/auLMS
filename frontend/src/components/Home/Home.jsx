import React, { useState, useEffect } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { Avatar, Menu, MenuItem } from '@mui/material';
import { CreateClass, JoinClass, Todos, Sidebar,Calendar } from '../index';
import { useLocalContext } from '../../context/context';
import { Classes } from '../index';
import { useSelector } from 'react-redux';
import { SelectUsers } from '../../store/userSlice';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { setCreateClassDialog, setJoinClassDialog } = useLocalContext();

    const handleClick = (event) =>setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    
    const handleJoin = () => {
        handleClose();
        setJoinClassDialog(true);
    }
    const handleCreate = () => {
        handleClose();
        setCreateClassDialog(true);
    }

    return (
        <div className="sm:w-[53.5rem] sticky top-0 bg-[#fff] border-[#e9eaec] border-b-2 h-[7rem] flex items-center px-4 justify-between">
            <div className="">
                <h1 className='text-[#032B44] font-semibold text-3xl'>My Courses</h1>
            </div>
            <div className="flex gap-4 text-3xl">
                <IoSearchOutline className='cursor-pointer' />
                <IoMdAdd onClick={handleClick} className='cursor-pointer' />
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleJoin}>Join Class</MenuItem>
                    <MenuItem onClick={handleCreate} >Create Class</MenuItem>
                </Menu>
            </div>
        </div>
    )
}

const Home = ({ children }) => {
    const { loggedInUser } = useLocalContext();
    useEffect(() => {}, [loggedInUser]);

    const currentUser = useSelector(SelectUsers);
    const [studentId, setStudentId] = useState(null);
    const [altName,setAltName]=useState('My Account');

    useEffect(() => {
        if (currentUser?.currentUser?.email) {
            const email = currentUser.currentUser.email;
            const atIndex = email.indexOf('@');
            const beforeAt = email.substring(0, atIndex);
            setAltName(beforeAt);
            const isNotNumeric = /\D/.test(beforeAt); // Checks if any character before @ is non-numeric
            if (isNotNumeric) {
                setStudentId(null);
            } else {
                setStudentId(beforeAt);
            }
        } else {
            setStudentId(null);
        }
    }, [currentUser]);

    console.log(currentUser);
    return (
        <div className="flex sm:ml-[12rem]">
            <Sidebar />
            <div className="h-screen flex w-[80rem] text-black">
                <div className="">
                    <Navbar />
                    <CreateClass />
                    <JoinClass />
                    <Classes />
                </div>
                <div className="bg-[#f0f0f0] fixed right-0 h-screen w-[17.5rem] flex flex-col justify-between py-8 px-6">
                    <div className="flex justify-end items-center gap-4">
                        <div className="text-right">
                            <h1 className="font-bold leading-4 text-xl">{currentUser?.currentUser?.name || altName }</h1>
                            <p>{studentId}</p>
                        </div>
                        <div className="h-full">
                            <Avatar src={currentUser?.currentUser?.photo} sx={{ width: 39, height: 39 }} />
                        </div>
                    </div>
                    <div className=""><Calendar /></div>
                    <div className="flex flex-col h-[20rem]">
                        <Todos />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
