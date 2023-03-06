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