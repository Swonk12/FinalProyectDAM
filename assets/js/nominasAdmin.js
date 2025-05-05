document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const fileList = document.getElementById("file-list");
    const uploadButton = document.getElementById("upload-button");
    let files = [];

    // Drag and drop events
    dropZone.addEventListener("click", () => fileInput.click());

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener("change", () => {
        handleFiles(fileInput.files);
    });

    function handleFiles(selectedFiles) {
        for (let file of selectedFiles) {
            files.push(file);
        }
        renderFileList();
    }

    function renderFileList() {
        fileList.innerHTML = "";
        files.forEach((file, index) => {
            const li = document.createElement("li");
            li.textContent = `${file.name}`;
            fileList.appendChild(li);
        });
    }

    uploadButton.addEventListener("click", () => {
        // Guardamos Archivos en Local
        

        // Guardamos Archivos en la Base de Datos (API)
        console.log("Ahora envia", files);
    });
});
