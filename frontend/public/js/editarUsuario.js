

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('id');

    if (usuarioId) {
        const response = await fetch(`http://localhost:3000/api/users/usuarios/${usuarioId}`);
        const data = await response.json();

        if (data.success) {
            const usuario = data.data;
            document.getElementById('usuarioId').value = usuario.cedula;
            document.getElementById('nombre').value = usuario.nombre;
            document.getElementById('apellido').value = usuario.apellido;
            document.getElementById('correo').value = usuario.correo;
            document.getElementById('genero').value = usuario.genero;
            document.getElementById('rol').value = usuario.rol;
            document.getElementById('nit_empresa').value = usuario.nit_empresa;
            document.getElementById('razon_social').value = usuario.razon_social;
        } else {
            alert('Usuario no encontrado');
            window.location.href = 'admin_usuarios/usuarios_ver.html';
        }
    }

    document.getElementById('formEditarUsuario').addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuarioId = document.getElementById('usuarioId').value;
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const correo = document.getElementById('correo').value;
        const genero = document.getElementById('genero').value;
        const rol = document.getElementById('rol').value;
        const nit_empresa = document.getElementById('nit_empresa').value;
        const razon_social = document.getElementById('razon_social').value;

        const response = await fetch(`http://localhost:3000/api/users/usuarios/${usuarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                apellido,
                correo,
                genero,
                rol,
                nit_empresa,
                razon_social
            })
        });

        if (response.ok) {
            alert('Usuario actualizado con éxito');
            window.location.href = 'admin_usuarios/usuarios_ver.html';
        } else {
            alert('Error al actualizar el usuario');
        }
    });
});