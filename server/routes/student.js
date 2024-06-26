const { upload_form_one, get_student_setup, get_student_grade, get_tutor_subject, upload_student_short_list, get_student_short_list,
    get_student_short_list_data,
    get_student_market_data,
    post_student_bookings,
    get_student_tutor_bookings,
    get_my_data,
    get_student_bank_details,
    post_student_bank_details,
    post_student_feedback,
    get_student_feedback,
    payment_report,
    get_feedback_questions,
    get_feedback_of_questions,
    post_feedback_questions,
    update_shortlist, get_student_bookings, getBookedSlot } = require('../controllers/student');
const { express,
    path,
    fs, parser, cookieParser, mocha, morgan, io, cors, shortId, jwt } = require('../modules');

const STUDENT_ROUTES = express.Router();

STUDENT_ROUTES.get('/student/setup', get_student_setup)
STUDENT_ROUTES.get('/student/grade', get_student_grade)
STUDENT_ROUTES.get('/student/tutor-subject', get_tutor_subject)
STUDENT_ROUTES.post('/student/short-list', parser, upload_student_short_list)
STUDENT_ROUTES.get('/student/my-data', get_my_data)
STUDENT_ROUTES.get('/student/short-list/:student', get_student_short_list)
STUDENT_ROUTES.put('/student/short-list/:AcademyId/:Student/:Subject', parser, update_shortlist)

STUDENT_ROUTES.get('/student/short-list-data', get_student_short_list_data)
STUDENT_ROUTES.get('/student/market-data', get_student_market_data)
STUDENT_ROUTES.post('/student/setup', parser, upload_form_one)
//bookings
STUDENT_ROUTES.post('/student/booking', parser, post_student_bookings)
STUDENT_ROUTES.get('/student/booking/:studentId/:tutorId', parser, get_student_tutor_bookings)
STUDENT_ROUTES.get('/student/booking/:studentId', get_student_bookings)
STUDENT_ROUTES.get('/student/bank/:AcademyId', get_student_bank_details)
STUDENT_ROUTES.post('/student/bank', parser, post_student_bank_details)
STUDENT_ROUTES.post('/student/feedback', parser, post_student_feedback)
STUDENT_ROUTES.get('/student/feedback/:ShortlistId', get_student_feedback)
STUDENT_ROUTES.get('/student/booked-slot', getBookedSlot)

STUDENT_ROUTES.get('/student/payment-report/:studentId', payment_report)
STUDENT_ROUTES.get('/questions/list', get_feedback_questions)
STUDENT_ROUTES.get('/questions/:StudentId/:TutorId/:SessionId', get_feedback_of_questions)
STUDENT_ROUTES.post('/questions', parser, post_feedback_questions)


module.exports = {
    STUDENT_ROUTES
} 