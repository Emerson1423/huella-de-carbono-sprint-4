<template>
  <div class="contenedor-tarjetas">
    <h1 class="titulo-principal">Artículos Ambientales</h1>
       

    
    <article 
      v-for="(tarjeta, index) in tarjetas" 
      :key="index" 
      class="tarjeta">

      <div class="contenido-tarjeta">
        <h2 class="titulo-tarjeta">{{ tarjeta.titulo }}</h2>
        <p class="texto-tarjeta">{{ tarjeta.texto }}</p>
        <button 
          class="enlace-tarjeta" 
          @click="abrirModal(tarjeta)">
          Ver más...
        </button>
      </div>
      
      <div class="imagen-contenedor">
        <img 
          :src="tarjeta.imagen" 
          :alt="tarjeta.alt || 'Imagen ilustrativa'"
          class="imagen-tarjeta"
          loading="lazy"
        >
      </div>
    </article>

    <!-- Modal -->
    <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-contenido">
        <button class="modal-cerrar" @click="cerrarModal">&times;</button>
        <h2 class="modal-titulo">{{ tarjetaActual.titulo }}</h2>
        <img 
          :src="tarjetaActual.imagen" 
          :alt="tarjetaActual.alt || 'Imagen ilustrativa'"
          class="modal-imagen" >

        <div class="modal-texto">
          <p>{{ tarjetaActual.textoCompleto || tarjetaActual.texto }}</p>
          <p v-if="tarjetaActual.enlace" class="modal-fuente">
            Fuente: <a :href="tarjetaActual.enlace" target="_blank" rel="noopener noreferrer">Ver artículo original</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalAbierto: false,
      tarjetaActual: null,
      tarjetas: [
        {
          titulo: "¿Y si un día amanecemos sin árboles?",
          texto: "Los árboles no solo dan sombra. Sin ellos, el planeta colapsa. Esto es lo que ocurriría si de pronto desaparecieran todos.",
          textoCompleto: "Los árboles no solo dan sombra. Sin ellos, el planeta colapsaría. Los árboles son fundamentales para la vida en la Tierra: producen oxígeno, absorben dióxido de carbono, regulan el clima, previenen la erosión del suelo y albergan una gran biodiversidad. Si desaparecieran, enfrentaríamos un aumento drástico de CO2 en la atmósfera, lo que aceleraría el cambio climático. Las temperaturas subirían, los patrones de lluvia cambiarían y muchos ecosistemas colapsarían. Además, la pérdida de hábitats llevaría a la extinción de innumerables especies. Las ciudades se volverían más calientes sin la sombra y enfriamiento que proporcionan los árboles. La calidad del aire empeoraría significativamente, aumentando los problemas respiratorios en humanos. La agricultura se vería gravemente afectada debido a la erosión del suelo y cambios en los patrones climáticos. En resumen, la vida tal como la conocemos sería imposible sin árboles.",
          enlace: "https://www.aztecajalisco.com/programas/que-pasa-si-desaparecen-los-arboles-consecuencias-ambientales-y-humanas",
          imagen: "https://media.istockphoto.com/id/1317323736/es/foto/una-vista-hacia-el-cielo-de-direcci%C3%B3n-de-los-%C3%A1rboles.jpg?s=612x612&w=0&k=20&c=t8tQ5ouh0WlI-QixI5l0V_LgGZE9TTZx5K5y8V1-S9c=",
        },
        {
          titulo: "En qué consiste la restauración de ecosistemas: experiencias inspiradoras de Latinoamérica",
          texto: "La región destaca por su rica biodiversidad, pero diversos eventos contribuyen a su degradación.",
          textoCompleto: "La restauración de ecosistemas en Latinoamérica está cobrando fuerza como respuesta a la creciente degradación ambiental. La región, que alberga el 40% de la biodiversidad mundial y el 50% de los bosques tropicales del planeta, enfrenta desafíos como la deforestación, la minería ilegal y el cambio climático. Proyectos inspiradores incluyen la reforestación comunitaria en Costa Rica, que ha logrado revertir la deforestación; la recuperación de manglares en Ecuador, cruciales para proteger las costas y almacenar carbono; y la restauración del Bosque Atlántico en Brasil, uno de los ecosistemas más amenazados del mundo. Estos esfuerzos no solo recuperan la biodiversidad, sino que generan empleo verde y fortalecen la resiliencia climática. La clave del éxito radica en combinar conocimiento científico con saberes tradicionales de las comunidades locales, creando modelos sostenibles que benefician tanto a la naturaleza como a las personas.",
          enlace: "https://www.nationalgeographicla.com/medio-ambiente/2023/02/en-que-consiste-la-restauracion-de-ecosistemas-experiencias-inspiradoras-de-latinoamerica",
          imagen: "https://www.nature.org/content/dam/tnc/nature/en/photos/c/e/cerradobrasil.jpg",
        },
        {
          titulo: "Los 5 consejos sencillos que puedes seguir para vivir de forma más sostenible",
          texto: "Muchas de estas sugerencias son fáciles y la mayoría te ayudarán a poner los pies en la hierba y las manos en la tierra.",
          textoCompleto: "1. Reduce tu consumo de carne: La industria cárnica es una de las mayores emisoras de gases de efecto invernadero. Comienza con un día sin carne a la semana. 2. Opta por transporte sostenible: Camina, usa bicicleta o transporte público siempre que puedas. Si necesitas auto, considera compartirlo o usar eléctricos. 3. Minimiza los plásticos de un solo uso: Lleva tu propia bolsa, botella de agua y recipientes reutilizables. 4. Consume local y de temporada: Los productos locales reducen la huella de carbono del transporte y apoyan la economía de tu comunidad. 5. Ahorra energía: Usa bombillas LED, desconecta aparatos que no uses y aprovecha la luz natural. Pequeños cambios en tu rutina pueden tener un gran impacto colectivo si todos participamos. La sostenibilidad no es perfección, es progreso.",
          enlace: "https://www.nationalgeographicla.com/medio-ambiente/2024/02/los-5-consejos-sencillos-que-puedes-seguir-para-vivir-de-forma-mas-sostenible",
          imagen: "https://static.nationalgeographicla.com/files/styles/image_3200/public/h_14.394562153.webp?w=1600&h=900",
          alt: "Vida sostenible"
        }, 
        {
          titulo: "Cómo una bolsa de patatas fritas alteró todo un ecosistema",
          texto: "Seguro que has oído eso de 'no dejar huella' cuando vas de excursión. Durante el Mes de la Tierra, te contamos por qué es fundamental dejar el entorno salvaje tal y como lo encontraste.",
          textoCompleto: "En un parque nacional de Estados Unidos, una bolsa de patatas fritas abandonada por un excursionista desencadenó una serie de eventos ecológicos. Primero, atrajo a mapaches que normalmente no se acercaban a esa zona. Los mapaches, a su vez, comenzaron a depredar nidos de aves que antes estaban a salvo. Esto redujo la población de ciertas aves que controlaban insectos. Con menos aves, aumentaron los insectos que afectaban la vegetación. Además, los mapaches empezaron a buscar comida cerca del camping, alterando su comportamiento natural. Este caso ilustra cómo un pequeño acto aparentemente insignificante puede desequilibrar un ecosistema. Los expertos estiman que la zona tardará años en recuperar su equilibrio original. Este ejemplo demuestra por qué el principio 'No dejar rastro' es crucial en áreas naturales: todo lo que llevamos debe volver con nosotros, incluyendo la basura y los restos de comida.",
          enlace: "https://www.nationalgeographicla.com/medio-ambiente/2025/04/como-una-bolsa-de-patatas-fritas-altero-todo-un-ecosistema",
          imagen: "https://static.nationalgeographicla.com/files/styles/image_3200/public/nationalgeographic2812585.webp?w=1600&h=900",
        }, 
      ]
    }
  },
  methods: {
    abrirModal(tarjeta) {
      this.tarjetaActual = tarjeta;
      this.modalAbierto = true;
      document.body.style.overflow = 'hidden'; 
    },
    cerrarModal() {
      this.modalAbierto = false;
      document.body.style.overflow = 'auto'; 
    }
  }
}
</script>

