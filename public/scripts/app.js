// var userIdInput = "daja000001";
var enara_api = config.ApiKey;
var enara_account = config.Account;
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
var dbData = [];
var userAvaName;
var userAptInf;
var userIdInput;

// var aptible = require("./models");

$(document).ready(function() {
  console.log("we're live");

  $.ajax({
    method: "GET",
    url: "/api/patient",
    success: handleSuccess,
    error: handleError
  });

  // $(".btn-primary").on("click", fetchUserData);
  $(".btn-primary").on("click", userNameImg);

  // fetchUserData();
  setTimeout(function() {
    renderInBody();
  }, 1500);
});

function handleSuccess(users) {
  console.log("aptible data collected");
  // users.forEach(function(user) {
  // console.log(users);
  dbData = users.rows;
  console.log(dbData);
  // console.log(dbData[920].first_name + " " + dbData[920].last_name);
  // });
}

function handleError(err) {
  console.log("There has been an error: ", err);
}

function userNameImg(e) {
  e.preventDefault();
  console.log(dbData);
  resetAllVar();
  userAptInfo = $("#inputUserID")
    .val()
    .toUpperCase();
  // userAptInfo =
  console.log(userAptInfo);
  for (i = 0; i < dbData.length; i++) {
    if (userAptInfo === dbData[i].drchrono_chart_id) {
      userIdInput = dbData[i];
      // console.log(dbData[i].drchrono_chart_id);
    }
  }
  console.log(userIdInput);
  fetchUserData();
}

