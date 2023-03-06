var ID;
const path = window.location.href.split('/')
const table = path[3]
const id = path[5]
console.log(table);
console.log(id);
(async function getData() {
    const response = await fetch(`/get-data?table=${table}&id=${id}`)
    const data = await response.json()
    ID = data.Donor_ID
    makeForm(data)

})()

function makeForm(values) {
    console.log(values)
    document.getElementById('Fname').value = values.First_Name
    document.getElementById('Lname').value = values.Last_Name
    document.getElementById('Phone').value = values.Phone
    document.getElementById('email').value = values.Email
}

document.querySelector('form').addEventListener('click', e => {
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
        Email: document.getElementById('email').value
    }
    const response = await fetch('/update-details?table=donors&id=' + ID, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

async function editOrganization() {
    console.log("I am an organization");
}