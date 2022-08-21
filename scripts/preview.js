const btn = document.querySelector("#calendar-btn");
const btnChart = document.querySelector("#chart-btn");
const btnTable = document.querySelector("#table-btn");

// window.addEventListener("load", () => {
  document.querySelector("main").style.visibility = "hidden";
// });

btn.addEventListener("click", () => {
  document.querySelector("main").style.visibility = "visible";
  document.querySelector("main").style.overflowY = "hidden";
  document.querySelector(".chart").classList.add("visible");
  document.querySelector(".tabella").classList.add("visible");
  document.getElementById("calendar").style.display = "flex";
});

btnTable.addEventListener("click", () => {
  document.querySelector("main").style.visibility = "visible";
  document.querySelector("main").style.overflowY = "scroll";
  document.querySelector(".chart").classList.add("visible");
  document.getElementById("calendar").style.display = "none";
  document.querySelector(".tabella").classList.remove("visible");
});

btnChart.addEventListener("click", () => {
  document.querySelector("main").style.visibility = "visible";
  document.querySelector("main").style.overflowY = "hidden";
  document.querySelector(".tabella").classList.add("visible");
  document.getElementById("calendar").style.display = "none";
  document.querySelector(".chart").classList.remove("visible");
});
