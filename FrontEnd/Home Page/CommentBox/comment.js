document.addEventListener("DOMContentLoaded", function () {
  const discussionBox = document.getElementById("discussionBox");
  const discussionPanel = document.querySelector(".discussionPanel");
  const commentTextarea = document.getElementById("commentTextArea");
  const inputField = document.getElementById("inputField");
  const clearButton = document.getElementById("clear");
  const commentButton = document.getElementById("commentButton");
  const commentBox = document.getElementById("comments");
  const commentList = [
    { userId: "605c2d2f32380c413ca56701", text: "Great question!" },
    { userId: "605c2d2f32380c413ca56702", text: "I found this tricky." },
    { userId: "605c2d2f32380c413ca56703", text: "Nice image included." },
    { userId: "605c2d2f32380c413ca56704", text: "Easy one, but well done!" },
    {
      userId: "605c2d2f32380c413ca56705",
      text: "I need more questions like this.",
    },
    { userId: "605c2d2f32380c413ca56706", text: "Challenging, but fun!" },
    { userId: "605c2d2f32380c413ca56707", text: "Good test overall." },
    { userId: "605c2d2f32380c413ca56708", text: "Excellent explanation." },
    { userId: "605c2d2f32380c413ca56709", text: "Too easy for my level." },
    {
      userId: "605c2d2f32380c413ca56710",
      text: "I enjoyed the variety of questions.",
    },
    { userId: "605c2d2f32380c413ca56711", text: "More images would be great." },
    { userId: "605c2d2f32380c413ca56712", text: "I disagree with the answer." },
    { userId: "605c2d2f32380c413ca56713", text: "Perfect difficulty level." },
    {
      userId: "605c2d2f32380c413ca56714",
      text: "Needs improvement on clarity.",
    },
    { userId: "605c2d2f32380c413ca56715", text: "Well-organized test." },
    {
      userId: "605c2d2f32380c413ca56716",
      text: "Not enough time for some questions.",
    },
    {
      userId: "605c2d2f32380c413ca56717",
      text: "I would recommend this test.",
    },
    { userId: "605c2d2f32380c413ca56718", text: "Interesting questions!" },
    { userId: "605c2d2f32380c413ca56719", text: "I aced it!" },
    {
      userId: "605c2d2f32380c413ca56720",
      text: "More tests from this author, please.",
    },
  ];

  commentList.forEach((comObj)=>{
    const comment = comObj.text.trim();
    const commentUser = document.createElement("h4");
    commentUser.textContent=comObj.userId.trim();
    if(comment!==""){
      const newCommentContent = document.createElement("div");
      const newComment = document.createElement("div");
      newCommentContent.textContent=comment;
      newComment.appendChild(commentUser);
      newComment.appendChild(newCommentContent);
      commentBox.appendChild(newComment);
    }
  })

  //function to toggle visiblility of discussion Box
  function toggleDiscussionBox() {
    discussionPanel.classList.toggle("visible");
    discussionBox.classList.toggle("visible");
  }

  //function to handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    const comment = commentTextarea.value.trim();
    if (comment !== "") {
      const newCommentContent = document.createElement("div");
      const newComment = document.createElement("div");
      const commentUser = document.createElement("h4");
      //changes required (User name)
      commentUser.textContent = "Me";
      newComment.appendChild(commentUser);
      newComment.appendChild(newCommentContent);
      newCommentContent.textContent = comment;
      commentBox.appendChild(newComment);
      commentTextarea.value = "";
    }
  }

  commentButton.addEventListener("click", toggleDiscussionBox);

  inputField.addEventListener("click", handleSubmit);

  clearButton.addEventListener("click", (event) => {
    event.preventDefault();
    commentTextarea.value = "";
  });
});
