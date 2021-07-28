const dropArea = document.getElementById("drop-area");
const fileUpload = document.getElementById("file-upload");
const form = document.getElementById("form");
const statusBarContainer = document.getElementById("status-bar-container");
const statusbar = document.getElementById("status-bar");
const fileUploadSuccess = document.getElementById("file-upload-success");
const fileStatus = document.getElementById("file-status");
const submitBtn = document.getElementById("submit-btn");
const baseUrl = "http://localhost:4000/api";
let file = null;

async function handleSubmit(event) {
  event.preventDefault();

  try {
    const formData = new FormData();
    formData.append("video", file, file.name);

    statusBarContainer.classList.remove("hidden");
    submitBtn.classList.add("opacity-50");
    submitBtn.classList.add("cursor-not-allowed");
    submitBtn.disabled = true;

    const res = await axios.post(baseUrl + "/convert", formData, {
      onUploadProgress,
      onDownloadProgress,
    });

    await promptFileDownloader(res);
  } catch (e) {
    showNotif(e.message);
  } finally {
    resetUI();
  }
}

function resetUI() {
  file = null;
  fileStatus.innerText = "";
  statusBarContainer.classList.add("hidden");
  fileUploadSuccess.classList.add("hidden");
  submitBtn.classList.remove("opacity-50");
  submitBtn.classList.remove("cursor-not-allowed");
  submitBtn.disabled = false;
}

function promptFileDownloader(response) {
  return new Promise((resolve) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", response.headers["x-filename"]);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    resolve();
  });
}

const onUploadProgress = (progressEvent) => {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );

  if (fileStatus.textContent !== "Uploading the file...") {
    fileStatus.textContent = "Uploading the file...";
  }
  updateStatusBarUI(percentCompleted);
};

const onDownloadProgress = (progressEvent) => {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  if (fileStatus.textContent !== "Downloading the file...") {
    fileStatus.textContent = "Downloading the file...";
  }
  updateStatusBarUI(percentCompleted);
};

function updateStatusBarUI(percentCompleted) {
  statusbar.style.width = percentCompleted + "%";
  statusbar.innerText = percentCompleted + "%";
}

function updateUIOnFileSelection(file) {
  fileUploadSuccess.classList.remove("hidden");
  fileUploadSuccess.children[1].innerHTML = `${file.name} selected`;
}

function checkFileExtension(file, fileExtension) {
  return file?.type?.split("/")[1] === fileExtension;
}

function onDragEnter(event) {
  event.preventDefault();
  dropArea.classList.add("bg-gray-200");
}

function onDragLeave(event) {
  event.preventDefault();
  dropArea.classList.remove("bg-gray-200");
}

function showNotif(message) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    backgroundColor: "#dc2f02",
    color: "#fffffc",
    stopOnFocus: true,
  }).showToast();
}

function onDrop(event) {
  dropArea.classList.remove("bg-gray-200");
  event.preventDefault();
  try {
    const selectedFile = event.dataTransfer.items[0].getAsFile();
    if (!checkFileExtension(selectedFile, "webm")) {
      throw new Error("File extension is not supported");
    }
    file = selectedFile;
    updateUIOnFileSelection(file);
  } catch (ex) {
    showNotif(ex.message);
  }
}

function onFileChange(event) {
  event.preventDefault();
  file = fileUpload.files[0];
  updateUIOnFileSelection(file);
}

form.addEventListener("submit", handleSubmit);
dropArea.addEventListener("dragenter", onDragEnter);
dropArea.addEventListener("dragleave", onDragLeave);
dropArea.addEventListener("drop", onDrop);
dropArea.addEventListener("dragover", (ev) => ev.preventDefault());
fileUpload.addEventListener("change", onFileChange);
