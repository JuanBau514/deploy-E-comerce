document.addEventListener('DOMContentLoaded', function() {
    cargarPerfil();
    iniciarTemporizador();
});

function cargarPerfil() {
    const cedula = localStorage.getItem('cedula');

    console.log('Cédula obtenida del local storage:', cedula); // Log para depuración

    fetch(`http://localhost:3000/api/users/usuarios/${cedula}`)
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta de la API:', data); // Log para depuración

            if (data.success) {
                const perfil = data.data;
                document.getElementById('profile-cedula').textContent = perfil.cedula;
                document.getElementById('profile-name').textContent = perfil.nombre;
                document.getElementById('profile-lastName').textContent = perfil.apellido;
                document.getElementById('profile-email').textContent = perfil.correo;
                document.getElementById('profile-phone').textContent = perfil.telefono;
                document.getElementById('profile-gender').textContent = perfil.id_genero;
                document.getElementById('profile-role').textContent = perfil.id_rol;
                document.getElementById('profile-nit').textContent = perfil.nit_empresa;
            } else {
                alert('Error al cargar el perfil: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar el perfil. Por favor, intenta nuevamente.');
        });
}

function iniciarTemporizador() {
    let tiempoInactividad = 0;
    let tiempoActividad = 0;
    const limiteInactividad = 3600; // 1 hora en segundos

    function actualizarTemporizador() {
        tiempoInactividad++;
        tiempoActividad++;
        const horas = Math.floor(tiempoActividad / 3600);
        const minutos = Math.floor((tiempoActividad % 3600) / 60);
        const segundos = tiempoActividad % 60;

        document.getElementById('session-timer').textContent = 
            `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

        if (tiempoInactividad >= limiteInactividad) {
            cerrarSesion();
        }
    }

    function resetearTemporizador() {
        tiempoInactividad = 0;
    }

    function cerrarSesion() {
        alert('Tu sesión ha expirado por inactividad.');
        localStorage.removeItem('cedula');
        localStorage.removeItem('sesionIniciada');
        window.location.href = '/Views/login.html';
    }

    document.addEventListener('mousemove', resetearTemporizador);
    document.addEventListener('keypress', resetearTemporizador);

    setInterval(actualizarTemporizador, 1000);
}

/*

function actualizarPerfil() {
    const cedula = document.getElementById('cedula').value.trim();
    const nombre = document.getElementById('first-name').value.trim();
    const apellido = document.getElementById('last-name').value.trim();
    const correo = document.getElementById('email').value.trim();
    const telefono = document.getElementById('phone').value.trim();
    const genero = document.getElementById('gender').value.trim();
    const rol = document.getElementById('role').value.trim();
    const nit_empresa = document.getElementById('nit').value.trim();

    const perfilActualizado = {
        cedula,
        nombre,
        apellido,
        correo,
        telefono,
        genero,
        rol,
        nit_empresa
    };

    fetch(`http://localhost:3000/api/users/${cedula}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(perfilActualizado),
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Perfil actualizado correctamente.');
            // Actualizar la información mostrada en la página
            cargarPerfil();
        } else {
            alert('Error al actualizar el perfil: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el perfil. Por favor, intenta nuevamente.');
    });
}
*/
