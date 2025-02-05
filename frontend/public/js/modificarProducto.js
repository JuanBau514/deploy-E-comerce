import { imagenUrl } from "./imagenAurl.js";

const spinner = document.querySelector('.spinner');

const productoCodigo = document.getElementById('producto-codigo');
const productoNombre = document.getElementById('producto-nombre');
const productoPrecio = document.getElementById('producto-precio');
const productoDescripcion = document.getElementById('producto-descripcion');
const productoCantidad = document.getElementById('producto-cantidad');
const productoEstado = document.getElementById('producto-estado');
const productoImagen = document.getElementById('producto-urlImagen');

const campoNombre = document.getElementById('nombre-producto-formulario');
const campoPrecio = document.getElementById('precio-producto-formulario');
const campoDescripcion = document.getElementById('descripcion-producto-formulario');
const campoCantidad = document.getElementById('cantidad-producto-formulario');
const camposEstado = document.querySelectorAll('input[name="estado-producto-formulario"]'); // Cambiado a querySelectorAll

const campoImagen = document.getElementById('imagen-producto-formulario');
const previa = document.querySelector('#previa');

window.onload = async function() {
    const producto = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productoUnidad');
    producto.json().then((producto) => {
        productoCodigo.textContent = producto.codigo_producto;
        productoNombre.textContent = producto.nombre;
        productoPrecio.textContent = producto.precio;
        productoDescripcion.textContent = producto.descripcion;
        productoCantidad.textContent = producto.cantidad_disponible;
        
        productoEstado.textContent = (producto.id_estado == 1) ? 'activo' : 'suspendido';
        
        productoImagen.src = producto.url_imagen;
        previa.src = producto.url_imagen;

        campoNombre.value = producto.nombre;
        campoPrecio.value = producto.precio;
        campoDescripcion.value = producto.descripcion;
        campoCantidad.value = producto.cantidad_disponible;

        // Seleccionar el radio button correcto
        camposEstado.forEach((radio) => {
            radio.checked = (radio.value == producto.id_estado);
        });
    });

    document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const nombre = campoNombre.value;
        const descripcion = campoDescripcion.value;
        const cantidad_disponible = campoCantidad.value;
        const precio = campoPrecio.value;
        const url_imagen = previa.src || "";
        const id_estado = [...camposEstado].find(radio => radio.checked)?.value || "1";

        if (!nombre || !precio || !cantidad_disponible) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }

        const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productos', {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                descripcion,
                cantidad_disponible,
                precio,
                url_imagen,
                id_estado
            })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el producto');
        }

        alert('Producto actualizado correctamente');
        window.location.href = "./productos_ver.html";

    } catch (error) {
        alert('Error: ' + error.message);
        console.error(error);
    }
});

    campoImagen.addEventListener('input', async () => {
        const file = campoImagen.files[0];
        if (file) {
            const base64URL = await imagenUrl.encodeFileAsBase64URL(file);
            previa.setAttribute('src', base64URL);
        }
    });
}



/*     
     
    
        */