<style scoped>
.contenedor-tarjetas {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  position: relative;
}
.titulo-principal{
  text-align: center;
  margin-bottom: 30px;
}

.titulo-principal h1{
  font-size: 2rem;
  font-weight: bold;
  color: #222;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}


.tarjeta {
  display: flex;
  background: #EAFAE5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tarjeta:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.contenido-tarjeta {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.imagen-contenedor {
  flex: 1;
  min-height: 40px;
}

.imagen-tarjeta {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.tarjeta:hover .imagen-tarjeta {
  transform: scale(1.03);
}

.titulo-tarjeta {
  color: #009951;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.texto-tarjeta {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.enlace-tarjeta {
  display: inline-block;
  background-color: #27ae60;
  border: none;
  border-radius: 5px;
  color: #f4f4f4;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
  align-self: flex-start;
  padding: 10px 20px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.enlace-tarjeta:hover {
  background-color: #70d399;
}

/*  modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-contenido {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-cerrar {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.2s;
}

.modal-cerrar:hover {
  color: #e74c3c;
}

.modal-titulo {
  color: #009951;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.modal-imagen {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.modal-texto {
  color: #34495e;
  line-height: 1.8;
  font-size: 1.1rem;
}

.modal-texto p {
  margin-bottom: 1.5rem;
}

.modal-fuente {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 2rem;
}

.modal-fuente a {
  color: #8c8383;
  text-decoration: none;
}

.modal-fuente a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .tarjeta {
    flex-direction: column;
  }
  
  .imagen-contenedor {
    order: -1;
    min-height: 200px;
  }
  
  .contenido-tarjeta {
    padding: 1.5rem;
  }
  
  .titulo-tarjeta {
    font-size: 1.3rem;
  }
  
  .modal-contenido {
    padding: 1.5rem;
  }
  
  .modal-titulo {
    font-size: 1.5rem;
    margin-right: 30px; 
  }
  
  .modal-imagen {
    max-height: 200px;
  }
}
</style>