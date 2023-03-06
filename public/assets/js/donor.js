(async function getDonorInfo() {
    const url = '/get-session-user'
    const response = await fetch(url, { method: 'GET' })
    const data = await response.json()
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