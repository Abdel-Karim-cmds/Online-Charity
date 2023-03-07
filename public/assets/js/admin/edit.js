var ID;
const path = window.location.href.split('/')
const table = path[3]
const id = path[5]
if (table === 'donors')
    document.getElementById('organization').style.display = 'none'
else
    document.getElementById('donors').style.display = 'none'

console.log(table);
console.log(id);
(async function getData() {
    const response = await fetch(`/get-data?table=${table}&id=${id}`)
    const data = await response.json()
    ID = data.Donor_ID || data.Organization_ID
    table === 'donors' ? FillDonor(data) : FillOrg(data)

})()

function FillDonor(values) {
    console.log(values)
    document.getElementById('Fname').value = values.First_Name
    document.getElementById('Lname').value = values.Last_Name
    document.getElementById('Phone').value = values.Phone
    document.getElementById('emailD').value = values.Email
}

function FillOrg(values) {
    // console.log(values.Email)
    // console.log(document.getElementById('orgEmail'));
    document.getElementById('Name').value = values.Name
    document.getElementById('orgEmail').value = values.Email
    document.getElementById('Description').value = values.Description
    document.getElementById('PhoneO').value = values.Phone
    document.getElementById('Address').value = values.Address
}

// document.querySelector('form').addEventListener('click', e => {
//     e.preventDefault()
// })


document.getElementById('donors').addEventListener('submit', e => {
    e.preventDefault()
})

document.getElementById('organization').addEventListener('submit', e => {
    e.preventDefault()
})

document.getElementById('confirm').addEventListener('click', e => {
    e.preventDefault()
    console.log(2);
    table === 'donors' ? editDonors() : editOrganization()

})

async function editDonors() {
    const data = {
        Fname: document.getElementById('Fname').value,
        Lname: document.getElementById('Lname').value,
        Phone: document.getElementById('Phone').value,
        Email: document.getElementById('emailD').value
    }
    const response = await fetch('/update-details?table=donors&id=' + ID, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const outcome = await response.json()
    if (response.status) {
        document.getElementById('sometext').innerText = outcome.message
        document.getElementById('unique').click()
        setTimeout(() => { location.reload() }, 2000)
    }
}

async function editOrganization() {
    const data = {
        Name: document.getElementById('Name').value,
        Email: document.getElementById('orgEmail').value,
        Description: document.getElementById('Description').value,
        Phone: document.getElementById('PhoneO').value,
        Address: document.getElementById('Address').value,
    }
    const response = await fetch('/update-details?table=organizations&id=' + ID, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const outcome = await response.json()
    if (response.status) {
        document.getElementById('sometext').innerText = outcome.message
        document.getElementById('unique').click()
        setTimeout(() => { location.reload() }, 2000)
    }
}