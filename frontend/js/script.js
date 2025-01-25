alert("Hola Mundo");
 // Seleccionamos todos los botones de dropdown
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');

    // Añadimos un listener de clic a cada botón
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Alternamos la clase active en el dropdown dentro del botón
            const dropdown = this.querySelector('.dropdown');
            dropdown.classList.toggle('active');

            // Cerrar otros dropdowns si están abiertos
            dropdownButtons.forEach(otherButton => {
                if (otherButton !== this) {
                    const otherDropdown = otherButton.querySelector('.dropdown');
                    otherDropdown.classList.remove('active');
                }
            });
        });
    });