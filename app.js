const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

var products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/requestProduct', express.urlencoded({ extended: true }), (req, res) => {
    const productId = parseInt(req.body.ID);

    const requestedProduct = products.find(product => product && product.id === productId);

    if (requestedProduct) {
        res.json({ message: 'Product requested successfully', product: requestedProduct });
    } else {
        res.status(404).json({ message: 'No product found with that ID' });
    }
});


app.get('/add', (req, res) => {
    res.sendFile(__dirname + '/addProduct.html');
});

app.post('/addProduct', express.urlencoded({ extended: true }), (req, res) => {
    const newProduct = {
        id: Object.keys(products).length + 1,
        name: req.body.name,
        price: req.body.price
    };

//    products[newProduct.id] = newProduct;
    products.push(newProduct);

    fs.writeFileSync('products.json', JSON.stringify(products));

    res.json({ message: 'Product added successfully', product: newProduct });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
