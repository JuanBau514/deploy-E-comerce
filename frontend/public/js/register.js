function mostrarCampos() {
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const camposNatural = document.getElementById('camposNatural'); 
    const camposEmpresa = document.getElementById('camposEmpresa');
    camposNatural.style.display = tipoUsuario === 'natural' ? 'block' : 'none';
    camposEmpresa.style.display = tipoUsuario === 'empresa' ? 'block' : 'none';
}

  document.addEventListener('DOMContentLoaded', function() {
        // Verificar si hay una sesión iniciada en el local storage
        const sesionIniciada = localStorage.getItem('sesionIniciada');

        if (sesionIniciada === 'true') {
            // Mostrar la sección de usuario si hay una sesión iniciada
            document.getElementById('seccion-usuario').style.display = 'block';
            // Ocultar el enlace de login
            const loginLink = document.querySelector('a[href="./login.html"]');
            if (loginLink) {
                loginLink.style.display = 'none';
            }
        }
    });

async function cargarRubros() {
    try {
        const response = await fetch('https://deploy-e-comerce-production.up.railway.app/api/users/rubros');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
            const rubrosArray = data.data;

            const rubroSelect = document.getElementById('rubro');
            if (rubroSelect) {
                rubroSelect.innerHTML = ''; // Limpia opciones anteriores

                // Agrega la opción de selección predeterminada
                const defaultOption = document.createElement('option');
                defaultOption.value = "";
                defaultOption.textContent = "Seleccione el Rubro";
                rubroSelect.appendChild(defaultOption);

                // Agrega las opciones de rubro dinámicamente
                rubrosArray.forEach(rubro => {
                    const option = document.createElement('option');
                    option.value = rubro.id_rubro;
                    option.textContent = rubro.rubro;
                    rubroSelect.appendChild(option);
                });
            } else {
                console.error('No se encontró el elemento con ID "rubro"');
            }
        } else {
            console.error('La respuesta del servidor no contiene datos válidos');
        }
    } catch (error) {
        console.error('Error al cargar los rubros:', error);
    }
}

function redireccionarRegistro() {
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    if (tipoUsuario === "natural") {
        window.location.href = "./registrol.html";
    } else if (tipoUsuario === "empresa") {
        document.getElementById("camposEmpresa").style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', cargarRubros);

async function registrarPersonaNatural() {
    const nickname = document.getElementById('nombre').value.trim();
    const lastname = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const rutFile = document.getElementById('rut').files[0];

    if (!nickname || !lastname || !email || !rutFile) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingrese un email válido.');
        return;
    }

    const formData = new FormData();
    formData.append('tipo', 'Persona Natural');
    formData.append('nombre', nickname);
    formData.append('apellido', lastname);
    formData.append('email', email);
    formData.append('archivo', rutFile);

    // Enviar datos al servidor
    await fetch('/api/enviarCorreoRegistro', {
        method: 'POST',
        body: formData
    });

    alert('Usuario registrado. Vamos a validar tu usuario y luego te enviaremos un correo de confirmación.');
    window.location.href = './userPage.html';
}

async function registrarEmpresa() {
    const companyNameElement = document.getElementById('razon_social');
    const companyEmailElement = document.getElementById('email_empresa');
    const companyRutFileElement = document.getElementById('nit');

    if (!companyNameElement || !companyEmailElement || !companyRutFileElement) {
        alert('No se encontraron los elementos del formulario. Por favor, asegúrese de que todos los campos estén presentes.');
        return;
    }

    const companyName = companyNameElement.value.trim();
    const companyEmail = companyEmailElement.value.trim();
    const companyRutFile = companyRutFileElement.files[0];

    if (!companyName || !companyEmail || !companyRutFile) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) {
        alert('Por favor, ingrese un email válido.');
        return;
    }

    const formData = new FormData();
    formData.append('tipo', 'Empresa');
    formData.append('nombre', companyName);
    formData.append('email', companyEmail);
    formData.append('archivo', companyRutFile);

    // Enviar datos al servidor
    await fetch('/api/enviarCorreoRegistro', {
        method: 'POST',
        body: formData
    });

    alert('Empresa registrada. Vamos a validar tu usuario y luego te enviaremos un correo de confirmación.');
    window.location.href = './userPage.html';
}