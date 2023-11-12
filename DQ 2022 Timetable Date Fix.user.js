chaîne 2022// ==UserScript==
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

function waitForEl(parent, selector) {
  return new Promise(resolve => {
    var existingEls = parent.querySelectorAll(selector);
    if (existingEls.length)
      return resolve(existingEls);
      
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length) {
            const res = [];
            for (const {addedNodes} of mutations) {
              for (const node of addedNodes) {
                if (node.nodeType === 1) {
                  for (const child of node.querySelectorAll(selector)) {
                    res.push(child);
                  }
                }
              }
            }
            
            if (res.length) {
              resolve(res);
              observer.disconnect();
            }
          }
        }
      }
    });
    observer.observe(parent, { childList: true, subtree: true })
  });
}

function convertDQTimes() {
  waitForEl(document.documentElement, ".time-table-defqon__row").then((timeHeadings) => {
    for (const timeHeading of timeHeadings) {
      timeHeading.textContent = convertLocalTime(timeHeading.textContent);
      if (twelveHourTime)
        timeHeading.style.right = "10px";
    }
  });
  
  waitForEl(document.documentElement, ".defqon-timeslot__time").then((artistTimes) => {
    for (const artistTime of artistTimes) {
      const artistTimeRange = artistTime.textContent.split(" - ");
      artistTime.textContent = convertLocalTime(artistTimeRange[0]) + " - " + convertLocalTime(artistTimeRange[1]);
    }
  });
}

convertDQTimes();

waitForEl(document.documentElement, ".defqon-timetable-overview__btn").then((dayButtons) => {
  dayButtons[0].classList.add("activeday");
  for (const dayButton of dayButtons) {
    dayButton.addEventListener("click", function() {
        if (!dayButton.classList.contains("activeday")) {
          convertDQTimes();
          dayButton.classList.add("activeday");
        }
    });
  }
});