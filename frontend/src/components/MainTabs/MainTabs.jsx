import React, { useState } from 'react';

const MainTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleClick = (id) => {
    setActiveTab(id);
  };

  return (
    <div className="flex flex-col">
      <ul className="flex mb-4">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`px-4 py-2 cursor-pointer ${
              activeTab === tab.id ? 'bg-gray-200 text-gray-800 font-bold' : 'text-gray-500'
            }`}
            onClick={() => handleClick(tab.id)}
          >
            {tab.title}
          </li>
        ))}
      </ul>
      <div className="flex-grow">
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>  
  );
};

export default MainTabs;
