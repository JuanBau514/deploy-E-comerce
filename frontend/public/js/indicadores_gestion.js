document.addEventListener('DOMContentLoaded', async function() {
    // Referencias a elementos del DOM
    const valorProductos = document.querySelector('.valor__inventarios');
    const valorClientes = document.querySelector('.valor__clientes'); 
    const valorAdministradores = document.querySelector('.valor__administradores');
    const valorPedidos = document.querySelector('.valor__pedidos');

    // Función para obtener usuarios y separarlos por rol
  async function obtenerUsuarios() {
    try {
        const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/usuarios');
        const data = await response.json();
        
        if (Array.isArray(data[0])) {
            const usuarios = data[0];
            const clientes = usuarios.filter(user => user.rol === "Cliente").length;
            const administradores = usuarios.filter(user => user.rol === "Administrador").length;
            return { clientes, administradores };
        }
        return { clientes: 0, administradores: 0 };
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return { clientes: 0, administradores: 0 };
    }
}

    // Función para obtener productos
    async function obtenerProductos() {
        try {
            const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productos');
            const data = await response.json();
            return Array.isArray(data[0]) ? data[0].length : 0;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return 0;
        }
    }

    // Función para obtener pedidos
    async function obtenerPedidos() {
    try {
        const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/pedidos');
        const responseData = await response.json();
        
        if (responseData.success && Array.isArray(responseData.data)) {
            return responseData.data.length;
        }
        return 0;
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        return 0;
    }
}

    // Función para formatear números
    function formatearNumero(numero) {
        return new Intl.NumberFormat('es-CO').format(numero);
    }

    // Función para actualizar el dashboard
    async function actualizarDashboard() {
        try {
            // Obtener todos los datos
            const { clientes, administradores } = await obtenerUsuarios();
            const totalProductos = await obtenerProductos();
            const totalPedidos = await obtenerPedidos();

            // Actualizar valores en el DOM
            if (valorProductos) valorProductos.textContent = formatearNumero(totalProductos);
            if (valorClientes) valorClientes.textContent = formatearNumero(clientes);
            if (valorAdministradores) valorAdministradores.textContent = formatearNumero(administradores);
            if (valorPedidos) valorPedidos.textContent = formatearNumero(totalPedidos);

        } catch (error) {
            console.error('Error al actualizar el dashboard:', error);
        }
    }

     async function generarReportePDF() {
        try {
            const { clientes, administradores } = await obtenerUsuarios();
            const totalProductos = await obtenerProductos();
            const totalPedidos = await obtenerPedidos();
            
            // Usar window.jsPDF
            const doc = new window.jsPDF();
            
            // Configuración y contenido
            doc.setFontSize(20);
            doc.text('Reporte de Indicadores de Gestión', 20, 20);
            
            doc.setFontSize(12);
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
            
            doc.setFontSize(14);
            doc.text('Resumen:', 20, 45);
            
            // Datos
            doc.setFontSize(12);
            doc.text(`• Productos en Inventario: ${formatearNumero(totalProductos)}`, 25, 60);
            doc.text(`• Clientes Registrados: ${formatearNumero(clientes)}`, 25, 70);
            doc.text(`• Administradores: ${formatearNumero(administradores)}`, 25, 80);
            doc.text(`• Total Pedidos: ${formatearNumero(totalPedidos)}`, 25, 90);
            
            // Guardar PDF
            doc.save('reporte-indicadores.pdf');
            
        } catch (error) {
            console.error('Error al generar el reporte:', error);
        }
    }

    async function exportarExcel() {
        try {
            const { clientes, administradores } = await obtenerUsuarios();
            const totalProductos = await obtenerProductos();
            const totalPedidos = await obtenerPedidos();

            // Crear CSV
            const csvContent = `Indicadores de Gestión\n
                  Productos en Inventario,${totalProductos}\n
                  Clientes Registrados,${clientes}\n
                  Administradores,${administradores}\n
                  Total Pedidos,${totalPedidos}`;

            // Crear blob y descargar
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "reporte-indicadores.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error al exportar Excel:', error);
        }
    }

    // Event Listeners
    document.querySelector('.boton_generarReporte').addEventListener('click', generarReportePDF);
    document.querySelector('.exportarReporte').addEventListener('click', exportarExcel);

    
 

    // Inicializar el dashboard
    actualizarDashboard();
});