const barraBusqueda = document.getElementById('busqueda');
const botonBuscar = document.getElementById('botonBusqueda');
const tablaUsuarios = document.getElementById('tabla_usuarios').getElementsByTagName('tbody')[0];

const creaFila = (id, nombre, apellido, correo, genero, id_rol, nit_empresa, razon_social) => {
    if (!nit_empresa || !razon_social) {
        nit_empresa = 'No registra';
        razon_social = 'No registra';
    }

    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${id}</td>
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${correo}</td>
        <td>${genero}</td>
        <td>${id_rol}</td>
        <td>${nit_empresa}</td>
        <td>${razon_social}</td>
        <td>
            <span class="las la-trash btnEliminar" data-id="${id}" style="cursor: pointer;"></span>
            <span class="las la-edit btnEditar" data-id="${id}" style="cursor: pointer; margin-left: 10px;"></span>
        </td>
    `;
    return fila;
}

const agregarUsuariosTabla = (usuarios) => {
    usuarios.forEach((usuario) => {
        const nuevaFila = creaFila(
            usuario.cedula,
            usuario.nombre,
            usuario.apellido,
            usuario.correo,
            usuario.genero,
            usuario.rol,
            usuario.nit_empresa,
            usuario.razon_social
        );
        tablaUsuarios.appendChild(nuevaFila);
    });

    // Añadir eventos a los botones de eliminación
    document.querySelectorAll('.btnEliminar').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            try {
                const response = await fetch(`http://localhost:3000/api/users/usuarios/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    e.target.closest('tr').remove();
                    alert('Usuario eliminado con éxito');
                } else if (response.status ===500){
                     alert('No se puede eliminar el usuario porque está asociado como representante de una empresa. Verifique la empresa.');
                } 
                else {
                    alert('Error al eliminar el usuario');
                }
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
                alert('Error al eliminar el usuario');
            }
        });
    });

    // Añadir eventos a los botones de edición
    document.querySelectorAll('.btnEditar').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            // Redirigir a una página de edición con el ID del usuario
            window.location.href = `/usuario_editar.html?id=${id}`;
        });
    });
}

window.onload = function() {
    fetch('http://localhost:3000/api/users/usuarios', {
        method: 'GET'
    }).then((data) => {
        data.json().then((usuarios) => {
            agregarUsuariosTabla(usuarios[0]);

            botonBuscar.addEventListener('click', (e) => {
                const cedula_buscar = (barraBusqueda.value).trim();
                

                let usuarioEncontrado = usuarios[0].filter((usuario) => {
                    if (usuario.cedula == cedula_buscar) {
                        return usuario;
                    }
                });

                if (usuarioEncontrado.length > 0) {
                    tablaUsuarios.innerHTML = '';
                    usuarioEncontrado = creaFila(
                        usuarioEncontrado[0].cedula,
                        usuarioEncontrado[0].nombre,
                        usuarioEncontrado[0].apellido,
                        usuarioEncontrado[0].correo,
                        usuarioEncontrado[0].genero,
                        usuarioEncontrado[0].rol,
                        usuarioEncontrado[0].nit_empresa,
                        usuarioEncontrado[0].razon_social,
                    );

                    tablaUsuarios.innerHTML = '';
                    tablaUsuarios.appendChild(usuarioEncontrado);
                    const cedulaB= usuarioEncontrado[0].cedula;
                    console.log(cedulaB);

                    // Añadir eventos a los botones de eliminación
                    document.querySelectorAll('.btnEliminar').forEach(button => {
                        button.addEventListener('click', async (e) => {
                            const id = e.target.getAttribute('data-id');
                            console.log(id);
                            try {
                                const response = await fetch(`http://localhost:3000/api/users/usuarios/${id}`, {
                                    method: 'DELETE'
                                });
                                if (response.ok) {
                                    e.target.closest('tr').remove();
                                    alert('Usuario eliminado con éxito');
                                } else {
                                    alert('Error al eliminar el usuario');
                                }
                            } catch (error) {
                                console.error('Error al eliminar el usuario:', error);
                                alert('Error al eliminar el usuario');
                            }
                        });
                    });

                    // Añadir eventos a los botones de edición
                    document.querySelectorAll('.btnEditar').forEach(button => {
                        button.addEventListener('click', (e) => {
                            const id = e.target.getAttribute('data-id');
                            // Redirigir a una página de edición con el ID del usuario
                            window.location.href = `/editarUsuario.html?id=${id}`;
                        });
                    });

                } else {
                    alert("usuario NO encontrado");
                    window.location.href = '/usuarios_ver.html';
                }

            });

        });

    })
}