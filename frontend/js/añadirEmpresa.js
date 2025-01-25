document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('empresaForm');
    const idRubroSelect = document.getElementById('id_rubro');

    // Cargar rubros
    try {
        const response = await fetch('http://localhost:3000/api/rubros');
        const data = await response.json();
        data.data.forEach(rubro => {
            const option = document.createElement('option');
            option.value = rubro.id_rubro;
            option.textContent = `${rubro.id_rubro} - ${rubro.rubro}`;
            idRubroSelect.appendChild(option);
        });
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
            const response = await fetch('http://localhost:3000/api/empresas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empresaData)
            });

            if (response.ok) {
                alert('Empresa registrada con éxito');
                window.location.href = '/Views/empresas_ver.html';
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