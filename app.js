// const express = require('express');
import fetch from 'node-fetch';
import express from 'express';
import ejs from 'ejs';

import path from 'path';
import { fileURLToPath } from 'url';
// const path = require('path');

const app = express();
const PORT = 3000;

// Tentukan __filename dan __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set folder 'public' untuk file statis (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// set EJS untuk view
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// Route ke halaman utama
app.get('/', (req, res) => {
    res.render('index');
});

// Route untuk mendapatkan data user dari laravel API
app.get('/users', async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/users');
        const users = await response.json();
        res.render('user', { users: users});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

// Halaman daftar produk
app.get('/products', async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/products/see');
        const products = await response.json();
        res.render('product', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

app.get('/suppliers', async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/suppliers/see');
        const suppliers = await response.json();
        res.render('supplier', { suppliers });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).send('Error fetching suppliers');
    }
});

app.listen(PORT, () => {
    console.log('Server running at http://127.0.0.1:${PORT}');
});