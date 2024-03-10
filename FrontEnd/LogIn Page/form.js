function fadeInElements(elements) {
  elements.forEach((item, i) => {
    setTimeout(() => {
      item.style.opacity = 1;
    }, i * 100);

    if (item.children.length > 0) {
      fadeInElements([...item.children]);
    }
  });
}

let check = false;
const errorMessage = document.querySelectorAll(".errorMessage");
const age = document.querySelector(".age");
const mobno = document.querySelector(".mobno");
const firstName = document.querySelector(".firstName");
const lastName = document.querySelector(".lastName");
const email = document.querySelector(".email");
const password = document.querySelector(".password");

function Validating(condt, ind, msg) {
  if (condt) {
    errorMessage[ind].style.opacity = 1;
    errorMessage[ind].textContent = msg;
    return false;
  } else {
    errorMessage[ind].textContent = "";
    errorMessage[ind].style.opacity = 0;
    return true;
  }
}

function validateInput() {
  let ageValue = parseInt(age.value);
  let ageCheck = ageValue < 0 || isNaN(ageValue) || ageValue > 150;
  check = Validating(ageCheck, 2, "Enter a valid age");
  let mobValue = parseInt(mobno.value);
  let mobCheck =
    mobValue < 0 ||
    isNaN(mobValue) ||
    mobValue / 1000000000 < 1 ||
    mobValue / 1000000000 > 9;
  check = Validating(mobCheck, 4, "Enter a valid phone Number");
  let fName = firstName.value;
  let fNameCheck = fName == "";
  check = Validating(fNameCheck, 0, "The field is required");
  let lName = lastName.value;
  let lNameCheck = lName == "";
  check = Validating(lNameCheck, 1, "The field is required");
  let emailField = email.value;
  let emailCheck = emailField == "";
  check = Validating(emailCheck, 5, "The field is required");
  let passField = password.value;
  let passCheck = passField == "";
  check = Validating(passCheck, 6, "The field is required");
  if (check) {
    window.location.href = "/Profile_Page/index.html";
  }
}

const form = document.querySelector(".form");
fadeInElements([...form.children]);
