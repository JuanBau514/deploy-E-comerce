const actualizarEmpresa = async (datosEmpresa) => {
  try {
    // Obtener el NIT desde localStorage
    const nit = localStorage.getItem('empresaNIT');
    
    if (!nit) {
      throw new Error('NIT de empresa no encontrado');
    }

    const response = await fetch(`https://deploy-e-comerce-production.up.railway.app/api/users/empresas/${nit}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(datosEmpresa)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error al actualizar la empresa:', error);
    throw error;
  }
}

// Cargar datos iniciales de la empresa
const cargarDatosEmpresa = async () => {
  const nit = localStorage.getItem('empresaNIT');
  
  if (nit) {
    document.getElementById('nit').value = nit;
    // Aquí puedes agregar la lógica para cargar los datos existentes de la empresa
  } else {
    alert('No se encontró el NIT de la empresa');
    window.location.href = 'empresas_ver.html';
  }
};

// Limpiar el localStorage después de completar la edición
document.getElementById('formEditarEmpresa').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const datosEmpresa = {
    razon_social: document.getElementById('razon_social').value,
    correo: document.getElementById('correo').value,
    telefono: document.getElementById('telefono').value,
    id_rubro: document.getElementById('id_rubro').value,
    cedula_representante_legal: document.getElementById('cedula_representante_legal').value
  };

  try {
    await actualizarEmpresa(datosEmpresa);
    localStorage.removeItem('empresaNIT'); // Limpiar después de actualizar
    alert('Empresa actualizada exitosamente');
    window.location.href = 'empresas_ver.html';
  } catch (error) {
    alert('Error al actualizar la empresa: ' + error.message);
  }
});

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatosEmpresa);