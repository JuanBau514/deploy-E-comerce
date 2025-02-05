document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('id');
    const rolSelect = document.getElementById('rol');

    // Cargar roles
    async function cargarRoles() {
    try {
        const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/roles');
        const responseData = await response.json();
        
        if (responseData.success && Array.isArray(responseData.data)) {
            rolSelect.innerHTML = responseData.data.map(rol => 
                `<option value="${rol.id_rol}">${rol.rol}</option>`
            ).join('');
        } else {
            console.error('Error al obtener roles:', responseData);
        }
    } catch (error) {
        console.error('Error al cargar roles:', error);
    }
}

    // Cargar datos del usuario
    if (usuarioId) {
        try {
            const response = await fetch(`https://deploy-e-comerce-production.up.railway.app/api/users/usuarios/${usuarioId}`);
            const data = await response.json();

            if (data.success) {
                const usuario = data.data;
                document.getElementById('usuarioId').value = usuario.cedula;
                document.getElementById('nombre').value = usuario.nombre;
                document.getElementById('apellido').value = usuario.apellido;
                document.getElementById('correo').value = usuario.correo;
                document.getElementById('genero').value = usuario.genero;
                
                // Primero cargar roles y luego establecer el rol del usuario
                await cargarRoles();
                rolSelect.value = usuario.rol;
                
                document.getElementById('nit_empresa').value = usuario.nit_empresa || '';
                document.getElementById('razon_social').value = usuario.razon_social || '';
            } else {
                alert('Usuario no encontrado');
                window.location.href = './usuarios_ver.html';
            }
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            alert('Error al cargar los datos del usuario');
        }
    }

    // Manejar envío del formulario
    document.getElementById('formEditarUsuario').addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuarioId = document.getElementById('usuarioId').value;
        const userData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            correo: document.getElementById('correo').value,
            genero: document.getElementById('genero').value,
            rol: rolSelect.value,
            nit_empresa: document.getElementById('nit_empresa').value || null,
            razon_social: document.getElementById('razon_social').value || null
        };

        try {
            const response = await fetch(`https://deploy-e-comerce-production.up.railway.app/api/users/usuarios/${usuarioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('Usuario actualizado correctamente');
                window.location.href = './usuarios_ver.html';
            } else {
                const errorData = await response.json();
                alert(`Error al actualizar: ${errorData.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar usuario');
        }
    });
});