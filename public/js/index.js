const baseUrl = window.baseUrl;

const dropArea = document.getElementById("drop-area");
const fileUpload = document.getElementById("file-upload");
const form = document.getElementById("form");
const statusBarContainer = document.getElementById("status-bar-container");
const statusbar = document.getElementById("status-bar");
const fileUploadSuccess = document.getElementById("file-upload-success");
const fileStatus = document.getElementById("file-status");
const submitBtn = document.getElementById("submit-btn");

let file = null;

async function handleSubmit(event) {
  event.preventDefault();

  try {
    if (!file) throw new Error("you need to select a file ");
    const formData = new FormData();
    formData.append("video", file, file.name);

    statusBarContainer.classList.remove("hidden");
    submitBtn.classList.add("opacity-50");
    submitBtn.classList.add("cursor-not-allowed");
    submitBtn.disabled = true;

    const res = await axios.post(baseUrl + "/convert", formData, {
      responseType: "blob",
      onUploadProgress,
      onDownloadProgress,
    });
    console.log(res.data);
    await promptFileDownloader(res);
  } catch (e) {
    console.log(e);
    showToast(e.message);
  } finally {
    resetUI();
  }
}

function resetUI() {
  file = null;
  fileUpload.value = null;
  fileStatus.innerText = "";
  statusBarContainer.classList.add("hidden");
  fileUploadSuccess.classList.add("hidden");
  submitBtn.classList.remove("opacity-50");
  submitBtn.classList.remove("cursor-not-allowed");
  submitBtn.disabled = false;
}

function promptFileDownloader(response) {
  return new Promise((resolve) => {
    const blob = new Blob([response.data], {
      type: "application/octet-stream",
    });
    const filename = response.headers["x-filename"];
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      // IE workaround for "HTML7007: One or more blob URLs were
      // revoked by closing the blob for which they were created.
      // These URLs will no longer resolve as the data backing
      // the URL has been freed."
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const blobURL =
        window.URL && window.URL.createObjectURL
          ? window.URL.createObjectURL(blob)
          : window.webkitURL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.style.display = "none";
      tempLink.href = blobURL;
      tempLink.setAttribute("download", filename);

      // Safari thinks _blank anchor are pop ups. We only want to set _blank
      // target if the browser does not support the HTML5 download attribute.
      // This allows you to download files in desktop safari if pop up blocking
      // is enabled.
      if (typeof tempLink.download === "undefined") {
        tempLink.setAttribute("target", "_blank");
      }

      document.body.appendChild(tempLink);
      tempLink.click();

      // Fixes "webkit blob resource error 1"
      setTimeout(function () {
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
      }, 200);
      resolve();
    }
  });
}

const onUploadProgress = (progressEvent) => {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );

  if (fileStatus.textContent !== "Uploading the file...") {
    fileStatus.textContent = "Uploading the file...";
  } else if (percentCompleted === 100) {
    fileStatus.textContent = "Converting ...";
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

function showToast(message) {
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
    showToast(ex.message);
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
form.addEventListener("reset", (event) => {
  resetUI();
});
