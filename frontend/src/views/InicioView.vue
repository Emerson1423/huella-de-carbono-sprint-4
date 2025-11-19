<template>
  <navComponente />

  <!-- Slideshow  -->
  <div class="slideshow-container"> 
    <div class="slide fade">
      <img src="@/assets/img/slide1.png" alt="Imagen 3">
      <div class="slide-content">
        <h2>BIENVENIDO A SALVAMBIENTE</h2>
        <p>Descubre y concientizate sobre el medio ambiente</p>
      </div>
    </div>
    <div class="slide fade">
      <img src="@/assets/img/slide2.png" alt="Imagen 0">
      <div class="slide-content">
        <h2>SE PARTE DEL CAMBIO</h2>
        <p>«Vivir de forma sostenible es la mejor manera de proteger el planeta.»</p>
      </div>
    </div>  
    <div class="slide fade">
      <img src="@/assets/img/slide3.png" alt="Imagen 4">
      <div class="slide-content">
        <h2>¡ES TIEMPO DE ACTUAR!</h2>
        <p>«No podemos seguir ignorando el cambio climático. Es hora de actuar.»</p>
      </div>
    </div>
    <div class="slide fade">
      <img src="@/assets/img/slide5.png">
      <div class="slide-content">
        <h2>MOTIVATE Y REFLEXIONA</h2>
        <p> «Todos podemos hacer algo para contribuir a la sostenibilidad.»</p>
      </div>
    </div>
    <div class="slide fade">
      <img src="@/assets/img/slide4.png" alt="Imagen 6">
      <div class="slide-content">
        <h2>RECUERDA LAS 3 R</h2>
        <p>Reciclar es una forma de darle una segunda vida a los materiales.</p>
      </div>
    </div>
  </div>

  <div class="contenido-inicio">
    <div class="content">
      <h1> ¿QUÉ ENCONTRARÁS?</h1>
    </div>
     <!-- Cards volteables -->
    <div class="cards">
      <ViewCard 
        title="Noticias" 
        link="/noticias" 
        icon="Noticias.png"
        backText="Mantente informado con las últimas noticias ambientales y descubrimientos científicos."
        actionText="Leer Noticias"
      />      
      <ViewCard 
        title="Calcula tu huella" 
        link="/huella" 
        icon="Huella.png"
        backText="Descubre tu impacto ambiental y haz pequeños cambios."
        actionText="Calcular"
      />      
      <ViewCard 
        title="Recursos Ambientales" 
        link="/articulos" 
        icon="Articulo.png"
        backText="Accede a artículos, curiosidades y videos sobre conscientización."
        actionText="Explorar"
      />
      <ViewCard 
        title="Hábitos" 
        link="/habitos" 
        icon="habitos.png"
        backText="Aprende hábitos sostenibles y cómo incorporarlos en tu vida diaria."
        actionText="Aprender"
      />
      <ViewCard 
        title="Eventos" 
        link="/eventos" 
        icon="Eventos.png"
        backText="Enterate de eventos y actividades ambientales en la comunidad."
        actionText="Ver Eventos"
      />
      <ViewCard 
        title="Entretenimiento" 
        link="/entretenimiento" 
        icon="Entretenimiento.png"
        backText="Diviértete mientras aprendes con nuestros minijuegos y actividades interactivas."
        actionText="Jugar"
      />
    </div>
  </div>
  
  <footerComponente></footerComponente>
</template>

<script>
import navComponente from '@/components/NavComponente.vue';
import ViewCard from '@/components/viewCardComponent.vue';
import footerComponente from '@/components/footerComponente.vue';

export default {
  components: {
    navComponente,
    ViewCard,
    footerComponente
  }
}
</script>

<style>
.contenido-inicio {
  max-width: 100vw;
  margin: 0 auto;
  padding: 32px 16px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: 'Poppins', sans-serif;
}

.slideshow-container {
  position: relative;
  margin-top: 5%;
  width: 100%;
  height: 70vh;
  min-height: 705px;
  max-height: 300px;
  overflow: hidden;
  background-color: #ffffff;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Contenido del slide - Mejorado para legibilidad */
.slide-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  color: #103b1f;
  padding: 40px 50px;
  border-radius: 15px;
  max-width: 75%;
  font-family: 'Poppins', sans-serif;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.slide-content h2 {
  font-size: 3rem;
  margin: 0 0 20px;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.slide-content p {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* Animación del slideshow */
.slide:nth-child(1) { animation: fade 25s infinite; }
.slide:nth-child(2) { animation: fade 25s infinite 5s; }
.slide:nth-child(3) { animation: fade 25s infinite 10s; }
.slide:nth-child(4) { animation: fade 25s infinite 15s; }
.slide:nth-child(5) { animation: fade 25s infinite 20s; }

/* Keyframes para el efecto fade */
@keyframes fade {
  0% { opacity: 0; }
  8% { opacity: 1; }
  20% { opacity: 1; }
  28% { opacity: 0; }
  100% { opacity: 0; }
}

.content {
  width: 100%;
  text-align: center;
  margin: 50px 0 40px 0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 35px;
  margin-top: 40px;
  margin-bottom: 50px;
  width: 100%;
  max-width: 1300px;
  padding: 0 25px;
}

h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 4rem;
  color: #6fa54e;
  text-align: center; 
  margin: 25px 0;
  font-weight: 800;
  letter-spacing: 1px;
}

/* ===== MEDIA QUERIES MEJORADAS ===== */

/* Escritorios extra grandes (1400px+) */
@media (min-width: 1400px) {
  .slideshow-container {
    height: 75vh;
    max-height: 800px;
  }
  
  .slide-content {
    max-width: 65%;
    padding: 50px 60px;
  }
  
  .slide-content h2 {
    font-size: 3.5rem;
  }
  
  .slide-content p {
    font-size: 1.8rem;
  }
  
  h1 {
    font-size: 4.5rem;
  }
  
  .cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    max-width: 1400px;
  }
}

/* Laptops grandes (1200px - 1399px) */
@media (min-width: 1200px) and (max-width: 1399px) {
  .slideshow-container {
    height: 65vh;
    max-height: 700px;
  }
  
  .slide-content h2 {
    font-size: 3rem;
  }
  
  .slide-content p {
    font-size: 1.5rem;
  }
  
  .cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 35px;
  }
}

