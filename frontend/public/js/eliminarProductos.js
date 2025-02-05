const barraBusqueda = document.getElementById('busqueda');
const botonBuscar = document.getElementById('botonBusqueda');
const tablaProductos = document.getElementById('tabla_productos').getElementsByTagName('tbody')[0];
const spinner = document.querySelector('.spinner');

const creaFila = (producto) => {
    console.log('Producto recibido:', producto); // Debug
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${producto.codigo_producto || 'N/A'}</td>
        <td>${producto.nombre || 'N/A'}</td>
        <td>$${producto.precio || 0}</td>
        <td>${producto.cantidad_disponible || 0}</td>
        <td>${producto.descripcion || 'N/A'}</td>
        <td>
            <button class="btn-eliminar" data-codigo="${producto.codigo_producto}">
                Eliminar
            </button>
        </td>
    `;
    
    const btnEliminar = fila.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', async (e) => {
        const codigoProducto = e.target.dataset.codigo;
        
        if (!codigoProducto) {
            alert('Error: Código de producto no válido');
            return;
        }
        
        if (confirm('¿Está seguro de eliminar este producto?')) {
            try {
                spinner.style.display = 'block';
                const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productos', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        codigo_producto: parseInt(codigoProducto) 
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al eliminar el producto');
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
        console.log('Datos recibidos:', data); // Debug
        
        tablaProductos.innerHTML = '';
        
        if (!data || data.length === 0) {
            tablaProductos.innerHTML = '<tr><td colspan="6">No hay productos disponibles</td></tr>';
            return;
        }

        // Asumiendo que data[0] contiene el array de productos
        const productos = Array.isArray(data[0]) ? data[0] : data;
        productos.forEach(producto => {
            if (producto && producto.codigo_producto) {
                tablaProductos.appendChild(creaFila(producto));
            }
        });

    } catch (error) {
        console.error('Error al cargar productos:', error);
        tablaProductos.innerHTML = '<tr><td colspan="6">Error al cargar productos</td></tr>';
    } finally {
        spinner.style.display = 'none';
    }
};

const getProductos = async (req, res) => {
    try {
        const [productos] = await Producto.getAll();
        console.log('Productos obtenidos:', productos); // Debug
        res.status(200).json([productos]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { codigo_producto } = req.body;
        console.log('Código a eliminar:', codigo_producto); // Debug
        
        if (!codigo_producto || isNaN(codigo_producto)) {
            return res.status(400).json({ error: 'Código de producto no válido' });
        }

        const result = await Producto.delete(parseInt(codigo_producto));
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);
