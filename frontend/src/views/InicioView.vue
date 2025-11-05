<template>
  <navComponente />

  <div class="contenido-inicio">


  <div class="slideshow-container"> 
       <div class="slide fade">
      <img src="@/assets/img/f3.png" alt="Imagen 3">
    </div>
      <div class="slide fade">
      <img src="@/assets/img/f2.png" alt="Imagen 0">
    </div>  
    <div class="slide fade">
      <img src="@/assets/img/imgSlide2.jpg" alt="Imagen 4">
    </div>
    <div class="slide fade">
      <img src="@/assets/img/imgSlide3.jpeg" alt="Imagen 5">
    </div>
        <div class="slide fade">
      <img src="https://img.itch.zone/aW1hZ2UvMjMyNTE5NC8xMzc3Mjg5NS5wbmc=/original/thWm3L.png" alt="Imagen 6">
    </div>
  </div>
  <br>
  <div class="content">
     <h1> ¿Qué encontrarás?</h1>
  </div>
  



  
    <!-- Cards -->
    <div class="cards">
      <ViewCard title="Noticias" link="/noticias" icon="Noticias.png" />      
      <ViewCard title="Calcula tu huella" link="/huella" icon="Huella.png" />      
      <ViewCard title="Recursos Ambientales" link="/articulos" icon="Articulo.png" />
      <ViewCard title="Hábitos" link="/habitos" icon="habitos.png" />
      <ViewCard title="Eventos" link="/eventos" icon="Eventos.png" />
      <ViewCard title="Entretenimiento" link="/" icon="Entretenimiento.png" />
    </div>
    <footer class="footer">
        SalvAmbiente &copy; {{ new Date().getFullYear() }}
      </footer>
  </div>
</template>

<script>
import navComponente from '@/components/NavComponente.vue';
import ViewCard from '@/components/viewCardComponent.vue';
import '@/Style.css';
export default {
  components: {
    navComponente,
    ViewCard
  }
}
</script>

<style>
.contenido-inicio {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.slideshow-container {
  position: relative;
  width: 100%;
  max-width: 100vw;
  height: 500px; /* Altura ajustable */
  overflow: hidden; 
  margin: 0 auto;


}

/* Estilos para cada slide */
.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

/* Animación del slideshow */
.slide:nth-child(1) { animation: fade 24s infinite; }
.slide:nth-child(2) { animation: fade 24s infinite 6s; }
.slide:nth-child(3) { animation: fade 24s infinite 12s; }
.slide:nth-child(4) { animation: fade 24s infinite 18s; }
/* Keyframes para el efecto fade */
@keyframes fade {
  0% { opacity: 0; }
  10% { opacity: 1; }    /* Fade in más rápido */
  25% { opacity: 1; }
  35% { opacity: 0; }    /* Fade out más rápido */
  100% { opacity: 0; }
}
/*.content {
  display: block;
  text-align: center; 
  margin: 20px 0;
}*/

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
  width: 100%;
  max-width: 1200px;
  padding:0 16px;
}
.footer {
  margin-top: auto; /* Empuja el footer hacia abajo */
  text-align: center;
  padding: 20px 0;
  background: #ffffff;
  color: #131313;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

h1{
    font-family: 'Poppins', sans-serif;
    font-size: 64px;
    color: #6fa54e;
    text-align: center; 
    margin:20px 0;
}
@media (max-width: 768px) {
  .contenido-inicio{
    padding: 24px 12px 0 12px;
  }
  .slideshow-container {
    height:350px;
  }
  h1 {
    font-size: 48px;
  }
  .cards {
    grid-template-columns:repeat(2, 1fr);
    gap: 20px;
    padding: 0 12px;
  }
  
}
@media (max-width: 480px) {
  .contenido-inicio{
    padding: 16px 8px 0 8px;
  }
  .slideshow-container {
    height: 250px;
  }
  h1 {
    font-size: 32px;
    margin: 15px 0;
  }
  .cards {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 8px;
  }
  .footer {
    font-size: 14px;
    padding: 15px 0;
  }
}

@media (max-width: 360px) {
  .slideshow-container {
    height: 200px;
  }
  h1 {
    font-size: 28px;
    
  }
  .cards {
    gap: 12px
  }
}
</style>