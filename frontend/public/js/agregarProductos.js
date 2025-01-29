const campoCodigo= document.getElementById('codigo-producto-formulario');
const campoNombre = document.getElementById('nombre-producto-formulario');
const campoPrecio = document.getElementById('precio-producto-formulario');
const campoDescripcion = document.getElementById('descripcion-producto-formulario');
const campoCantidad = document.getElementById('cantidad-producto-formulario');
const camposEstado = document.querySelectorAll('input[name="estado-producto-formulario"]'); // Cambiado a querySelectorAll
const campoImagen = document.getElementById('imagen-producto-formulario');
const previa = document.querySelector('#previa');

import { imagenUrl } from "./imagenAurl.js";

window.onload = async function(){

    document.querySelector('form').addEventListener('submit',async (e)=>{
        e.preventDefault();
        const codigo_producto=campoCodigo.value
        const nombre=campoNombre.value
        const descripcion=campoDescripcion.value 
        const cantidad_disponible= campoCantidad.value
        const precio= campoPrecio.value
        const estado = [...camposEstado].find(radio => radio.checked)?.value || "1"; // Por defecto 'activo'
        const url_imagen = (previa.src === "" || previa.src === null || previa.src === undefined) ? "" : previa.src;

                    alert('producto creado')
            window.location.href = "./admin_productos/productos_ver.html"

        await fetch('https://deploy-e-comerce-production.up.railway.app/api//users/productos',{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            
            body:JSON.stringify({
               codigo_producto,
                nombre,
                descripcion,
                cantidad_disponible,
                precio,
                url_imagen,
                estado
            })
        })
        
    })


    campoImagen.addEventListener('input', async (event) => {
        const file = campoImagen.files[0]; // Obtener el primer archivo
        if (file) {
            const base64URL = await imagenUrl.encodeFileAsBase64URL(file);
            previa.setAttribute('src', base64URL); // Establecer la imagen con el src en base64
        }
    });
}

