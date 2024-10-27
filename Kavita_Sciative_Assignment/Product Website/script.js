const csvFilePath = 'croma_led_tv_test.csv'; 

let products = [];

// Fetch and parse the CSV file
fetch(csvFilePath)
    .then(response => response.text())
    .then(data => {
        const rows = data.trim().split('\n').slice(1); // Skip header
        products = rows.map(row => {
            const [name, brand, price, ranking, rating, description, imageUrl] = row.split(',');
            return { 
                name,
                brand,
                price: parseFloat(price), 
                ranking: parseInt(ranking, 10), 
                rating: parseFloat(rating), 
                description, 
                imageUrl 
            };
        });
        displayProducts(products);
    })
    .catch(error => console.error('Error fetching the CSV file:', error));

// Display products in card format
function displayProducts(productsToDisplay) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Clear previous cards

    productsToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${product.imageUrl || 'path/to/fallback-image.png'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Category: ${product.brand}</p>
            <p>Price: ₹${product.price.toFixed(2)}</p>
            <p>Catalog Ranking: ${product.ranking}</p>
            <p>Rating: ${product.rating}</p>
            <p>Description: ${product.description}</p>
        `;
        cardContainer.appendChild(card);
    });
}

// Search functionality
document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.price.toString().includes(searchTerm) || 
        product.ranking.toString().includes(searchTerm) || 
        product.rating.toString().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});

// Filter functionality based on dropdown selection
document.getElementById('filter-dropdown').addEventListener('change', (event) => {
    const value = event.target.value;
    let sortedProducts;

    switch (value) {
        case 'lowest-price':
            sortedProducts = [...products].sort((a, b) => a.price - b.price);
            break;
        case 'catalog-ranking':
            sortedProducts = [...products].sort((a, b) => a.ranking - b.ranking);
            break;
        case 'top-rated':
            sortedProducts = [...products].sort((a, b) => b.rating - a.rating);
            break;
        default:
            sortedProducts = products; // Default: no filter
    }

    displayProducts(sortedProducts);
});
