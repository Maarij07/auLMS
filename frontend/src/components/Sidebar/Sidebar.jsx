import React, { useState } from 'react';
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { MdOutlineVideoCameraFront } from "react-icons/md";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';

const LogoutDialog = ({ onConfirm, onCancel }) => {
    return (
        <div className="logout-dialog">
            <p>Are you sure you want to log out?</p>
            <div>
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onConfirm}>Logout</button>
            </div>
        </div>
    );
};

const Sidebar = () => {
    const dispatch = useDispatch();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    function handleLogout() {
        setShowLogoutDialog(true);
    }

    function confirmLogout() {
        signOut(auth).then(() => {
            dispatch(setUser(null))
            Navigate('/');
        }).catch((error) => {
            console.log(error);
        });
        setShowLogoutDialog(false);
    }

    function cancelLogout() {
        setShowLogoutDialog(false);
    }

    return (
        <div className="hidden sm:flex flex-col gap-10 flex-grow bg-gradient-to-b from-[#032B44] via-[#205475] to-[#052F48] h-screen w-[11rem] text-white fixed left-0 items-center justify-around text-xl ">
            <div className="">
                <img src="/logo-white.png" className='sm:ml-[-1rem]' alt="logo" width={270} />
            </div>
            <div className="flex flex-col gap-6">
                <Link to='/' className="flex items-center gap-2">
                    <IoHomeOutline />
                    <span>Home</span>
                    {/* <Link to='/call?roomID=yl0dl'>hello </Link> */}
                </Link>
                <div className="flex items-center gap-2">
                    <MdOutlineVideoCameraFront />
                    <span>MarkSheets</span>
                    {/* <Link to='/call?roomID=hNYiz' >Hell2</Link> */}
                </div>
                <Link to='/settings' className="flex items-center gap-2">
                    <IoSettingsOutline />
                    <span>Settings</span>
                </Link>
            </div>
            <div className="flex items-center gap-2" onClick={handleLogout}>
                <RiLogoutBoxLine />
                <button>Logout</button>
            </div>
            <Dialog aria-labelledby='dialog-title' aria-describedby='dialog-content' open={showLogoutDialog} onClose={cancelLogout}>
                <DialogTitle id="dialog-title" >Logout</DialogTitle>
                <DialogContent id="dialog-content" >Are you sure you want to logout?</DialogContent>
                <DialogActions>
                    <Button onClick={cancelLogout} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmLogout} color="primary">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Sidebar;
