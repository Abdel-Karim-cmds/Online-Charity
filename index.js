// Import required packages
const express = require('express')
const port = 3000
const app = express()
    // const path = require('path')
const mysql = require('mysql')
const bodyparser = require("body-parser");
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ entended: false }))
const crypto = require('crypto')
    // const cryptoJS = require('crypto-js')
    // const CryptoJS = require('cryptojs')
    // const bcrypt = require('bcrypt')
const uuid4 = require('uuid4')

const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const { log } = require('console');
const moment = require('moment')
const filestore = require("session-file-store")(sessions)
const oneDay = 1000 * 60 * 60 * 24;
const oneHour = 1000 * 60 * 60;
const oneMinute = 1000 * 60;


// Setting up the project
app.set('views', 'views') // Where the pages are going to be stored
app.set('view engine', 'hbs') // The view engine used
app.use(express.static('public')) //The folder for the assests


// cookie parser middleware
app.use(cookieParser());

//session middleware
app.use(sessions({
    name: "User_Session",
    secret: "8Ge2xLWOImX2HP7R1jVy9AmIT0ZN68oSH4QXIyRZyVqtcl4z1I",
    saveUninitialized: false,
    cookie: { maxAge: oneDay, httpOnly: false },
    resave: false,
    store: new filestore({ logFn: function() {} }),
    path: "./sessions/"
}));

var session;
var message

//mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'online_charity',
    // port: '3308'
});

//establish the connection to the database
connection.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully!');
});

// The Home page
app.get('/', (request, response) => {
    response.render('home')
})

//Login Page
app.get('/login-page', (request, response) => {
    const { user } = request.cookies

    if (user === 'donor')
        return response.redirect('/')
    if (user === 'organization')
        return response.redirect('/organization-profile')
    response.render('login_page', { message: message })
})

//Signup Page
app.get('/sign-up-page', (request, response) => {
    response.render('SignUp')
})

//Admin dashboard
app.get('/dashboard', (request, response) => {
    console.log(request.cookies);
    const { user } = request.cookies
    if (user !== 'admin')
        response.redirect('/')
    response.render('./admin/Admin-dashboard')
})

//Admin donor dashboard
app.get('/admin-donor', (request, response) => {
    response.render('./admin/admin-donor')
})

// Donor's profile
app.get('/my-profile', (request, response) => {
    response.render('./Donors/Donor_profile')
})

//Donate
app.get('/donate', (request, response) => {
        response.render('./Donors/Donate')
    })
    //donation
app.get('/organization-profile', (request, response) => {

    const { user } = request.cookies
    if (user !== 'organization')
        response.redirect('/')
    response.render('./Organization/Organization_home')
})

// Getting the Page for creating a donation
app.get('/organization-profile/create-donation', (request, response) => {
    response.render('./Organization/Create_donation')
})

//Post a donation
app.post('/create-donation', (request, response) => {
    // console.log(request.body);
    const { date, item } = request.body
        // console.log(session.user.Organization_ID)
    const orgID = request.session.user.Organization_ID
        // console.log(new Date(date).toLocaleDateString())
    const ending = new Date(date)
        // const someDate = moment(date).format('YYYY-MM-DD')
        // log(someDate)
        // const theEnd = ending.toISOString().split('T')[0]
    const theEnd = moment(ending, 'YYYY-MM-DD', 'UTC').format()
    console.log(item)
    const now = new Date()
        // const today = now.toISOString().split('T')[0]
    const today = moment(now, 'YYYY-MM-DD', 'UTC').format()
    console.log(`Today is ${today}`);
    console.log(`The end is ${theEnd}`);
    // console.log(new Date().toLocaleDateString())
    try {
        connection.query(`INSERT INTO donations_posted values ('${uuid4()}','${orgID}', '${today}', '${theEnd}', '${item}')`, (err, result) => {
            // connection.query(`INSERT INTO donations_posted values ('${uuid4()}','something', '${today}', '${theEnd}', '${item}')`, (err, result) => {
            if (err) {
                console.log(err);
                return response.status(401).json({
                    message: 'Something went wrong'
                })
            }

            console.log("Record inserted")
            return response.status(200).json({
                message: 'Donation was created successfully'
            })
        })

    } catch (error) {
        log("here")
        console.log("Sadly there was an error")
    }
})

