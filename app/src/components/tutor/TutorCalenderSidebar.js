import React, { useEffect, useRef } from 'react';
import { hours, days } from '../../constants/constants';
import { BsCheckCircle } from 'react-icons/bs';

function TutorCalenderSidebar({
    activeTab,
    setActiveTab,
    disableWeekDays,
    setDisabledWeekDays,
    disabledHours,
    setDisabledHours,
    disableColor,
    setDisableColor
}) {
    const hoursChecboxes = useRef(null);
    useEffect(() => {
        if (hoursChecboxes.current) {
            const element = hoursChecboxes.current;
            const middle = element.scrollHeight / 2;
            element.scrollTop = middle;
        }
    }, [activeTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    
    const handleCheckboxClick = (day, timeRange) => {
        if (activeTab === 'month') {
            if (disableWeekDays?.includes(day)) {
                setDisabledWeekDays(disableWeekDays.filter((d) => d !== day));
            } else {
                setDisabledWeekDays([...(disableWeekDays ?? []), day]);
            }
        } else if (activeTab === 'day') {
            if (disabledHours?.some(range => range[0] === timeRange[0])) {
                setDisabledHours(disabledHours.filter((range) => range[0] !== timeRange[0]));
            }
            else {
                setDisabledHours([...disabledHours, timeRange]);
            }
        }
    };

    const checkboxChecked = (timeRangeOne) => {
        return disabledHours?.some(range =>
            range[0] === timeRangeOne)
    }

    return (
        <div className="tab-content card h-100" style={{ overflowY: "auto" }}>
            <div className='highlight small p-2'>To view feedback, postpone, or cancel, click on the lesson</div>
            <div className='d-flex'>

                <button
                    className={`btn btn-sm w-50 ${activeTab === 'month' ? 'btn-primary' : 'btn-success'
                        }`}
                    style={{
                        boxShadow: `${activeTab === 'month' ? "5px 5px 10px rgba(0, 0, 0, 0.5)" : ""}`

                    }}
                    onClick={() => handleTabClick('month')}

                >
                    Blooked Week Days
                </button>
                <button
                    className={`btn btn-sm w-50 ${activeTab === 'day' ? 'btn-primary' : 'btn-success'
                        }`}
                    style={{
                        boxShadow: `${activeTab === 'day' ? "5px 5px 10px rgba(0, 0, 0, 0.5)" : ""}`
                    }}
                    onClick={() => handleTabClick('day')}
                >
                    Blocked Hours
                </button>
            </div>
            <div className={`h-100 tab-pane ${activeTab === 'month' ? 'active' : ''}`} id="months">
                <div className='w-100 p-2'>
                    <label>Click on the pallet below to select a color indicating your blocked slots:</label>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='d-flex '
                            style={{
                                marginRight: "5px"
                            }}
                        >Select Blockout Color</div>
                        <input className='p-0 m-0'
                            onChange={(e) => setDisableColor(e.target.value)}
                            value={disableColor || "#5ed387"}
                            style={{
                                width: "120px",
                                height: "20px"
                            }}
                            type="color" />
                    </div>
                </div>
                <div className="form-scheduling-cnt-left h-100 w-100">

                    <div className="highlight small lh-sm">
                        Checkbox the Day you are not tutoring. Students will
                        not be able to book lessons for your blocked day(s).
                    </div>

                    <div className="form-scheduling-b-days">
                        {days.map((day, index) => (
                            <div className="form-check" key={index}>
                                <input
                                    type="checkbox"
                                    id={day.toLowerCase()}
                                    className="form-check-input"
                                    style={{
                                        accentColor: disableWeekDays?.includes(day)
                                            ? disableColor : "#fff",
                                        backgroundColor: disableWeekDays?.includes(day)
                                            ? disableColor : "#fff",
                                    }}
                                    checked={disableWeekDays?.includes(day)}
                                    onChange={() => handleCheckboxClick(day)}
                                />
                                <label className="form-check-label small" htmlFor={day.toLowerCase()}>
                                    {day}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="highlight small lh-sm">
                        Double click on a blocked weekday or hour, Will unblock the
                        day, or the specific hour for that day.11
                    </div>
                    <div className='text-end'>
                        <div className='highlight'>Tutor Calendar Color legend.</div>
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center w-100" style={{
                                fontSize: "12px",
                                fontFamily: "inherit"
                            }}>
                                Tutor BlockOut Days/Slots
                                <div className="border" style={{ width: "40px", height: "20px", background: disableColor }}></div>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center w-100" style={{
                                fontSize: "12px",
                                fontFamily: "inherit"
                            }}>
                                Students Intro Sessions
                                <div className="border" style={{ width: "40px", height: "20px", background: "lightblue" }}></div>

                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center w-100" style={{
                                fontSize: "12px",
                                fontFamily: "inherit"
                            }}>
                                Students Booked Sessions
                                <div className="border" style={{ width: "40px", height: "20px", background: "lightgreen" }}></div>

                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center w-100" style={{
                                fontSize: "12px",
                                fontFamily: "inherit"
                            }}>
                                Students Reserved Session
                                <div className="border" style={{ width: "40px", height: "20px", background: "lightyellow" }}></div>

                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center w-100" style={{
                                fontSize: "12px",
                                fontFamily: "inherit"
                            }}>
                                Default disable slots
                                <div className="border" style={{ width: "40px", height: "20px", background: "lightgray" }}></div>

                            </li>

                        </ul>

                    </div>
                </div>
            </div>

            <div className={`tab-pane ${activeTab === 'day' ? 'active' : ''}`} id="days" style={{ height: "92%" }}>
                <div className="form-scheduling-cnt-left flex-column d-flex  justify-content-between h-100 w-100">

                    <div className="highlight small lh-sm">
                        CheckBox the hours that you are not tutoring. Students will
                        not be able to book lessons for your blocked hours.
                        By default, Gray checkboxes are blooking undesirable hours. If desired, you can unblock any hour from this group to accomodate your student(s)
                    </div>

                    <div className="form-scheduling-hours" ref={hoursChecboxes}>
                        {hours.map((timeRange, index) => {
                            return (<div className="form-check" key={index}>
                                <input
                                    type="checkbox"
                                    id={`hour-${index}`}
                                    style={{
                                        accentColor: timeRange[2] !== 'midnight' && checkboxChecked(timeRange[0], timeRange[1])
                                            ? disableColor : timeRange[2] === 'midnight' && checkboxChecked(timeRange[0], timeRange[1]) ?
                                                "lightgray" : "#fff",
                                        backgroundColor: timeRange[2] !== 'midnight' && checkboxChecked(timeRange[0], timeRange[1])
                                            ? disableColor : timeRange[2] === 'midnight' && checkboxChecked(timeRange[0], timeRange[1]) ?
                                                "lightgray" : "#fff",

                                    }}
                                    className={`form-check-input ${timeRange[2] === 'midnight' ? "gray-checkbox" : ""}`}
                                    checked={checkboxChecked(timeRange[0], timeRange[1])}
                                    onChange={() => handleCheckboxClick(null, timeRange)}
                                />
                                <label className="form-check-label small lh-sm" htmlFor={`hour-${index}`}>
                                    {timeRange[0]} to {timeRange[1]}
                                </label>
                            </div>)
                        }
                        )}

                    </div>

                    <div className="highlight small lh-sm">
                        Double click on a blocked weekday or hour, will unblock the
                        day or the specific hour for that day.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TutorCalenderSidebar