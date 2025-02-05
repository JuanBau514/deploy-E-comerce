document.addEventListener('DOMContentLoaded', async function() {
    const API_URL = 'https://deploy-e-comerce-production.up.railway.app/api/users';

    async function fetchData() {
        try {
            const response = await fetch(`${API_URL}/indicadores`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    function updateDashboard(data) {
        if (!data) return;
        
        const elements = {
            inventarios: document.querySelector('.valor__inventarios'),
            clientes: document.querySelector('.valor__clientes'),
            administradores: document.querySelector('.valor__administradores'),
            pedidos: document.querySelector('.valor__pedidos')
        };

        elements.inventarios.textContent = data.productos?.total || '0';
        elements.clientes.textContent = data.clientes || '0';
        elements.administradores.textContent = data.administradores || '0';
        elements.pedidos.textContent = data.pedidos?.total || '0';
    }

    const data = await fetchData();
    if (data?.success) {
        updateDashboard(data.data);
    }
});