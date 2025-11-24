const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const passport = require('./config/passport');
const app = express();

app.disable('x-powered-by');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto',
  resave: false,
  saveUninitialized: true,
}));

// Importar rutas
const authRoutes = require('./routes/auth');
const huellaRoutes = require('./routes/huella');
const passwordResetRoutes = require('./routes/passwordReset');
const googleOAuthRoutes = require('./routes/googleOauth');
const updatePerfilRoutes = require('./routes/updatePerfil');
const estadisticasHuellaRoutes = require('./routes/estadisticasHuella');
const juego1Routes = require('./routes/juego1');
const juego2Routes = require('./routes/juego2');
const dashboardRoutes = require('./routes/dashboard');
const soporteRoutes = require('./routes/soporte');
const adminRoutes = require('./routes/rolesAdmin');

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Registrar rutas
app.use('/api', authRoutes);
app.use('/api', huellaRoutes);
app.use('/api', passwordResetRoutes);
app.use('/api', googleOAuthRoutes);
app.use('/api', updatePerfilRoutes);
app.use('/api', estadisticasHuellaRoutes);
app.use('/api/juego1', juego1Routes);
app.use('/api/juego2', juego2Routes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/soporte', soporteRoutes);
app.use('/api', adminRoutes); // ✅ CORREGIDO

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;