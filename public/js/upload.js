function select(e) {
  document.querySelector("label.alert-danger").classList.add("hidden")
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
  document.querySelector("label.del-label").classList.add("hidden")
  document.querySelector(".update-data").classList.add("hidden");
  document.querySelector(".fa-angle-double-down").classList.add("hidden");
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
  document.querySelector(".update-data").classList.add("hidden");
  document.querySelector(".fa-angle-double-down").classList.add("hidden")
  document.querySelector(".alert").classList.add("hidden")
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
  var chosenImg = document.getElementsByName("clicked")[0]
  if (document.querySelector("[name=old-image]")) {
    document.querySelector("[name=old-image]").remove();
  }
  var imgEdit = document.createElement("input");
  imgEdit.setAttribute('type', "text")
  imgEdit.className = "img-edit hidden"
  imgEdit.value = chosenImg.src;
  imgEdit.name = "oldImage";
  document.getElementById("updateForm").appendChild(imgEdit);

  var currentCat = document.querySelector("[name=medium]").value
  var upperCat = currentCat.charAt(0).toLocaleUpperCase() + currentCat.slice(1)
  var labels = document.querySelectorAll("label.update")
  for (i=0; i < labels.length; i++) {
    if (labels[i].innerText === upperCat) {
      labels[i].click();
    }
  }
  document.querySelector("#subcatUp").value = document.querySelector("#subcat.selected").innerText
  document.querySelector("#artnameUp").value = document.querySelector(".del-label").innerText.split(".")[0]
};


function update(e) {
  var catUpdate = e.target;
  var radioUpdate = document.querySelectorAll("label.update")
  for (i=0; i < radioUpdate.length; i++) {
    radioUpdate[i].classList.remove("selected")
  }
  catUpdate.classList.add("selected")
};

function verify() {
  var found = false;
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


function edit() {
  var icon = document.querySelector("i.fa-angle-double-down");
  var updateImg = document.querySelectorAll(".img")
  for (i=0; i < updateImg.length; i++) {
    if (updateImg[i].getAttribute("name") === "clicked") {
      document.querySelector(".update-data").classList.toggle("hidden");
      document.querySelector("label.alert-danger").classList.add("hidden")
      icon.classList.toggle("hidden");
      break;
    } else {
      document.querySelector("label.alert-danger").classList.remove("hidden")
    }
  }
}
