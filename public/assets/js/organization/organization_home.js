var elemID;
(async function getDetails() {
    const response = await fetch('/get-session-user')
    const data = await response.json()
    console.log(data);
    populateDetail(data)
})()

function populateDetail(details) {
    document.getElementById("ID").innerText = details.Organization_ID;
    document.getElementById("Name").innerText = details.Name;
    document.getElementById("Nam").innerText = details.Name;
    document.getElementById("Email").innerText = details.Email;
    document.getElementById("Phone").innerText = details.Phone;
    document.getElementById("Description").innerText = details.Description;
}



async function getDonations(){
    const response = await fetch('/organization-donations')
    const data = await response.json()
    console.log(data)
    populateDonations(data)
}

getDonations()
function populateDonations(donations){
    const table = document.getElementById('table')
    for (let i = 0; i < donations.length; i++) {
        const element = donations[i];
        // console.log(element)
        const row = document.createElement('tr')

        const name = document.createElement('td')
        const textName = document.createTextNode(element.First_Name)
        // name.appendChild(textName)
        element.Anonymous == 'YES'?name.innerText = 'Anonymous':name.appendChild(textName)

        const item = document.createElement('td')
        const textItem = document.createTextNode(element.Item_donated)
        item.appendChild(textItem)

        const amount = document.createElement('td')
        const textAmount = `${element.Amount} ${unit(element.Item_donated)}`
        amount.innerText = textAmount

        const date = document.createElement('td')
        const textDate = document.createTextNode(element.Date_donated.slice(0, 10))
        date.appendChild(textDate)

        const receivedBtn = document.createElement('button')
        receivedBtn.classList = 'btn btn-success'
        receivedBtn.setAttribute('data-toggle', 'modal')
        receivedBtn.setAttribute('data-target', '#confirmBox')
        receivedBtn.innerText = 'Mark as received'
        receivedBtn.setAttribute('onclick',`mark("${element.REF}")`)
        console.log(receivedBtn)

        const status = document.createElement('td')
        element.Received == 'YES'? status.innerText = 'Received':status.appendChild(receivedBtn)

        const actions = document.createElement('td')
        const dropdown = document.createElement('div')
        dropdown.classList = 'dropdown'
        const dropbtn = document.createElement('button')
        dropbtn.classList = 'dropbtn'
        dropbtn.innerText = 'Contact'
        const content = document.createElement('div')
        content.classList = 'dropdown-content'
        const a1 = document.createElement('a')
        a1.href = `mailto:${element.Email}`
        a1.innerText = 'Email'
        const a2 = document.createElement('a')
        a2.href = `tel:${element.Phone}`
        a2.innerText = 'Call'

        content.appendChild(a1)
        content.appendChild(a2)
        dropdown.appendChild(dropbtn)
        dropdown.appendChild(content)
        actions.appendChild(dropdown)

        row.appendChild(name)
        row.appendChild(item)
        row.appendChild(amount)
        row.appendChild(date)
        row.appendChild(status)
        row.appendChild(actions)
        table.appendChild(row)
    }


}

function unit(element){
    if(element == 'Cash')
        return 'KSH'
    if(element == 'Food')
        return 'Kg'
    else
        return ''
}


function mark(id){
    console.log(id)
    elemID = id
}

document.getElementById('confirm').addEventListener('click',e=>{
    setMarked()
})

async function setMarked(){
    const response = await fetch(`/update-status?id=${elemID}`,{method:'PUT'})
    const data = await response.json()
    if(response.status === 200)
    location.reload()
}