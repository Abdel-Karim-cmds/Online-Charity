const path = window.location.href.split('/')
document.querySelector(`a[href="/report/${path[4]}"]`).classList = 'nav-link active'

path[4] == 'donations' && getDonations()
path[4] == 'organizations'?getInfo(path[4]):getDonorNumber()

async function getDonations() {
    const response = await fetch('/donations-report')
    const data = await response.json()
    // console.log(data);
    makeAnonymous(data)
    makeDonations(data)
    makeReceived(data)
    // getDonorNumber()
    // console.log(getDonorNumber())
}

async function getDonorNumber(){
  // const url = '/get-info'
  //   const response = fetch(url + `?table=donors`, { method: 'GET' })
  const response = fetch('/different-donors')
    const response2 = fetch('/number-of-donations')
    const result = await Promise.all([response,response2])
    const donors = (await result[0].json()).length
    const donors2 = (await result[1].json())[0]["COUNT(*)"]
    const donors3 = [donors,donors2 ]
    // console.log(donors3)
    makeDonors(donors3)
    // console.log(await result[)

    // console.log((await result[0].json()).length)
    // console.log((await result[1].json())[0]["COUNT(*)"])
    // return result
}

function makeDonors(donors){
  console.log(donors)
  const summed = [donors[0], donors[1]-donors[0]]
  console.log(summed)
  var barColors = ["#006b57", "#fdd55a", ];
    var ch = new Chart("cht", {
        type: "pie",
        data: {
            labels: ["People who donated", "People who did not donate" ],
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
              text: `Donation ratio, Total: ${donors[1]}` 
            }
          }
    });
}

async function getInfo(table) {
    const url = '/get-info'
    const response = await fetch(url + `?table=${table}`, { method: 'GET' })
    // const response2 = await fetch('/number-of-donations')
    // const result = Promise.all([response,response2])
    // console.log(result)
    const data = await response.json()

    console.log(data);
    makeLocation(data)
}

function makeAnonymous(values){
    const anonymous = values.filter(donor => donor.Anonymous == 'YES').length
    const notAnonymous = values.length - anonymous
    const summed = [anonymous, notAnonymous]
    var barColors = ["#006b57", "#fdd55a", ];
    var ch = new Chart("cht", {
        type: "pie",
        data: {
            labels: ["Anonymous", "Not Anonymous" ],
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
              text: "Anonymous and Public Donations"
            }
          }
    });
}

function makeDonations(values){
    const counts = {}
    for (const num of values) {
        counts[num.Item_donated] = counts[num.Item_donated] ? counts[num.Item_donated] + 1 : 1;
    }
    const labels = []
    const summed = []
    for (const key of Object.keys(counts)) {
        labels.push(key)
        summed.push(counts[key])
    };
    var barColors = ["#006b57", "#fdd55a","#FF1136","#8844a6","#ff00f9","#ff99f9","#a987f9", "#000",];
    var ch = new Chart("cht1", {
        type: "pie",
        data: {
            labels: labels,
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
              text: "List of item donated"
            }
          }

    });
}

function makeReceived(values){
    const received = values.filter(donor => donor.Received == 'YES').length
    const pending = values.length - received
    const summed = [received, pending]

    var barColors = ["#006b57", "#fdd55a", ];
    var ch = new Chart("cht2", {
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

function makeLocation(values){
    const counts = {}
    for (const num of values) {
        counts[num.Address] = counts[num.Address] ? counts[num.Address] + 1 : 1;
    }
    console.log(counts)
    
    const labels = []
    const summed = []
    for (const key of Object.keys(counts)) {
        labels.push(key)
        summed.push(counts[key])
    };
    console.log(labels)
    console.log(summed)
    new Chart("cht1", {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            backgroundColor: 'red',
            data: summed
          }]
        },
        options: {
          legend: {display: false},
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }],
          },
          title:{
              display: true,
              text: "Organizations by location",
          }
        }
      });
}