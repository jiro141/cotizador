export const createHtmlFile1 = (data) => {
  const reportId = Math.floor(1000 + Math.random() * 9000);

  const procesarTexto = (texto) =>
    texto.replace(/\*\*/g, "").replace(/\n/g, "<br>");

  const generarPaginasDesdeContenido = (contenido) => {
    return Object.entries(contenido)
      .filter(([key, value]) => value && value.length !== 0)
      .map(([key, value], i) => {
        if (key === "caracteristicas" && Array.isArray(value)) {
          const rendered = value
            .map(
              (item) => `
                <div style="margin-bottom: 20px;">
                  <h5>${procesarTexto(item.nombre)}</h5>
                  <p class="parrafo">${procesarTexto(item.descripcion)}</p>
                </div>`
            )
            .join("");
          return `
              <div class="page">
                <div class="header">
                  <img src="${data.logo}" style="max-height: 80px" />
                </div>
                <h2>${i + 1}. Características</h2>
                ${rendered}
                <div class="footer">
                  Informe generado automáticamente – Smart Solutions
                </div>
              </div>`;
        } else {
          const titulo = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          return `
              <div class="page">
                <div class="header">
                  <img src="${data.logo}" style="max-height: 80px" />
                </div>
                <h2>${i + 1}. ${titulo}</h2>
                <p class="parrafo">${procesarTexto(value)}</p>
                <button class="btn btn-sm btn-primary edit-btn">✏️ Editar</button>
                <div class="footer">
                  Informe generado automáticamente – Smart Solutions
                </div>
              </div>`;
        }
      })
      .join("\n");
  };

  const htmlContent = `<!DOCTYPE html>
    <html lang="es">
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Montserrat", serif !important;
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .page-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .page {
        width: 100%;
        max-width: 800px;
        min-height: 1020px;
        margin: 10px 0px;
        padding: 120px 100px 60px 100px;
        background: white;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        position: relative;
      }
      h1,
      h2,
      h3 {
        color: #000;
      }
      .icono {
        max-width: 300px;
      }
      .center {
        height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .header,
      .footer {
        position: absolute;
        left: 0;
        width: 100%;
        text-align: center;
        font-weight: bold;
        padding: 10px 0;
      }
      .header {
        top: 0;
      }
      .footer {
        bottom: 0;
      }
      .parrafo {
        text-align: justify;
      }
      .edit-btn {
        position: relative;
        cursor: pointer;
      }
      .download-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 50px;
        cursor: pointer;
      }
      @media print {
        .edit-btn,
        .download-btn {
          display: none !important;
        }
        .page {
          page-break-before: always;
          break-inside: avoid;
        }
      }
      .table-container {
        width: 80%;
        margin: 20px auto;
        border: 2px dashed blue;
        background-color: #cce0ff; /* Color de fondo azul claro */
        padding: 10px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #fff; /* Líneas divisorias en blanco */
      }
      th {
        text-align: left;
        font-weight: bold;
      }
    </style>
  </head>
    <body class="bg-light">
      <div class="page-container">
        <div class="page">
          <div class="center">
            <h1 style="font-weight: bold; font-size: 50px">Smart Solutions</h1>
            <img class="icono" src="${data.frente}" />
          </div>
          <div class="table-container">
            <table>
              <tr><th>Nº de Oferta</th><td>${reportId}</td></tr>
              ${
                data.informe?.descripcion_empresa
                  ? `<tr><th>Empresa</th><td>${data.informe.descripcion_empresa}</td></tr>`
                  : ""
              }
              ${
                data.informe?.cliente?.nombre
                  ? `<tr><th>Cliente</th><td>${data.informe.cliente.nombre}</td></tr>`
                  : ""
              }
              ${
                data.informe?.cliente?.cargo
                  ? `<tr><th>Cargo</th><td>${data.informe.cliente.cargo}</td></tr>`
                  : ""
              }
            </table>
          </div>
        </div>
        ${generarPaginasDesdeContenido(data.contenido)}
      </div>
      <div
      class="modal fade"
      id="editorModal"
      tabindex="-1"
      aria-labelledby="editorModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl" style="min-height: 1800px">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editorModalLabel">Editar Contenido</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <textarea id="editor"></textarea>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            <button type="button" class="btn btn-primary" id="saveChanges">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <button class="download-btn" onclick="downloadPDF()">Descargar PDF</button>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
    <script src="./utils.js"></script>
    <script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script>
    <script>
      let editorInstance;
      let currentParagraph = null; // Guardará el párrafo que se está editando

      document.addEventListener("DOMContentLoaded", function () {
        editorInstance = CKEDITOR.replace("editor"); // Inicializar CKEditor
      });

      function checkParagraphs() {
  document.querySelectorAll(".page .parrafo").forEach((parrafo) => {
    const parent = parrafo.parentElement;
    const editBtn = parent.querySelector(".edit-btn");

    if (parrafo.innerText.trim()) {
      parrafo.style.display = "block";
      editBtn.style.display = "inline-block";
    } else {
      parrafo.style.display = "none";
      editBtn.style.display = "inline-block";
    }

    // ✅ Agregar evento al botón si no lo tenía
    if (editBtn && !editBtn.onclick) {
      editBtn.onclick = () => editParagraph(parrafo);
    }
  });
}


      function editParagraph(parrafo) {
        currentParagraph = parrafo; // Guardar referencia al párrafo
        editorInstance.setData(parrafo.innerHTML); // Cargar contenido en CKEditor
        let modal = new bootstrap.Modal(document.getElementById("editorModal"));
        modal.show(); // Mostrar el modal
      }

      document
        .getElementById("saveChanges")
        .addEventListener("click", function () {
          if (currentParagraph) {
            currentParagraph.innerHTML = editorInstance.getData(); // Guardar cambios
          }
          let modalElement = document.getElementById("editorModal");
          let modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide(); // Cerrar modal
        });

      document.addEventListener("DOMContentLoaded", checkParagraphs);

    

     function downloadPDF() {
  const sectionToPrint = document.querySelector(".page-container");

  // Ocultar botones antes del PDF
  const buttonsToHide = document.querySelectorAll(".edit-btn, .download-btn");
  buttonsToHide.forEach((btn) => (btn.style.display = "none"));

  const options = {
    margin: 10,
    filename: "informe.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  html2pdf()
    .set(options)
    .from(sectionToPrint)
    .save()
    .then(() => {
      // Restaurar visibilidad después de exportar
      buttonsToHide.forEach((btn) => (btn.style.display = "inline-block"));
    });
}


      document.addEventListener("DOMContentLoaded", function () {
        ensurePageExists();
        checkParagraphs();
      });
    </script>
    </body>
    </html>`;

  // ✅ CREAR BLOB Y ABRIR EN PESTAÑA NUEVA
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};
