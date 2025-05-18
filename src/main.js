import "./style.css";
import "material-icons/iconfont/material-icons.css";
import "./style.scss";
import * as api from "./api.js";
document.querySelector("#app").innerHTML = `
    <div>
        <input type="radio" class="form-check-input" >
        <label></label>
    </div>

<!-- HTML a renderizar en el main.js -->
  <div class="container">
  <header>
      <h1>Gestión de biblioteca</h1>
  </header>

  <div class="row">
      <div class="col-sm-8">
          <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12" id="autores">
                  <h2>Autores</h2>
                  <table class="table table-striped table-hover">
                      <thead class="thead-dark bg-primary">
                          <tr>
                              <th>Id</th>
                              <th>Apellidos, nombre</th>
                              <th>Nacionalidad</th>
                              <th>Acciones</th>
                          </tr>
                      </thead>
                      <tbody>
                          <!-- Aquí insertaremos los autores-->
                      </tbody>
                  </table>
              </div>
          </div>

          <!-- Tabla de Libros -->
          <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12" id="libros">
                  <h2>Libros</h2>
                  <table class="table table-striped table-hover">
                      <thead class="thead-dark bg-primary">
                          <tr>
                              <th>Id</th>
                              <th>Nombre</th>
                              <th>Descipción</th>
                              <th>Categoría</th>
                              <th>Fecha préstamo</th>
                              <th>Acciones</th>
                          </tr>
                      </thead>
                      <tbody>
                          <!-- Aquí insertaremos los libros-->
                      </tbody>
                  </table>
                  <p class="lead float-right">Total de libros: <strong id="total">0</strong></p>
              </div>
          </div>
      </div>
      <div class="col-sm-4">
          <form novalidate>
              <fieldset>
                  <legend>Añadir libro</legend>
                  <div class="form-group">
                      <label>Nombre:</label>
                      <input type="text" class="form-control" id="form-nombre" required minlength="4" maxlength="50">
                      <span id="error-nombre" class="error"></span>
                  </div>
                  <div class="form-group">
                      <label>ISBN:</label>
                      <input type="text" class="form-control" id="form-ISBN"required minlength="10" maxlength="10" >
                      <span id="error-ISBN" class="error"></span>
                  </div>
                  <div class="form-group">
                      <label>Descripción:</label>
                      <textarea class="form-control" id="form-descrip" maxlength="150"></textarea>
                      <span id="error-descrip" class="error"></span>
                  </div>
                  <div class="form-group">
                      <label>Autor:</label>
                      <select class="form-control" id="form-autor" required>
                          <option value="">- Selecciona un autor -</option>
                      </select>
                      <span id="error-autor" class="error"></span>
                  </div>
                  <div class="form-check">
                    <label>Tema:</label>
                    <br>
                    <div id="form-tema">
                        <!-- Aquí metemos el DIV del radiobutton para cada tema, completándolos -->
                    </div>
                    <span id="error-tema" class="error"></span>
                    </div>
                  <br>
                  <button type="submit" class="btn btn-default btn-primary">Guardar</button>
                  <button type="reset" class="btn btn-danger">Reset</button>
              </fieldset>
          </form>
      </div>
  </div>
`;
let temas = [];
document.addEventListener("DOMContentLoaded", () => {
  init();
  
});

async function init() {
  await carregarAutores();
  await omplirSelectFormulari();
  await completarRadioButtons();
  prepararFormulariValidacio();

}


async function carregarAutores() {
  const taulaAutores = document.querySelector("#autores tbody");
  try {
    const autores = await api.getAutores();
    const autoresOrdenados = autores.sort((a, b) =>
      a.apellidos.localeCompare(b.apellidos)
    );
    autoresOrdenados.forEach((autor) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${autor.id}</td>
        <td>${autor.nombre}, ${autor.apellidos}</td>
        <td>${autor.nacionalidad}</td>
        <td>
          <button class="vore" title="vore">
            <span class="material-icons">visibility</span>
          </button>
        </td>`;
      const botonVore = fila.querySelector(".vore");
      botonVore.addEventListener("click", () => {
        carregarLlibresAutor(autor.id);
      });
      taulaAutores.appendChild(fila);
    });

  } catch (error) {
    console.log(error);
  }
}

async function carregarLlibresAutor(autorId) {
  try {

    const libros = await api.getLibrosAutor(autorId);
    const totalLibros = document.getElementById("total");
    totalLibros.textContent = libros.length;

    const taulaLibros = document.querySelector("#libros tbody");

    libros.forEach((libro) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
   <td>${libro.id}</td>
   <td>${libro.nombre}</td>
   <td>${libro.desc}</td>
   <td>${libro.tema}</td>
   <td>${libro.fechaPrestamo || `No prestado`}</td>
   <td>
           <button class="borrar" title="Eliminar">
          <span class="material-icons">delete</span>
        </button>
        <button class="prestar" title="Prestar">
          <span class="material-icons">login</span>
        </button>
        <button class="devolver" title="Devolver">
          <span class="material-icons">undo</span>
        </button>
   </td>
   `;
      //Borrar
      const botonBorrar = fila.querySelector(".borrar");
      botonBorrar.addEventListener("click", async () => {
        if (confirm("Seguro que quieres borrar el libro?")){
          await api.borrarLibro(libro.id);
          fila.remove();
          const totalLibros = document.getElementById("total");
          totalLibros.textContent = Number(totalLibros.textContent) - 1;
        }
      });

      //Prestar
      const botonPrestar = fila.querySelector(".prestar");
      botonPrestar.addEventListener("click", async () => {
        
      })
      //Devolver
      const botonDevolver = fila.querySelector(".devolver");
      botonDevolver.addEventListener("click", async () => {
        
      })
      taulaLibros.appendChild(fila);
    });
  } catch (error) {
    console.log(error);
  }
}

