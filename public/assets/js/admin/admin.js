var elementID;
var Table
async function getInfo(table) {
    const url = '/get-info'
    const response = await fetch(url + `?table=${table}`, { method: 'GET' })
    const data = await response.json()
    console.log(data);
    table === 'organizations' && populateOrganization(data)
    table === 'donors' && populateDonors(data)
    Table = table;
}

function populateOrganization(organizations) {
    let table = document.getElementById('table')
    for (let index = 0; index < organizations.length; index++) {
        const element = organizations[index]
        let row = document.createElement('tr')

        let Org_ID = document.createElement('td')
        let text_OrgID = document.createTextNode(element.Organization_ID)
        Org_ID.appendChild(text_OrgID)

        let Org_name = document.createElement('td')
        let text_OrgName = document.createTextNode(element.Name)
        Org_name.appendChild(text_OrgName)

        let Org_Email = document.createElement('td')
        let text_OrgEmail = document.createTextNode(element.Email)
        Org_Email.appendChild(text_OrgEmail)

        let Org_Desc = document.createElement('td')
        let text_OrgDesc = document.createTextNode(element.Description)
        Org_Desc.appendChild(text_OrgDesc)

        let Org_Address = document.createElement('td')
        let text_OrgAddress = document.createTextNode(element.Address)
        Org_Address.appendChild(text_OrgAddress)

        let Org_Phone = document.createElement('td')
        let text_OrgPhone = document.createTextNode(element.Phone)
        Org_Phone.appendChild(text_OrgPhone)


        let actions = document.createElement('td')
        let deleteButton = document.createElement('button')
        deleteButton.className = 'btn btn-success ml-2'
        deleteButton.setAttribute('onclick', 'doSomething(this)')
        deleteButton.setAttribute('data-toggle', 'modal')
        deleteButton.setAttribute('data-target', '#confirmBox')
        deleteButton.innerText = "DELETE"



        let editButton = document.createElement('a')
        editButton.className = 'btn btn-warning'
        editButton.innerText = "EDIT"
        editButton.setAttribute('onclick', 'doRedirect(this)')

        actions.appendChild(editButton)
        actions.appendChild(deleteButton)

        row.appendChild(Org_ID)
        row.appendChild(Org_name)
        row.appendChild(Org_Email)
        row.appendChild(Org_Desc)
        row.appendChild(Org_Address)
        row.appendChild(Org_Phone)
        row.appendChild(actions)
        table.appendChild(row)
    }
}

function populateDonors(donors) {
    let table = document.getElementById('table')
    for (let index = 0; index < donors.length; index++) {
        const element = donors[index]
        let row = document.createElement('tr')

        let Donor_ID = document.createElement('td')
        let text_DonorID = document.createTextNode(element.Donor_ID)
        Donor_ID.appendChild(text_DonorID)

        let FirstName = document.createElement('td')
        let text_FirstName = document.createTextNode(element.First_Name)
        FirstName.appendChild(text_FirstName)

        let LastName = document.createElement('td')
        let text_LastName = document.createTextNode(element.Last_Name)
        LastName.appendChild(text_LastName)

        let Email = document.createElement('td')
        let textEmail = document.createTextNode(element.Email)
        Email.appendChild(textEmail)

        let Phone = document.createElement('td')
        let textPhone = document.createTextNode(element.Phone)
        Phone.appendChild(textPhone)

        let actions = document.createElement('td')
        let deleteButton = document.createElement('button')
        deleteButton.className = 'btn btn-success ml-1'
        deleteButton.setAttribute('onclick', 'doSomething(this)')
        deleteButton.setAttribute('data-toggle', 'modal')
        deleteButton.setAttribute('data-target', '#confirmBox')
        deleteButton.innerText = "DELETE"

        let editButton = document.createElement('a')
        editButton.className = 'btn btn-warning'
        editButton.innerText = "EDIT"
        editButton.setAttribute('onclick', 'doRedirect(this)')

        actions.appendChild(editButton)
        actions.appendChild(deleteButton)


        row.appendChild(Donor_ID)
        row.appendChild(Email)
        row.appendChild(LastName)
        row.appendChild(FirstName)
        row.appendChild(Phone)
        row.appendChild(actions)
        table.appendChild(row)
    }
}


function doSomething(element) {
    // console.log("element")
    let row = element.parentNode.parentNode
    let children = row.childNodes
    elementID = children[0].innerText
    let orgName = children[1].innerText
        // console.log(row)
    console.log(elementID)
    document.getElementById('donID').innerText = orgName
}

document.getElementById('confirm').addEventListener('click', e => {
    e.preventDefault()
    console.log("Confirmed")
    deleteTarget()
})

async function deleteTarget() {
    const response = await fetch(`/delete-target?Table=${Table}&id=${elementID}`, { method: 'DELETE' })
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
    window.location.href = `${Table}/edit/${elementID}`
}