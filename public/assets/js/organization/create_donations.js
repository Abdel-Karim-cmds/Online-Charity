async function createDonation() {
    const url = '/create-donation'
    const data = {
        // date: moment(document.getElementById("date").value, 'YYYY-MM-DD', 'UTC').format(),
        date: document.getElementById("date").value,
        item: document.getElementById("items").value
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url, options)
        // const outcome = await response.json()
    const { message } = await response.json()
    if (response.status) {
        document.getElementById('sometext').innerText = message
        document.getElementById('unique').click()
        setTimeout(() => { location.reload() }, 2000)
    }
}


document.querySelector("form").addEventListener("submit", e => {
    const now = new Date()
        // const selectedDate = document.getElementById("date").value
        // const day = Date.parse(selectedDate).toString()
    const date = new Date(document.getElementById("date").value)
        // console.log("now " + now);
        // console.log("Selceted date " + date);
        // console.log("Is the date in the future? ")
        // console.log(date > now)
        // console.log("Is the date in the past? ")
        // console.log(now > date)
        // console.log(now + 1);

    if (now > date)
        document.getElementById('errorMessage').style.display = 'block'

    e.preventDefault()
        // console.log("Yo");


    if (document.getElementById("date").value < new Date())
        console.log("Past");
    createDonation()
})