var enara_api = config.ApiKey;
var enara_account = config.Account;
var userIdInput = "calvin";
var lastDatetime;
var allDatesArr = [];
var inBodyArr = [];
var startDate;

$(document).ready(function() {
  console.log("we're live");
  fetchUserData();
});

//Gets all Datetimes from users
function fetchUserData() {
  console.log("Retrieving Date Times by ID");
  $.ajax({
    type: "POST",
    url: "https://apiusa.lookinbody.com/inbody/GetDateTimesByID",
    contentType: "application/json",
    data: JSON.stringify({ UserID: userIdInput }),
    headers: {
      "API-KEY": enara_api,
      Account: enara_account
    },
    success: function(userData) {
      allDatesArr = userData;
      console.log(allDatesArr);
      // storeInBody(allDatesArr);
      fetchInBodyData(allDatesArr);
    },
    error: function(error) {
      console.log("error");
    }
  });
}

//Gets and stores all InBody data into variable
// function storeInBody(allDatesArr) {
//   for (i = 0; i < allDatesArr.length; i++) {
//     fetchInBodyData(allDatesArr);
//     console.log(i);
//   }
// }

//AJAX call to show json data from InBody
function fetchInBodyData(allDatesArr) {
  // selectDatetime(userData);
  console.log("starting communication for Full InBody Data");
  console.log(allDatesArr);
  var newDatesArr = allDatesArr.slice(0, -1);
  for (i = 0; i < allDatesArr.length; i++) {
    console.log(i);
    $.ajax({
      type: "POST",
      url: "https://apiusa.lookinbody.com/InBody/GetFullInBodyDataByID",
      contentType: "application/json",
      data: JSON.stringify({ UserID: userIdInput, Datetimes: newDatesArr[i] }),
      headers: {
        "API-KEY": enara_api,
        Account: enara_account
      },
      success: function(inBodyData) {
        // pushData(inBodyData);
        inBodyArr.push(inBodyData);
        console.log(inBodyArr);
        renderInBody();
      },
      error: function(error) {
        console.log("error");
      }
    });
  }
}

// userData[userData.length-2]
// Selection of Datetime to use to get latest user info
// function selectDatetime() {
//   if (inBodyArr.length > 3) {
//     lastDatetime = userData[userData.length - 1];
//   } else if (userData.length === 3) {
//     lastDatetime = userData[1];
//   } else {
//     lastDatetime = userData[0];
//   }
// }

function renderInBody() {
  console.log(inBodyArr);
  console.log(inBodyArr.length);
  console.log(inBodyArr[0].DateofRegistration);
  // console.log(startDate);
  startDate = new Date(inBodyArr[0].DateofRegistration);
  $("h5.member-since").html(startDate.getFullYear());
  $("h5.current-weight").html(
    inBodyArr[inBodyArr.length - 1].Weight + " " + "lbs"
  );
  $("h5.fat-mass").html(
    inBodyArr[inBodyArr.length - 1]["BFM(BodyFatMass)"] + " " + "lbs"
  );
  $("h5.lean-mass").html(
    inBodyArr[inBodyArr.length - 1]["LBM(LeanBodyMass)"] + " " + "lbs"
  );
  pieChart();
  smmLineChart();
}

//CHARTS Section
function pieChart() {
  Highcharts.chart("pie-chart", {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie"
    },
    title: {
      text: "Body Fat Mass and Lean Body Mass ratio"
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          style: {
            color:
              (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
              "black"
          }
        }
      }
    },
    series: [
      {
        name: "Brands",
        colorByPoint: true,
        data: [
          {
            name: "Lean Body Mass",
            y: parseInt(inBodyArr[inBodyArr.length - 1]["LBM(LeanBodyMass)"])
          },
          {
            name: "Body Fat Mass",
            y: parseInt(inBodyArr[inBodyArr.length - 1]["BFM(BodyFatMass)"])
          }
        ]
      }
    ]
  });
}

function smmLineChart() {
  Highcharts.chart("smm-fm-chart", {
    title: {
      text: "Skeletal Muscle vs Fat Mass Trend"
    },

    subtitle: {
      text: "Source: thesolarfoundation.com"
    },

    yAxis: {
      title: {
        text: "Number of Employees"
      }
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle"
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: startDate.getFullYear()
      }
    },

    series: [
      {
        name: "Skeletal Muscle Mass",
        data: [
          parseInt(inBodyArr[0]["SMM(SkeletalMuscleMass)"]),
          parseInt(inBodyArr[1]["SMM(SkeletalMuscleMass)"])
          // inBodyArr[2]["SMM(SkeletalMuscleMass)"]
        ]
      },
      {
        name: "Manufacturing",
        data: []
      },
      {
        name: "Body Fat Mass",
        data: [
          parseInt(inBodyArr[0]["BFM(BodyFatMass)"]),
          parseInt(inBodyArr[1]["BFM(BodyFatMass)"])
        ]
      },
      {
        name: "Project Development",
        data: []
      },
      {
        name: "Other",
        data: []
      }
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom"
            }
          }
        }
      ]
    }
  });
}

// Highcharts.setOptions({
//   colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
//     return {
//       radialGradient: {
//         cx: 0.5,
//         cy: 0.3,
//         r: 0.7
//       },
//       stops: [
//         [0, color],
//         [
//           1,
//           Highcharts.Color(color)
//             .brighten(-0.3)
//             .get("rgb")
//         ] // darken
//       ]
//     };
//   })
// });
// // Build the chart
//
// Highcharts.chart("pie-chart", {
//   chart: {
//     plotBackgroundColor: null,
//     plotBorderWidth: null,
//     plotShadow: false,
//     type: "pie"
//   },
//   title: {
//     text: "Body Fat Mass vs. Lean Body Mass"
//   },
//   tooltip: {
//     pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
//   },
//   plotOptions: {
//     pie: {
//       allowPointSelect: true,
//       cursor: "pointer",
//       dataLabels: {
//         enabled: true,
//         format: "<b>{point.name}</b>: {point.percentage:.1f} %",
//         style: {
//           color:
//             (Highcharts.theme && Highcharts.theme.contrastTextColor) || "blue"
//         },
//         connectorColor: "silver"
//       }
//     }
//   },
//   series: [
//     {
//       name: "Brands",
//       data: [
//         {
//           name: "Fat mass",
//           y: parseInt(inBodyArr[inBodyArr.length - 1]["BFM(BodyFatMass)"])
//         },
//         // {
//         //     name: 'Chrome',
//         //     y: 24.03,
//         //     sliced: true,
//         //     selected: false
//         // },
//         {
//           name: "Lean Mass",
//           y: parseInt(inBodyArr[inBodyArr.length - 1]["LBM(LeanBodyMass)"])
//         }
//         // { name: 'Safari', y: 4.77 },
//         // { name: 'Opera', y: 0.91 },
//         // { name: 'Other', y: 0.2 }
//       ]
//     }
//   ]
// });
