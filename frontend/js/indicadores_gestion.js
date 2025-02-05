
document.addEventListener('DOMContentLoaded', async function() {
    // Referencias a elementos del DOM
    const valorUsuarios = document.querySelector('.valor__usuarios');
    const valorProductos = document.querySelector('.valor__productos');
    const valorAdministradores = document.querySelector('.valor__administradores');
    const valorPedidos = document.querySelector('.valor__pedidos');

    // Función para obtener usuarios
    async function obtenerUsuarios() {
        try {
            const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/usuarios');
            const data = await response.json();
            return data.length;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return 0;
        }
    }

    // Función para obtener productos
    async function obtenerProductos() {
        try {
            const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/productos');
            const data = await response.json();
            return data.length;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return 0;
        }
    }

    // Función para obtener administradores
    async function obtenerAdministradores() {
        try {
            const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/usuarios');
            const data = await response.json();
            return data.filter(usuario => usuario.rol_id === 1).length;
        } catch (error) {
            console.error('Error al obtener administradores:', error);
            return 0;
        }
    }

     function formatearNumero(numero) {
        return new Intl.NumberFormat('es-CO').format(numero);
    }

    // Función para obtener fecha actual formateada
    function obtenerFechaFormateada() {
        const fecha = new Date();
        return fecha.toLocaleDateString('es-CO', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Función mejorada para generar PDF
    function generarPDF(datos) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configuración de fuentes
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);

        // Título
        doc.text("Reporte de Indicadores de Gestión", 105, 20, { align: "center" });
        
        // Fecha del reporte
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha de generación: ${obtenerFechaFormateada()}`, 105, 30, { align: "center" });

        // Línea separadora
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Contenido del reporte
        doc.setFontSize(14);
        const startY = 50;
        const lineHeight = 10;

        // Sección de Usuarios
        doc.setFont("helvetica", "bold");
        doc.text("Información de Usuarios", 20, startY);
        doc.setFont("helvetica", "normal");
        doc.text(`• Total Clientes Registrados: ${formatearNumero(datos.usuarios)}`, 30, startY + lineHeight);
        doc.text(`• Total Administradores: ${formatearNumero(datos.administradores)}`, 30, startY + lineHeight * 2);

        // Sección de Productos
        doc.setFont("helvetica", "bold");
        doc.text("Información de Productos", 20, startY + lineHeight * 4);
        doc.setFont("helvetica", "normal");
        doc.text(`• Total Productos en Inventario: ${formatearNumero(datos.productos)}`, 30, startY + lineHeight * 5);

        // Sección de Pedidos
        doc.setFont("helvetica", "bold");
        doc.text("Información de Pedidos", 20, startY + lineHeight * 7);
        doc.setFont("helvetica", "normal");
        doc.text(`• Total Pedidos Realizados: ${formatearNumero(datos.pedidos)}`, 30, startY + lineHeight * 8);

        // Pie de página
        doc.setFontSize(10);
        doc.text("Inal Dulces - Sistema de Gestión", 105, 280, { align: "center" });
        
        // Guardar PDF
        const nombreArchivo = `reporte-indicadores-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(nombreArchivo);
    }

    // Función para actualizar el dashboard
    async function actualizarDashboard() {
        const usuarios = await obtenerUsuarios();
        const productos = await obtenerProductos();
        const administradores = await obtenerAdministradores();

        // Actualizar valores en el DOM
        if (valorUsuarios) valorUsuarios.textContent = usuarios;
        if (valorProductos) valorProductos.textContent = productos;
        if (valorAdministradores) valorAdministradores.textContent = administradores;
        if (valorPedidos) valorPedidos.textContent = "Pendiente"; // Implementar cuando exista la ruta

        // Guardar datos para el reporte
        window.datosReporte = {
            usuarios,
            productos,
            administradores,
            pedidos: 0 // Actualizar cuando exista la ruta
        };
    }

    // Botón para generar reporte
    const btnGenerarReporte = document.createElement('button');
    btnGenerarReporte.textContent = 'Generar Reporte PDF';
    btnGenerarReporte.className = 'btn-reporte';
    btnGenerarReporte.onclick = () => generarPDF(window.datosReporte);
    document.querySelector('.main-content').appendChild(btnGenerarReporte);

    // Inicializar dashboard
    await actualizarDashboard();
});