const trackId = document.getElementById("trackId").innerHTML;
const ctx = document.getElementById("myChart").getContext("2d");
let hours = [];

function loadData() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", `/getdata/${trackId}`, true);

  xhr.onload = function () {
    if (this.status === 200) {
      let response = this.responseText;
      response = JSON.parse(response);
      response = response.data;
      let values = Object.values(response);
      let keys = Object.keys(response);
      let backgroundColor = [];
      let borderColor = [];
      // keys are the labels for the graph
      // hours are the data points for the graph
      values.forEach((data) => {
        hours.push(data[1]);
        backgroundColor.push("rgba(224, 225, 238, 1");
        borderColor.push("rgba(15, 76, 117, 1");
      });

      let myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: keys,
          datasets: [
            {
              label: "Number of hours",
              data: hours,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });

      let hisChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: keys,
          datasets: [
            {
              label: "Number of hours",
              data: hours,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    }
  };
  xhr.onload();

  xhr.send();
}

loadData();