//Charities
app.get('/charity', (request, response) => {
    response.render('Charities')
})

//Organization viewing their donations
app.get("/organization-profile/view-donation-posted", (request, response) => {
    response.render('./Organization/donations_posted')
})

//Get method to send the donations posted by an organization
app.get('/get-donations', (request, response) => {

    // log("Here")
    const { origin } = request.query
        // log(origin)
    let orgID;
    try {
        orgID = request.session.user.Organization_ID || ''
    } catch (error) {
        log("Nothing to see here")
    }

    let sql = `SELECT * FROM donations_posted where Organization_ID = '${orgID}'`;
    let sql2 = `SELECT donations_posted.Donation_ID, donations_posted.Date_Posted, donations_posted.Items_needed, donations_posted.Date_Ending, organizations.Name, organizations.Email FROM donations_posted INNER JOIN organizations on donations_posted.Organization_ID = organizations.Organization_ID ORDER BY donations_posted.Date_Posted`
    connection.query(origin ? sql : sql2, function(err, rows, fields) {
        if (err) throw err;
        // decEmail("Yo")
        var results = rows;
        var res = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            element.Date_Posted = JSON.parse(JSON.stringify(moment(element.Date_Posted, 'YYYY-MM-DD', 'UTC').format()))
            element.Date_Ending = JSON.parse(JSON.stringify(moment(element.Date_Ending, 'YYYY-MM-DD', 'UTC').format()))
            if (element.Email)
                element.Email = decEmail(element.Email)
            res.push(element)
        }
        response.send(rows);
    });
})

app.delete('/delete-target', (request, response) => {
    log(request.query)
    const { Table, id } = request.query
    let donorSQL = `DELETE FROM donors where Donor_ID = '${id}'`
    let orgSQL = `DELETE FROM organizations where Organization_ID = '${id}'`
    connection.query(Table === 'organizations' ? orgSQL : donorSQL, (err, result) => {
        if (err) throw err
        console.log("Delete Successfully")
    })
    response.status(500).json({
        message: 'There was an error whlie deleting'
    })
})

app.get('/get-data', (request, response) => {
    log(request.query)
    const { table, id } = request.query
    let sql = `SELECT * FROM ${table} where Donor_ID = '${id}'`
    let sql2 = `SELECT * FROM ${table} where Organization_ID = '${id}'`

    connection.query(table === 'donors' ? sql : sql2, (error, result) => {
        if (error) throw error;
        let res = JSON.parse(JSON.stringify(result))[0]
        res.Email = decEmail(res.Email)
            // console.log(decEmail(JSON.parse(JSON.stringify(result))[0].Email))
            // log(res)
        response.send(res)
    })
})

app.get('/donate/:id', (request, response) => {
    const { user } = request.cookies
    if (user === 'donor')
        return response.render('donations/donate_form')
    return response.redirect('/login-page')
})

app.get('/donations', (request, response) => {
    log(request.query)
    const { id } = request.query
    let sql = `SELECT donations_posted.Donation_ID, donations_posted.Date_Posted, donations_posted.Items_needed, donations_posted.Date_Ending, organizations.Name, organizations.Email, organizations.Organization_ID FROM donations_posted INNER JOIN organizations on donations_posted.Organization_ID = organizations.Organization_ID WHERE donations_posted.Donation_ID = '${id}'`


    connection.query(sql, (error, result) => {
        // connection.query(`SELECT * FROM donations_posted where Donation_ID = '${id}'`, (error, result) => {
        if (error) throw error;
        console.log(result)
        response.send(result)
    })
})

