import React, { useEffect, useState } from 'react'
import { get_feedback_to_question } from '../../../../axios/student'
import { wholeDateFormat } from '../../../../constants/constants'
import { showDate } from '../../../../helperFunctions/timeHelperFunctions'
import StarRating from '../../../student/Feedback/StarRating'
import { convertToDate } from '../../Calendar/Calendar'
import LeftSideBar from '../../LeftSideBar'
import Loading from '../../Loading'
import { SessionActions } from './SessionActions'
import { SessionFeedback } from './SessionFeedback'

export const TutorEventModal = ({ isOpen, onClose, clickedSlot, timeZone }) => {
    const [questions, setQuestions] = useState([]);
    const [questionLoading, setQuestionLoading] = useState(false)
    useEffect(() => {
        if (clickedSlot.id) {
            setQuestionLoading(true)
            const fetchFeedbackToQuestion = async () => {
                const data = await get_feedback_to_question(clickedSlot.id, clickedSlot.tutorId, clickedSlot.studentId)
                if (data.length)
                    setQuestions(data)
                setQuestionLoading(false)
            }
            fetchFeedbackToQuestion()
        }
    }, [clickedSlot])


    return (
        <LeftSideBar
            top={"165px"}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="">
                <div className="modal-header">
                    <div style={{ width: '80%' }}>
                        <p className="modal-title" style={{ fontSize: "14px" }}>{showDate(clickedSlot.start, wholeDateFormat)} - {clickedSlot.studentName}</p>
                    </div>
                </div>
                {
                    convertToDate(clickedSlot.end).getTime() <= (new Date()).getTime() ?
                        <SessionFeedback clickedSlot={clickedSlot} questions={questions} /> :
                        <SessionActions clickedSlot={clickedSlot} />
                }

            </div>
        </LeftSideBar >
    )
}
