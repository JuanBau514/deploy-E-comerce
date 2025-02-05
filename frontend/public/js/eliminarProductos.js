

const barraBusqueda = document.getElementById('busqueda')
const botonBuscar = document.getElementById('botonBusqueda')
const tablaProductos = document.getElementById('tabla_productos').getElementsByTagName('tbody')[0];

const creaFila = (codigo_producto, nombre, precio, cantidad, descripcion) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${codigo_producto}</td>
        <td>${nombre}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>${descripcion}</td>
    `;
    
    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.addEventListener('click', async () => {
        if (confirm('¿Está seguro de eliminar este producto?')) {
            try {
                const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productos', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ codigo_producto })
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el producto');
                }

                alert('Producto eliminado correctamente');
                // Eliminar la fila de la tabla
                eliminarBtn.closest('tr').remove();

            } catch (error) {
                alert('Error: ' + error.message);
                console.error(error);
            }
        }
    });

};

const agregarProductoTabla = (productos) => {

    productos.forEach((producto) => {
        const nuevaFila = creaFila(
            producto.codigo_producto,
            producto.nombre,
            producto.precio,
            producto.cantidad_disponible,
            producto.descripcion
        );
        tablaProductos.appendChild(nuevaFila);
    });
};

window.onload = async function() {
    try {    
        const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productos');
        const productos = await response.json();
        agregarProductoTabla(productos[0]);


        botonBuscar.addEventListener('click',(e)=>{
            const codigo_buscar = (barraBusqueda.value).trim();            
            const productoEncontrado = productos[0].filter((producto)=>{
                if(producto.codigo_producto == codigo_buscar ){
                    return producto;
                }
            })

            if(productoEncontrado.length > 0){
                tablaProductos.innerHTML = ''
                agregarProductoTabla(productoEncontrado)
            }else{            
                alert("producto NO encontrado")
                tablaProductos.innerHTML = ''
                agregarProductoTabla(productos[0]);
            }
            
        })

    } catch (error) {
        alert(`Hubo un error ${error}`);
    }

};

