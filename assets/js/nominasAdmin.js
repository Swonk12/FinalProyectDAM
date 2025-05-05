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
        files.forEach((file) => {
            const li = document.createElement("li");
            li.textContent = `${file.name}`;
            fileList.appendChild(li);
        });
    }

    uploadButton.addEventListener("click", () => {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('nominas[]', file);
        });

        fetch('../api/uploadNominas.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            let errores = [];
            let exitos = [];

            result.forEach(entry => {
                if (entry.status === "success") {
                    exitos.push(entry.file);
                } else if (entry.status === "formato_invalido") {
                    errores.push(`${entry.file} - Formato inválido`);
                } else {
                    errores.push(`${entry.file} - Error al guardar`);
                }
            });

            if (exitos.length > 0) {
                alert(`Archivos subidos correctamente:\n- ${exitos.join('\n- ')}`);
            }

            if (errores.length > 0) {
                alert(`Algunos archivos no se subieron:\n- ${errores.join('\n- ')}`);
            }

            files = [];
            renderFileList();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un error al subir los archivos");
        });
    });
});