/* Laptops estándar (992px - 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .slideshow-container {
    height: 60vh;
  }
  
  .slide-content {
    padding: 35px 45px;
    max-width: 80%;
  }
  
  .slide-content h2 {
    font-size: 2.5rem;
  }
  
  .slide-content p {
    font-size: 1.3rem;
  }
  
  h1 {
    font-size: 3.2rem;
  }
  
  .cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    padding: 0 20px;
  }
}

/* Tablets grandes (768px - 991px) */
@media (max-width: 991px) {
  .contenido-inicio {
    padding: 28px 15px 0 15px;
  }
  
  .slideshow-container {
    height: 50vh;
    min-height: 400px;
    margin-top: 7%;
  }
  
  .slide-content {
    padding: 30px 35px;
    max-width: 85%;
    backdrop-filter: blur(8px);
  }
  
  .slide-content h2 {
    font-size: 2.2rem;
    margin-bottom: 15px;
  }
  
  .slide-content p {
    font-size: 1.2rem;
  }
  
  h1 {
    font-size: 2.8rem;
    margin: 20px 0;
  }
  
  .cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
    padding: 0 15px;
  }
}

/* Tablets pequeñas (576px - 767px) */
@media (max-width: 767px) {
  .contenido-inicio {
    padding: 24px 12px 0 12px;
  }
  
  .slideshow-container {
    height: 45vh;
    min-height: 350px;
    margin-top: 10%;
  }
  
  .slide-content {
    padding: 25px 30px;
    width: 90%;
    max-width: 90%;
    backdrop-filter: blur(5px);
  }
  
  .slide-content h2 {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
  
  .slide-content p {
    font-size: 1rem;
  }
  
  h1 {
    font-size: 2.2rem;
    margin: 15px 0;
  }
  
  .cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 12px;
  }
}

/* Móviles grandes (481px - 575px) */
@media (max-width: 575px) {
  .contenido-inicio {
    padding: 20px 10px 0 10px;
  }
  
  .slideshow-container {
    height: 40vh;
    min-height: 300px;
    margin-top: 12%;
  }
  
  .slide-content {
    padding: 20px 25px;
    width: 92%;
    max-width: 92%;
    backdrop-filter: blur(3px);
  }
  
  .slide-content h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  .slide-content p {
    font-size: 0.9rem;
  }
  
  h1 {
    font-size: 1.8rem;
    margin: 12px 0;
  }
  
  .cards {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 0 10px;
  }
}

/* Móviles pequeños (360px - 480px) */
@media (max-width: 480px) {
  .contenido-inicio {
    padding: 16px 8px 0 8px;
  }
  
  .slideshow-container {
    height: 35vh;
    min-height: 250px;
    margin-top: 15%;
  }
  
  .slide-content {
    padding: 15px 20px;
    width: 95%;
    max-width: 95%;
  }
  
  .slide-content h2 {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }
  
  .slide-content p {
    font-size: 0.8rem;
  }
  
  h1 {
    font-size: 1.5rem;
    margin: 10px 0;
  }
  
  .cards {
    gap: 15px;
    padding: 0 8px;
  }
}

/* Móviles muy pequeños (hasta 359px) */
@media (max-width: 359px) {
  .contenido-inicio {
    padding: 12px 6px 0 6px;
  }
  
  .slideshow-container {
    height: 30vh;
    min-height: 200px;
  }
  
  .slide-content {
    padding: 12px 15px;
  }
  
  .slide-content h2 {
    font-size: 1.1rem;
  }
  
  .slide-content p {
    font-size: 0.75rem;
  }
  
  h1 {
    font-size: 1.3rem;
  }
  
  .cards {
    gap: 12px;
  }
}

/* Ajustes para orientación landscape en móviles */
@media (max-height: 500px) and (orientation: landscape) {
  .slideshow-container {
    height: 80vh;
    min-height: 300px;
  }
  
  .slide-content {
    padding: 15px 25px;
  }
  
  .slide-content h2 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
  
  .slide-content p {
    font-size: 0.9rem;
  }
}
</style>