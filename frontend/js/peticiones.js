// Variables globales
let solicitudesData = [];

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('solicitudes');
    if (savedData) {
        solicitudesData = JSON.parse(savedData);
        displaySolicitudes(solicitudesData);
    }

    // Agregar event listener para el input file
    document.getElementById('excelFile').addEventListener('change', handleFileUpload);
});

// Manejador del archivo Excel
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    document.getElementById('fileName').textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            console.log('Datos cargados:', jsonData); // Debug
            
            solicitudesData = jsonData;
            localStorage.setItem('solicitudes', JSON.stringify(solicitudesData));
            displaySolicitudes(jsonData);
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            alert('Error al procesar el archivo Excel');
        }
    };
    reader.readAsArrayBuffer(file);
}

function filterSolicitudes(filter) {
    const filteredData = filter === 'all' 
        ? solicitudesData 
        : solicitudesData.filter(row => {
            const tipoSolicitud = row['Solicitud'];
            switch(filter) {
                case 'personal':
                    return tipoSolicitud?.includes('información personal');
                case 'usuarios':
                    return tipoSolicitud?.includes('agregar más usuarios');
                case 'empresa':
                    return tipoSolicitud?.includes('información empresa');
                default:
                    return true;
            }
        });
    
    displaySolicitudes(filteredData);
}

function displaySolicitudes(data) {
    const container = document.querySelector('.solicitudes-container');
    
    // Mantener elementos importantes
    const header = container.querySelector('h1');
    const uploadSection = container.querySelector('.upload-section');
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Restaurar elementos
    container.appendChild(header);
    container.appendChild(uploadSection);
    
    // Agregar sección de filtros
    const filterSection = document.createElement('div');
    filterSection.className = 'filter-section';
    filterSection.innerHTML = `
        <h3>Filtrar por tipo de solicitud:</h3>
        <button class="filter-btn active" data-filter="all">Todas las solicitudes</button>
        <button class="filter-btn" data-filter="personal">Cambio de información personal</button>
        <button class="filter-btn" data-filter="usuarios">Agregar más usuarios</button>
        <button class="filter-btn" data-filter="empresa">Cambio información empresa</button>
    `;
    container.appendChild(filterSection);
    
    // Agregar event listeners a los botones de filtro
    filterSection.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterSolicitudes(e.target.dataset.filter);
        });
    });

    // Mostrar tarjetas
    data.forEach(row => {
        const card = document.createElement('div');
        card.className = 'solicitud-card';
        card.innerHTML = `
            <div class="card-header">
                <p class="id">ID: ${row['Id'] || ''}</p>
                <button class="delete-btn" onclick="deleteSolicitud(${row['Id']})">Eliminar</button>
            </div>
            <p class="nombre">Nombre completo: ${(row['Digite su nombre completo'] || '') + ' ' + (row['Digite su Apellido completo'] || '')}</p>
            <p class="documento">Identificación: ${row['Cedula'] || ''}</p>
            <p class="email">Correo: ${row['Digite su correo Electrónico Actualizado'] || ''}</p>
            <p class="telefono">Teléfono: ${row['ingrese un teléfono de contacto directo'] || ''}</p>
            <p class="tipo-solicitud">Tipo de solicitud: ${row['Solicitud'] || ''}</p>
            <p class="rol">Rol: ${row['En caso de que tenga un rol asignado digite el nombre del rol (en caso de que no simplemente coloque persona natural)'] || ''}</p>
            <p class="especificacion">Especificación: ${row['Si requiere especificar en su solicitud algún atributo especifiquelo aquí'] || ''}</p>
        `;
        container.appendChild(card);
    });
}

function deleteSolicitud(id) {
    if (confirm('¿Está seguro de eliminar esta solicitud?')) {
        solicitudesData = solicitudesData.filter(item => item.Id != id);
        localStorage.setItem('solicitudes', JSON.stringify(solicitudesData));
        displaySolicitudes(solicitudesData);
    }
}
