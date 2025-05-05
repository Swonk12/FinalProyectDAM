document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const fileList = document.getElementById("file-list");
    const uploadButton = document.getElementById("upload-button");
    let files = [];

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

    async function obtenerIdUsuario(nombre, apellido) {
        try {
            const response = await fetch("http://localhost:5064/api/Usuarios");
            const usuarios = await response.json();

            const usuario = usuarios.find(u =>
                u.nombre.toLowerCase() === nombre.toLowerCase() &&
                u.apellido.toLowerCase() === apellido.toLowerCase()
            );

            return usuario ? usuario.idUsuario : null;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            return null;
        }
    }

    uploadButton.addEventListener("click", async () => {
        let errores = [];
        let exitos = [];

        for (let file of files) {
            const nombreArchivo = file.name;

            // Validar formato
            const formatoValido = /^[a-zA-Z]+[a-zA-Z]*_[0-9]{1,2}_[0-9]{4}\.pdf$/;
            if (!formatoValido.test(nombreArchivo)) {
                errores.push(`${nombreArchivo} - Formato inválido`);
                continue;
            }

            const [nombreCompleto, mes, anioConExtension] = nombreArchivo.split("_");
            const anio = anioConExtension.replace(".pdf", "");

            const nombreSeparado = nombreCompleto.replace(/([a-z])([A-Z])/g, "$1 $2");
            const [nombre, apellido] = nombreSeparado.split(" ");

            const idUsuario = await obtenerIdUsuario(nombre, apellido);
            if (!idUsuario) {
                errores.push(`${nombreArchivo} - Usuario no encontrado`);
                continue;
            }

            const formData = new FormData();
            formData.append("nominas[]", file);
            formData.append("idUsuario", idUsuario);

            try {
                const response = await fetch("../../includes/uploadNominas.php", {
                    method: "POST",
                    body: formData
                });

                const text = await response.text();
                console.log("📄 Respuesta cruda del servidor:", text);

                const result = JSON.parse(text);

                for (let entry of result) {
                    if (entry.status === "success") {
                        exitos.push(entry.file);

                        // Construir datos para la API .NET
                        const mesAnio = `${mes.padStart(2, "0")}-${anio}`;
                        const nombreArchivoSinExtension = entry.file.replace(".pdf", "");
                        const fechaSubida = new Date().toISOString();

                        const nuevaNomina = {
                            idNomina: 0,
                            idUsuario: idUsuario,
                            mesAnio: mesAnio,
                            nombreArchivo: nombreArchivoSinExtension,
                            rutaArchivo: `../assets/uploads/${nombreArchivoSinExtension}`,
                            fechaSubida: fechaSubida
                        };

                        // Llamada a la API .NET
                        const apiResponse = await fetch("http://localhost:5064/api/Nominas", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(nuevaNomina)
                        });

                        if (!apiResponse.ok) {
                            errores.push(`${entry.file} - Fallo al guardar en la base de datos`);
                        }
                    } else if (entry.status === "formato_invalido") {
                        errores.push(`${entry.file} - Formato inválido`);
                    } else if (entry.status === "usuario_no_encontrado") {
                        errores.push(`${entry.file} - Usuario no encontrado`);
                    } else {
                        errores.push(`${entry.file} - Error al guardar`);
                    }
                }

            } catch (error) {
                console.error("Error durante el proceso de subida o API:", error);
                errores.push(`${nombreArchivo} - Error inesperado`);
            }
        }

        if (exitos.length > 0) {
            alert(`✅ Archivos subidos correctamente:\n- ${exitos.join("\n- ")}`);
        }

        if (errores.length > 0) {
            alert(`⚠️ Archivos con errores:\n- ${errores.join("\n- ")}`);
        }

        files = [];
        renderFileList();
    });
});
