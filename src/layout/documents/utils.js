function ensurePageExists() {
  let pages = document.querySelectorAll(".page");

  pages.forEach((element) => {
    // Asegurar que haya un header en cada página
    if (!element.querySelector(".header")) {
      const header = document.createElement("div");
      header.className = "header";
      header.innerHTML = `<img style="width: 80%; height: 5%;" src="../../img/banner.png" alt="Logo">`;
      element.prepend(header);
    }

    // Asegurar que haya un footer en cada página
    if (!element.querySelector(".footer")) {
      const footer = document.createElement("div");
      footer.className = "footer";
      footer.innerHTML = `<a href="https://detipcompany.com/" target="_blank">www.detipcompany.com</a>`;
      element.appendChild(footer);
    }

    let content = element.querySelector(".content"); // Contenedor de contenido dinámico
    if (!content) return;

    // Si el contenido sobrepasa la altura de la página, dividirlo en nuevas páginas
    while (content.scrollHeight > element.clientHeight - 200) {
      // Espacio para el footer
      let newPage = document.createElement("div");
      newPage.className = "page"; // Se asegura que tenga la clase .page

      // Agregar header a la nueva página
      const newHeader = document.createElement("div");
      newHeader.className = "header";
      newHeader.innerHTML = `<img style="width: 80%; height: 5%;" src="../../img/banner.png" alt="Logo">`;
      newPage.appendChild(newHeader);

      // Crear un nuevo contenedor de contenido para la nueva página
      let extraContent = document.createElement("div");
      extraContent.className = "content";

      // Mover contenido desbordado a la nueva página
      while (
        content.children.length > 0 &&
        newPage.scrollHeight < element.clientHeight - 200
      ) {
        extraContent.appendChild(content.children[0]); // Mover elementos uno a uno
      }
      newPage.appendChild(extraContent);

      // Agregar footer a la nueva página
      const newFooter = document.createElement("div");
      newFooter.className = "footer";
      newFooter.innerHTML = `<a href="https://detipcompany.com/" target="_blank">www.detipcompany.com</a>`;
      newPage.appendChild(newFooter);

      // Insertar la nueva página después de la página actual
      element.parentNode.insertBefore(newPage, element.nextSibling);
    }
  });
}

// Ejecutar la función cuando el contenido esté cargado
document.addEventListener("DOMContentLoaded", ensurePageExists);
