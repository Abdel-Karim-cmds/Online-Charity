
(async function getDonations(){
    const pending =  fetch('/donations-result?status=NO')
    const received = fetch('/donations-result?status=YES')
    const response = await Promise.all([received,pending])
    const pend = await response[0].json()
    const rec = await response[1].json()
    const a = (pend[0])["COUNT(*)"]
    const b = (rec[0])["COUNT(*)"]

    makeDonationsGraph(a,b)

})()


function makeDonationsGraph(received,pending){
    
    const summed = [pending, received]
    var barColors = ["#006b57", "#fdd55a", ];
    var ch = new Chart("cht", {
        type: "pie",
        data: {
            labels: ["Pending", "RECEIVED" ],
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
              text: `Received and Pending Donation, Total ${received+pending}`
            }
          }
    });
}