//Function to update user details
app.put('/update-details', (request, response) => {
    log(2)
    log(request.body)
    log(request.query)
    const { table, id } = request.query
    const { Fname, Lname, Phone, Email, Name, Description, Address } = request.body
    const sql = `UPDATE donors SET First_Name = '${Fname}', Last_Name = '${Lname}', Phone = '${Phone}', Email = '${EncEmail(Email)}' where Donor_ID = '${id}'`
    const sql2 = `UPDATE organizations SET Name = '${Name}', Email = '${EncEmail(Email)}', Description = '${Description}', Address = '${Address}' where Organization_ID = '${id}'`;
    connection.query(table === 'donors' ? sql : sql2, (error, result) => {
        if (error) throw error;
        // console.log(result)
        console.log("Updated")
        return response.status(200).json({
            message: 'User updated successfully'
        })
    })
})

//Delete method to delete a donation by an organization
app.delete('/delete-donation', (request, response) => {
    // console.log(request.params)
    const { id } = request.query
    log(id)
    connection.query(`DELETE FROM donations_posted where Donation_ID = '${id}'`, (err, result) => {
        if (err) throw err;
        console.log("Successfully deleted")
            // response.status(200).json({
            //     message: 'Deleted succesffully'
            // })

    })
    response.status(500).json({
        message: 'There was an error whlie deleting'
    })
})

app.get('/view-donations_posted', (request, response) => {
    response.render('admin/admin-view-donations-posted')
})

app.get('/:table/edit/:id', (request, response) => {
    response.render('admin/edit')
})

app.post('/post-donation', (request, response) => {
    log(request.body)
})

//Function to signup the donor
app.post('/signup-donor', (request, response) => {
    // const { Donor_Password } = request.body
    // console.log(request.body)
    let Donor_info = request.body;
    Donor_info.Donor_Email = EncEmail(Donor_info.Donor_Email)
    Donor_info.Donor_Password = EncPass(Donor_info.Donor_Password)
    try {
        connection.query(`INSERT INTO donors values ('${uuid4()}','${Donor_info.Donor_Fname}', '${Donor_info.Donor_Lname}', '${Donor_info.Donor_Number}', '${Donor_info.Donor_Email}', '${Donor_info.Donor_Password}')`, (err, result) => {
            if (err) {
                return response.status(401).json({
                    message: 'Email already in use'
                })
            }

            console.log("Record inserted")
            return response.status(200).redirect(301, '/login-page')
                // response.redirect('/login-page')
        })

    } catch (error) {
        console.log("Sadly there was an error")
    }
})

//Function to signup the Orgnization
app.post('/signup-organization', (request, response) => {
    // const { Donor_Password } = request.body
    // console.log(request.body)
    let Organization_info = request.body
    Organization_info.Organization_Email = EncEmail(Organization_info.Organization_Email)
    Organization_info.Organization_Password = EncPass(Organization_info.Organization_Password)
    try {
        connection.query(`INSERT INTO organizations values ('${uuid4()}', '${Organization_info.Organization_Name}', '${Organization_info.Organization_Email}', '${Organization_info.Organization_Password}','${Organization_info.Organization_Description}', '${Organization_info.Organization_Number}', '${Organization_info.Organization_Address}')`, (err, result) => {

            if (err) {
                return response.status(401).json({
                    message: 'Organization name or email already in use'
                })
            }

            console.log("Organization Added")
                // console.log("Record inserted")
            return response.status(200).redirect(301, '/login-page')
        })

    } catch (error) {
        console.log("There was an unfortunate mistake")
    }
})

