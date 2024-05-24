import React from 'react'
import dayjs from 'dayjs';
import cn from './cn';

export const generateDate = (month = dayjs().month(), year = dayjs().year()) => {

    const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
    const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");

    const arrayOfDate = [];

    //create prefix date
    for (let i = 0; i < firstDateOfMonth.day(); i++) {
        arrayOfDate.push({ currentMonth: false, date: firstDateOfMonth.day(i) });
    }

    //generate current date
    for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
        arrayOfDate.push({ date: firstDateOfMonth.date(i), currentMonth: true, today: firstDateOfMonth.date(i).toDate().toDateString() === dayjs().toDate().toDateString() });
    }

    const remaining = 42 - arrayOfDate.length;
    for (let i = lastDateOfMonth.date() + 1; i <= lastDateOfMonth.date() + remaining; i++) {
        arrayOfDate.push({ date: lastDateOfMonth.date(i), currentMonth: false });
    }

    return arrayOfDate;
}

const Calender = () => {

    const days = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div className='w-78 h-78 bg-white'>
            <div className="w-full grid grid-cols-7">
                {days.map((day, index) => {
                    return <h1 className='grid place-content-center text-sm font-semibold' key={index}> {day}</h1>
                })}
            </div>
            <div className="w-full grid grid-cols-7 ">
                {generateDate().map(({ date, currentMonth, today }, index) => {
                    return (
                        <div key={index} className="h-8 border-t grid place-content-center text-sm">
                            <h1 className={cn(currentMonth?"":"text-gray-400", today? "bg-red-600 text-white":"", 'h-6 w-6 grid place-content-center rounded-full hover:bg-black hover:text-white transition-all cursor-pointer' )} >{date.date()}</h1>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Calender;