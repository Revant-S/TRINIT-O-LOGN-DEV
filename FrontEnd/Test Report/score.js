// let CurrentPage=document.getElementById("scoreCard");
// CurrentPage.classList.add("active");


document.addEventListener("DOMContentLoaded", function () {
  var menuOption = document.querySelectorAll(".menuOption");
  var currentLocation = window.location.href;

  menuOption.forEach(function (link) {
    if (link.href === currentLocation) {
      link.classList.add("activeOption");
    }
  });

  var menuLinks = document.querySelectorAll(".menuLink");
  var currentLocation = window.location.href;

  menuLinks.forEach(function (link) {
    if (link.href === currentLocation) {
      link.classList.add("active");
      menuOption[2].classList.add("activeOption");
    }
  });
});
