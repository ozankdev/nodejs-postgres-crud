  //------------------------- PROJE ------------------------- //


require('dotenv').config();

const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.json());

  //------------------------------------------------------------------------ //






  //------------------------- VERİTABANI BAĞLANTISI ------------------------- //


const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

client.connect()
.then(() => console.log('Bağlantı Başarılı'))
.catch(err => console.error('Bağlantı Başarısız', err.stack));


  //------------------------------------------------------------------------ //









//----------------------- POST REQUEST ------------------------- //

app.post('/users', async (req, res) => {
    const { name, email, age } = req.body;
    const query = 'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *';
    try {
        const result = await client.query(query, [name, email, age]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//-------------------------------------------------------------- //










//----------------------- GET REQUEST ------------------------- //


app.get('/users', async (req, res) => {
    const query = 'SELECT * FROM users';
    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//-------------------------------------------------------------- //














//----------------------- PUT REQUEST ------------------------- //


app.put('/users/:id', async (req, res) => {
    const { name, email, age } = req.body;
    const query = 'UPDATE users SET name=$1, email=$2, age=$3 WHERE id=$4 RETURNING *';
    try {
        const result = await client.query(query, [name, email, age, req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Kullanıcı Bulunamadı' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//-------------------------------------------------------------- //








//------------------------- DELETE REQUEST ------------------------- //


app.delete('/users/:id', async (req, res) => {
    const query = 'DELETE FROM users WHERE id=$1 RETURNING *';
    try {
      const result = await client.query(query, [req.params.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }
      res.status(200).json({ message: 'Kullanıcı silindi' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //------------------------------------------------------------------ //




  //------------------------- PORT BİLGİLERİ ------------------------- //


  const port = 3000;
  app.listen(port, () => {
    console.log(`Server http://localhost:${port} Adresinde Çalışıyor!`);
  });


