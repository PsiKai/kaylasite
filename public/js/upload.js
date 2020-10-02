function select(e) {
  var catSelect = e.target;
  var radios = document.querySelectorAll("label.radio")
  for (i=0; i < radios.length; i++) {
    radios[i].classList.remove("selected")
  }
  catSelect.classList.add("selected")
  var subSelect = document.querySelector(".sub.selected")
  if (subSelect) {
    subSelect.classList.remove("selected")
  }
};

function onSelect() {
  var inputFile = document.querySelector(".inputfile").value;
  var splitFile = inputFile.split('\\')
  document.querySelector("#fileName").innerHTML = splitFile[2];
  document.querySelector(".inputfile").filename = inputFile;
  var preview = document.getElementById('preview');
  preview.src = window.URL.createObjectURL(event.target.files[0])
  preview.classList.remove("hidden")
};

function onChange(e) {
  var select = e.target.value;
  var subs = document.querySelectorAll(".sub");
  var hiddenSubs = document.querySelectorAll(".sub:not(.hidden)");
  var allImgs = document.querySelectorAll('.img:not(.hidden)');
  for (i = 0; i < allImgs.length; i++) {
    allImgs[i].classList.add('hidden')
  }
  for (i = 0; i < hiddenSubs.length; i++) {
    hiddenSubs[i].classList.add('hidden')
  }
  var options  = document.getElementsByClassName("sub " + select)
  for (i=0; i < options.length; i++) {
    options[i].classList.remove("hidden")
  }
};


function showImg(e) {
  var refresh = document.querySelectorAll(".img")
  for (i=0; i < refresh.length; i++) {
    var src = refresh[i].getAttribute("src")
    refresh[i].setAttribute("src", src)
  }
  var allImgs = document.querySelectorAll('.img:not(.hidden)');
  for (i = 0; i < allImgs.length; i++) {
    allImgs[i].classList.add("hidden")
  }
  var subject = e.target.innerHTML.toLowerCase().replace(/ /g, "-").replace("&amp;", "and");
  var select = document.querySelectorAll("[name=medium]")
  var category = ''
  for (i=0; i < select.length; i++) {
    if (select[i].checked) {
      var category = select[i].value;
    }
  }
  var images = document.querySelectorAll("." + subject + "." + category);
  for (i = 0; i < images.length; i++) {
    images[i].classList.remove("hidden")
  }
  var subs = document.querySelectorAll(".sub")
  for (i=0; i < subs.length; i++) {
    subs[i].classList.remove("selected")
  }
  e.target.classList.add("selected")
  var clickedImg = document.querySelector("[name=clicked]")
  if (clickedImg) {
    console.log(clickedImg);
    clickedImg.setAttribute("name", "")
    clickedImg.classList.remove("img-clicked")
  }
  document.querySelector(".del-label").classList.add("hidden")
};

function highlight(e) {
  for (i = 0; i < document.querySelectorAll("[name=clicked]").length; i++) {
    var clicked = document.querySelectorAll("[name=clicked]");
    clicked[i].removeAttribute("name", "clicked")
  }
  for (i = 0; i < document.querySelectorAll(".img-clicked").length; i++) {
    var imgSelect = document.querySelectorAll(".img-clicked");
    imgSelect[i].classList.remove("img-clicked")
  }
  e.target.classList.toggle("img-clicked")
  e.target.setAttribute('name', "clicked")
  var input = document.querySelector(".delete-img")
  input.setAttribute("value", document.querySelectorAll("[name=clicked]")[0].src)
  var label = document.querySelector(".del-label");
  label.innerHTML = input.value.split("/")[6].split("-thumb")[0] + ".jpg";
  label.classList.remove("hidden")
  document.querySelector("label.alert-danger").classList.add("hidden")
};

function verify() {
  var found = false;
  // document.querySelector(".img-clicked").remove()
  var chosenImg = document.querySelectorAll(".img")
  for (i=0; i < chosenImg.length; i++) {
    if (chosenImg[i].getAttribute("name") === "clicked") {
      found = true;
      break;
    }
  }
  if (found === false) {
    document.querySelector("label.alert-danger").classList.remove("hidden")
  }
  return found;
};
