const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../bd');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

const JWT_SECRET = '8116e6a30e1856625e50ead825375db00b7182bad1cfbc52c9770758d972a1e2';

router.post('/registro', async (req, res) => {
  const { usuario, correo, contraseña } = req.body;
  try {
    const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE usuario = ? OR correo = ?', [usuario, correo]);
    if (existingUser.length > 0) return res.status(400).json({ error: 'El usuario o correo ya existe' });

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    await pool.query('INSERT INTO usuarios (usuario, correo, contraseña) VALUES (?, ?, ?)', [usuario, correo, hashedPassword]);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    if (users.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = users[0];
    const validPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, usuario: user.usuario, correo: user.correo }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, usuario: user.usuario, correo: user.correo } });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/completar-registro-google', async (req, res) => {
  const { temp_token, usuario, contraseña } = req.body;
  
  try {
    const decoded = jwt.verify(temp_token, JWT_SECRET);
    
    if (decoded.verified) {
      return res.status(400).json({ error: 'Token ya utilizado' });
    }

    // Verificar que no exista por usuario O correo
    const [existingUser] = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = ? OR correo = ?', 
      [usuario, decoded.email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }

    // Crear usuario SIN google_id
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (usuario, correo, contraseña) VALUES (?, ?, ?)', 
      [usuario, decoded.email, hashedPassword]
    );

    // Token final
    const token = jwt.sign(
      { 
        id: result.insertId, 
        usuario: usuario, 
        correo: decoded.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'Registro completado exitosamente',
      token,
      user: { id: result.insertId, usuario, correo: decoded.email }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
});

router.post('/logout', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Sesión cerrada exitosamente' });
});

router.get('/verificar-token', authenticateToken, (req, res) => {
  res.json({ 
    valido: true, 
    user: {
      id: req.user.id,
      usuario: req.user.usuario,
      correo: req.user.correo
    }
  });
});

module.exports = router;
