const form = document.querySelector('form');
const inputid = document.getElementById('cedula');
const inputNombre = document.getElementById('first-name');
const inputApellido = document.getElementById('last-name');
const inputCorreo = document.getElementById('email');
const inputTelefono = document.getElementById('phone');
const inputGenero = document.getElementById('gender');
const inputNitEmpresa = document.getElementById('nit_empresa');
const inputContrasenaNueva = document.getElementById('newPassword');
const botonCambios = document.getElementById('GuardaCambiosBtn');

const ponerInformacion = async (cedula) => {
    try {
        if (!cedula) {
            throw new Error('Cédula no proporcionada');
        }

        const response = await fetch(`http://localhost:3000/api/users/usuarios/${cedula}`);
        
        if (response.status === 404) {
            throw new Error('Usuario no encontrado');
        }
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const responseData = await response.json();
        
        // Verificar que la respuesta sea exitosa y acceder a data
        if (!responseData.success || !responseData.data) {
            throw new Error('No se recibieron datos del usuario');
        }

        // Usar responseData.data para acceder a la información del usuario
        const data = responseData.data;

        // Actualizar los inputs del formulario
        if (inputid) inputid.value = data.cedula?.toString() || '';
        if (inputNombre) inputNombre.value = data.nombre || '';
        if (inputApellido) inputApellido.value = data.apellido || '';
        if (inputCorreo) inputCorreo.value = data.correo || '';
        if (inputTelefono) inputTelefono.value = data.telefono || '';
        if (inputGenero) inputGenero.value = data.id_genero?.toString() || '';
        if (inputNitEmpresa) inputNitEmpresa.value = data.nit_empresa || '';

        // Actualizar los elementos de visualización del perfil
        const profileElements = {
            'profile-cedula': data.cedula,
            'profile-name': data.nombre,
            'profile-lastName': data.apellido,
            'profile-email': data.correo,
            'profile-phone': data.telefono || 'No especificado',
            'profile-gender': data.id_genero === 1 ? 'Masculino' : 'Femenino',
            'profile-role': data.id_rol === 1 ? 'Administrador' : 'Usuario',
            'profile-nit': data.nit_empresa || 'No especificado'
        };

        Object.entries(profileElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        alert(`No se pudo cargar la información del usuario: ${error.message}`);
    }
};

window.onload = function() {
    const cedulaUsuario = localStorage.getItem('cedula');
    
    if (!cedulaUsuario) {
        console.error('No se encontró la cédula del usuario en el localStorage');
        alert('Por favor, inicie sesión nuevamente');
        window.location.href = '/login.html';
        return;
    }

    ponerInformacion(cedulaUsuario);

    form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    try {
        const userData = {
            cedula: inputid.value,
            nombre: inputNombre.value,
            apellido: inputApellido.value,
            correo: inputCorreo.value,
            telefono: inputTelefono.value,
            id_genero: parseInt(inputGenero.value),
            nit_empresa: inputNitEmpresa.value || null,
            contrasenaNueva: inputContrasenaNueva.value || undefined
        };

        console.log('Enviando datos:', userData);

        const response = await fetch('http://localhost:3000/api/users/usuarios', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al actualizar los datos');
        }

        alert('Cambios guardados con éxito');
        await ponerInformacion(userData.cedula);
        
    } catch (error) {
        console.error('Error detallado:', error);
        alert('Error al guardar los cambios: ' + error.message);
    }
});
    
};