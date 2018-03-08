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
var rgArmFat1 = [];
var rgArmMusc1 = [];
var rgArmFat2 = [];
var rgArmMusc2 = [];
var lfArmFat1 = [];
var lfArmFat2 = [];
var lfArmMusc1 = [];
var lfArmMusc2 = [];

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

//RENDER into the DOM
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
  //Get Right Arm Fat
  rgArmFat();
  //Get right arm muscle
  rgArmMusc();
  //Get LEFT Arm Fat
  lfArmFat();
  //Get LEFT arm muscle
  lfArmMusc();
  //Skeletal Muscle Trends
  skmValues();
  //Body Fat & Lean Mass ratio
  pieChart();
  //Skeletal mass & Fat Mass Trend
  smmLineChart();
  //Right Arm data Trend
  rightArmChart();
  //LEFT ARM data Trend
  leftArmChart();
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

//Right Arm Fat
function rgArmFat() {
  for (i = 0; i < inBodyArr.length; ++i) {
    rgArmFat1.push(inBodyArr[i]["BFMofRightArm"]);
  }
  var newValues = rgArmFat1.map(function(x) {
    rgArmFat2.push(parseInt(x, 10));
  });
}

//Right Arm Muscle
function rgArmMusc() {
  for (i = 0; i < inBodyArr.length; ++i) {
    rgArmMusc1.push(inBodyArr[i]["LBMofRightArm"]);
  }
  var newValues = rgArmMusc1.map(function(x) {
    rgArmMusc2.push(parseInt(x, 10));
  });
}

//Left Arm Fat
function lfArmFat() {
  for (i = 0; i < inBodyArr.length; ++i) {
    lfArmFat1.push(inBodyArr[i]["BFMofRightArm"]);
  }
  var newValues = lfArmFat1.map(function(x) {
    lfArmFat2.push(parseInt(x, 10));
  });
}

//Left Arm Muscle
function lfArmMusc() {
  for (i = 0; i < inBodyArr.length; ++i) {
    lfArmMusc1.push(inBodyArr[i]["LBMofRightArm"]);
  }
  var newValues = lfArmMusc1.map(function(x) {
    lfArmMusc2.push(parseInt(x, 10));
  });
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

//Skeletal Muscle Chart
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
      },
      {
        name: "",
        data: []
      },
      {
        name: "Body Fat Mass",
        data: bfValues2
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

//BODY FAT trends
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

//RIGHT arm chart
function rightArmChart() {
  Highcharts.chart("right-arm-chart", {
    title: {
      text: "Right Arm: Muscle vs. Fat Mass"
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
        name: "Right Arm Muscle Mass",
        data: rgArmMusc2
      },
      {
        name: "Right Arm Fat Mass",
        data: rgArmFat2
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

//LEFT arm chart
function leftArmChart() {
  Highcharts.chart("left-arm-chart", {
    title: {
      text: "Left Arm: Muscle vs. Fat Mass"
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
        name: "Right Arm Muscle Mass",
        data: lfArmMusc2
      },

      {
        name: "Right Arm Fat Mass",
        data: lfArmFat2
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
