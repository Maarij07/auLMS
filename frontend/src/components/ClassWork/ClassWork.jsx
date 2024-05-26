import React, { useState } from 'react';
import { useLocalContext } from '../../context/context';
import {Assignments, Finals, Mids, Projects, Quiz} from '../index';

const ClassWork = ({ classData }) => {
    const { loggedInMail } = useLocalContext();
    const [activeIndex, setActiveIndex] = useState(null);

    const handleAccordionClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const accordionItems = [
        { title: 'Assignment', content: <Assignments classData={classData} /> },
        { title: 'Quiz', content: <Quiz classData={classData} />},
        { title: 'Mids', content: <Mids classData={classData} />},
        { title: 'Final', content: <Finals classData={classData}/>},
        { title: 'Projects', content: <Projects classData={classData} /> },
    ];

    return (
        <div className="mx-auto mt-4 sm:w-[54.5rem]">
            {accordionItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200">
                    <button
                        onClick={() => handleAccordionClick(index)}
                        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    >
                        <h2 className="font-semibold">{item.title}</h2>
                    </button>
                    {activeIndex === index && (
                        <div className="px-4 py-2 bg-white">
                            {item.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ClassWork;
