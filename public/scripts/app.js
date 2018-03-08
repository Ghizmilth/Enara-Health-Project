var enara_api = config.ApiKey;
var enara_account = config.Account;
var userIdInput = "calvin";
var lastDatetime;
var allDatesArr = [];
var inBodyArr = [];
var startDate;
var bfValues1 = [];
var bfValues2 = [];
var newDatesArr = [];
var skmValues1 = [];
var skmValues2 = [];
var rgArmFat1, rgArmMusc1, rgArmFat2, rgArmMusc2;

$(document).ready(function() {
  console.log("we're live");
  fetchUserData();
  setTimeout(function() {
    renderInBody();
  }, 1000);
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
      fetchInBodyData(allDatesArr);
    },
    error: function(error) {
      console.log("error");
    }
  });
}
// var count = 0;
// // Gets and stores all InBody data into variable
// function storeInBody(allDatesArr) {
//   var newDatesArr = allDatesArr.slice(0, -1);
//
//   for (i = 0; i < allDatesArr.length; i++) {
//     count = i;
//     fetchInBodyData(allDatesArr);
//     console.log(i);
//   }
//   renderInBody();
// }

//AJAX call to show json data from InBody
function fetchInBodyData(allDatesArr) {
  // selectDatetime(userData);
  console.log("starting communication for Full InBody Data");
  var newDatesArr = allDatesArr.slice(0, -1);
  // var count = 0;
  for (i = 0; i < allDatesArr.length; i++) {
    // while (count < allDatesArr.length) {
    // renderInBody();
    // }
    $.ajax({
      type: "POST",
      url: "https://apiusa.lookinbody.com/InBody/GetFullInBodyDataByID",
      contentType: "application/json",
      data: JSON.stringify({
        UserID: userIdInput,
        Datetimes: newDatesArr[i]
      }),
      headers: {
        "API-KEY": enara_api,
        Account: enara_account
      },
      success: function(inBodyData) {
        // pushData(inBodyData);
        inBodyArr.push(inBodyData);
        console.log("successful call");
        console.log(inBodyArr);
        // renderInBody();
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

  //Get Body Fatt Mass Trend Values
  bfValues();
  //Skeletal Muscle Trends
  skmValues();
  //Body Fat & Lean Mass ratio
  pieChart();
  //Skeletal mass & Fat Mass Trend
  smmLineChart();
  //Right Arm data Trend
  rightArmChart();
  //Body Fat Mass Trend Chart
  bfTrend();
}

//Functions to get TRENDS of values form inBody data

//Body Fat Values
function bfValues() {
  for (i = 0; i < inBodyArr.length; ++i) {
    bfValues1.push(inBodyArr[i]["BFM(BodyFatMass)"]);
  }
  var newValues = bfValues1.map(function(x) {
    bfValues2.push(parseInt(x, 10));
  });
}

//Skeletal Muscle Value
function skmValues() {
  for (i = 0; i < inBodyArr.length; ++i) {
    skmValues1.push(inBodyArr[i]["SMM(SkeletalMuscleMass)"]);
  }
  var newValues = skmValues1.map(function(x) {
    skmValues2.push(parseInt(x, 10));
  });
}

//Right Arm Muscle
function rgArmFat() {
  for (i = 0; i < inBodyArr.length; ++i) {
    rgArmFat1.push(inBodyArr[i]["SMM(SkeletalMuscleMass)"]);
  }
  var newValues = skmValues1.map(function(x) {
    rgArmFat2.push(parseInt(x, 10));
  });
}

//Right Arm Fat

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
      text: "Source: InBody User Records"
    },

    yAxis: {
      title: {
        text: "Lbs"
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
        data: skmValues2
        // [
        //   parseInt(inBodyArr[0]["SMM(SkeletalMuscleMass)"]),
        //   parseInt(inBodyArr[1]["SMM(SkeletalMuscleMass)"]),
        //   parseInt(inBodyArr[2]["SMM(SkeletalMuscleMass)"])
        // ]
      },
      {
        name: "",
        data: []
      },
      {
        name: "Body Fat Mass",
        data: bfValues2
        // [
        //   parseInt(inBodyArr[0]["BFM(BodyFatMass)"]),
        //   parseInt(inBodyArr[1]["BFM(BodyFatMass)"]),
        //   parseInt(inBodyArr[1]["BFM(BodyFatMass)"])
        // ]
      }
      // {
      //   name: "Project Development",
      //   data: []
      // },
      // {
      //   name: "Other",
      //   data: []
      // }
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

function bfTrend() {
  console.log(bfValues2);
  Highcharts.chart("bf-trend-chart", {
    title: {
      text: "Body Fat Trend"
    },

    subtitle: {
      text: "Source: InBody User Records"
    },

    yAxis: {
      title: {
        text: "Lbs"
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
        name: "Body Fat Mass",
        data: bfValues2
        // [
        // parseInt(inBodyArr[0]["BFM(BodyFatMass)"]),
        // parseInt(inBodyArr[1]["BFM(BodyFatMass)"]),
        // parseInt(inBodyArr[1]["BFM(BodyFatMass)"])
        // ]
      }
      // {
      //   name: "",
      //   data: []
      // },
      // {
      //   name: "Body Fat Mass",
      //   data: [
      //     parseInt(inBodyArr[0]["BFM(BodyFatMass)"]),
      //     parseInt(inBodyArr[1]["BFM(BodyFatMass)"]),
      //     parseInt(inBodyArr[1]["BFM(BodyFatMass)"])
      //   ]
      // }
      // {
      //   name: "Project Development",
      //   data: []
      // },
      // {
      //   name: "Other",
      //   data: []
      // }
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

function rightArmChart() {
  Highcharts.chart("right-arm-chart", {
    chart: {
      type: "spline"
    },
    title: {
      text: "Right Arm: Muscle vs. Fat"
    },
    subtitle: {
      text: "Irregular time data in Highcharts JS"
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        // don't display the dummy year
        month: "%e. %b",
        year: "%e. %b"
      },
      title: {
        text: "Date"
      }
    },
    yAxis: {
      title: {
        text: "Lbs."
      },
      min: 0
    },
    tooltip: {
      headerFormat: "<b>{series.name}</b><br>",
      pointFormat: "{point.x:%e. %b}: {point.y:.2f} m"
    },

    plotOptions: {
      spline: {
        marker: {
          enabled: true
        }
      }
    },

    colors: ["#6CF", "#39F", "#06C", "#036", "#000"],

    // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: [
      {
        name: "Winter 2014-2015",
        data: rgArmFat2
        // [
        //   [Date.UTC(1970, 10, 25), 0],
        //   [Date.UTC(1970, 11, 6), 0.25],
        //   [Date.UTC(1970, 11, 20), 1.41],
        //   [Date.UTC(1970, 11, 25), 1.64],
        //   [Date.UTC(1971, 0, 4), 1.6],
        //   [Date.UTC(1971, 0, 17), 2.55],
        //   [Date.UTC(1971, 0, 24), 2.62],
        //   [Date.UTC(1971, 1, 4), 2.5],
        //   [Date.UTC(1971, 1, 14), 2.42],
        //   [Date.UTC(1971, 2, 6), 2.74],
        //   [Date.UTC(1971, 2, 14), 2.62],
        //   [Date.UTC(1971, 2, 24), 2.6],
        //   [Date.UTC(1971, 3, 1), 2.81],
        //   [Date.UTC(1971, 3, 11), 2.63],
        //   [Date.UTC(1971, 3, 27), 2.77],
        //   [Date.UTC(1971, 4, 4), 2.68],
        //   [Date.UTC(1971, 4, 9), 2.56],
        //   [Date.UTC(1971, 4, 14), 2.39],
        //   [Date.UTC(1971, 4, 19), 2.3],
        //   [Date.UTC(1971, 5, 4), 2],
        //   [Date.UTC(1971, 5, 9), 1.85],
        //   [Date.UTC(1971, 5, 14), 1.49],
        //   [Date.UTC(1971, 5, 19), 1.27],
        //   [Date.UTC(1971, 5, 24), 0.99],
        //   [Date.UTC(1971, 5, 29), 0.67],
        //   [Date.UTC(1971, 6, 3), 0.18],
        //   [Date.UTC(1971, 6, 4), 0]
        // ]
      },
      {
        name: "Winter 2015-2016"
        // data:
        // [
        //   [Date.UTC(1970, 10, 9), 0],
        //   [Date.UTC(1970, 10, 15), 0.23],
        //   [Date.UTC(1970, 10, 20), 0.25],
        //   [Date.UTC(1970, 10, 25), 0.23],
        //   [Date.UTC(1970, 10, 30), 0.39],
        //   [Date.UTC(1970, 11, 5), 0.41],
        //   [Date.UTC(1970, 11, 10), 0.59],
        //   [Date.UTC(1970, 11, 15), 0.73],
        //   [Date.UTC(1970, 11, 20), 0.41],
        //   [Date.UTC(1970, 11, 25), 1.07],
        //   [Date.UTC(1970, 11, 30), 0.88],
        //   [Date.UTC(1971, 0, 5), 0.85],
        //   [Date.UTC(1971, 0, 11), 0.89],
        //   [Date.UTC(1971, 0, 17), 1.04],
        //   [Date.UTC(1971, 0, 20), 1.02],
        //   [Date.UTC(1971, 0, 25), 1.03],
        //   [Date.UTC(1971, 0, 30), 1.39],
        //   [Date.UTC(1971, 1, 5), 1.77],
        //   [Date.UTC(1971, 1, 26), 2.12],
        //   [Date.UTC(1971, 3, 19), 2.1],
        //   [Date.UTC(1971, 4, 9), 1.7],
        //   [Date.UTC(1971, 4, 29), 0.85],
        //   [Date.UTC(1971, 5, 7), 0]
        // ]
      },
      {
        name: "Winter 2016-2017"
        // data:
        // [
        //   [Date.UTC(1970, 9, 15), 0],
        //   [Date.UTC(1970, 9, 31), 0.09],
        //   [Date.UTC(1970, 10, 7), 0.17],
        //   [Date.UTC(1970, 10, 10), 0.1],
        //   [Date.UTC(1970, 11, 10), 0.1],
        //   [Date.UTC(1970, 11, 13), 0.1],
        //   [Date.UTC(1970, 11, 16), 0.11],
        //   [Date.UTC(1970, 11, 19), 0.11],
        //   [Date.UTC(1970, 11, 22), 0.08],
        //   [Date.UTC(1970, 11, 25), 0.23],
        //   [Date.UTC(1970, 11, 28), 0.37],
        //   [Date.UTC(1971, 0, 16), 0.68],
        //   [Date.UTC(1971, 0, 19), 0.55],
        //   [Date.UTC(1971, 0, 22), 0.4],
        //   [Date.UTC(1971, 0, 25), 0.4],
        //   [Date.UTC(1971, 0, 28), 0.37],
        //   [Date.UTC(1971, 0, 31), 0.43],
        //   [Date.UTC(1971, 1, 4), 0.42],
        //   [Date.UTC(1971, 1, 7), 0.39],
        //   [Date.UTC(1971, 1, 10), 0.39],
        //   [Date.UTC(1971, 1, 13), 0.39],
        //   [Date.UTC(1971, 1, 16), 0.39],
        //   [Date.UTC(1971, 1, 19), 0.35],
        //   [Date.UTC(1971, 1, 22), 0.45],
        //   [Date.UTC(1971, 1, 25), 0.62],
        //   [Date.UTC(1971, 1, 28), 0.68],
        //   [Date.UTC(1971, 2, 4), 0.68],
        //   [Date.UTC(1971, 2, 7), 0.65],
        //   [Date.UTC(1971, 2, 10), 0.65],
        //   [Date.UTC(1971, 2, 13), 0.75],
        //   [Date.UTC(1971, 2, 16), 0.86],
        //   [Date.UTC(1971, 2, 19), 1.14],
        //   [Date.UTC(1971, 2, 22), 1.2],
        //   [Date.UTC(1971, 2, 25), 1.27],
        //   [Date.UTC(1971, 2, 27), 1.12],
        //   [Date.UTC(1971, 2, 30), 0.98],
        //   [Date.UTC(1971, 3, 3), 0.85],
        //   [Date.UTC(1971, 3, 6), 1.04],
        //   [Date.UTC(1971, 3, 9), 0.92],
        //   [Date.UTC(1971, 3, 12), 0.96],
        //   [Date.UTC(1971, 3, 15), 0.94],
        //   [Date.UTC(1971, 3, 18), 0.99],
        //   [Date.UTC(1971, 3, 21), 0.96],
        //   [Date.UTC(1971, 3, 24), 1.15],
        //   [Date.UTC(1971, 3, 27), 1.18],
        //   [Date.UTC(1971, 3, 30), 1.12],
        //   [Date.UTC(1971, 4, 3), 1.06],
        //   [Date.UTC(1971, 4, 6), 0.96],
        //   [Date.UTC(1971, 4, 9), 0.87],
        //   [Date.UTC(1971, 4, 12), 0.88],
        //   [Date.UTC(1971, 4, 15), 0.79],
        //   [Date.UTC(1971, 4, 18), 0.54],
        //   [Date.UTC(1971, 4, 21), 0.34],
        //   [Date.UTC(1971, 4, 25), 0]
        // ]
      }
    ]
  });
}

function leftArm() {}
