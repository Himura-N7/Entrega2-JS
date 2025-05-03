// Arrays de productos
const papeleria = [
    {
        id: 1,
        nombre: "Papel Bond",
        tipo: "Carta",
        precio: 6000
    },
    {
        id: 2,
        nombre: "Lápiz HB",
        tipo: "Grafito",
        precio: 400
    },
    {
        id: 3,
        nombre: "Post-it",
        tipo: "3x3 pulgadas",
        precio: 350
    },
    {
        id: 4,
        nombre: "Grapadora",
        tipo: "Metálica",
        precio: 2500
    }
]

const tecnologia = [
    {
        id: 5,
        nombre: "Teclado",
        tipo: "Inalámbrico",
        precio: 8000
    },
    {
        id: 6,
        nombre: "Mouse",
        tipo: "Óptico",
        precio: 5000
    },
    {
        id: 7,
        nombre: "Audífonos",
        tipo: "Bluetooth",
        precio: 12000
    },
    {
        id: 8,
        nombre: "Cargador USB",
        tipo: "Universal",
        precio: 3000
    }
]

const mobiliario = [
    {
        id: 9,
        nombre: "Silla Escritorio",
        tipo: "Ergonómica",
        precio: 50000
    },
    {
        id: 10,
        nombre: "Escritorio",
        tipo: "1.2m x 60cm",
        precio: 75000
    },
    {
        id: 11,
        nombre: "Archivador",
        tipo: "4 cajones",
        precio: 40000
    },
    {
        id: 12,
        nombre: "Lámpara LED",
        tipo: "Regulable",
        precio: 15000
    }
]

// Carrito
let carrito = []

// Variables de estado
let productoActual = papeleria

// Función para renderizar productos
function renderizarProductos(productos) {
    const contenedor = document.getElementById("productos-container")
    contenedor.innerHTML = ""
    
    productos.forEach(producto => {
        const card = document.createElement("div")
        card.className = "producto-card"
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Tipo: ${producto.tipo}</p>
            <p>Precio: $${producto.precio}</p>
            <div class="cantidad">
                <button class="btn-disminuir" data-id="${producto.id}">-</button>
                <span class="contador-cantidad" data-id="${producto.id}">0</span>
                <button class="btn-aumentar" data-id="${producto.id}">+</button>
            </div>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        `
        contenedor.appendChild(card)
    })
    
    // Event listeners
    asignarEventos()
}

// Función para asignar eventos
function asignarEventos() {
    // Botones cantidad
    document.querySelectorAll(".btn-disminuir").forEach(boton => {
        boton.addEventListener("click", disminuirCantidad)
    })
    
    document.querySelectorAll(".btn-aumentar").forEach(boton => {
        boton.addEventListener("click", aumentarCantidad)
    })
    
    // Botones agregar
    document.querySelectorAll(".btn-agregar").forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    })
}

// Función para disminuir cantidad
function disminuirCantidad(e) {
    const id = e.target.dataset.id
    const contador = document.querySelector(`.contador-cantidad[data-id="${id}"]`)
    let cantidad = parseInt(contador.textContent)
    
    if (cantidad > 0) {
        cantidad--
        contador.textContent = cantidad
    }
}

// Función para aumentar cantidad
function aumentarCantidad(e) {
    const id = e.target.dataset.id
    const contador = document.querySelector(`.contador-cantidad[data-id="${id}"]`)
    let cantidad = parseInt(contador.textContent)
    
    cantidad++
    contador.textContent = cantidad
}

// Función para agregar al carrito
function agregarAlCarrito(e) {
    const id = parseInt(e.target.dataset.id)
    const cantidad = parseInt(document.querySelector(`.contador-cantidad[data-id="${id}"]`).textContent)
    
    if (cantidad > 0) {
        // Buscar producto
        let producto = productoActual.find(p => p.id === id)
        
        if (producto) {
            for (let i = 0; i < cantidad; i++) {
                carrito.push({...producto})
            }
            
            // Guardar en localStorage
            localStorage.setItem("carrito", JSON.stringify(carrito))
            
            // Resetear contador
            document.querySelector(`.contador-cantidad[data-id="${id}"]`).textContent = "0"
            
            // Actualizar contador carrito
            actualizarContadorCarrito()
        }
    }
}

// Función para actualizar contador carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito")
    contador.textContent = carrito.length
}

// Función para mostrar carrito
function mostrarCarrito() {
    const contenedor = document.getElementById("productos-container")
    contenedor.innerHTML = ""
    
    // Título del carrito
    const titulo = document.createElement("h2")
    titulo.textContent = "Mi Carrito"
    contenedor.appendChild(titulo)
    
    // Mostrar productos del carrito
    carrito.forEach((producto, index) => {
        const item = document.createElement("div")
        item.className = "carrito-item"
        item.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        `
        contenedor.appendChild(item)
    })
    
    // Mostrar total
    const total = carrito.reduce((suma, producto) => suma + producto.precio, 0)
    const totalDiv = document.createElement("div")
    totalDiv.innerHTML = `<h3>Total: $${total}</h3>`
    contenedor.appendChild(totalDiv)
    
    // Botón vaciar carrito
    const vaciarBtn = document.createElement("button")
    vaciarBtn.textContent = "Vaciar Carrito"
    vaciarBtn.addEventListener("click", vaciarCarrito)
    contenedor.appendChild(vaciarBtn)
    
    // Event listeners para eliminar
    document.querySelectorAll(".btn-eliminar").forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito)
    })
}

// Función para eliminar del carrito
function eliminarDelCarrito(e) {
    const index = parseInt(e.target.dataset.index)
    carrito.splice(index, 1)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    mostrarCarrito()
    actualizarContadorCarrito()
}

// Función para vaciar carrito
function vaciarCarrito() {
    carrito = []
    localStorage.setItem("carrito", JSON.stringify(carrito))
    mostrarCarrito()
    actualizarContadorCarrito()
}

// Función de búsqueda
function buscarProducto() {
    const termino = document.getElementById("buscar").value.toLowerCase()
    
    const productosFiltrados = productoActual.filter(producto => {
        return producto.nombre.toLowerCase().includes(termino)
    })
    
    renderizarProductos(productosFiltrados)
}

// Event listeners al cargar página
document.getElementById("btn-mostrar-papeleria").addEventListener("click", () => {
    productoActual = papeleria
    renderizarProductos(papeleria)
})

document.getElementById("btn-mostrar-tecnologia").addEventListener("click", () => {
    productoActual = tecnologia
    renderizarProductos(tecnologia)
})

document.getElementById("btn-mostrar-mobiliario").addEventListener("click", () => {
    productoActual = mobiliario
    renderizarProductos(mobiliario)
})

document.getElementById("btn-carrito").addEventListener("click", mostrarCarrito)
document.getElementById("buscar").addEventListener("input", buscarProducto)

// Cargar carrito del localStorage
carrito = JSON.parse(localStorage.getItem("carrito")) || []
actualizarContadorCarrito()

// Inicializar
renderizarProductos(papeleria)