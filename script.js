const url = "/animales";

const contenedor = document.getElementById("contenedor");
const contador = document.getElementById("contador");

let idEditar = null;

obtenerAnimales();

// ================= MOSTRAR =================

async function obtenerAnimales() {

    const respuesta = await fetch(url);

    const animales = await respuesta.json();

    mostrarAnimales(animales);

}

function mostrarAnimales(animales) {

    contenedor.innerHTML = "";

    contador.innerHTML = `🐾 ${animales.length} animales`;

    animales.forEach(animal => {

        let imagen = animal.imagen;

        if (!imagen || imagen.trim() === "") {

            imagen = "https://placehold.co/600x400?text=AnimalDB";

        }

        contenedor.innerHTML += `

        <div class="card">

            <img src="${imagen}">

            <div class="card-contenido">

                <h2>${animal.nombre}</h2>

                <p><b>${animal.especie}</b> • ${animal.raza}</p>

                <p>Edad: ${animal.edad}</p>

                <p>${animal.descripcion}</p>

                <div class="botones">

                    <button class="editar"
                    onclick="editarAnimal('${animal._id}')">

                    ✏️ Editar

                    </button>

                    <button class="eliminar"
                    onclick="eliminarAnimal('${animal._id}')">

                    🗑️ Eliminar

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

// ================= GUARDAR =================

async function guardarAnimal() {

    const datos = {

        nombre: document.getElementById("nombre").value,
        especie: document.getElementById("especie").value,
        raza: document.getElementById("raza").value,
        edad: document.getElementById("edad").value,
        descripcion: document.getElementById("descripcion").value,
        imagen: document.getElementById("imagen").value

    };

    if (idEditar) {

        await fetch(url + "/" + idEditar, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(datos)

        });

        idEditar = null;

        document.getElementById("botonGuardar").innerText = "Guardar Animal";

    }

    else {

        await fetch(url, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(datos)

        });

    }

    limpiarFormulario();

    obtenerAnimales();

}

// ================= EDITAR =================

async function editarAnimal(id) {

    const respuesta = await fetch(url);

    const animales = await respuesta.json();

    const animal = animales.find(a => a._id === id);

    document.getElementById("nombre").value = animal.nombre;
    document.getElementById("especie").value = animal.especie;
    document.getElementById("raza").value = animal.raza;
    document.getElementById("edad").value = animal.edad;
    document.getElementById("descripcion").value = animal.descripcion;
    document.getElementById("imagen").value = animal.imagen;

    idEditar = id;

    document.getElementById("botonGuardar").innerText = "Actualizar Animal";

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

}

// ================= ELIMINAR =================

async function eliminarAnimal(id) {

    const confirmar = confirm("¿Eliminar este animal?");

    if (!confirmar) return;

    await fetch(url + "/" + id, {

        method: "DELETE"

    });

    obtenerAnimales();

}

// ================= LIMPIAR =================

function limpiarFormulario() {

    document.getElementById("nombre").value = "";
    document.getElementById("especie").value = "";
    document.getElementById("raza").value = "";
    document.getElementById("edad").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("imagen").value = "";

}

// ================= BUSCADOR + FILTRO =================

document.getElementById("buscador")
.addEventListener("input", filtrarAnimales);

document.getElementById("filtro")
.addEventListener("change", filtrarAnimales);

async function filtrarAnimales() {

    const texto = document
    .getElementById("buscador")
    .value
    .toLowerCase();

    const especieFiltro = document
    .getElementById("filtro")
    .value;

    const respuesta = await fetch(url);

    const animales = await respuesta.json();

    const filtrados = animales.filter(animal => {

        const coincideNombre = animal.nombre
        .toLowerCase()
        .includes(texto);

        const coincideEspecie =

            especieFiltro === "Todos" ||

            animal.especie === especieFiltro;

        return coincideNombre && coincideEspecie;

    });

    mostrarAnimales(filtrados);

}

// ================= MODO OSCURO =================

const botonModo = document.getElementById("modoOscuro");

if (localStorage.getItem("modo") === "oscuro") {

    document.body.classList.add("dark");

}

botonModo.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("modo", "oscuro");

    }

    else {

        localStorage.setItem("modo", "claro");

    }

});