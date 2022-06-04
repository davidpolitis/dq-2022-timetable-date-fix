// ==UserScript==
// @name        DQ 2022 Timetable Date Fix
// @namespace   https://davidpolitis.net
// @match       https://www.q-dance.com/en/events/defqon-1/defqon-1-weekend-festival-2022/lineup
// @require     https://momentjs.com/downloads/moment.min.js
// @require     https://momentjs.com/downloads/moment-timezone-with-data-10-year-range.min.js
// @grant       none
// @version     1.0
// @author      David Politis
// @description Converts from local time to CEST
// ==/UserScript==

const twelveHourTime = true; // set to false to keep times in 24-hour format

function convertLocalTime(val) {
  return moment(val, "HH:mm").tz("Europe/Amsterdam").format(twelveHourTime ? "hh:mm A" : "HH:mm");
}

function convertDQTimes() {
  const timeRows = document.querySelectorAll(".time-table-defqon__row");
  if (timeRows) {
    for (let i = 0; i < timeRows.length; ++i) {
      timeRows[i].textContent = convertLocalTime(timeRows[i].textContent);
      if (twelveHourTime)
        timeRows[i].style.right = "10px"; 
    }
  }
  const timeSlots = document.querySelectorAll(".defqon-timeslot__time");
  if (timeSlots) {
    for (let i = 0; i < timeSlots.length; ++i) {
      const timeRanges = timeSlots[i].textContent.split(" - ");
      timeSlots[i].textContent = convertLocalTime(timeRanges[0]) + " - " + convertLocalTime(timeRanges[1]);
    }
  }
}

window.onload = function() {
  convertDQTimes();
  
  const dayButtons = document.querySelectorAll(".defqon-timetable-overview__btn");
  if (dayButtons) {
    dayButtons[0].classList.add("activeday");
    for (let i = 0; i < dayButtons.length; ++i) {
      dayButtons[i].addEventListener("click", function() {
        if (!dayButtons[i].classList.contains("activeday")) {
          convertDQTimes();
          dayButtons[i].classList.add("activeday");
        }
      });
    }
  }
};