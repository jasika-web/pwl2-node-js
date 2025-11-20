// const express = require('express');
import fetch from 'node-fetch';
import express from 'express';
import ejs from 'ejs';

import path from 'path';
import { fileURLToPath } from 'url';
// const path = require('path');
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3000;

// Tentukan __filename dan __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set folder 'public' untuk file statis (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

// Form Tambah Pengguna
app.get('/users/create', (req, res) => {
    res.render('user_create');
});

// Tampilkan Detail Pengguna
app.get('/users/:id', async (req, res) => {
    try {
        const response = await fetch(`http://localhost:8000/api/users/${req.params.id}`);

        const user = await response.json();
        res.render('user_show', {user: user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error fetching user');
    }
});

// Tambah Pengguna
app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash Password

        const response = await fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
        });
        res.redirect('/users');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

// Form Edit Pengguna
app.get('/users/:id/edit', async (req, res) => {
    try {
        const response = await fetch(`http://localhost:8000/api/users/${req.params.id}`);

        const user = await response.json();
        res.render('user_update', { user: user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error fetching user');
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const dataToUpdate = {
            name: req.body.name,
            email: req.body.email
        };

        if (req.body.password) {
            dataToUpdate.password = req.body.password; 
        }
        
        await fetch(`http://localhost:8000/api/users/${req.params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToUpdate)
        });
        res.redirect('/users');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});

// Hapus Pengguna
app.delete('/users/:id', async (req, res) => {
    try {
        await fetch(`http://localhost:8000/api/users/${req.params.id}`, {
            method: 'DELETE',
        });
        res.redirect('/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});

app.get('/suppliers/create', (req, res) => {
    res.render('supplier_create');
});

app.post('/suppliers', async (req, res) => {
    try {
        await fetch('http://127.0.0.1:8000/api/suppliers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                supplier_name: req.body.supplier_name,
                pic_supplier: req.body.pic_supplier
            })
        });

        res.redirect('/suppliers');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating supplier");
    }
});

app.get('/suppliers/:id', async (req, res) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/suppliers/${req.params.id}`);
        const supplier = await response.json();
        res.render('supplier_show', { supplier });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching supplier");
    }
});

app.get('/suppliers/:id/edit', async (req, res) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/suppliers/${req.params.id}`);
        const supplier = await response.json();
        res.render('supplier_update', { supplier });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching supplier");
    }
});

app.put('/suppliers/:id', async (req, res) => {
    try {
        await fetch(`http://127.0.0.1:8000/api/suppliers/${req.params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                supplier_name: req.body.supplier_name,
                pic_supplier: req.body.pic_supplier
            })
        });

        res.redirect('/suppliers');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating supplier");
    }
});

app.delete('/suppliers/:id', async (req, res) => {
    try {
        await fetch(`http://127.0.0.1:8000/api/suppliers/${req.params.id}`, {
            method: 'DELETE'
        });

        res.redirect('/suppliers');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting supplier");
    }
});
