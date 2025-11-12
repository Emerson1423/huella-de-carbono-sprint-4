<template>
  <footer class="salvambiente-footer">
    <div class="footer-content">
      <!-- Sección Información -->
      <div class="footer-section">
        <div class="footer-logo">
          <h3>Salvambiente</h3>
          <p class="footer-description">
            Pequeños cambios, generan impacto. Sé parte de este pequeño inicio hacia el movimiento sostenible.
          </p>
        </div>
        <div class="social-links">
          <a href="#" class="social-link" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" class="social-link" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="social-link" aria-label="Twitter">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" class="social-link" aria-label="YouTube">
            <i class="fab fa-youtube"></i>
          </a>
        </div>
      </div>

      <!-- Enlaces rápidos -->
      <div class="footer-section">
        <h4>Enlaces Rápidos</h4>
        <ul class="footer-links">
         
        </ul>
      </div>

      <!-- Contacto -->
      <div class="footer-section">
        <h4>Contacto</h4>
        <div class="contact-info">
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <span>equiposalvambiente@gmail.com</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-phone"></i>
            <span>+503 2257-7777 </span>
          </div>
          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>San Miguel, El Salvador</span>
          </div>
        </div>
        

      </div>
    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p>&copy; {{ currentYear }} Salvambiente. Todos los derechos reservados.</p>
        <div class="legal-links">
          <p>Política de Privacidad</p>
          <p>Términos de Servicio</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SalvambienteFooter',
  data() {
    return {
     
      currentYear: new Date().getFullYear()
    }
  },

}
</script>

<style scoped>
.salvambiente-footer {
  background: linear-gradient(135deg, #ffffff 0%, #39aa26 100%);
  color: #1c1d1c;
  padding: 3rem 0 0 0;
  margin-top: auto;
  font-family: 'Poppins', sans-serif;


}

.footer-content {
  max-width: auto;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  color: #1c1d1c;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.footer-section h4 {
  color: #1c1d1c;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section h5 {
  color: #1c1d1c;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.footer-description {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #1c1d1c;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #1c1d1c;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #429044;
  transform: translateY(-2px);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #1c1d1c;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #53a155;
}

.contact-info {
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #1c1d1c;
}

.contact-item i {
  margin-right: 0.5rem;
  color: #1c1d1c;
  width: 20px;
}


.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
  padding: 1.5rem 0;
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-links p {
  color: #1c1d1c;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}



/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }

  .contact-item {
    justify-content: center;
  }
}
</style>