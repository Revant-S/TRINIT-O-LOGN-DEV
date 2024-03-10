document.addEventListener("DOMContentLoaded", function () {
  var menuLinks = document.querySelectorAll(".menuOption");
  var currentLocation = window.location.href;

  function getFileName(file, msg) {
    file.addEventListener("change", (e) => {
      const [file] = e.target.files;
      const { name: fileName, size } = file;
      const fileSize = (size / 1000).toFixed(2);
      const fileNameAndSize = `${fileName} - ${fileSize}KB`;
      document.getElementById(msg).textContent = fileNameAndSize;
    });
  }

  const Qfile = document.getElementById("QuestionPaper");
  getFileName(Qfile, "QfileName");

  const Afile = document.getElementById("AnswerKey");
  getFileName(Afile, "AfileName");
  menuLinks.forEach(function (link) {
    if (link.href === currentLocation) {
      link.classList.add("active");
    }
  });
});


