// Obtener el año actual y generar los años en el selector
const currentYear = new Date().getFullYear();
const yearSelector = document.getElementById('yearSelector');

for (let i = currentYear; i >= currentYear - 10; i--) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelector.appendChild(option);
}

// Función para generar el reporte
function generateReport() {
    const month = document.getElementById('monthSelector').value;
    const year = document.getElementById('yearSelector').value;
    const reportOutput = document.getElementById('reportOutput');

    if (month && year) {
        const monthNames = {
            "01": "Enero",
            "02": "Febrero",
            "03": "Marzo",
            "04": "Abril",
            "05": "Mayo",
            "06": "Junio",
            "07": "Julio",
            "08": "Agosto",
            "09": "Septiembre",
            "10": "Octubre",
            "11": "Noviembre",
            "12": "Diciembre"
        };
        reportOutput.textContent = `Generando reporte para: ${monthNames[month]} de ${year}`;
    } else {
        reportOutput.textContent = "Por favor selecciona mes y año.";
    }
}
