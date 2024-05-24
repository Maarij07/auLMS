import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import db from '../../lib/firebase';
import { Button, TextField, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useLocalContext } from '../../context/context';

const Groups = ({ classData }) => {
    const { loggedInMail } = useLocalContext();
    const [groups, setGroups] = useState([]);
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [maxMembers, setMaxMembers] = useState(2);
    const [userGroup, setUserGroup] = useState(null);

    // Fetch groups from Firestore
    useEffect(() => {
        const groupRef = collection(db, `Classes/${classData.id}/Groups`);
        const unsubscribe = onSnapshot(groupRef, (querySnapshot) => {
            const groupsData = [];
            let userGroupFound = null;
            querySnapshot.forEach((doc) => {
                const group = {
                    id: doc.id,
                    ...doc.data()
                };
                groupsData.push(group);
                if (group.members.includes(loggedInMail)) {
                    userGroupFound = group;
                }
            });
            setGroups(groupsData);
            setUserGroup(userGroupFound);
        });
        return () => unsubscribe();
    }, [classData.id, loggedInMail]);

    // Create a new group
    const handleCreateGroup = async () => {
        const groupRef = collection(db, `Classes/${classData.id}/Groups`);
        await addDoc(groupRef, {
            groupName,
            creator: loggedInMail,
            maxMembers,
            members: [loggedInMail]
        });
        setOpen(false);
        setGroupName('');
        setMaxMembers(2);
    };

    // Join a group
    const handleJoinGroup = async (group) => {
        if (userGroup) {
            alert('You are already a member of a group');
            return;
        }
        const groupDocRef = doc(db, `Classes/${classData.id}/Groups/${group.id}`);
        if (group.members.length < group.maxMembers) {
            const updatedMembers = [...group.members, loggedInMail];
            await updateDoc(groupDocRef, {
                members: updatedMembers
            });
        } else {
            alert('Group is full');
        }
    };

    // Leave a group
    const handleLeaveGroup = async (group) => {
        const groupDocRef = doc(db, `Classes/${classData.id}/Groups/${group.id}`);
        const updatedMembers = group.members.filter(member => member !== loggedInMail);
        if (updatedMembers.length === 0) {
            await deleteDoc(groupDocRef);
        } else {
            await updateDoc(groupDocRef, {
                members: updatedMembers
            });
        }
        setUserGroup(null);  // Update local state
    };

    return (
        <div className='sm:w-[53rem]'>
            <Button onClick={() => setOpen(true)} disabled={!!userGroup}>Create Group</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create a New Group</DialogTitle>
                <TextField label="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                <TextField
                    label="Max Members"
                    type="number"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                />
                <DialogActions>
                    <Button onClick={handleCreateGroup}>Create</Button>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <div className='w-full flex flex-col gap-4'>
                {groups.map((group) => (
                    <div key={group.id} className="group-card bg-green-50 p-4 rounded-sm border-2">
                        <h3 className='font-semibold'>{group.groupName}</h3>
                        <p className='text-sm opacity-70'>Members: {group.members.length}/{group.maxMembers}</p>
                        <div>
                            {group.members.map((member, index) => (
                                <li className='list-disc text-sm' key={index}>{member}</li>
                            ))}
                        </div>
                        {group.members.includes(loggedInMail) ? (
                            <>
                                <p>You are a member of this group</p>
                                <Button onClick={() => handleLeaveGroup(group)}>Leave Group</Button>
                            </>
                        ) : (
                            <Button onClick={() => handleJoinGroup(group)} disabled={!!userGroup}>Join Group</Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Groups;
