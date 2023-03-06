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

// Function to sign up the customer
async function signupCustomer() {
    let fname = document.getElementById('Fname').value
    let lname = document.getElementById('Lname').value
    let uemail = document.getElementById('uEmail').value
    let upass = document.getElementById('uPass').value

    const url = "/signupC";
    const customerInfo = {
        Fname: fname,
        Lname: lname,
        uEmail: uemail,
        uPass: upass,
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customerInfo),
    };
    const response = await fetch(url, options);
    const outcome = await response.json();
    display(outcome.message)

    //Reset the form and go back to the sign in page
    if (response.status == 200) {
        toggleForm()
        document.getElementById('customer').reset();
    }
}

//Function to sign up the business
async function signupBusiness() {
    let ofn = document.getElementById('OFN').value;
    let oln = document.getElementById('OLN').value;
    let bname = document.getElementById('Bname').value;
    let email = document.getElementById('bEmail').value;
    let bpass = document.getElementById('bPass').value;
    const url = "/signupB";
    const businessInfo = {
        OFName: ofn,
        OLName: oln,
        Bname: bname,
        Email: email,
        Bpass: bpass
    };

    console.log("Right here")
    console.log(businessInfo)
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(businessInfo),
    };
    const response = await fetch(url, options);
    const outcome = await response.json();
    display(outcome.message)

    //Reset the form and go back to the sign in page
    if (response.status == 200) {
        toggleForm()
        document.getElementById('business').reset();
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

//Sign up form validation for the customer
if (document.getElementById('customer')) {
    document.getElementById('customer').addEventListener('submit', (e) => {
        e.preventDefault();
        let upass = document.getElementById('uPass').value
        let cpass = document.getElementById('cuPass').value
        let uEmail = document.getElementById('uEmail').value;
        if (cpass != upass) {
            return display('Password are not the same')
        } else {
            if (upass.length < 8) {
                return display('Password length should be at least 8 characters')
            }
        }
        // if()
        // checkEmail(uEmail)
        if (checkEmail(uEmail)) {
            signupCustomer();
        }
    })
}

//Sign up form validation for the business
if (document.getElementById('business')) {
    document.getElementById('business').addEventListener('submit', (e) => {
        e.preventDefault();
        let pass1 = document.getElementById('bPass').value
        let pass2 = document.getElementById('buPass').value
        let bEmail = document.getElementById('bEmail').value
        if (pass1 != pass2) {
            return display('Password are not the same')
        } else {
            if (pass1.length < 8) {
                return display('Password length should be at least 8 characters')
            }
        }
        if (checkEmail(bEmail)) {
            signupBusiness();
        }
    })
}