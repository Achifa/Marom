const { resolve } = require('path/posix');
const { marom_db, knex, connecteToDB } = require('../db');
const { shortId } = require('../modules');
const { insert, updateById, getAll, find, findByAnyIdColumn, update } = require('../helperfunctions/crud_queries');



let post_new_subject = (req, res) => {


    let { faculty, subject, reason, AcademyId, facultyId } = req.body;

    let date = new Date();

    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            var resultSet = poolConnection.request().query(
                `
                    INSERT INTO "NewTutorSubject"(faculty, subject, date, AcademyId, reason, facultyID)
                    VALUES ('${faculty}', '${subject}', '${date}', '${AcademyId}', '${reason}', '${facultyId}')
                    `
            )

            resultSet.then((result) => {

                result.rowsAffected[0] === 1
                    ?
                    res.send({ bool: true, mssg: 'Data Was Successfully Saved' })
                    :
                    res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })

            })
                .catch((err) => {
                    console.log(err);
                    res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })
                })

        }

    })
}
let subjects = (req, res) => {

    let { id } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT Id,FacultyId,SubjectName FROM Subjects WHERE CONVERT(VARCHAR, FacultyId) =  '${id}'
                `
            )

            res.send(resultSet)

        }

    })

}

let post_form_one = (req, res) => {

    let { fname, mname, sname, email, pwd, acadId, cell, add1, add2, city, state, zipCode,
        country, timeZone, response_zone, intro, motivation, headline, photo, video, grades, userId } = req.body;

    let UserId = mname.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] + shortId.generate() : fname + '.' + ' ' + sname[0] + shortId.generate();
    let screenName = mname.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] : fname + '.' + ' ' + sname[0]

    let action = cb => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            let result = poolConnection ? await get_action(poolConnection) : 'connection error';
            cb(result);

        })
    }

    action((result) => {

        if (result) {

            let db = marom_db(async (config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);


                insert_rates(poolConnection)
                    .then((result) => {
                        res.send({ user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Saved Successfully', type: 'save' })
                    })
                    .catch((err) => {
                        res.send({ user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Saved Successfully Due To Database Malfunction, Please Try Again.' })

                    })

            })

        } else {

            let db = marom_db(async (config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                update_rates(poolConnection)
                    .then((result) => {
                        res.send({ user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Updated Successfully', type: 'update' })
                    })
                    .catch((err) => {
                        res.send({ user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Updated Successfully Due To Database Malfunction, Please Try Again.' })
                    })
                //res.send({user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Updated Successfully'})

            })

        }
    })

    let get_action = async (poolConnection) => {
        let records = await poolConnection.request().query(`SELECT * FROM "TutorSetup" WHERE CONVERT(VARCHAR, Email) = '${email}'`)
        let get_duplicate = await records.recordset;

        let result = get_duplicate.length > 0 ? false : true;
        return (result);
    }

    let insert_rates = async (poolConnection) => {
        const dataObject = {
            Photo: photo || null,
            Video: video || null,
            FirstName: fname || null,
            MiddleName: mname || null,
            LastName: sname || null,
            Address1: add1 || null,
            Address2: add2 || null,
            CityTown: city || null,
            StateProvince: state || null,
            ZipCode: zipCode || null,
            Country: country || null,
            Email: email || null,
            CellPhone: cell || null,
            GMT: timeZone || null,
            ResponseHrs: response_zone || null,
            TutorScreenname: screenName || null,
            HeadLine: headline || null,
            Introduction: intro || null,
            Motivate: motivation || null,
            IdVerified: null || null,
            BackgroundVerified: null || null,
            AcademyId: UserId || null,
            Status: 'Pending' || null,
            Grades: grades || null,
            userId
        };
        let records = await poolConnection.request().query(
            insert('TutorSetup', dataObject)
        )

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }

    let update_rates = async (poolConnection) => {
        let records = await poolConnection.request().query(`UPDATE "TutorSetup" set Photo = '${photo}', Video = '${video}',  Grades = '${grades}', Address1 = '${add1}', Address2 = '${add2}', CityTown = '${city}', StateProvince = '${state}', ZipCode = '${zipCode}', Country = '${country}', Email = '${email}', CellPhone = '${cell}', GMT = '${timeZone}', ResponseHrs = '${response_zone}', TutorScreenname = '${screenName}', HeadLine = '${headline}', Introduction = '${intro}', Motivate = '${motivation}', Password = '${pwd}', IdVerified = '${null}', BackgroundVerified = '${null}' WHERE CONVERT(VARCHAR, AcademyId) = '${acadId}'`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }

}

let post_form_two = async (req, res) => {

    let { level, university1, university2, university3, degree, degreeFile, certificate, certificateFile, language, state2, state3, state4, state5, state6, doctorateState, experience, graduagteYr1, graduagteYr2, graduagteYr3, doctorateGraduateYear, expiration, otherang, workExperience, user_id } = req.body;


    let duplicate = await connecteToDB.then(async (poolConnection) => {
        return await poolConnection.request().query(`SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${user_id}'`)
            .then((result) => {

                return result.recordset
            })
            .catch(err => console.log(err))
    });

    if (!duplicate.length) {
        marom_db(async (config) => {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                var resultSet = poolConnection.request().query(
                    `
                        INSERT INTO "Education"(EducationalLevel, EducationalLevelExperience, College1, 
                            College1State, College1Year, College2, College2State, College2StateYear, 
                            DoctorateCollege, DoctorateState, DoctorateGradYr, Degree,DegreeFile, DegreeState, 
                            DegreeYear, Certificate,CertificateFile, CertificateState, CertificateExpiration, NativeLang, NativeLangState, NativeLangOtherLang, WorkExperience, AcademyId)
                        VALUES ('${level}', '${experience}', '${university1}',
                        '${state2}','${graduagteYr1}','${university2}','${state3}','${graduagteYr2}',
                        '${university3}','${doctorateState}','${doctorateState}','${degree}', '${degreeFile}','${state4}',
                        '${graduagteYr3}','${certificate}','${certificateFile}','${state5}','${expiration}','${language}','${state6}','${otherang}','${workExperience}', '${user_id}')
                        `
                )

                resultSet.then((result) => {

                    result.rowsAffected[0] === 1
                        ?
                        res.send(true)
                        :
                        res.send(false)

                })
                    .catch((err) => {
                        console.log(err);
                        res.send(false)
                    })

            }

        })
    } else {
        marom_db(async (config) => {
            const sql = require('mssql');
            console.log('uploading data...')

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                var resultSet = poolConnection.request().query(
                    `
                        UPDATE  "Education" SET EducationalLevel = '${level}', EducationalLevelExperience = '${experience}',
                         College1 = '${university1}', DoctorateCollege = '${university3}',DoctorateState = '${doctorateState}', 
                         DoctorateGradYr='${doctorateGraduateYear}',
                        College1State = '${state2}', College1Year = '${graduagteYr1}', College2 ='${university2}',
                         College2State = '${state3}', College2StateYear = '${graduagteYr2}', Degree = '${degree}',
                         DegreeState ='${state4}', DegreeYear = '${graduagteYr3}', Certificate = '${certificate}',
                          CertificateState = '${state5}', CertificateExpiration = '${expiration}', NativeLang = '${language}', 
                          NativeLangState = '${state6}', NativeLangOtherLang = '${otherang}', WorkExperience = '${workExperience}',
                          CertificateFile = '${certificateFile}', DegreeFile='${degreeFile}'
                          WHERE CONVERT(VARCHAR, AcademyId) = '${user_id}'
                        `
                )

                resultSet.then((result) => {

                    result.rowsAffected[0] === 1
                        ?
                        res.send(true)
                        :
                        res.send(false)

                })
                    .catch((err) => {
                        console.log(err);
                        res.send(false)
                    })

            }

        })
    }
}

