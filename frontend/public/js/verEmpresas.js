async function cargarEmpresas() {
    try {
        const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/empresas');
        const data = await response.json();
        const tbody = document.querySelector('#tabla_empresas tbody');
        tbody.innerHTML = '';

        data.data.forEach(empresa => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${empresa.nit}</td>
                <td>${empresa.razon_social}</td>
                <td>${empresa.correo}</td>
                <td>${empresa.telefono_empresa}</td>
                <td>${empresa.id_rubro}</td>
                <td>${empresa.rubro}</td>
                <td>${empresa.cedula_representante_legal}</td>
                <td>
                    <button class="btn btn-edit" onclick="editarEmpresa(${empresa.nit})">Editar</button>
                    <button class="btn btn-delete" onclick="eliminarEmpresa(${empresa.nit})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar empresas:', error);
    }
}

async function agregarEmpresa() {
    window.location.href = '/empresañadir.html';
}

async function editarEmpresa(nit) {
    // Lógica para editar una empresa
    alert('Editar empresa con NIT: ' + nit);
    window.location.href = './empresas_editar.html';
}

async function eliminarEmpresa(nit) {
    if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
        try {
            const response = await fetch(`https://deploy-e-comerce-production.up.railway.app/api/users/empresas/${nit}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Empresa eliminada con éxito');
                cargarEmpresas();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al eliminar empresa:', error);
            alert('Error al eliminar empresa');
        }
    }
}

// Cargar las empresas al cargar la página
window.onload = cargarEmpresas;