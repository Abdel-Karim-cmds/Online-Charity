var elementID;

(async function getDonations() {
    const response = await fetch('/get-donations?origin=organization')
    const data = await response.json()
    console.log(data);
    populateTable(data)
})()

function populateTable(donations) {
    const table = document.getElementById('table')
    donations.forEach(donation => {
        let row = document.createElement('tr')

        let donID = document.createElement('td')
        let textID = document.createTextNode(donation.Donation_ID)
        donID.appendChild(textID)

        let datePosted = document.createElement('td')
        let textdatePosted = document.createTextNode(donation.Date_Posted.slice(0, 10))
        datePosted.appendChild(textdatePosted)

        let dateEnding = document.createElement('td')
        let textEnding = document.createTextNode(donation.Date_Ending.slice(0, 10))
        dateEnding.appendChild(textEnding)

        let item = document.createElement('td')
        let textItem = document.createTextNode(donation.Items_needed)
        item.appendChild(textItem)

        let actions = document.createElement('td')

        let deleteButton = document.createElement('button')
        deleteButton.className = 'btn btn-success'
        deleteButton.setAttribute('onclick', 'doSomething(this)')
        deleteButton.setAttribute('data-toggle', 'modal')
        deleteButton.setAttribute('data-target', '#confirmBox')
        deleteButton.innerText = "DELETE"

        actions.appendChild(deleteButton)


        row.appendChild(donID)
        row.appendChild(datePosted)
        row.appendChild(dateEnding)
        row.appendChild(item)
        row.appendChild(actions)
        table.appendChild(row)
    })
}

function doSomething(element) {
    // console.log("element")
    let row = element.parentNode.parentNode
    let children = row.childNodes
    elementID = children[0].innerText
        // console.log(row)
    console.log(elementID)
    document.getElementById('donID').innerText = elementID
}

document.getElementById('confirm').addEventListener('click', e => {
    e.preventDefault()
    console.log("Confirmed")
    deleteDonation()
})

async function deleteDonation() {
    console.log("Yes")
    console.log(elementID);
    // const response = await fetch(`/delete-donation/${elementID}`, { method: 'DELETE' })
    const response = await fetch(`/delete-donation?id=${elementID}`, { method: 'DELETE' })
    const outcome = await response.json()
    if (response.status) {
        document.getElementById('sometext').innerText = outcome.message
        document.getElementById('unique').click()
        setTimeout(() => { location.reload() }, 2000)
    }
}

function doRedirect(element) {
    let row = element.parentNode.parentNode
    let children = row.childNodes
    elementID = children[0].innerText
    console.log(elementID);
}