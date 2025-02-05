document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nit = urlParams.get('nit');

    if (nit) {
        try {
            const response = await fetch(`https://deploy-e-comerce-production.up.railway.app/api/users/empresas/${nit}`);
            const data = await response.json();

            if (data.status === 'success') {
                const empresa = data.data;
                document.getElementById('nit').value = empresa.nit;
                document.getElementById('razon_social').value = empresa.razon_social;
                document.getElementById('correo').value = empresa.correo;
                document.getElementById('telefono').value = empresa.telefono_empresa;
                document.getElementById('id_rubro').value = empresa.id_rubro;
                document.getElementById('cedula_representante_legal').value = empresa.cedula_representante_legal;
            } else {
                alert('Error al cargar los datos de la empresa');
            }
        } catch (error) {
            console.error('Error al cargar los datos de la empresa:', error);
            alert('Error al cargar los datos de la empresa');
        }
    }

    document.getElementById('formEditarEmpresa').addEventListener('submit', async (event) => {
        event.preventDefault();

        const nit = document.getElementById('nit').value;
        const razon_social = document.getElementById('razon_social').value;
        const correo = document.getElementById('correo').value;
        const telefono = document.getElementById('telefono').value;
        const id_rubro = document.getElementById('id_rubro').value;
        const cedula_representante_legal = document.getElementById('cedula_representante_legal').value;

        try {
            const response = await fetch(`https://deploy-e-comerce-production.up.railway.app/api/users/empresas/${nit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nit,
                    razon_social,
                    correo,
                    telefono,
                    id_rubro,
                    cedula_representante_legal
                })
            });

            if (response.ok) {
                alert('Empresa actualizada con éxito');
                window.location.href = './empresas_ver.html';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al actualizar la empresa:', error);
            alert('Error al actualizar la empresa');
        }
    });
});