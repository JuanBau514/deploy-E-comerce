const actualizarEmpresa = async (datosEmpresa) => {
  try {
    const nit = localStorage.getItem('empresaNIT');
    
    if (!nit) {
      throw new Error('NIT de empresa no encontrado');
    }

    // Validar datos requeridos
    if (!datosEmpresa.razon_social || !datosEmpresa.correo || !datosEmpresa.cedula_representante_legal) {
      throw new Error('Todos los campos requeridos deben estar completos');
    }

    // Log para debug
    console.log('Datos a enviar:', datosEmpresa);

    const response = await fetch(`https://deploy-e-comerce-production.up.railway.app/api/users/empresas/${nit}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(datosEmpresa)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error completo:', error);
    throw error;
  }
}

document.getElementById('formEditarEmpresa').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const datosEmpresa = {
            razon_social: document.getElementById('razon_social').value.trim(),
            correo: document.getElementById('correo').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            id_rubro: document.getElementById('id_rubro').value.trim(),
            cedula_representante_legal: document.getElementById('cedula_representante_legal').value.trim()
        };

        // Validación de campos
        const camposRequeridos = ['razon_social', 'correo', 'cedula_representante_legal', 'id_rubro'];
        const camposFaltantes = camposRequeridos.filter(campo => !datosEmpresa[campo]);
        
        if (camposFaltantes.length > 0) {
            alert(`Los siguientes campos son requeridos: ${camposFaltantes.join(', ')}`);
            return;
        }

        const resultado = await actualizarEmpresa(datosEmpresa);
        console.log('Respuesta del servidor:', resultado);
        
        alert('Empresa actualizada exitosamente');
        window.location.href = 'empresas_ver.html';
    } catch (error) {
        alert('Error al actualizar: ' + error.message);
    }
});