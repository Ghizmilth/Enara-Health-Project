var enara_api = config.ApiKey;
var enara_account = config.Account;
var userIdInput = "calvin";
var lastDatetime;
var inBodyArr = [];

$(document).ready(function() {
  console.log("we're live");
  fetchUserData();
});

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
      fetchInBodyData(userData);
    },
    error: function(error) {
      console.log("error");
    }
  });
}

//AJAX call to show json data from InBody
function fetchInBodyData(userData) {
  selectDatetime(userData);
  console.log("starting communication for Full InBody Data");
  console.log(userData);
  // for (i = 0; i < userData.length; i++) {
  $.ajax({
    type: "POST",
    url: "https://apiusa.lookinbody.com/InBody/GetFullInBodyDataByID",
    contentType: "application/json",
    data: JSON.stringify({ UserID: userIdInput, Datetimes: lastDatetime }),
    headers: {
      "API-KEY": enara_api,
      Account: enara_account
    },
    success: function(data) {
      // console.log(data);
      // inBodyArr.push(data);
      console.log(inBodyArr);
      renderInBody(data);
      initializePieChart(data);
    },
    error: function(error) {
      console.log("error");
    }
  });
  // }
}

// userData[userData.length-2]

// Selection of Datetime to use to get latest user info
function selectDatetime(userData) {
  if (userData.length > 3) {
    lastDatetime = userData[userData.length - 2];
  } else if (userData.length === 3) {
    lastDatetime = userData[1];
  } else {
    lastDatetime = userData[0];
  }
}

//Renders InBody data into DOM
function renderInBody(InBodyData) {
  $("h5.current-weight").html(InBodyData.Weight + " " + "lbs");
  $("h5.fat-mass").html(InBodyData["BFM(BodyFatMass)"] + " " + "lbs");
  $("h5.lean-mass").html(InBodyData["LBM(LeanBodyMass)"] + " " + "lbs");
}

//CHARTS Section
function initializePieChart(chartData) {
  Highcharts.setOptions({
    colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
      return {
        radialGradient: {
          cx: 0.5,
          cy: 0.3,
          r: 0.7
        },
        stops: [
          [0, color],
          [
            1,
            Highcharts.Color(color)
              .brighten(-0.3)
              .get("rgb")
          ] // darken
        ]
      };
    })
  });

  // Build the chart
  Highcharts.chart("pie-chart", {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie"
    },
    title: {
      text: "Body Fat Mass vs. Lean Body Mass"
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
              (Highcharts.theme && Highcharts.theme.contrastTextColor) || "blue"
          },
          connectorColor: "silver"
        }
      }
    },
    series: [
      {
        name: "Brands",
        data: [
          { name: "Fat mass", y: parseInt(chartData["BFM(BodyFatMass)"]) },
          // {
          //     name: 'Chrome',
          //     y: 24.03,
          //     sliced: true,
          //     selected: false
          // },
          { name: "Lean Mass", y: parseInt(chartData["LBM(LeanBodyMass)"]) }
          // { name: 'Safari', y: 4.77 },
          // { name: 'Opera', y: 0.91 },
          // { name: 'Other', y: 0.2 }
        ]
      }
    ]
  });
}
