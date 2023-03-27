// var userID ;

(async function getDonorInfo() {
    const url = '/get-session-user'
    const response = await fetch(url, { method: 'GET' })
    const data = await response.json()
    getUserDonations(data.Donor_ID)
    console.log(data);
    // console.log(data.Donor_ID   )
    // userID = data.Donor_ID;
    // console.log(userID)
    populateDetails(data)
})()

function populateDetails(detail) {
    document.getElementById('firstName').innerText = detail.First_Name
    document.getElementById('ID').innerText = detail.Donor_ID
    document.getElementById('Full_Name').innerText = `${detail.Last_Name} ${detail.First_Name}`
    document.getElementById('email').innerText = detail.Email
    document.getElementById('phone').innerText = detail.Phone
}

async function getUserDonations(id){
    const response = await fetch(`/get-user-donations?id=${id}`)
    const data = await response.json()
    console.log(data)
    populateDonations(data)
}

function populateDonations(donations){
    let cards = document.getElementById('cards')

    for (let i = 0; i < donations.length; i++) {
        const element = donations[i];
        console.log(element)
        let p1 = document.createElement('p')
        p1.classList = 'mb-1'
        p1.style.fontSize = '0.77rem'
        p1.innerText = element.Name
        let p2 = document.createElement('p')
        p2.classList = 'mb-1'
        p2.innerText = `${element.item_donated}`
        let p3 = document.createElement('p')
        p3.classList = 'txt'
        p3.innerHTML = `${element.amount} ${unit(element.item_donated)} ${element.Received=='YES'?'<span class="text-warning"> RECEIVED</span>':'<span class="text-danger">NOT RECEIVED</span>'}`
        cards.appendChild(p1)
        cards.appendChild(p2)
        cards.appendChild(p3)
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
