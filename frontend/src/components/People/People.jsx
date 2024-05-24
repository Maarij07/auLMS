import React from 'react';

const People = ({ classData }) => {
    console.log(classData);
    return (
        <div className="w-full flex flex-col gap-3 overflow-hidden h-full">
            {classData.map((email, index) => (
                <div key={index} className="w-full bg-white sm:p-4 border-2 rounded-md">
                    <a href={`mailto:${email.replace(/_/g, '.')}`}>
                        <p>{email.replace(/_/g, '.')}</p>
                    </a>
                </div>
            ))}
        </div>
    );
};

export default People;