//Gets all Datetimes from users
function fetchUserData() {
  // resetAllVar();
  // e.preventDefault();
  // userIdInput = $("#inputUserID").val();
  console.log("Retrieving Date Times by ID");
  // fetchAptUser(e);
  $.ajax({
    type: "POST",
    url: "https://apiusa.lookinbody.com/inbody/GetDateTimesByID",
    contentType: "application/json",
    data: JSON.stringify({ UserID: userIdInput.drchrono_chart_id }),
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
  console.log("starting communication for Full InBody Data");
  var newDatesArr = allDatesArr.slice(0, -1);
  for (i = 0; i < allDatesArr.length; i++) {
    $.ajax({
      async: false,
      type: "POST",
      url: "https://apiusa.lookinbody.com/InBody/GetFullInBodyDataByID",
      contentType: "application/json",
      data: JSON.stringify({
        UserID: userIdInput.drchrono_chart_id,
        Datetimes: newDatesArr[i]
      }),
      headers: {
        "API-KEY": enara_api,
        Account: enara_account
      },
      success: function(inBodyData) {
        inBodyArr.push(inBodyData);
        console.log("successful call");
        console.log(inBodyArr);
      },
      error: function(error) {
        console.log("error");
      }
    });
  }
  setTimeout(function() {
    renderInBody();
  }, 1500);
}

function resetAllVar() {
  lastDatetime;
  allDatesArr = [];
  inBodyArr = [];
  startDate;
  bfValues1 = [];
  bfValues2 = [];
  newDatesArr = [];
  skmValues1 = [];
  skmValues2 = [];
  rgArmFat1 = [];
  rgArmMusc1 = [];
  rgArmFat2 = [];
  rgArmMusc2 = [];
  lfArmFat1 = [];
  lfArmFat2 = [];
  lfArmMusc1 = [];
  lfArmMusc2 = [];
  userIdInput;
}

//RENDER into the DOM
function renderInBody() {
  console.log(inBodyArr);
  console.log(inBodyArr.length);
  console.log(inBodyArr[0].DateofRegistration);
  startDate = new Date(inBodyArr[0].DateofRegistration);
  $("h5.member-since").html(startDate.getFullYear());
  $("h5.current-weight").html(
    parseFloat(inBodyArr[inBodyArr.length - 1].Weight * 2.20462).toFixed(2) +
      " " +
      "lbs"
  );
  $("h5.fat-mass").html(
    parseFloat(
      inBodyArr[inBodyArr.length - 1]["BFM(BodyFatMass)"] * 2.20462
    ).toFixed(2) +
      " " +
      "lbs"
  );
  $("h5.lean-mass").html(
    parseFloat(
      inBodyArr[inBodyArr.length - 1]["LBM(LeanBodyMass)"] * 2.20462
    ).toFixed(2) +
      " " +
      "lbs"
  );
  // $("h1.user-name").html(inBodyArr[0].ID);
  $("h1.user-name").html(userIdInput.first_name + " " + userIdInput.last_name);
  $("img.user-avatar")
    .attr(
      "src",
      "https://commondatastorage.googleapis.com/enara/uploads/user/avatar/" +
        userIdInput.id +
        "/" +
        userIdInput.avatar
    )
    .height(300);
  // .width(100);

  pieChart();
  //COMPARE weight progress
  compWeight();
  //COMPARE body fat mass progress
  compFat();
  //COMPARE lean body Mass
  compLean();
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
  smmLineChart1();
  //Right Arm data Trend
  rightArmChart();
  //LEFT ARM data Trend
  leftArmChart();
  //Body Fat Mass Trend Chart
  bfTrend1();
  //COMPARE weight formula start to end
  weightStart();
  //COMPARE body fat start to end
  fatStart();
  //COMPARE lean mass start to end
  leanStart();
}

//COMPARE weight
function compWeight() {
  var comp = 0;
  if (inBodyArr.length > 2) {
    comp =
      parseInt(inBodyArr[inBodyArr.length - 1].Weight * 2.20462).toFixed(2) -
      parseInt(inBodyArr[inBodyArr.length - 2].Weight * 2.20462).toFixed(2);
    if (comp >= 1) {
      $("h7 .comp-weight").html("a Decrease of " + comp + " lbs");
    } else if (comp === 0) {
      $("h7 .comp-weight").html("No changes ");
    } else {
      comp *= -1;
      $("h7 .comp-weight").html("an Increase of " + comp + " lbs");
    }
  } else if (inBodyArr.length === 2) {
    comp =
      parseFloat(parseInt(inBodyArr[0].Weight) * 2.20462).toFixed(2) -
      parseFloat(parseInt(inBodyArr[1].Weight) * 2.20462).toFixed(2);
    if (comp >= 1) {
      $("h7 .comp-weight").html("a Decrease of " + comp + " lbs");
    } else if (comp === 0) {
      $("h7 .comp-weight").html("No changes ");
    } else {
      comp *= -1;
      $("h7 .comp-weight").html("an Increase of " + comp + " lbs");
    }
  } else {
    if (inBodyArr.length === 1) {
      $("h7 .comp-weight").html("No changes");
    }
  }
}

function weightStart() {
  var comp2 =
    parseInt(inBodyArr[0].Weight * 2.20462).toFixed(2) -
    parseInt(inBodyArr[inBodyArr.length - 1].Weight * 2.20462).toFixed(2);
  if (comp2 > 0) {
    $("h7 .comp-weight-start").html("a Decrease of " + comp2 + " lbs");
  } else if (comp2 === 0) {
    $("h7 .comp-weight-start").html("No changes ");
  } else {
    comp2 *= -1;
    $("h7 .comp-weight-start").html("an Increase of " + comp2 + " lbs");
  }
}

function fatStart() {
  var comp2 =
    parseInt(inBodyArr[0]["BFM(BodyFatMass)"] * 2.20462).toFixed(2) -
    parseInt(
      inBodyArr[inBodyArr.length - 1]["BFM(BodyFatMass)"] * 2.20462
    ).toFixed(2);
  if (comp2 > 0) {
    $("h7 .body-fat-start").html("a Decrease of " + comp2 + " lbs");
  } else if (comp2 === 0) {
    $("h7 .body-fat-start").html("No changes ");
  } else {
    comp2 *= -1;
    $("h7 .body-fat-start").html("an Increase of " + comp2 + " lbs");
  }
}

function leanStart() {
  var comp2 =
    parseInt(inBodyArr[0]["LBM(LeanBodyMass)"] * 2.20462).toFixed(2) -
    parseInt(
      inBodyArr[inBodyArr.length - 1]["LBM(LeanBodyMass)"] * 2.20462
    ).toFixed(2);
  if (comp2 > 0) {
    $("h7 .lean-mass-start").html("a Decrease of " + comp2 + " lbs");
  } else if (comp2 === 0) {
    $("h7 .lean-mass-start").html("No changes ");
  } else {
    comp2 *= -1;
    $("h7 .lean-mass-start").html("an Increase of " + comp2 + " lbs");
  }
}

//COMPARE body fat mass
function compFat() {
  var comp = 0;
  if (inBodyArr.length > 2) {
    comp =
      parseInt(
        inBodyArr[inBodyArr.length - 1]["BFM(BodyFatMass)"] * 2.20462
      ).toFixed(2) -
      parseInt(
        inBodyArr[inBodyArr.length - 2]["BFM(BodyFatMass)"] * 2.20462
      ).toFixed(2);
    if (comp >= 1) {
      $("h7 .body-fat").html("a Decrease of " + comp + " lbs");
    } else if (comp === 0) {
      $("h7 .body-fat").html("No changes ");
    } else {
      comp *= -1;
      $("h7 .body-fat").html("an Increase of " + comp + " lbs");
    }
  } else if (inBodyArr.length === 2) {
    comp =
      parseInt(inBodyArr[0]["BFM(BodyFatMass)"] * 2.20462).toFixed(2) -
      parseInt(inBodyArr[1]["BFM(BodyFatMass)"] * 2.20462).toFixed(2);
    if (comp >= 1) {
      $("h7 .body-fat").html("a Decrease of " + comp + " lbs");
    } else if (comp === 0) {
      $("h7 .body-fat").html("No changes ");
    } else {
      comp *= -1;
      $("h7 .body-fat").html("an Increase of " + comp + " lbs");
    }
  } else {
    if (inBodyArr.length === 1) {
      $("h7 .body-fat").html("No changes");
    }
  }
}

//COMPARE lean body mass
function compLean() {
  var comp = 0;
  if (inBodyArr.length > 2) {
    comp =
      parseInt(
        inBodyArr[inBodyArr.length - 1]["LBM(LeanBodyMass)"] * 2.20462
      ).toFixed(2) -
      parseInt(
        inBodyArr[inBodyArr.length - 2]["LBM(LeanBodyMass)"] * 2.204622
      ).toFixed(2);
    if (comp >= 1) {
      $("h7 .lean-mass").html("a Decrease of " + comp + " lbs");
    } else if (comp === 0) {
      $("h7 .lean-mass").html("No changes ");
    } else {
      comp *= -1;
      $("h7 .lean-mass").html("an Increase of " + comp + " lbs");
    }
  } else if (inBodyArr.length === 2) {
    comp =
      parseInt(inBodyArr[0]["LBM(LeanBodyMass)"] * 2.20462).toFixed(2) -
      parseInt(inBodyArr[1]["LBM(LeanBodyMass)"] * 2.20462).toFixed(2);
    if (comp >= 1) {
      $("h7 .lean-mass").html("a Decrease of " + comp + " lbs");
    } else if (comp === 0) {
      $("h7 .lean-mass").html("No changes ");
    } else {
      comp *= -1;
      $("h7 .lean-mass").html("an Increase of " + comp + " lbs");
    }
  } else {
    if (inBodyArr.length === 1) {
      $("h7 .lean-mass").html("No changes");
    }
  }
}

// function selectDatetime(userData) {
//   if (userData.length > 3) {
//     lastDatetime = userData[userData.length - 2];
//   } else if (userData.length === 3) {
//     lastDatetime = userData[1];
//   } else {
//     lastDatetime = userData[0];
//   }
// }

//Functions to get TRENDS of values form inBody data

//Body Fat Values
function bfValues() {
  for (i = 0; i < inBodyArr.length; ++i) {
    bfValues1.push(inBodyArr[i]["BFM(BodyFatMass)"] * 2.20462);
  }
  var newValues = bfValues1.map(function(x) {
    bfValues2.push(parseInt(x, 10));
  });
}

//Skeletal Muscle Value
function skmValues() {
  for (i = 0; i < inBodyArr.length; ++i) {
    skmValues1.push(inBodyArr[i]["SMM(SkeletalMuscleMass)"] * 2.20462);
  }
  var newValues = skmValues1.map(function(x) {
    skmValues2.push(parseInt(x, 10));
  });
}

//Right Arm Fat
function rgArmFat() {
  for (i = 0; i < inBodyArr.length; ++i) {
    rgArmFat1.push(inBodyArr[i]["BFMofRightArm"] * 2.20462);
  }
  var newValues = rgArmFat1.map(function(x) {
    rgArmFat2.push(parseInt(x, 10));
  });
}

//Right Arm Muscle
function rgArmMusc() {
  for (i = 0; i < inBodyArr.length; ++i) {
    rgArmMusc1.push(inBodyArr[i]["LBMofRightArm"] * 2.20462);
  }
  var newValues = rgArmMusc1.map(function(x) {
    rgArmMusc2.push(parseInt(x, 10));
  });
}

//Left Arm Fat
function lfArmFat() {
  for (i = 0; i < inBodyArr.length; ++i) {
    lfArmFat1.push(inBodyArr[i]["BFMofRightArm"] * 2.20462);
  }
  var newValues = lfArmFat1.map(function(x) {
    lfArmFat2.push(parseInt(x, 10));
  });
}

//Left Arm Muscle
function lfArmMusc() {
  for (i = 0; i < inBodyArr.length; ++i) {
    lfArmMusc1.push(inBodyArr[i]["LBMofRightArm"] * 2.20462);
  }
  var newValues = lfArmMusc1.map(function(x) {
    lfArmMusc2.push(parseInt(x, 10));
  });
}

//CHARTS Section
function pieChart() {
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [
        {
          data: [
            parseInt(
              inBodyArr[inBodyArr.length - 1]["LBM(LeanBodyMass)"] * 2.20462
            ),
            parseInt(
              inBodyArr[inBodyArr.length - 1]["BFM(BodyFatMass)"] * 2.20462
            )
          ],
          backgroundColor: ["#50C1E3", "#DE6351"]
        }
      ],
      labels: [
        "Lean Body Mass" +
          (
            inBodyArr[inBodyArr.length - 1]["LBM(LeanBodyMass)"] * 2.20462
          ).toFixed(2) +
          "lbs",
        "Body Fat Mass " +
          (
            inBodyArr[inBodyArr.length - 1]["BFM(BodyFatMass)"] * 2.20462
          ).toFixed(2) +
          "lbs"
      ],
      options: { responsive: true }
    }
  });
}

