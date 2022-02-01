const URLJSON = "json_local.json";
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let sidebar = document.querySelector(".listaCarrito");
const miLocalStorage = window.localStorage;

const inyectarCards = () => {
    $.getJSON(URLJSON, function (respuesta, estado) {

        if (estado === "success") {
            let productos = respuesta;

            productos.forEach((info) => {

                if ($(`${info.coleccion}`).length === 0) {

                    $('#items').append(`<div class="col-md-4 card"> 
                                    <div class= "${info.coleccion}">
                                   <img src="${info.imagen}" class="imagenProducto">
                                    <h3 class="infoProducto">${info.nombre}</h3>
                                    <p class="infoProducto">${info.descripcion}</p>
                                    <p class="infoProducto">$<span>${info.precio}</span></p>
                                    <button class="btnComprar" data-id=${info.id}>AGREGAR</button></div>
                                    </div>`);




                };

                let btnComprar = document.querySelectorAll(".btnComprar");

                btnComprar.forEach((e) =>
                    e.addEventListener("click", (e) => {
                        enviarAlCarrito(e.target.parentElement);
                        $(".sidebar").show();
                    })
                );
            })
        }
    })
};


const enviarAlCarrito = card => {
    let productoAlCarrito = {
        imagen: card.querySelector("img").src,
        nombre: card.querySelector("h3").textContent,
        precioPorUnidad: Number(card.querySelector("p span").textContent),
        precioTotal: Number(card.querySelector("p span").textContent),
        id: card.querySelector("button").getAttribute("data-id"),
        cantidad: 1,
    };

    let existeProducto = carrito.some(
        (element) => element.id === productoAlCarrito.id
    );

    if (existeProducto) {
        carrito = carrito.map(element => {
            if (element.id === productoAlCarrito.id) {
                element.cantidad++;
                element.precioTotal = element.precioPorUnidad * element.cantidad;
                return element;
            } else {
                return element;
            }
        })
    } else {
        carrito.push(productoAlCarrito);
    }
    nuevoProductoAlCarrito();
    guardarCarritoEnLocalStorage();
};

const nuevoProductoAlCarrito = () => {
    sidebar.innerHTML = "";
    carrito.forEach(element => {
        let {
            imagen,
            nombre,
            cantidad,
            precioPorUnidad,
            id
        } = element;
        sidebar.innerHTML += `<div>
                                <img class="imagenCarrito" src="${imagen}" />
                                <p>${nombre} - $<span>${precioPorUnidad}</span> | Cantidad: ${cantidad}</p>
                                <button class="btnRestar btnCarrito" data-id=${id}> - </button>
                                <button class="btnSumar btnCarrito" data-id=${id}> + </button>
                                <button class="btnBorrar btnCarrito" data-id=${id}> BORRAR </button>
                                <hr>
                            </div>`;
    })
    totalDeCarrito();
};

const restarProducto = (e) => {
    let idProducto = Number(e.target.getAttribute("data-id"));

    carrito = carrito.map(element => {
        if (element.id == idProducto) {
            element.cantidad--;
            element.precioTotal = element.precioTotal - element.precioPorUnidad;
            if (element.cantidad === 0) {
                element.cantidad = 1;
                element.precioTotal = element.precioPorUnidad;
            }
            return element;
        } else {
            return element;
        }
    });
    nuevoProductoAlCarrito();
    totalDeCarrito();
};

const sumarProducto = (e) => {
    let idProducto = Number(e.target.getAttribute("data-id"));

    carrito = carrito.map(element => {
        if (element.id == idProducto) {
            element.cantidad++;
            element.precioTotal = element.precioTotal + element.precioPorUnidad;
            if (element.cantidad === 0) {
                element.cantidad = 1;
                element.precioTotal = element.precioPorUnidad;
            }
            return element;
        } else {
            return element;
        }
    });
    nuevoProductoAlCarrito();
    totalDeCarrito();
};

const borrarProducto = (e) => {
    let idProducto = Number(e.target.getAttribute("data-id"));
    carrito = carrito.filter(element => element.id != idProducto);
    nuevoProductoAlCarrito();
    totalDeCarrito();
};

sidebar.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnRestar")) {
        restarProducto(e);
        guardarCarritoEnLocalStorage();
    }
    if (e.target.classList.contains("btnBorrar")) {
        borrarProducto(e);
        guardarCarritoEnLocalStorage();
    }
    if (e.target.classList.contains("btnSumar")) {
        sumarProducto(e);
        guardarCarritoEnLocalStorage();
    }
});

function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    if (miLocalStorage.getItem('carrito') !== null) {
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

function totalDeCarrito() {
    let total = carrito.reduce((a, i) => a + i.precioTotal, 0);
    $("#mostrarTotal span").html(`$${total}`);
}

document.addEventListener("DOMContentLoaded", () => {
    $(".sidebar").hide();
    $("#btnIconoCarrito").click(function () {
        $(".sidebar").slideToggle("fast");
    });
    $(".cerrarCarrito").click(function () {
        $(".sidebar").hide();
    });
    $(".btnFinalizar").click(function () {
        carrito = [];
        nuevoProductoAlCarrito();
        totalDeCarrito();
    });

    cargarCarritoDeLocalStorage();
    nuevoProductoAlCarrito();
    totalDeCarrito();
    inyectarCards();
});
document.addEventListener("DOMContentLoaded", () => {


    $("#cat1").click(function () {
        $(".tigre").show();
        $(".mariposa").hide();
    });

    $("#cat2").click(function () {
        $(".mariposa").show();
        $(".tigre").hide();
    });
    $("#todo").click(function () {
        $(".mariposa").show();
        $(".tigre").show();
    });

})



function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}