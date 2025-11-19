<template>
  
    <NavComponente></NavComponente>

     <div class="titulo-principal"> <h1>Minijuegos Ambientales</h1></div>
    <div class="contenedor-juegos">
   
         <div class="lista-juegos">
        <div class="juego-item">
          <h2 class="titulo-juego">Juego 1</h2>
          <router-link to="/recicla" class="boton-jugar">
            Jugar ahora
          </router-link>
        </div>
        
        <div class="juego-item">
          <h2 class="titulo-juego">Juego 2</h2>
          <router-link to="/" class="boton-jugar">
            Jugar ahora
          </router-link>
        </div>
      </div>
    </div>
    <footerComponente></footerComponente>
</template>

<script>
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';

export default {
  name: 'MinijuegosView',
  components: {
    NavComponente,
    footerComponente
  }
}
</script>

<style scoped>
.contenedor-juegos {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background-image: url("@/assets/img/fjuego1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

}

.titulo-principal{
  text-align: center;
  margin-top: 10%;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  font-weight: bold;
  color: #009951;
  font-family: 'Poppins', sans-serif;
}

.lista-juegos {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.juego-item {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 2px solid #e0e0e0;
}

.titulo-juego {
  font-size: 1.8rem;
  font-weight: 600;
  color: #27ae60;
  margin-bottom: 1.5rem;
}

.boton-jugar {
  display: inline-block;
  background: #27ae60;
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid #27ae60;
}

.boton-jugar:hover {
  background: white;
  color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .contenedor-juegos {
    padding: 1rem;
  }
  
  .titulo-principal {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .juego-item {
    padding: 1.5rem;
  }
  
  .titulo-juego {
    font-size: 1.5rem;
  }
}
</style>