function smmLineChart1() {
  var ctx = document.getElementById("smm-fm-chart1");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      datasets: [
        {
          label: "Skeletal Muscle Mass",
          data: skmValues2,
          borderColor: "#50C1E3",
          backgroundColor: "rgb(0,0,0,0.0)"
        },
        {
          label: "Body Fat Mass",
          data: bfValues2,
          borderColor: "#DE6351",
          backgroundColor: "rgb(0,0,0,0.0)"
        }
      ]
    }
  });
}

//BODY FAT trends
function bfTrend1() {
  var ctx = document.getElementById("bf-trend-chart1");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      datasets: [
        {
          label: "Body Fat Mass",
          data: bfValues2,
          borderColor: "#50C1E3",
          backgroundColor: "rgb(0,0,0,0.0)"
        }
        // {
        //   label: "Body Fat Mass",
        //   data: bfValues2,
        //   borderColor: "#DE6351",
        //   backgroundColor: "rgb(0,0,0,0.0)"
        // }
      ]
    }
  });
}

//RIGHT arm chart
function rightArmChart() {
  var ctx = document.getElementById("right-arm-chart");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      datasets: [
        {
          label: "Right Arm Muscle Mass",
          data: rgArmMusc2,
          borderColor: "#50C1E3",
          backgroundColor: "rgb(0,0,0,0.0)"
        },
        {
          label: "Right Arm Fat Mass",
          data: rgArmFat2,
          borderColor: "#DE6351",
          backgroundColor: "rgb(0,0,0,0.0)"
        }
      ]
    }
  });
}

//LEFT arm chart
function leftArmChart() {
  var ctx = document.getElementById("left-arm-chart");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      datasets: [
        {
          label: "Left Arm Muscle Mass",
          data: lfArmMusc2,
          borderColor: "#50C1E3",
          backgroundColor: "rgb(0,0,0,0.0)"
        },
        {
          label: "Left Arm Fat Mass",
          data: lfArmFat2,
          borderColor: "#DE6351",
          backgroundColor: "rgb(0,0,0,0.0)"
        }
      ]
    }
  });
}
