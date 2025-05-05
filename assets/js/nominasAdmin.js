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

    uploadButton.addEventListener("click", async () => {
        let errores = [];
        let exitos = [];

        // Obtener todos los usuarios de la API una vez
        const usuarios = await fetch("http://localhost:5064/api/Usuarios")
            .then(res => res.json())
            .catch(err => {
                console.error("❌ Error al obtener usuarios:", err);
                return [];
            });

        for (let file of files) {
            const nombreArchivo = file.name;

            // Validar formato: NombreApellido_MM_AAAA.pdf
            const formatoValido = /^[a-zA-Z]+[a-zA-Z]*_[0-9]{1,2}_[0-9]{4}\.pdf$/;
            if (!formatoValido.test(nombreArchivo)) {
                errores.push(`${nombreArchivo} - Formato inválido`);
                continue;
            }

            const [nombreCompleto, mes, anioConExtension] = nombreArchivo.split("_");
            const anio = anioConExtension.replace(".pdf", "");
            const mesAnio = `${mes.padStart(2, "0")}-${anio}`;
            const nombreSinExtension = nombreArchivo.replace(".pdf", "");

            // Buscar usuario que coincida
            let idUsuario = null;
            for (const usuario of usuarios) {
                const combinado = (usuario.nombre + usuario.apellido).toLowerCase();
                if (combinado === nombreCompleto.toLowerCase()) {
                    idUsuario = usuario.idUsuario;
                    break;
                }
            }

            if (!idUsuario) {
                errores.push(`${nombreArchivo} - Usuario no encontrado`);
                continue;
            }

            // Subir archivo al servidor
            const formData = new FormData();
            formData.append("nominas[]", file);

            try {
                const response = await fetch("../../includes/uploadNominas.php", {
                    method: "POST",
                    body: formData,
                });

                const text = await response.text();
                console.log("📄 Respuesta cruda del servidor:", text);

                const result = JSON.parse(text);

                if (!Array.isArray(result) || result.length === 0) {
                    errores.push(`${nombreArchivo} - Respuesta inesperada del servidor`);
                    continue;
                }

                const estado = result[0].status;

                if (estado === "success") {
                    // Subir a la base de datos vía API
                    const nominaData = {
                        idNomina: 0,
                        idUsuario: idUsuario,
                        mesAnio: mesAnio,
                        nombreArchivo: nombreSinExtension,
                        rutaArchivo: `../assets/uploads/${nombreSinExtension}`,
                        fechaSubida: new Date().toISOString()
                    };

                    const apiResponse = await fetch("http://localhost:5064/api/Nominas", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(nominaData)
                    });

                    if (apiResponse.ok) {
                        exitos.push(nombreArchivo);
                    } else {
                        errores.push(`${nombreArchivo} - Error al insertar en la base de datos`);
                    }
                } else if (estado === "formato_invalido") {
                    errores.push(`${nombreArchivo} - Formato inválido`);
                } else {
                    errores.push(`${nombreArchivo} - Error al guardar el archivo`);
                }
            } catch (error) {
                console.error("❌ Error al procesar archivo:", error);
                errores.push(`${nombreArchivo} - Error inesperado`);
            }
        }

        // Mostrar resultados
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
