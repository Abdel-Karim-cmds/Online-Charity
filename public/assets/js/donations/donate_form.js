const path = window.location.href.split('/')
const id = path[4]

console.log(path)
console.log(id)

getDonation()

async function getDonation() {
    const response = await fetch('/donations?id=' + id)
    const data = await response.json()
    console.log(data)
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
        console.log("Empty");
        // document.getElementById('unique').click()
        document.getElementById('unique').click()
    }
    // console.log(document.getElementById('anonymous').checked)
    postDonation()
})

async function postDonation() {
    const data = {
        item: document.getElementById('items').value,
        amount: document.getElementById('amount').value,
        anonymous: document.getElementById('anonymous').checked ? 'YES' : 'NO'
    }
    console.log(data)

    // const outcome = await response.json()
    // if (response.status) {
    //     document.getElementById('sometext').innerText = outcome.message
    //     document.getElementById('unique').click()
    //     setTimeout(() => { location.reload() }, 2000)
    // }
}