let post_form_three = (req, res) => {


    let { MutiStudentHourlyRate, IntroSessionDiscount, CancellationPolicy,
        FreeDemoLesson, ConsentRecordingLesson, ActivateSubscriptionOption,
        SubscriptionPlan, AcademyId, DiscountCode, CodeShareable, MultiStudent } = req.body;
    marom_db(async (config) => {
        try {

            const sql = require('mssql');
            console.log('uploading data...')

            var poolConnection = await sql.connect(config);
            let result;
            if (poolConnection) {

                let recordExisted = await poolConnection.request().query(
                    findByAnyIdColumn('TutorRates', { AcademyId }, 'varchar')
                )
                if (recordExisted.recordset.length) {
                    result = await poolConnection.request().query(
                        `UPDATE TutorRates 
                        SET MutiStudentHourlyRate = '${MutiStudentHourlyRate}', 
                        CancellationPolicy = '${CancellationPolicy}', 
                        FreeDemoLesson = '${FreeDemoLesson}',
                         ConsentRecordingLesson = '${ConsentRecordingLesson}',
                          ActivateSubscriptionOption = '${ActivateSubscriptionOption}', 
                          SubscriptionPlan = '${SubscriptionPlan}',
                           DiscountCode = '${DiscountCode}', 
                           CodeShareable=${CodeShareable ? 1 : 0},  
                           MultiStudent=${MultiStudent ? 1 : 0},
                           IntroSessionDiscount=${IntroSessionDiscount ? 1 : 0}
                         WHERE cast(AcademyId as varchar) = '${AcademyId}'`
                    )
                } else {
                    result = await poolConnection.request().query(
                        `
                            INSERT INTO "TutorRates"
                            (MutiStudentHourlyRate,CancellationPolicy,FreeDemoLesson,
                                ConsentRecordingLesson,ActivateSubscriptionOption,
                                SubscriptionPlan,AcademyId, DiscountCode,MultiStudent,
                                CodeShareable,IntroSessionDiscount)
                            VALUES ( '${MutiStudentHourlyRate}', 
                            '${CancellationPolicy}','${FreeDemoLesson}',
                            '${ConsentRecordingLesson}','${ActivateSubscriptionOption}',
                            '${SubscriptionPlan}','${AcademyId}','${DiscountCode}',${MultiStudent ? 1 : 0},
                            ${CodeShareable ? 1 : 0},${IntroSessionDiscount ? 1 : 0})
                            `
                    )
                }

                {/* console.log(result) */ }
                result.rowsAffected[0] === 1
                    ?
                    res.send({ bool: true, mssg: 'Data Was Successfully Saved' })
                    :
                    res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })
            }
        }
        catch (err) {
            console.log(err)
            res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })
        }

    })
}


