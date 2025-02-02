document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('empresaForm');
    const idRubroSelect = document.getElementById('id_rubro');

    try {
    const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/rubros', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.success && data.data) {
        data.data.forEach(rubro => {
            const option = document.createElement('option');
            option.value = rubro.id_rubro;
            option.textContent = `${rubro.id_rubro} - ${rubro.rubro}`;
            idRubroSelect.appendChild(option);
        });
    }
} catch (error) {
    console.error('Error al cargar rubros:', error);
}

    // Manejar el envío del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const empresaData = {
            nit: formData.get('nit'),
            razon_social: formData.get('razon_social'),
            correo: formData.get('correo'),
            telefono_empresa: formData.get('telefono_empresa'),
            id_rubro: formData.get('id_rubro'),
            cedula_representante_legal: formData.get('cedula_representante_legal'),
            nombre_representante: formData.get('nombre_representante'),
            apellido_representante: formData.get('apellido_representante')
        };

        try {
            const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/empresas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empresaData)
            });

            if (response.ok) {
                alert('Empresa registrada con éxito');
                window.location.href = './empresas_ver.html';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al registrar empresa:', error);
            alert('Error al registrar empresa');
        }
    });
});