document.addEventListener("DOMContentLoaded", function () {
    const newUserBtn = document.querySelector(".btn-create-user-hg45");
    const popup = document.getElementById("popup-user-creation-tt78");
    const closeBtn = document.querySelector(".close-popup-btn-xd66");

    if (!popup) return; // Evita errores si el popup no existe

    if (newUserBtn) {
        newUserBtn.addEventListener("click", function () {
            popup.classList.add("active");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            popup.classList.remove("active");
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.classList.remove("active");
        }
    });
});