let get_countries = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT Country FROM Countries
                `
            )

            res.send(resultSet)


        }

    })

}

let get_state = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM States
                `
            )

            res.send(resultSet)


        }

    })
}



let get_gmt = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM GMT
                `
            )

            res.send(resultSet)


        }

    })
}


let get_experience = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM Experience
                `
            )

            res.send(resultSet)


        }

    })
}



let get_level = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM EducationalLevel
                `
            )

            res.send(resultSet)


        }

    })
}


let get_degree = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM Degree
                `
            )

            res.send(resultSet)


        }

    })
}

let get_certificates = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM CertificateTypes
                `
            )

            res.send(resultSet)


        }

    })
}

let get_response = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM ResponseTime
                `
            )

            res.send(resultSet)


        }

    })
}

let get_user_data = (req, res) => {
    let { user_id } = req.query;
    console.log(user_id)
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT EducationalLevel, EducationalLevelExperience, Certificate, CertificateState, CertificateExpiration, AcademyId  From Education  WHERE CONVERT(VARCHAR(max), AcademyId) = '${user_id}'
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}

let upload_tutor_rates = (req, res) => {

    try {
        let { rate_list, AcademyId } = req.body;

        let book = []

        let data = rate_list.map(async (item, index) => {

            let action = async cb => {
                await marom_db(async (config) => {
                    const sql = require('mssql');
                    var poolConnection = await sql.connect(config);

                    let result = poolConnection ? await get_action(poolConnection, item) : 'connection error';
                    cb(result, index);

                })
            }


            let response = action(async (result, index) => {

                if (result) {

                    try {
                        await marom_db(async (config) => {
                            const sql = require('mssql');
                            var poolConnection = await sql.connect(config);

                            let result = poolConnection ? await insert_rates(poolConnection, item) : 'connection error';

                            book.push(result)
                            if (book.length > (rate_list.length / 2)) {

                                res.status(200).send(true)
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }

                } else {

                    try {
                        await marom_db(async (config) => {
                            const sql = require('mssql');
                            var poolConnection = await sql.connect(config);

                            let result = poolConnection ? await update_rates(poolConnection, item) : 'connection error';

                            book.push(result)
                            if (book.length > (rate_list.length / 2)) {
                                res.status(200).send(true)
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }


                }
            })

        })

        let get_action = async (poolConnection, item) => {
            let records = await poolConnection.request().query(`SELECT * FROM "SubjectRates"`)
            let get_duplicate = await records.recordset.filter(file => file.subject === item.course && file.AcademyId === AcademyId);

            let result = get_duplicate.length > 0 ? false : true;
            return (result);
        }

        let insert_rates = async (poolConnection, item) => {
            let records = await poolConnection.request().query(`INSERT INTO "SubjectRates"(faculty, subject, rate, AcademyId) VALUES('${item.faculty}','${item.course}','${item.rate}','${AcademyId}') `)

            let result = await records.rowsAffected[0] === 1 ? true : false

            return (result);
        }

        let update_rates = async (poolConnection, item) => {
            let records = await poolConnection.request().query(`UPDATE "SubjectRates" set faculty='${item.faculty}', subject='${item.course}', rate='${item.rate}'  WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' AND CONVERT(VARCHAR, subject) = '${item.course}' `)

            let result = await records.rowsAffected[0] === 1 ? true : false
            return (result);

        }

    } catch (err) {
        console.log('Error message', err)
    }

}

let upload_form_four = (req, res) => {

    let { start_day, acct_name, acct_type, bank_name, acct, routing, ssh,
        accumulated_hrs, commission, total_earning, payment_option, AcademyId } = req.body;

    let checker = (cb) => {

        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);
            let response = poolConnection ? await poolConnection.request().query(`SELECT * FROM "TutorBank" WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}'`) : 'err conneecting to db'

            cb(response.rowsAffected[0])
        })

    }

    checker((data) => {
        if (data < 1) {

            let db = marom_db(async (config) => {
                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                let result = poolConnection ? await insert_bank_details(poolConnection) : 'connection error';


                if (result) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            })

        } else {
            let db = marom_db(async (config) => {
                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                let result = poolConnection ? await update_bank_details(poolConnection) : 'connection error';


                if (result) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            })
        }
    })

    let insert_bank_details = async (poolConnection) => {
        let records = await poolConnection.request().query(`INSERT INTO "TutorBank"
        (AccountName,AccountType,BankName,Account,Routing,SSH,AccumulatedHrs,Commission,
            TotalEarning,PaymentOption,TutorStartDay,AcademyId)
        VALUES ('${acct_name}', '${acct_type}','${bank_name}','${acct}','${routing}',
        '${ssh}','${accumulated_hrs}','${commission}', '${total_earning}','${payment_option}',
         '${start_day}', '${AcademyId}')`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }

    let update_bank_details = async (poolConnection) => {
        let records = await poolConnection.request().query(
            `
                UPDATE "TutorBank" set AccountName = '${acct_name}', AccountType = '${acct_type}', BankName = '${bank_name}', Account = '${acct}', Routing = '${routing}', SSH = '${ssh}', AccumulatedHrs = '${accumulated_hrs}', Commission = '${commission}', TotalEarning = '${total_earning}', PaymentOption = '${payment_option}'  WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}'
            `
        )

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);

    }

}

let get_my_data = async (req, res) => {
    let { AcademyId } = req.query;
    let books = []


    let response_0 = (resolve) => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            poolConnection.request().query(`SELECT * from TutorSetup WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
                .then((result) => {
                    books.push(result.recordsets);
                    resolve()
                })
                .catch((err) => err);
        })
    }

    let response_1 = (resolve) => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            poolConnection.request().query(`SELECT * from Education WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
                .then((result) => {
                    books.push(result.recordsets);
                    resolve()
                })
                .catch((err) => err);
        })
    }

    let response_2 = (cb) => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            poolConnection.request().query(`SELECT * from TutorRates WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
                .then((result) => {
                    books.push(result.recordsets);
                    cb()
                })
                .catch((err) => err);
        })
    }


    let sender = (cb) => {

        new Promise((resolve) => {
            response_1(resolve)
        })
            .then(() => {
                response_2(cb)
            })
            .catch(err => console.log(err))
    }

    sender(() => {
        new Promise((resolve) => {
            response_0(resolve)
        })

            .catch(err => console.log(err))
            .finally(() => {
                res.send(books)
            })
    })

}


let get_rates = (req, res) => {
    let { AcademyId } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From SubjectRates WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}

let get_tutor_rates = (req, res) => {
    let { AcademyId } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From TutorRates WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}

let faculties = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From Faculty  
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}

let get_bank_details = (req, res) => {
    let { AcademyId } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From TutorBank WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}


let get_tutor_setup = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                findByAnyIdColumn('TutorSetup', req.query, 'varchar(max)')
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}

let get_my_edu = (req, res) => {
    let { AcademyId } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                findByAnyIdColumn('Education', req.query, 'varchar(max)')
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).send(err)
                })
        }

    })
}

//related to booking slot and student section
let storeEvents = (req, res) => {
    try {
        const { end, start, title } = req.body;

        marom_db(async (config) => {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                poolConnection.request().query(
                    `
                   INSERT INTO EVENTS (endTime, startTime, title) VALUES ('${end}','${start}', '${title}')
                `
                )
                    .then((result) => {
                        res.status(200).send(result);
                    })
                    .catch(err => console.log(err, 'ERR!23'))
            }

        })
    } catch (error) {
        console.error("Error storing event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

let storeCalenderTutorRecord = (req, res) => {
    const { id } = req.params;
    try {
        marom_db(async (config) => {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                poolConnection.request().query(
                    updateById(id, 'TutorSetup', req.body)
                )
                    .then((result) => {
                        res.status(200).send(result.recordset);
                    })
                    .catch(err => console.log(err))
            }
        })
    } catch (error) {
        console.error("Error Updating TutorSetup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

let get_tutor_status = (req, res) => {
    let { AcademyId } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT Status From TutorSetup WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}

let fetchStudentsBookings = (req, res) => {
    try {
        const { tutorId } = req.params;
        marom_db(async (config) => {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                poolConnection.request().query(
                    find('StudentBookings', { tutorId })
                )
                    .then((result) => {
                        res.status(200).send(result.recordset);
                    })
                    .catch(err => {
                        res.status(400).json({ message: err.message });
                    })
            }
        })
    } catch (error) {
        console.error("Error storing Events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const post_tutor_setup = (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const findtutorSetup = await poolConnection.request().query(
                    findByAnyIdColumn('TutorSetup', { userId: req.body.userId })
                );
                if (findtutorSetup.recordset.length) {
                    delete req.body["AcademyId"]
                    const updated = await poolConnection.request().query(
                        update('TutorSetup', req.body, { AcademyId: findtutorSetup.recordset[0].AcademyId })
                    );
                    if (updated.rowsAffected[0]) {
                        const result = await poolConnection.request().query(
                            findByAnyIdColumn("TutorSetup", { AcademyId: findtutorSetup.recordset[0].AcademyId })
                        );
                        console.log(result, 'resd')
                        res.status(200).send(result.recordset);
                    }
                    else
                        res.status(200).send([]);
                }
                else {
                    req.body.AcademyId = req.body.MiddleName.length > 0 ?
                        req.body.FirstName + '.' + ' ' + req.body.MiddleName[0] + '.' + ' ' +
                        req.body.LastName[0] + shortId.generate() :
                        req.body.FirstName + '.' + ' ' + req.body.LastName[0] + shortId.generate();

                    const result = await poolConnection.request().query(
                        insert('TutorSetup', req.body)
                    );
                    res.status(200).send(result.recordset);
                }
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

let get_tutor_market_data = async (req, res) => {

    let { id } = req.query;

    let TutortData = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From TutorSetup WHERE CONVERT(VARCHAR, AcademyId) =  '${id}'`)
            .then((result) => {
                return (result.recordset);
            })
            .catch(err => console.log(err))
    )

    let Education = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From Education WHERE CONVERT(VARCHAR, AcademyId) =  '${id}'`)
            .then((result) => {

                return (result.recordset);
            })
            .catch(err => console.log(err))

    )

    let Exprience = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From Experience `)
            .then((result) => {

                return (result.recordset);
            })
            .catch(err => console.log(err))

    )

    let EducationalLevel = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From EducationalLevel `)
            .then((result) => {

                return (result.recordset);
            })
            .catch(err => console.log(err))
    )

    let CertificateTypes = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM CertificateTypes `)
            .then((result) => {

                return (result.recordset);
            })
            .catch(err => console.log(err))

    )

    let Subjects = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM SubjectRates WHERE CONVERT(VARCHAR, AcademyId) =  '${id}'`)
            .then((result) => {

                return (result.recordset);
            })
            .catch(err => console.log(err))
    )

    let Faculty = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM Faculty `)
            .then((result) => {

                return (result.recordset);
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err))
    )

    let GMT = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM GMT`)
            .then((result) => {

                return (result.recordset);
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err))
    )

    new Promise((resolve, reject) => {
        resolve(TutortData)
    })
        .then((TutortData) => {
            return { TutortData, Exprience }
        })
        .then(({ TutortData, Exprience }) => {
            return { TutortData, EducationalLevel, Exprience }
        })
        .then(({ TutortData, EducationalLevel, Exprience }) => {
            return { TutortData, EducationalLevel, Exprience, CertificateTypes }
        })
        .then(({ TutortData, EducationalLevel, Exprience, CertificateTypes }) => {
            return { TutortData, EducationalLevel, Exprience, CertificateTypes, Subjects }
        })
        .then(({ TutortData, EducationalLevel, Exprience, CertificateTypes, Subjects }) => {
            return { TutortData, EducationalLevel, Exprience, CertificateTypes, Subjects, Faculty }
        })
        .then(({ TutortData, EducationalLevel, Exprience, CertificateTypes, Subjects }) => {
            return { TutortData, EducationalLevel, Exprience, CertificateTypes, Subjects, Faculty, GMT }
        })
        .then(({ TutortData, EducationalLevel, Exprience, CertificateTypes, Subjects }) => {
            return { TutortData, EducationalLevel, Exprience, CertificateTypes, Subjects, Faculty, Education }
        })
        .then((result) => {
            res.send(result)
        })
        .cach(e => {
            console.log(e)
        })


}


module.exports = {
    subjects,
    get_tutor_market_data,
    post_tutor_setup,
    faculties,
    post_form_one,
    post_form_two,
    post_form_three,
    get_countries,
    get_gmt,
    post_new_subject,
    get_state,
    get_experience,
    get_degree,
    get_level,
    get_certificates,
    get_user_data,
    get_response,
    upload_tutor_rates,
    get_my_data,
    get_my_edu,
    get_rates,
    upload_form_four,
    get_tutor_setup,
    get_tutor_rates,
    get_bank_details,
    storeEvents,
    fetchStudentsBookings,
    storeCalenderTutorRecord,
    get_tutor_status
}
