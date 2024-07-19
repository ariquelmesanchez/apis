async function fetchData(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error('Success');
        return await response.json();
    } catch (error) {
        document.getElementById('error').innerText = 'Result: ' + error.message;
        throw error;
    }
}

async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    const resultElement = document.getElementById('result');
    const errorElement = document.getElementById('error');
    const chartElement = document.getElementById('chart').getContext('2d');

    errorElement.innerText = '';

    if (!amount) {
        errorElement.innerText = 'Por favor, ingresa una cantidad en pesos chilenos.';
        return;
    }

    try {
        const data = await fetchData('https://mindicador.cl/api');
        const exchangeRate = data[currency].valor;
        const convertedAmount = (amount / exchangeRate).toFixed(2);

        resultElement.innerText = `${amount} CLP son aproximadamente ${convertedAmount} ${currency === 'dolar' ? 'USD' : 'EUR'}`;

        const historicalData = await fetchData(`https://mindicador.cl/api/${currency}/10`);
        const labels = historicalData.serie.map(item => new Date(item.fecha).toLocaleDateString());
        const values = historicalData.serie.map(item => item.valor);

        new Chart(chartElement, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Valor del ${currency === 'dolar' ? 'USD' : 'EUR'} en los últimos 10 días`,
                    data: values,
                    borderColor: 'blue',
                    backgroundColor: 'lightblue',
                    fill: false
                }]
            },
            
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
