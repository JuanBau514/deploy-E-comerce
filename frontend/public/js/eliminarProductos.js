const barraBusqueda = document.getElementById('busqueda');
const botonBuscar = document.getElementById('botonBusqueda');
const tablaProductos = document.getElementById('tabla_productos').getElementsByTagName('tbody')[0];
const spinner = document.querySelector('.spinner');

// Función para crear fila de producto
const creaFila = (producto) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${producto.codigo_producto}</td>
        <td>${producto.nombre}</td>
        <td>$${producto.precio}</td>
        <td>${producto.cantidad_disponible}</td>
        <td>${producto.descripcion}</td>
        <td>
            <button class="btn-eliminar" data-codigo="${producto.codigo_producto}">
                Eliminar
            </button>
        </td>
    `;
    
    const btnEliminar = fila.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', async (e) => {
        const codigoProducto = e.target.dataset.codigo;
        
        if (confirm('¿Está seguro de eliminar este producto?')) {
            try {
                spinner.style.display = 'block';
                const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productos', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ codigo_producto: codigoProducto })
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el producto');
                }

                fila.remove();
                alert('Producto eliminado correctamente');
            } catch (error) {
                console.error('Error:', error);
                alert(error.message);
            } finally {
                spinner.style.display = 'none';
            }
        }
    });

    return fila;
};

const cargarProductos = async () => {
    try {
        spinner.style.display = 'block';
        const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productos');
        const data = await response.json();
        
        // Limpiar tabla
        tablaProductos.innerHTML = '';
        
        // Verificar si hay datos
        if (!data || !Array.isArray(data)) {
            throw new Error('No se recibieron datos válidos del servidor');
        }

        // Iterar sobre los productos
        data.forEach(producto => {
            if (producto) {
                tablaProductos.appendChild(creaFila(producto));
            }
        });

    } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar los productos: ' + error.message);
    } finally {
        spinner.style.display = 'none';
    }
};

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);

const getProductos = async (req, res) => {
    try {
        const [productos] = await Producto.getAll();
        // Enviar directamente el array de productos
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { codigo_producto } = req.body;
        if (!codigo_producto) {
            return res.status(400).json({ error: 'Código de producto requerido' });
        }

        const result = await Producto.delete(codigo_producto);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};