document.querySelector('.boton-enviar').addEventListener('click', async function (e) {
    e.preventDefault();

    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            try {
                const response = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    // Guarda la cédula en localStorage
                    localStorage.setItem('cedula', result.cedula);
                    // Guarda el estado de sesión iniciada en localStorage
                    localStorage.setItem('sesionIniciada', 'true');

                    // Verifica el rol del usuario
                    if (result.role === 1) {  // Asegúrate de que este es el rol de Administrador
                        window.location.href = '/Views/adminPage.html';
                    } else {
                        window.location.href = '/Views/userPage.html';
                    }
                } else {
                    alert('Error en el inicio de sesión: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error en el inicio de sesión. Por favor, intenta nuevamente.');
            }
        } else {
            alert('Por favor, ingresa tu correo electrónico y contraseña.');
        }
    }
});