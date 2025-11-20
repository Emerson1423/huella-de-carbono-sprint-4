<template>
  <NavComponente></NavComponente>
  <div class="contenido-principal">
    <div class="titulo-principal">
      <h1>Minijuegos Ambientales</h1>
    </div>
    <div class="contenedor-juegos">
      <div class="lista-juegos">
        <div class="juego-item">
          <h2 class="titulo-juego">Recicla - ¿Y esto a dónde va?</h2>
          <router-link to="/recicla" class="boton-jugar">
            Jugar ahora
          </router-link>
        </div>
        
        <div class="juego-item">
          <h2 class="titulo-juego">Quiz - Planta Virtual</h2>
          <router-link to="/planta" class="boton-jugar">
            Jugar ahora
          </router-link>
        </div>
      </div>
    </div>
    <footerComponente></footerComponente>
  </div>
</template>

<script>
import NavComponente from '@/components/NavComponente.vue';
import footerComponente from '@/components/footerComponente.vue';
import fondoEntretenimiento from '@/assets/img/fondoEntretenimiento.jpg';

export default {
  name: 'MinijuegosView',
  components: {
    NavComponente,
    footerComponente
  },
  data() {
    return {
      fondoUrl: fondoEntretenimiento
    }
  }
}
</script>
<style scoped>
.contenido-principal {
  background-image: url('@/assets/img/fondoEntretenimiento.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 20px 0;
}

.contenedor-juegos {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.titulo-principal {
  text-align: center;

}

.titulo-principal h1 {
  margin-top: 10%;
  font-size: 2.3rem;
  font-weight: bold;
  color: #f4f7f4;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  text-shadow: 2px 2px 5px rgb(0, 0, 0);


}

.lista-juegos {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.juego-item {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  border: 2px solid rgba(39, 174, 96, 0.3);
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.juego-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
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
  
  .titulo-principal h1 {
    font-size: 2rem;
    margin-top: 20%;
    padding: 12px 25px;
  }
  
  .juego-item {
    padding: 1.5rem;
  }
  
  .titulo-juego {
    font-size: 1.5rem;
  }
  
  .contenido-principal {
    background-attachment: scroll;
  }
}

@media (max-width: 480px) {
  .titulo-principal h1 {
    font-size: 1.7rem;
    margin-top: 25%;
    padding: 10px 20px;
  }
  
  .juego-item {
    padding: 1rem;
  }
  
  .titulo-juego {
    font-size: 1.3rem;
  }
  
  .boton-jugar {
    padding: 10px 25px;
    font-size: 1rem;
  }
}

</style>