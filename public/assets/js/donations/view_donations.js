(async function getDonations() {
    const response = await fetch('/get-donations')
    const data = await response.json()
    console.log(data);
    populateTable(data)
})()


function populateTable(donations) {
    var count = 1;
    const table = document.getElementById('table')


    for (let index = 0; index < donations.length; index++) {
        const donation = donations[index];
        console.log(donation);
        const donateDate = new Date(donation.Date_Ending)
        const today = new Date()

        console.log(donateDate)
        console.log(today)
        console.log(donateDate > today)

        if (today > donateDate) {
            continue
        }

        let row = document.createElement('tr')
        row.classList = "colorbg";
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

        let orgName = document.createElement('td')
        let textName = document.createTextNode(donation.Name)
        orgName.appendChild(textName)

        let orgEmail = document.createElement('td')
        let textEmail = document.createTextNode(donation.Email)
        orgEmail.appendChild(textEmail)


        let actions = document.createElement('td')
        let donateButton = document.createElement('a')
        donateButton.href = `/donate/${donation.Donation_ID}`
        donateButton.className = 'btn btn-success'
        donateButton.innerText = "DONATE"
        actions.appendChild(donateButton)


        row.appendChild(orgName)
        row.appendChild(orgEmail)
        row.appendChild(datePosted)
        row.appendChild(dateEnding)
        row.appendChild(item)
        row.appendChild(actions)
        table.appendChild(row)
        count++;
    }
}