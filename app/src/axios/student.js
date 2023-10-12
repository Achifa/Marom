import axios from "axios";
const axiosInstance = axios.create({
    baseURL: 'http://localhost:9876',
    headers: {
        'Content-Type': 'application/json',
    },
});

export let upload_form_one = (fname, mname, sname, email, lang, is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone, parent_fname, parent_lname, parent_email, photo, acadId, parentConsent) => {

    return new Promise((resolve, reject) => {


        axios.post('http://localhost:9876/student/setup', {
            fname, mname, sname, email, lang, is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone, parent_fname, parent_lname, parent_email, photo, acadId, parentConsent
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}



export let get_student_setup = (id) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/student/setup', {
            params: {
                id
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_student_grade = () => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/student/grade', {})
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let get_student_market_data = (id) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/student/market-data', { params: { id } })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_tutor_subject = (subject) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/student/tutor-subject', { params: { subject } })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let upload_student_short_list = (items) => {

    return new Promise((resolve, reject) => {


        axios.post('http://localhost:9876/student/short-list', { items })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_student_short_list = (student) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/student/short-list', { params: { student } })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_my_data = (AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/student/my-data', {
            params: {
                AcademyId
            }
        })
        .then((result) => {
            resolve(result.data)
        })
        .catch((err) => {
            reject(err)
        })           

    })
}

export let get_student_short_list_data = (id) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/student/short-list-data', { params: { id } })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export const save_student_events = async (body) => {
    await axiosInstance.post('/student/booking', body);
}

export const get_student_events = async (studentId, tutorId) => {
    const { data } = await await axiosInstance.get(`/student/booking/${studentId}/${tutorId}`);
    return data;
}