// ============================================================
// SCRIPT.JS - La Pequelette
// Maneja: productos, modal, carrito, validación de formulario
// ============================================================


// ============================================================
// 1. DATOS DE PRODUCTOS
// Los productos de La Pequelette se definen aquí como objetos
// (en vez de una API externa, porque son productos propios)
// ============================================================

const productos = [
    {
        id: 1,
        titulo: "Brousse (75g)",
        categoria: "Queso Fresco",
        descripcion: "Queso fresco de leche de cabra, elaborado con receta francesa. Textura suave y sabor delicado. Ideal para untar o acompañar con mermelada.",
        precio: 4000,
        imagen: "img/productos/prod1.jpg"
    },
    {
        id: 2,
        titulo: "Brousse (150g)",
        categoria: "Queso Fresco",
        descripcion: "Queso fresco de leche de cabra, elaborado con receta francesa. Textura suave y sabor delicado. Ideal para untar o acompañar con mermelada.",
        precio: 8000,
        imagen: "img/productos/prod2.jpg"
    },
    {
        id: 3,
        titulo: "Untable con Albahaca (150g)",
        categoria: "Untable",
        descripcion: "Queso untable de cabra con albahaca fresca cosechada en la chacra. Perfecto para tostadas, crackers o como dip para verduras.",
        precio: 9000,
        imagen: "img/productos/prod5.jpg"
    },
    {
        id: 4,
        titulo: "Untable con Cebolla de verdeo (150g)",
        categoria: "Untable",
        descripcion: "Queso untable de cabra con cebolla de verdeo fresca. Un clásico de La Pequelette, ideal para picadas y aperitivos.",
        precio: 9000,
        imagen: "img/productos/prod4.jpg"
    },
    {
        id: 5,
        titulo: "Untable con Menta (150g)",
        categoria: "Untable",
        descripcion: "Queso untable de cabra con menta fresca. Una combinación refrescante y aromática, ideal para acompañar con pan artesanal.",
        precio: 9000,
        imagen: "img/productos/prod6.jpg"
    },
    {
        id: 6,
        titulo: "Untable con Ají picante (150g)",
        categoria: "Untable",
        descripcion: "Queso untable de cabra con ají picante. Para los que buscan un toque de intensidad. La estrella de las picadas en La Pequelette.",
        precio: 9000,
        imagen: "img/productos/prod3.jpg"
    }
];


// ============================================================
// 2. RENDERIZAR PRODUCTOS EN EL DOM
// Crea las cards de productos dinámicamente con JavaScript
// ============================================================

