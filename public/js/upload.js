// Define global variables
var radios = Array.from(document.querySelectorAll("label.radio"))
var alert = document.querySelector("label.alert-danger")
var updateForm = document.querySelector(".update-data")
var downArrow = document.querySelector(".fa-angle-double-down")
var thumbnails = Array.from(document.querySelectorAll(".img"))
var artworkName = document.querySelector(".del-label")

//Radio button labels to select art medium at upload and delete section
function selectMedium(e) {
	//remove alerts and any other highlights
	alert.classList.add("hidden")
	artworkName.classList.add("hidden")
	radios.forEach((radio) => radio.classList.remove("selected"))

	//highlight selected art medium
	var catSelect = e.target
	catSelect.classList.add("selected")
	var subSelect = document.querySelector(".sub.selected")
	if (subSelect) {
		subSelect.classList.remove("selected")
	}
}

//file upload label that replaces native input[type="file"] layout
function previewImageUpload() {
	//parses file name and sets it to the label text
	var inputFile = document.querySelector(".inputfile")
	var splitFile = inputFile.value.split("\\")
	var inputLabel = document.querySelector("#fileName")
	inputLabel.innerHTML = splitFile[2]
	inputFile.filename = inputFile

	//create thumbnail preview of file upload
	var preview = document.getElementById("preview")
	preview.src = window.URL.createObjectURL(event.target.files[0])
	preview.classList.remove("hidden")
}

//reveals subcategory buttons when art medium category is selected
function revealSubCategories(e) {
	//hides any revealed subcategories and update form
	alert.classList.add("hidden")
	updateForm.classList.add("hidden")
	downArrow.classList.add("hidden")

	//removes .hidden from elements to be revealed
	var hiddenCategories = Array.from(
		document.querySelectorAll(".sub:not(.hidden)")
	)
	var revealedThumbnails = Array.from(
		document.querySelectorAll(".img:not(.hidden)")
	)
	revealedThumbnails.forEach((img) => img.classList.add("hidden"))
	hiddenCategories.forEach((category) => category.classList.add("hidden"))

	//reveals subcategory buttons for selected medium
	var select = e.target.value
	var options = Array.from(document.getElementsByClassName("sub " + select))
	options.forEach((option) => option.classList.remove("hidden"))
}

//reveals thumbnails of images to be deleted/edited
function showImg(e) {
	//hides any revealed thumbnail images and resets selection to event target
	updateForm.classList.add("hidden")
	downArrow.classList.add("hidden")
	alert.classList.add("hidden")
	artworkName.classList.add("hidden")

	var revealedThumbnails = Array.from(
		document.querySelectorAll(".img:not(.hidden)")
	)
	revealedThumbnails.forEach((img) => img.classList.add("hidden"))

	var subCategories = Array.from(document.querySelectorAll(".sub"))
	subCategories.forEach((sub) => sub.classList.remove("selected"))

	var clickedImg = document.querySelector("[name=clicked]")
	if (clickedImg) {
		clickedImg.setAttribute("name", "")
		clickedImg.classList.remove("img-clicked")
	}

	e.target.classList.add("selected")

	//reveals thumbnails of images matching the chosen subcategory
	var subject = e.target.innerHTML
		.toLowerCase()
		.replace(/ /g, "-")
		.replace("&amp;", "and")
	var category = document.querySelector("[name=medium]:checked").value
	var images = Array.from(
		document.querySelectorAll("." + subject + "." + category)
	)
	images.forEach((img) => img.classList.remove("hidden"))
}

//highlights the selected thumbnail images
function highlight(e) {
	//Removes previously selected image and alert
	var highlightedImg = Array.from(document.querySelectorAll("[name=clicked]"))
	highlightedImg.forEach((img) => {
		img.removeAttribute("name", "clicked")
		img.classList.remove("img-clicked")
	})
	alert.classList.add("hidden")

	//Sets new styles on selected image
	e.target.classList.toggle("img-clicked")
	e.target.setAttribute("name", "clicked")
	var chosenImg = document.querySelector("[name=clicked]")

	//Reveals a label with the current selection's title
	var input = document.querySelector(".delete-img")
	input.setAttribute("value", chosenImg.src)
	artworkName.innerHTML = input.value.split("/")[6].split("-thumb")[0] + ".jpg"
	artworkName.classList.remove("hidden")

	//Delete input and create new input with current selection starting values
	if (document.querySelector("[name=old-image]")) {
		document.querySelector("[name=old-image]").remove()
	}
	var imgEdit = document.createElement("input")
	imgEdit.setAttribute("type", "text")
	imgEdit.className = "img-edit hidden"
	imgEdit.value = chosenImg.src
	imgEdit.name = "oldImage"
	document.getElementById("updateForm").appendChild(imgEdit)

	//Fill update form with current selection starting values
	var currentCategory = e.target.getAttribute("data-category").split("/")[0]
	var labels = Array.from(document.querySelectorAll("label.update"))
	labels.forEach(
		(label) => label.innerText === currentCategory && label.click()
	)
	document.querySelector("#subcatUp").value =
		document.querySelector("#subcat.selected").innerText
	document.querySelector("#artnameUp").value =
		artworkName.innerText.split(".")[0]
}

//selects art medium in update form
function updateMedium(e) {
	var radioUpdate = Array.from(document.querySelectorAll("label.update"))
	radioUpdate.forEach((medium) => medium.classList.remove("selected"))
	e.target.classList.add("selected")
}

//form verification
function verify() {
	var found = false
	var chosenImg = document.querySelectorAll(".img")
	for (i = 0; i < chosenImg.length; i++) {
		if (chosenImg[i].getAttribute("name") === "clicked") {
			found = true
			break
		}
	}
	if (found === false) {
		alert.classList.remove("hidden")
	}
	return found
}

//reveals update form with selected artwork to edit
function edit() {
	var updateImg = document.querySelectorAll(".img")

	for (i = 0; i < updateImg.length; i++) {
		if (updateImg[i].getAttribute("name") === "clicked") {
			updateForm.classList.toggle("hidden")
			alert.classList.add("hidden")
			downArrow.classList.toggle("hidden")
			break
		} else {
			alert.classList.remove("hidden")
		}
	}
}
