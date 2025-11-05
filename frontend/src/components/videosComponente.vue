

<template>
  <div class="galeria-videos">

    <div class="seccion-destacada">
      <div class="contenedor-principal">
        <div class="contenido-textual">
          <h2 class="titulo-destacado">{{ featuredVideo.mih2 }}<br><span class="texto-resaltado">{{ featuredVideo.highlight }}</span></h2>
            <p class="descripcion-video">
                {{ featuredVideo.description }}
            </p>
        </div>
        
        <div class="contenido-visual">
          <div class="marco-video">
            <iframe 
              width="100%" 
              height="100%"
              :src="'https://www.youtube.com/embed/' + featuredVideo.id" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </div>

    <!--  mas videos -->
    <div class="seccion-secundaria">
      <h3 class="titulo-seccion">Más Cortometrajes Ambientales</h3>
      <div class="rejilla-videos">
        <div 
          v-for="(video, index) in videos" 
          :key="index" 
          class="tarjeta-video"
          @click="setFeaturedVideo(video)">
          
          <div class="miniatura">
            <img :src="getThumbnail(video.id)" :alt="video.title">
            <div class="icono-reproducir">▶</div>
          </div>
          <h4 class="titulo-video">{{ video.title }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
 
  data() {
    return {
      featuredVideo: {
        id: 'M3z-YPsumOw',
        title: 'Historia de Basuria',
        mih2:'Campaña',
        highlight:'Concienciación para fomentar el reciclaje',

        description: 'Este corto muestra la historia de una ciudad nombrada «Basuria» y que está creada sobre grandes montañas de basura que dan un color gris a la ciudad. La historia cambia cuando uno de los niños descubre que con algunos de los residuos se puede hacer música, algo que le gusta mucho, y anima a todos sus compañeros y compañeras a organizar la basura según el tipo para poder sacar el mejor provecho para hacer instrumentos. Este acto permite a la ciudad empezar a adquirir su color natural y un aire mucho más agradable.'
      },
      videos: [
        { id: 'Gi8F1rk1ajE', title: 'Choiba', mih2:'Protección',highlight:'Vida silvestre' ,description:'Este corto de animación refleja la problemática que hay en muchas zonas forestales a causa de la desforestación. En este caso, se muestra como el mono «Choiba» está en peligro de extinción a causa de la tala de árboles en las zonas donde vive de Colombia. Un corto impactante y que muestra la dureza con la que viven algunos animales en su ecosistema.' },
        { id: 'oLIZFNX5AxI', title: 'Cuida el Agua' , mih2:'Cuida',highlight:'Del Agua',description:'A menudo no somos conscientes que algunas de nuestras acciones diarias condicionan nuestra vida del planeta, y esto es lo que quiere plasmar este corto de animación. La historia muestra como todos los pequeños gestos que hace un humano en casa, como tener la calefacción muy alta, no reciclar o gastar mucha agua en la bañera, condicionan la vida en una isla de un gato, que se encuentra con cambios de tiempos bruscos, sequía, fuertes vientos… El grito de ayuda de este gato es el que nos muestra el planeta cada día.'},
        { id: 'hDwAGfecLJ4', title: 'Equilibrium', mih2:'Equilibrio',highlight:'Ambiental',description:'Este corto de animación muestra la historia de un señor que se encuentra en una plataforma flotante sobre el mar, una plataforma que va llenando con elementos que él cree necesarios. Estos elementos hacer que la plataforma vaya bajando su nivel según como de contaminante es lo que hace. Llega un momento que la plataforma se encuentra tan llena que su vida empieza a correr peligro, y es que unas pirañas le están a punto de comer, es en este momento cuando decide que debe dejar los malos hábitos y empezar a pensar en sus acciones. Un corto para tomar consciencia de lo que hacemos en nuestro día a día.' },
        { id: 't4-sDoVfjxw', title: 'Hay un monstruo en mi cocina' ,  mih2:'Solidaridad Ambiental',highlight:'No a la Deforestación',description:'Este cortometraje impulsado por Greenpeace, quiere concienciar sobre las consecuencias del sistema agroalimentario actual, en el que hay un consumo desmesurado de carne y de productos lácticos. La historia muestra como un niño se encuentra un monstruo en la cocina y este le explica qué monstruos ve él en su casa, su hábitat natural.'},
        { id: 'DY-GgzZKxUQ', title: 'El Espantapájaros ' , mih2:'Devorando el Futuro:',highlight:'La Explotación Alimentaria',description:'La historia de un espantapájaros que vive en una ciudad donde todo está mecanizado y sobreexplotado es los que nos muestra este corto. Pone el foco de atención en criticar el sistema agroalimentario actual, mostrando la sobreexplotación de los animales para producir alimentos para los humanos, en este caso comida basura. El hecho que el sistema alimentario no sigue su propio curso, también afecta al medio ambiente, ya que todo el proceso, desde el inicio hasta el final, se ve condicionado. Será el espantapájaros quién empieza a dar un paso para cambiar esta situación cultivando productos de proximidad y de calidad.'},
        { id: 'R-ufluPWBuM', title: 'La Nevera  Runaway', mih2:'Las 4R:',highlight:'Reusa - Recupera - Reutiliza - Recicla',description:'Este corto muestra la historia de un chico y su nevera. Un buen día una pieza de la nevera se rompe, y esto le hace pensar que el chico la tirará y cambiará por una nueva y moderna. La historia muestra la tristeza de esta nevera y la búsqueda del chico para encontrarla, ya que se considera que aún sigue funcionando bien y, por lo tanto, no hacer falta cambiarla, sólo repararla. Este corto nos puede hacer reflexionar sobre la importancia de la reparación de alguno de los objetos que tenemos en casa, en vez de sustituirlos rápidamente por uno de nuevo. ¡Recordemos las 4R: Reducir, Reutilizar, Reciclar y Repensar!' },
        { id: 'BxD6GNSNJHk', title: 'Corto Lemon' , mih2:'Plastic Free:',highlight:'Los Plásticos en la Naturaleza',description:'El siguiente corto muestra las peripecias de una pequeña tortuga que acaba de nacer para llegar al mar. Esta tortuga debe esquivar el ataque de una gaviota que busca comida para llevar a sus crías, la sorpresa llega cuando la gaviota se piensa que ha cogido la tortuga y le da a su cría un tapón de plástico que ha encontrado en el mar. La reflexión de este cortometraje hace referencia a la gran cantidad de residuos que los animales encuentra en el mar, y lo que comporta para su salud y la salud del planeta.'},
        { id: 'WfGMYdalClU', title: 'MAN' , mih2:'La Humanidad',highlight:'En el Planeta',description:'Este es un corto crítico y directo sobre el efecto que tenemos los humanos en el planeta. A través de una animación se muestra la historia de un hombre que cuando sale de su casa, destruye todo ser vivo con el que se cruza. Desde unas serpientes que se convierten en unas botas de piel, una foca que se transforma en abrigo, árboles convertidos en hojas de papel o fábricas de explotación animal. Se trata de una crítica muy interesante sobre el impacto del ser humano en el planeta, todo a ritmo de música clásica.'},
        { id: 'bvtVbzPE1UY', title: 'Selfish' , mih2:'Los microplásticos:',highlight:'Contaminación Marina ',description:'Este cortometraje centra su historia en un restaurante japonés, en el que unos clientes piden comida. La sorpresa llega cuando la comida que les sirven está formada básicamente por plásticos. Este corto pretende concienciar y hacer ver la cantidad de microplásticos que ingerimos en nuestro día a día, unos microplásticos que los peces han ingerido al mar a consecuencia de la acción de los humanos.'},
        { id: 'XD7DzUAA5CM', title: 'Piper' , mih2:'La Naturaleza:',highlight:'Ciclos en Ecosistemas.',description:'En este bonito cortometraje, se observa el aprendizaje que hace un pajarito en el proceso de adquirir alimento acompañado de su madre. El proceso de aprendizaje de cada individuo es diferente, y se debe hacer un acompañamiento personalizado en este camino. Esta historia también plasma la riqueza de la naturaleza y de los ciclos de la vida de los ecosistemas, unos espacios que se deben cuidar y proteger.'}
      ]
    }
  },
  methods: {
    getThumbnail(videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    },
    setFeaturedVideo(video) {
      this.featuredVideo = video

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style>
.galeria-videos {
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.seccion-destacada {
  background-color: #EAFAE5;
  padding: 80px 0;
}

.contenedor-principal {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
  padding: 0 20px;
}

.contenido-textual {
  flex: 1;
}

.titulo-destacado {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #466f54;
}

.texto-resaltado {
  color: #14AE6B;
}

.descripcion-video {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 2rem;
}

.contenido-visual {
  flex: 1;
}

.marco-video {
  position: relative;
  padding-bottom: 56.25%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-height: 220px;
  max-width: 100%;
  display: block;
  aspect-ratio: 16 / 9;
}

.marco-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.seccion-secundaria {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.titulo-seccion {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #14AE6B;
  text-align: center;
}

.rejilla-videos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.tarjeta-video {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.tarjeta-video:hover {
  transform: translateY(-5px);
}

.miniatura {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.miniatura img {
  width: 100%;
  display: block;
  transition: opacity 0.3s ease;
}

.tarjeta-video:hover .miniatura img {
  opacity: 0.8;
}

.icono-reproducir {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.7);
  color: #14AE6B;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tarjeta-video:hover .icono-reproducir {
  opacity: 1;
}

.titulo-video {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

@media (max-width: 768px) {
  .contenedor-principal {
    flex-direction: column;
    gap: 40px;
    align-items: stretch;
  }
  
  .seccion-destacada {
    padding: 60px 0;
  }
  
  .titulo-destacado {
    font-size: 2rem;
  }
  
  .descripcion-video {
    font-size: 1rem;
  }
  
  .rejilla-videos {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .rejilla-videos {
    grid-template-columns: 1fr;
  }
}
</style>