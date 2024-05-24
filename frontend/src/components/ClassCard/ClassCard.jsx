import React from 'react'
import { MdMoreVert } from "react-icons/md";
import { LiaGreaterThanSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';

export default function ClassCard({ classData }) {
    // console.log(classData)
    return (
        <div className="flex flex-col bg-[#f0f0f0] rounded-xl shadow-md shadow-black p-4 w-[25rem] h-[10rem] ">
            <div className="flex">
                <div className="">
                    <img src="/class-logo.svg" alt="" className='' width={300} />
                </div>
                <div className="flex flex-col">
                    <Link  to={`/${classData.id}`} className='font-bold text-xl'>{classData.courseName}</Link>
                    <p className='font-extralight text-sm mt-2'>Unlock knowledge and explore the world of {classData.courseName} in this interactive class.</p>
                    <Link className="flex w-full mt-2 justify-end gap-2" to={`/${classData.id}`}>
                        <p>Teacher: <span className='font-bold '>{classData.teacher}</span></p>
                        <button className='bg-[#032B44] rounded-full px-2 text-white'><LiaGreaterThanSolid /></button>
                    </Link>
                </div>
            </div>

        </div>
    )
}