function renderizarProductos() {
    const contenedor = document.getElementById("contenedor-productos");

    // Recorre cada producto y crea su card en HTML
    productos.forEach(function(producto) {
        const card = document.createElement("div");
        card.classList.add("producto");

        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}" onclick="abrirModal(${producto.id})">
            <div class="producto-descripcion">
                <span>${producto.categoria}</span>
                <h5>${producto.titulo}</h5>
                <h4>$${producto.precio.toLocaleString()}</h4>
            </div>
            <button class="btn-consultar" onclick="abrirModal(${producto.id})">Ver detalle</button>
        `;

        contenedor.appendChild(card);
    });
}

// Ejecutar al cargar la página
renderizarProductos();


// ============================================================
// 3. MODAL DE DETALLE DE PRODUCTO
// Muestra la información completa del producto al hacer clic
// ============================================================

const modalOverlay = document.getElementById("modal-overlay");
const modalImagen = document.getElementById("modal-imagen");
const modalCategoria = document.getElementById("modal-categoria");
const modalTitulo = document.getElementById("modal-titulo");
const modalDescripcion = document.getElementById("modal-descripcion");
const modalPrecio = document.getElementById("modal-precio");
const modalBtnAgregar = document.getElementById("modal-btn-agregar");

// Guarda qué producto está abierto en el modal
let productoEnModal = null;

// Abre el modal con los datos del producto seleccionado
function abrirModal(idProducto) {
    // Busca el producto en el array por su id
    const producto = productos.find(function(p) {
        return p.id === idProducto;
    });

    if (!producto) return;

    productoEnModal = producto;

    // Inyecta los datos del producto en el modal
    modalImagen.src = producto.imagen;
    modalImagen.alt = producto.titulo;
    modalCategoria.textContent = producto.categoria;
    modalTitulo.textContent = producto.titulo;
    modalDescripcion.textContent = producto.descripcion;
    modalPrecio.textContent = "$" + producto.precio.toLocaleString();

    // Muestra el modal agregando la clase "visible"
    modalOverlay.classList.add("visible");
}

// Cierra el modal quitando la clase "visible"
function cerrarModal() {
    modalOverlay.classList.remove("visible");
    productoEnModal = null;
}

// Eventos para cerrar el modal
document.getElementById("btn-cerrar-modal").addEventListener("click", cerrarModal);

// También se cierra al hacer clic fuera de la caja del modal
modalOverlay.addEventListener("click", function(evento) {
    if (evento.target === modalOverlay) {
        cerrarModal();
    }
});

// Botón "Agregar al carrito" dentro del modal
modalBtnAgregar.addEventListener("click", function() {
    if (productoEnModal) {
        agregarAlCarrito(productoEnModal);
        cerrarModal();
    }
});


// ============================================================
// 4. CARRITO DE COMPRAS
// Con localStorage para que no se pierda al recargar la página
// ============================================================

// Carga el carrito desde localStorage, o empieza vacío
let carrito = JSON.parse(localStorage.getItem("carrito-lapequelette")) || [];

const panelCarrito = document.getElementById("panel-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");

// Abre el panel del carrito
document.getElementById("btn-carrito").addEventListener("click", function() {
    panelCarrito.classList.add("abierto");
});

// Cierra el panel del carrito
document.getElementById("btn-cerrar-carrito").addEventListener("click", function() {
    panelCarrito.classList.remove("abierto");
});

// Agrega un producto al carrito
function agregarAlCarrito(producto) {
    // Busca si el producto ya está en el carrito
    const itemExistente = carrito.find(function(item) {
        return item.id === producto.id;
    });

    if (itemExistente) {
        // Si ya está, aumenta la cantidad
        itemExistente.cantidad++;
    } else {
        // Si no está, lo agrega con cantidad 1
        carrito.push({
            id: producto.id,
            titulo: producto.titulo,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarYActualizarCarrito();
    panelCarrito.classList.add("abierto");
}

// Guarda el carrito en localStorage y actualiza la vista
function guardarYActualizarCarrito() {
    localStorage.setItem("carrito-lapequelette", JSON.stringify(carrito));
    renderizarCarrito();
}

// Renderiza los items del carrito en el panel
function renderizarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío 🧀</p>';
        totalCarrito.textContent = "$0";
        contadorCarrito.textContent = "0";
        return;
    }

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(function(item) {
        total += item.precio * item.cantidad;
        cantidadTotal += item.cantidad;

        const itemElemento = document.createElement("div");
        itemElemento.classList.add("carrito-item");

        itemElemento.innerHTML = `
            <img src="${item.imagen}" alt="${item.titulo}">
            <div class="carrito-item-info">
                <p>${item.titulo}</p>
                <span>$${item.precio.toLocaleString()} c/u</span>
            </div>
            <div class="carrito-item-controles">
                <button onclick="cambiarCantidad(${item.id}, -1)">−</button>
                <span>${item.cantidad}</span>
                <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
            </div>
        `;

        listaCarrito.appendChild(itemElemento);
    });

    // Actualiza el total y el contador del header
    totalCarrito.textContent = "$" + total.toLocaleString();
    contadorCarrito.textContent = cantidadTotal;
}

// Cambia la cantidad de un item (puede ser +1 o -1)
function cambiarCantidad(idProducto, cambio) {
    const item = carrito.find(function(i) {
        return i.id === idProducto;
    });

    if (!item) return;

    item.cantidad += cambio;

    // Si la cantidad llega a 0, elimina el item del carrito
    if (item.cantidad <= 0) {
        carrito = carrito.filter(function(i) {
            return i.id !== idProducto;
        });
    }

    guardarYActualizarCarrito();
}

// Vacía todo el carrito
document.getElementById("btn-vaciar").addEventListener("click", function() {
    carrito = [];
    guardarYActualizarCarrito();
});

// Renderiza el carrito al cargar la página (por si había datos guardados)
renderizarCarrito();


// ============================================================
// 5. VALIDACIÓN DEL FORMULARIO DE CONTACTO
// Valida los campos antes de enviar usando e.preventDefault()
// ============================================================

// Valida que el formato del correo sea correcto (usando RegEx)
const correoValido = function(correo) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(correo);
};

// Muestra u oculta el mensaje de error debajo del campo
const mostrarEstadoCampo = function(input, esValido, mensaje) {
    const contenedorPadre = input.parentNode;
    const textoError = contenedorPadre.querySelector(".texto-error");

    if (esValido) {
        contenedorPadre.classList.remove("error");
        if (textoError) textoError.textContent = "";
    } else {
        contenedorPadre.classList.add("error");
        if (textoError) textoError.textContent = mensaje;
    }
};

// Intercepta el envío del formulario
const formulario = document.getElementById("formulario-contacto");

formulario.addEventListener("submit", function(e) {
    // Detiene el envío automático del formulario
    e.preventDefault();

    let formularioValido = true;

    const nombre = document.getElementById("tu-nombre");
    const correo = document.getElementById("tu-correo");
    const mensaje = document.getElementById("tu-mensaje");
    const mensajeExito = document.getElementById("mensaje-exito");

    // Validación del nombre (no puede estar vacío)
    if (nombre.value.trim() === "") {
        mostrarEstadoCampo(nombre, false, "Por favor, ingresá tu nombre.");
        formularioValido = false;
    } else {
        mostrarEstadoCampo(nombre, true);
    }

    // Validación del correo (vacío + formato correcto)
    if (correo.value.trim() === "") {
        mostrarEstadoCampo(correo, false, "El correo electrónico es obligatorio.");
        formularioValido = false;
    } else if (!correoValido(correo.value.trim())) {
        mostrarEstadoCampo(correo, false, "Ingresá un correo electrónico válido.");
        formularioValido = false;
    } else {
        mostrarEstadoCampo(correo, true);
    }

    // Validación del mensaje (no puede estar vacío)
    if (mensaje.value.trim() === "") {
        mostrarEstadoCampo(mensaje, false, "Por favor, escribí tu mensaje.");
        formularioValido = false;
    } else {
        mostrarEstadoCampo(mensaje, true);
    }

    // Si todos los campos son válidos, envía el formulario
    if (formularioValido) {
        mensajeExito.textContent = "¡Mensaje enviado! Te contactamos a la brevedad 🧀";
        formulario.reset();
        // Para enviar realmente a Formspree descomentar la línea de abajo:
        // formulario.submit();
    }
});
