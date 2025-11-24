<template>
  <footer class="salvambiente-footer">
    <div class="salvambiente-container">
      <div class="footer-content">
        <!-- Sección Información -->
        <div class="footer-section animate-on-scroll">
          <div class="footer-logo">
            <h3>Salvambiente</h3>
          </div>
          <p class="footer-description">
            Pequeños cambios, generan impacto. Sé parte de este pequeño inicio hacia el movimiento sostenible.
          </p>
        </div>

        <!-- Enlaces del sitio web -->
        <div class="footer-section animate-on-scroll">
          <h4 class="footer-heading">Enlaces Rápidos</h4>
          <ul class="footer-links">
            <li><router-link to="/noticias">Noticias</router-link></li>
            <li><router-link to="/eventos">Eventos</router-link></li>
            <li><router-link to="/curiosidades">Curiosidades</router-link></li>
            <li><router-link to="/huella">Cálculo CO2</router-link></li>
            <li><router-link to="/entretenimiento">Entretenimiento</router-link></li>
          </ul>
        </div>

        <!-- Contacto -->
        <div class="footer-section animate-on-scroll">
          <h4 class="footer-heading">Contacto</h4>
          <ul class="contact-list">
            <li>
              <i class="fas fa-envelope"></i>
              <span>equiposalvambiente@gmail.com</span>
            </li>
            <li>
              <i class="fas fa-phone"></i>
              <span>+503 2257-7777</span>
            </li>
            <li>
              <i class="fas fa-map-marker-alt"></i>
              <span>San Miguel, El Salvador</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="copyright animate-on-scroll">
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
  mounted() {
    // Animación al hacer scroll
    this.initScrollAnimation();
  },
  methods: {
initScrollAnimation() {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        }
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      for (const el of document.querySelectorAll('.animate-on-scroll')) {
        observer.observe(el);
      }
    }
  }
}
</script>

<style scoped>
.salvambiente-footer {
  font-family: 'Poppins', sans-serif;
  background: #067c2f;
  padding: 4rem 0 2rem;
  border-top: 4px solid #93ba89;

}

.salvambiente-footer * {
  box-sizing: border-box;
}

.salvambiente-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
  margin-bottom: 2.25rem;
  align-items: start;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 1.5rem;
  color: #FFFFFF;
  margin-bottom: 1rem;
}

.footer-logo h3 {
  color:#FFFFFF;
  margin: 0;
}

.footer-description {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.footer-heading {
  color: #FFFFFF;
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: #4CAF50;
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all .28s ease;
  padding: 0.25rem 0;
  display: inline-block;
  position: relative;
}

.footer-links a:hover,
.footer-links a:focus {
  color: #8BC34A;
  transform: translateX(8px);
  outline: none;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: .8rem;
  color: rgba(255, 255, 255, 0.9);
}

.contact-list li {
  display: flex;
  align-items: center;
  transition: all .28s ease;
  padding: 0.25rem 0;
}

.contact-list li:hover {
  transform: translateX(4px);
}

.contact-list i {
  margin-right: .8rem;
  opacity: .9;
  width: 16px;
  text-align: center;
  color: #4CAF50;
}
.copyright {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.copyright .legal-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.copyright .legal-links p {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all .28s ease;
  font-size: 0.85rem;
  cursor: pointer;
}

.copyright .legal-links p:hover {
  color: #FFFFFF;
}

/* Animación al hacer scroll */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .6s ease, transform .6s ease;
}

.is-visible {
  opacity: 1;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .footer-heading::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .copyright .legal-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .contact-list li {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .salvambiente-footer {
    padding: 3rem 0 1.5rem;
  }

  .salvambiente-container {
    padding: 0 1rem;
  }
  
  .footer-logo {
    justify-content: center;
  }
}
</style>