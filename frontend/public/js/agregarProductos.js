const campoCodigo = document.getElementById('codigo-producto-formulario');
const campoNombre = document.getElementById('nombre-producto-formulario');
const campoPrecio = document.getElementById('precio-producto-formulario');
const campoDescripcion = document.getElementById('descripcion-producto-formulario');
const campoCantidad = document.getElementById('cantidad-producto-formulario');
const camposEstado = document.querySelectorAll('input[name="estado-producto-formulario"]');
const campoImagen = document.getElementById('imagen-producto-formulario');
const previa = document.querySelector('#previa');

import { imagenUrl } from "./imagenAurl.js";

window.onload = async function(){
    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener valores de los campos
        const codigo_producto = campoCodigo.value;
        const nombre = campoNombre.value;
        const precio = campoPrecio.value;
        const descripcion = campoDescripcion.value;
        const cantidad_disponible = campoCantidad.value;
        const estado = [...camposEstado].find(radio => radio.checked)?.value || "1";
        const url_imagen = previa.src || "";

        try {
            // Validar datos
            if (!codigo_producto || !nombre || !precio || !cantidad_disponible) {
                alert('Por favor complete todos los campos requeridos');
                return;
            }

            const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productos', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo_producto,
                    nombre,
                    descripcion,
                    cantidad_disponible,
                    precio,
                    url_imagen,
                    estado
                })
            });

            if (!response.ok) {
                throw new Error('Error al crear el producto');
            }

            alert('Producto creado exitosamente');
            window.location.href = "./productos_ver.html";
        } catch (error) {
            alert('Error: ' + error.message);
            console.error(error);
        }
    });

    // Manejo de previsualización de imagen
    campoImagen.addEventListener('input', async (event) => {
        const file = campoImagen.files[0];
        if (file) {
            const base64URL = await imagenUrl.encodeFileAsBase64URL(file);
            previa.setAttribute('src', base64URL);
        }
    });
}
