const path = window.location.href.split('/')
const id = path[4]
var orgID;

console.log(path)
console.log(id)


function display(message) {
    let err = document.querySelector('.pop-up')
    err.classList.toggle('hide')
    let Message = document.querySelector('.message')
    Message.innerText = message
}

getDonation()

async function getDonation() {
    const response = await fetch('/donations?id=' + id)
    const data = await response.json()
    console.log(data)
    orgID = data[0].Organization_ID
    console.log(orgID)
    document.getElementById('name').innerText = data[0].Name
    document.getElementById('goal').innerText = data[0].Items_needed
    document.getElementById('date').innerText = data[0].Date_Ending.slice(0, 10)
}

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
        // console.log("1")
        // console.log(document.getElementById('items').value)
        // console.log(document.getElementById('amount').value)
    if (document.getElementById('amount').value == false) {
        // display("Please fill in the amount")
        document.getElementById('exampleModalLabel').innerText = 'Error'
        document.getElementById('message').innerText = 'Please fill in the amont'
        document.getElementById('unique').click()
        // console.log("Empty");
        // document.getElementById('unique').click()
    }
    else{

        postDonation()
    }
    // console.log(document.getElementById('anonymous').checked)
})

async function postDonation() {
    const data = {
        item: document.getElementById('items').value,
        amount: document.getElementById('amount').value,
        org: orgID,
        anonymous: document.getElementById('anonymous').checked ? 'YES' : 'NO'
    }
    console.log(data)
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const response = await fetch('/post-donation',options)

    const outcome = await response.json()
    if (response.status) {
        document.getElementById('exampleModalLabel').innerText = 'Success'
        document.getElementById('message').innerText = outcome.message
        document.getElementById('unique').click()
        setTimeout(() => { location.reload() }, 2000)
    }
}

document.getElementById('items').addEventListener('change', e=>{
    if(document.getElementById('items').value === 'Cash')
        document.getElementById('amount').setAttribute('placeholder','KSH')
    else if(document.getElementById('items').value === 'Food')
        document.getElementById('amount').setAttribute('placeholder','Kg')
    else
        document.getElementById('amount').setAttribute('placeholder','')
})