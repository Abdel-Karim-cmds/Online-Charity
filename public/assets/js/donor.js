// var userID ;

(async function getDonorInfo() {
    const url = '/get-session-user'
    const response = await fetch(url, { method: 'GET' })
    const data = await response.json()
    getUserDonations(data.Donor_ID)
    console.log(data);
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
    populateDonations(data)
    makeGraph(data)
}

function populateDonations(donations){
    let cards = document.getElementById('cards')

    for (let i = 0; i < donations.length; i++) {
        const element = donations[i];
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

function makeGraph(donations){
    // console.log(donations)
    const received = donations.filter(donation => donation.Received === 'YES')
    const pending = donations.filter(donation => donation.Received === 'NO')
    console.log(received)
    console.log(pending)
    const summed = [received.length, pending.length]
    var barColors = ["#006b57", "#fdd55a", ];
    var ch = new Chart("cht", {
        type: "pie",
        data: {
            labels: ["Received", "Pending" ],
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: barColors,
                borderColor: barColors,
                borderWidth: 4,
                data: summed,
            }, ],
        },

        options: {
            title: {
              display: true,
              text: "Received and Pending Donations"
            }
          }
    });
}