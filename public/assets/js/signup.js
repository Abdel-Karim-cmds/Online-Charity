function toggleForm() {
    let container = document.querySelector('.container');
    let section = document.querySelector('section');
    container.classList.toggle('active');
    section.classList.toggle('active');
}

function display(message) {
    let err = document.querySelector('.pop-up')
    err.classList.toggle('hide')
    let Message = document.querySelector('.message')
    Message.innerText = message
}

if (document.getElementById('close')) {
    let close_btn = document.getElementById('close')
    close_btn.onclick = () => {
        document.querySelector('.pop-up').classList.toggle('hide')
    }
}

//Function to check email
function checkEmail(email) {

    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email)) {
        // alert('Please provide a valid email address');
        display('Please provide a valid email address')
        return false;
    } else {
        return true;
    }
}

//function to signup Donors
async function SingUp_Donors() {
    const url = '/signup-donor'
    const data = {
        Donor_Fname: document.getElementById('donor_Fname').value,
        Donor_Lname: document.getElementById('donor_Lname').value,
        Donor_Email: document.getElementById('donor_email').value,
        Donor_Number: document.getElementById('donor_number').value,
        Donor_Password: document.getElementById('donor_password').value,
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    const outcome = await response.json();
    if (response.status === 401)
        display(outcome.message)
    if (response.status === 200)
        display("New Donor added")
        setTimeout(()=>{window.location.href = '/login-page'},2000)

}

//function to signup  Organizations
async function SingUp_Organizations() {
    const url = '/signup-organization'
    const data = {
        Organization_Name: document.getElementById('organization_name').value,
        Organization_Email: document.getElementById('organization_email').value,
        Organization_Password: document.getElementById('organization_password').value,
        Organization_Number: document.getElementById('organization_number').value,
        Organization_Description: document.getElementById('organization_description').value,
        Organization_Address: document.getElementById('organization_address').value
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    const outcome = await response.json();
    if (response.status === 401)
        display(outcome.message)
    if (response.status === 200)
        display("New Organization added")
}

async function Login() {
    const url = '/login'
    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        type_of_user: document.getElementsByName('type_of_user').values
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url, options)
    const outcome = await response.json();
    if (response.status === 401)
        display(outcome.message)
}

document.getElementById('Donor').addEventListener('submit', e => {
    e.preventDefault()
        // console.log(document.getElementById('donor_password').value);
        // console.log(document.getElementById('donor_password2').value);
    checkEmail(document.getElementById('donor_email').value)
    if (document.getElementById('donor_password').value !== document.getElementById('donor_password2').value)
        display('Your two passwords are not the same')
    else if (document.getElementById('donor_number').value.length < 10 || document.getElementById('donor_number').value.length > 15)
        display('Phone number should have between 10 and 15 characters')
    else if (document.getElementById('donor_password').value.length < 8)
        display('Password should be at least 8 characters')
    else
        SingUp_Donors()
})

document.getElementById('Ogranization').addEventListener('submit', e => {
    e.preventDefault()
    checkEmail(document.getElementById('organization_email').value)
    if (document.getElementById('organization_password').value !== document.getElementById('organization_password2').value)
        display('Your two passwords are not the same')
    else if (document.getElementById('organization_number').value.length < 10 || document.getElementById('organization_number').value.length > 15)
        display('Phone number should have between 10 and 15 characters')
    else if (document.getElementById('organization_password').value.length < 8)
        display('Password should be at least 8 characters')

    else
        SingUp_Organizations()
})