//Sign In
app.post('/login', async(request, response) => {
    console.log(request.body)
    const { type_of_user, email, password } = request.body

    if (email === 'admin@gmail.com' && password === 'admin123') {
        session = request.session
        session.user = request.body
        session.save()
        response.cookie('user', "admin")
        return response.redirect('/dashboard')
    }

    if (type_of_user === 'Donor') {
        connection.query('SELECT * FROM donors WHERE Email = ? AND Password = ?', [EncEmail(email), EncPass(password)], (error, results, fields) => {
            if (error) throw error;
            if (results.length) {

                session = request.session
                session.user = JSON.parse(JSON.stringify(results[0]))
                session.user.Email = decEmail(session.user.Email)
                console.log(session);
                session.save()
                response.cookie('user', 'donor')
                message = null
                return response.redirect('/my-profile')
            } else {
                message = 'User not found'
                return response.redirect('/login-page')
            }
        })

    } else {
        connection.query('SELECT * FROM organizations WHERE Email = ? AND Password = ?', [EncEmail(email), EncPass(password)], (error, results, fields) => {
            if (error) throw error;
            if (results.length) {
                session = request.session
                session.user = JSON.parse(JSON.stringify(results[0]))
                session.user.Email = decEmail(session.user.Email)
                session.save()
                response.cookie('user', 'organization')
                message = null
                response.redirect('/organization-profile')
            } else {
                message = 'User not found'
                return response.redirect('/login-page')
            }
        })
    }

})

//Signin
app.post('/sign-in', (request, response) => {
    // console.log(request.body)
    const { email, password } = request.body
        // console.log(EncEmail(email), EncPass(password))
    connection.query('SELECT * FROM donors WHERE Email = ? AND Password = ?', [EncEmail(email), EncPass(password)], (error, results, fields) => {
        if (error) throw error
        if (results.length) {
            //Create a session
            response.redirect('/')
        } else
            return response.status(401).json({
                message: 'User not found'
            })
    })
})


app.get('/Organization', (request, response) => {
    response.render('donations/organizations')
})

//Function to encrypt Emails
function EncEmail(email) {
    const secret = 'very-secret-email-password'
    let cipher = crypto.createCipher('aes-128-cbc', secret);
    let hash = cipher.update(email, 'utf8', 'hex')
    hash += cipher.final('hex');
    return hash
}

//Function to decrypt Emails
function decEmail(encryptedEmail) {
    const secret = 'very-secret-email-password'
    var mykey = crypto.createDecipher('aes-128-cbc', secret);
    var mystr = mykey.update(encryptedEmail, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}

//Function to encrypt Passwords
function EncPass(password) {
    const secret = 'very-secret-password-password'
    let cipher = crypto.createCipher('aes-128-cbc', secret);
    let hash = cipher.update(password, 'utf8', 'hex')
    hash += cipher.final('hex');
    return hash
}

//Function to decrypt Password
function decPassword(encryptedPassword) {
    const secret = 'very-secret-password-password'
    var mykey = crypto.createDecipher('aes-128-cbc', secret);
    var mystr = mykey.update(encryptedPassword, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}

//Logout route
app.get('/logout', (request, response) => {
    // console.log(request.session)
    // errmessage = ''
    // Sign-out successful.
    session = request.session
    session.destroy((err) => {
        message = null

        if (err) throw err;
        session = null;
        response.clearCookie('user')
        response.clearCookie('User_Session')
        response.redirect('/')
    })
})

//Send the List of organizations or donors
app.get('/get-info', (request, response) => {
    console.log(request.query);
    const { table } = request.query
    console.log(table);
    connection.query(`SELECT * FROM ${table}`, (err, rows, fileds) => {
        if (err) throw err;
        // response.send(rows)
        // console.log("*-*-*--*-*-*");
        let info = rows.map(item => {
            // console.log(JSON.parse(JSON.stringify(item)));
            item = JSON.parse(JSON.stringify(item))
                // console.log(item);
            item.Email = decEmail(item.Email)
            return item
        })

        // console.log("*********************");
        // console.log(info);
        response.send(info)
    })


    // console.log("YO")
    // console.log(req);
})

//send user session info
app.get('/get-session-user', (request, response) => {
    response.send(request.session.user)
})

//Not found page
app.get('*', (request, response) => {
    response.render('Not Found')
})


//Starting the project
app.listen(port, () => console.log(`Server is listening on port ${port}`))