async function omplirSelectFormulari() {
  const selectAutores = document.getElementById("form-autor");
  selectAutores.innerHTML ="<option value=''>- Selecciona un autor -</option>"

  try {
    const autores = await api.getAutores();
    autores.forEach((autor) => {
      const option = document.createElement("option");
      option.value = autor.id;
      option.textContent = `${autor.nombre}, ${autor.apellidos}`;
      selectAutores.appendChild(option);
    })
  } catch (error) {
    console.log(error);
  }
}

async function completarRadioButtons(){
  try {
    const temas = await api.getTemas();
    const divTemasRadioButtons = document.getElementById("form-tema");
    temas.forEach((tema) => {
      const div = document.createElement("div");
      div.innerHTML = `
      <input type="radio" class="form-check-input" id="tema-${tema.id}" name="tema" value="${tema.id}" required>
     <label>${tema.nombre}</label>
      `
      divTemasRadioButtons.appendChild(div);
    });
  } catch (error) {
    console.log(error);
  }
  
}


function prepararFormulariValidacio(){
  const form = document.querySelector("form");
  form.addEventListener("submit", async(event ) => {
    event.preventDefault();
   
    //Netejar errors
    document.querySelectorAll(".error").forEach(span => span.textContent = "");

    const nombre = document.getElementById("form-nombre");
    const isbn = document.getElementById("form-ISBN");
    const desc = document.getElementById("form-descrip");
    const autor = document.getElementById("form-autor");
    const temaRadio = document.querySelector("input[name='tema']:checked");

    let valido = true;

    //Validacions 

    if (!nombre.value.length < 4 || nombre.length > 50) {
      document.getElementById("error-nombre").textContent = "El nombre debe tener entre 4 y 50 caracteres";
      nombre.focus();
      valido = false;
    } else {
      document.getElementById("error-nombre").textContent = "";
    }

    if (!isbn.value.length < 10 || isbn.length > 10) {
      document.getElementById("error-ISBN").textContent = "El ISBN debe tener 10 caracteres";
      isbn.focus();
      valido = false;
    } else {
      document.getElementById("error-nombre").textContent = "";
    }

    if (!desc.value.length < 10 || desc.length > 500) {
      document.getElementById("error-descrip").textContent = "La descripción debe tener entre 10 y 500 caracteres";
      desc.focus();
      valido = false;
    } else {
      document.getElementById("error-nombre").textContent = "";
    } 

    if (!autor.value) {
      document.getElementById("error-autor").textContent = "Debes seleccionar un autor";
      autor.focus();
      valido = false;
    } else {
      document.getElementById("error-nombre").textContent = "";
    }

    if (!temaRadio) {
      document.getElementById("error-tema").textContent = "Debes seleccionar un tema";
      temas.focus();
      valido = false;
    } else {
      document.getElementById("error-nombre").textContent = "";
    }

    const nouLlibre = {
      nombre: nombre.value,
      ISBN: isbn.value,
      desc: desc.value,
      autor: autor.value,
      tema: temaRadio.value,
      fechaPrestamo: null
    };

    try {
      const llibreCreat = await api.addLlibre(nouLlibre);
      renderLibroAnyadido(llibreCreat);
      form.reset();
    } catch (error) {
      console.log(error);
    }

  });
}

function renderLibroAnyadido(libro) {
  const taulaLlibres = document.querySelector("#libros tbody");
  const fila = document.createElement("tr");
  fila.innerHTML= `
  <td>${libro.id}</td>
  <td>${libro.nombre}</td>
  <td>${libro.desc}</td>
  <td>${libro.tema}</td>
  <td>No prestado</td>
  <td>
  <button class="borrar" title="Eliminar">
        <span class="material-icons">delete</span>
      </button>
      <button class="prestar" title="Prestar">
        <span class="material-icons">login</span>
      </button>
      <button class="devolver" title="Devolver">
        <span class="material-icons">undo</span>
      </button></td>
  `;

  // Eventos
  const botonBorrar = fila.querySelector(".borrar");
  botonBorrar.addEventListener("click", async () => {
    const confirmar = confirm("¿Eliminar este libro?");
    if (!confirmar) return;

    try {
      await api.borrarLibro(libro.id);
      fila.remove();
      const totalLibros = document.getElementById("total");
      totalLibros.textContent = Number(totalLibros.textContent) - 1;
    } catch (error) {
      alert("Error al borrar el libro");
    }
  });
  taulaLlibres.appendChild(fila);
  const totalLibros = document.getElementById("total");
  totalLibros.textContent = Number(totalLibros.textContent) + 1;
}
