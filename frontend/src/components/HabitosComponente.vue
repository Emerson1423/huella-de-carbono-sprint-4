<template>
  <div class="contenido-habitos">

    <img v-if="!mostrarDetalle" src="@/assets/img/Img-Hab.png" alt="Hábitos Ecológicos" class="img-hab" />
    <img v-else :src="cards[habitoActual].img" :alt="cards[habitoActual].title" class="img-hab" />


      <div v-if="!mostrarDetalle">
      <div class="cards-grid">
        <div 
          v-for="(card, idx) in cards" 
          :key="idx" 
          class="viewcard"
          @click="verDetalle(idx)"
          style="cursor: pointer"
        >
          <img :src="card.img" :alt="card.title" class="card-img" />
          <h2 class="card-title">{{ card.title }}</h2>
          <p class="card-desc">{{ card.desc }}</p>
          <!-- Aquí debe pasar el índice -->
          <button class="filter-btn" @click.stop="agregarHabito(idx)">Agregar</button>
        </div>
      </div>
    </div>

    <!-- MODO DETALLE: Componente separado -->
    <HabitoDetalle
      v-else
      :habito="cards[habitoActual]"
      :habitoActual="habitoActual"
      :totalHabitos="cards.length"
      @anterior="habitoAnterior"
      @siguiente="habitoSiguiente"
      @volver="volverALista"
      @agregar="agregarHabito"
    />
  </div>

</template>

<script>
import HabitoDetalle from './HabitoDetalle.vue';
import '../Style.css';


export default {
  name: 'HabitosComponente',
  components: {
    HabitoDetalle

  },
  
  data() {
    return {
      // Control del estado
      mostrarDetalle: false,
      habitoActual: 0,
      
      // array de hábitos
      cards: [
        {
          id: 1,
          img: require('@/assets/img/agua.jpeg'),
          title: 'Ahorra agua',
          desc: 'Pequeños cambios en tu rutina diaria pueden hacer una gran diferencia en el ahorro de agua. Cierra la llave mientras te lavas los dientes, toma duchas más cortas y repara las fugas inmediatamente.',
         
          explicacionCompleta: `
              Ahorrar agua es un hábito fundamental para cuidar nuestro planeta y garantizar que todos tengamos acceso a este recurso vital. Cada gota cuenta: usarla de manera responsable protege los ecosistemas, reduce el desperdicio y asegura que futuras generaciones también puedan disfrutar de agua limpia. Aprender a valorar y gestionar el agua nos hace más conscientes de nuestro impacto y nos ayuda a vivir de forma más sostenible.
              • Cierra la llave mientras te lavas los dientes (ahorra 6 litros por minuto)
              • Toma duchas de 5 minutos máximo
              • Repara fugas inmediatamente
              • Usa la lavadora y lavavajillas solo con carga completa
              • Recolecta agua de lluvia para regar plantas
          `,
          beneficios: [
            'Reduces tu factura de agua hasta un 30%',
            'Contribuyes a la conservación del medio ambiente',
            'Ayudas a preservar este recurso para futuras generaciones'
          ],
          articulos: [
            {
              titulo: '10 formas de ahorrar agua en casa',
              url: 'https://www.nationalgeographic.com.es/medio-ambiente/consejos-para-cuidar-agua_21827',
              fuente: 'National Geographic'
            },
            {
              titulo: 'El impacto del ahorro de agua',
              url: 'https://www.bbva.com/es/sostenibilidad/causas-de-la-escasez-de-agua/',
              fuente: 'BBVA'
            }
          ],
          videos: [
            {
              titulo: 'Cómo ahorrar agua en el hogar',
              url: 'https://youtu.be/TOD_9kWu3bA?si=wvovE47oQOF2krSA',
              duracion: '3:08'
            },
          ],
          consejosPracticos: [
            'Instala reductores de caudal en grifos y duchas',
            'Usa un vaso para enjuagarte los dientes',
            'Riega las plantas en las horas más frescas del día'
          ]
        },
  
        
        {
          id: 2,
          img: require('@/assets/img/plastico.jpeg'),
          title: 'Reduce el uso de plástico',
          desc: 'Opta por productos reutilizables y evita el plástico de un solo uso. Usa botellas de agua reutilizables, bolsas de tela para las compras y contenedores de vidrio para almacenar alimentos.',
                 
          explicacionCompleta: `
              Reducir el uso de plástico es clave para proteger el medio ambiente, ya que gran parte de este material termina en ríos, mares y suelos, contaminando los ecosistemas durante cientos de años. El plástico de un solo uso, como bolsas, botellas y envoltorios, es uno de los mayores responsables de la contaminación. Al disminuir su consumo, evitamos que llegue a los océanos, reducimos la producción industrial y fomentamos hábitos más sostenibles que cuidan nuestra salud y la del planeta.
          `,
          beneficios: [
            'Disminuye la contaminación en mares y ríos.',
            'Protege la vida marina y la biodiversidad.',
            'Reduce la huella de carbono al disminuir la producción de plásticos.',
            'Fomenta un consumo más responsable y saludable.'
          ],
          articulos: [
            {
              titulo: 'Cómo vivir con menos plástico: consejos para reducir el consumo',
              url: 'https://www.nationalgeographicla.com/medio-ambiente/2022/07/como-vivir-con-menos-plastico-consejos-para-reducir-el-consumo',
              fuente: 'National Geographic'
            },
            {
              titulo: 'Consejos para reducir el plástico en casa',
              url: 'https://www.nalgeneiberia.com/blog/reciclaje/consejos-reducir-el-plastico-en-casa/',
              fuente: 'Nalgene Iberia'
            }
          ],
          videos: [
            {
              titulo: 'Cómo reducir el uso de plástico',
              url: 'https://youtu.be/7NDtVsWv928?si=Gw1vLfcp6aslayWm',
              duracion: '4:49'
            },
          ],
          consejosPracticos: [
            'Usa botellas y termos reutilizables.',
            'Lleva tus bolsas de tela al hacer compras.',
            'Prefiere productos con menos empaques plásticos.',
            'Evita los cubiertos y pajillas desechables.',
            'Compra a granel siempre que sea posible.'
          ]
        },
        {
          id: 3,
          img: require('@/assets/img/transporte.jpeg'),
          title: 'Utiliza transporte sostenible',
          desc: 'Caminar, andar en bicicleta o usar transporte público reduce tu huella de carbono. También puedes compartir vehículo con otros o considerar vehículos eléctricos.',
                 
          explicacionCompleta: `
              Optar por transporte sostenible significa reducir el uso del automóvil particular y elegir alternativas como caminar, usar bicicleta o transporte público. Esto disminuye la contaminación del aire, el ruido y las emisiones de gases de efecto invernadero que afectan al clima. Además, promueve una vida más activa y saludable.
          `,
          beneficios: [
            'Reduce la contaminación del aire.',
            'Disminuye la emisión de CO₂.',
            'Ahorra dinero en combustible.',
            'Mejora la salud física y mental.'
          ],
          articulos: [
            {
              titulo: '¿Qué es el transporte sostenible?',
              url: 'https://www.nationalgeographicla.com/medio-ambiente/2023/11/que-es-el-transporte-sostenible',
              fuente: 'National Geographic'
            },
            {
              titulo: '¿Qué es el transporte sostenible y cómo ayuda al cambio climático?',
              url: 'https://climatepromise.undp.org/es/news-and-stories/que-es-el-transporte-sostenible-cambio-climatico',
              fuente: 'UNDP'
            }
          ],
          videos: [
            {
              titulo: 'Los 5 medios de transporte más sostenibles',
              url: 'https://youtu.be/zIkdZWEHLnc?si=WyqtG7GsxWPYmkk5',
              duracion: '9:00'
            },
          ],
          consejosPracticos: [
            'Camina distancias cortas en lugar de usar auto o moto.',
            'Usa bicicleta para tus recorridos diarios.',
            'Comparte el carro con compañeros o amigos (carpooling).',
            'Utiliza transporte público siempre que sea posible.'
          ]
        },
        {
          id: 4,
          img: require('@/assets/img/clasificar.jpeg'),
          title: 'Recicla y reutiliza',
          desc: 'Dale una segunda vida a los objetos y reduce la cantidad de residuos que generas. Separa correctamente tus residuos y encuentra formas creativas de reutilizar materiales.',
                 
          explicacionCompleta: `
          Reciclar y reutilizar son hábitos que permiten dar una segunda vida a los materiales, evitando que terminen en vertederos o contaminando la naturaleza. Al separar correctamente los residuos y aprovechar lo que todavía puede usarse, reducimos la cantidad de basura y ayudamos a crear un modelo de economía circular.
          `,
          beneficios: [
            'Disminuye la acumulación de residuos.',
            'Ahorra recursos naturales y energía.',
            'Fomenta empleos en la industria del reciclaje.',
            'Contribuye a un planeta más limpio.'
          ],
          articulos: [
            {
              titulo: '5 beneficios del reciclaje que necesitas saber',
              url: 'https://www.nationalgeographicla.com/medio-ambiente/2023/05/que-beneficios-nos-trae-el-reciclaje-5-datos-que-necesitas-saber',
              fuente: 'National Geographic'
            },
            {
              titulo: 'Cultura del reciclaje y economía circular',
              url: 'https://www.bbva.com/es/sostenibilidad/economia-circular/cultura-reciclaje/',
              fuente: 'BBVA'
            }
          ],
          videos: [
            {
              titulo: 'Las 3R del reciclaje: Reducir, Reutilizar y Reciclar',
              url: 'https://youtu.be/_N8pVVVchfM?si=9ufiAX3Wi5m09Z-2',
              duracion: '4:51'
            },
          ],
          consejosPracticos: [
            'Separa la basura en orgánica, reciclable y no reciclable.',
            'Reutiliza frascos, botellas y cajas.',
            'Dona ropa y objetos en buen estado.',
            'Compra productos reciclados o reciclables.',
            'Usa papel por ambos lados antes de desecharlo.'
          ]
        
        },
        {
          id: 5,
          img: require('@/assets/img/local.jpeg'),
          title: 'Consume local y de temporada',
          desc: 'Apoya a los productores locales y reduce la huella de transporte de tus alimentos. Los productos de temporada son más nutritivos y tienen mejor sabor.',
                 
          explicacionCompleta: `
              Consumir productos locales y de temporada apoya a los agricultores cercanos, reduce el transporte de alimentos (que genera contaminación) y garantiza que los productos sean más frescos, nutritivos y económicos. Este hábito conecta a las comunidades y fortalece la economía local.
          `,
          beneficios: [
            'Disminuye la huella de carbono por transporte.',
            'Apoya a los productores locales.',
            'Obtienes alimentos más frescos y saludables.',
            'Fomenta la economía de tu comunidad.'
          ],
          articulos: [
            {
              titulo: '',
              url: 'https://www.nationalgeographic.com.es/medio-ambiente/consejos-para-cuidar-agua_21827',
              fuente: 'National Geographic'
            },
            {
              titulo: '',
              url: 'https://www.bbva.com/es/sostenibilidad/causas-de-la-escasez-de-agua/',
              fuente: 'BBVA'
            }
          ],
          videos: [
            {
              titulo: '',
              url: 'https://youtu.be/TOD_9kWu3bA?si=wvovE47oQOF2krSA',
              duracion: '5:30'
            },
          ],
          consejosPracticos: [
            'Instala reductores de caudal en grifos y duchas',
            'Usa un vaso para enjuagarte los dientes',
            'Riega las plantas en las horas más frescas del día'
          ]
        },
        {
          id: 6,
          img: require('@/assets/img/energia.jpeg'),
          title: 'Ahorra energía',
          desc: 'Apaga las luces y desconecta los aparatos electrónicos cuando no los estés usando. Usa bombillas LED y aprovecha la luz natural durante el día.',
                 
          explicacionCompleta: `
             Ahorrar energía significa usar de manera eficiente la electricidad y los recursos energéticos. Esto reduce las emisiones contaminantes de las plantas eléctricas y el gasto económico en el hogar. Además, nos ayuda a ser conscientes de que los recursos no son infinitos.
          `,
          beneficios: [
            'Reduce la contaminación y la huella de carbono.',
           'Disminuye el gasto en electricidad.',
           'Protege los recursos naturales.',
           'Fomenta hábitos responsables.'
           
          ],
          articulos: [
            {
              titulo: 'Cómo ahorrar energía en casa',
              url: 'https://www.repsol.com/es/energia-avanzar/energia/ahorro-energetico/index.cshtml',
              fuente: 'Repsol'
            },
            {
              titulo: 'Guía del ahorro energético en el hogar',
              url: 'https://www.bbva.com/es/sostenibilidad/la-guia-del-ahorro-energetico-en-el-hogar/',
              fuente: 'BBVA'
            }
          ],
          videos: [
            {
              titulo: 'Uso responsable de la energía',
              url: 'https://youtu.be/Ej_ugAMp30g?si=MfdBnNssvmYb50IH',
              duracion: '8:25'
            },
          ],
          consejosPracticos: [
            'Apaga luces y aparatos que no uses.',
           'Aprovecha la luz natural.',
           'Usa focos LED de bajo consumo.',
           'Desconecta cargadores y electrodomésticos en reposo.',
           'Regula el uso del aire acondicionado o calefacción.'
          ]
        },
        {
          id: 7,
          img: require('@/assets/img/arbol.jpeg'),
          title: 'Planta un árbol',
          desc: 'Los árboles ayudan a limpiar el aire y proporcionan hábitats para la fauna. Participar en actividades de reforestación es una excelente manera de contribuir al medio ambiente.',
        
                 
          explicacionCompleta: `
          Plantar un árbol es una de las acciones más poderosas para combatir el cambio climático. Los árboles absorben dióxido de carbono, producen oxígeno, dan sombra, refrescan el ambiente y sirven de hábitat para muchas especies. Con este simple acto, se contribuye al bienestar del planeta y de las personas.
          `,
          beneficios: [
           'Absorben CO₂ y producen oxígeno.',
           'Refrescan el ambiente y reducen el calor urbano.',
           'Mejoran la calidad del aire.',
           'Dan sombra y refugio a animales.'
           
          ],
          articulos: [
            {
              titulo: 'La importancia de la reforestación',
              url: 'https://www.bbva.com/es/sostenibilidad/que-es-la-reforestacion-y-como-puede-salvarnos-la-vida/',
              fuente: 'BBVA'
            },
            {
              titulo: 'Cómo plantar un árbol correctamente',
              url: 'https://www.gob.mx/semarnat/articulos/como-plantar-un-arbol-179529?idiom=es',
              fuente: 'Gobierno de México'
            }
          ],
          videos: [
            {
              titulo: ' Cómo plantar un árbol',
              url: 'https://youtu.be/Ye7CqVSjVT4?si=aZky1KfUCYeC8G79',
              duracion: '1:12'
            },
          ],
          consejosPracticos: [
           'Participa en campañas de reforestación.',
           'Planta un árbol en tu casa, escuela o comunidad.',
           'Riega y cuida los árboles jóvenes.',
           'Elige especies nativas de tu región.',
           'Protege los árboles que ya existen.'
          ]
        },
        {
          id: 8,
          img: require('@/assets/img/edu.jpeg'),
          title: 'Educación ambiental',
          desc: 'Infórmate y comparte tus conocimientos sobre sostenibilidad con los demás. La educación es clave para crear conciencia ambiental en tu comunidad.',
                 
          explicacionCompleta: `
              La educación ambiental nos enseña a comprender cómo nuestras acciones afectan al planeta y nos motiva a tomar decisiones más responsables. Aprender sobre ecología, reciclaje, energías limpias y conservación permite generar conciencia colectiva y promover cambios positivos en la sociedad.
          `,
          beneficios: [
           'Aumenta la conciencia ecológica.',
           'Fomenta la participación ciudadana.',
           'Genera cambios duraderos en la sociedad.',
           'Prepara a las futuras generaciones.'
           
          ],
          articulos: [
            {
              titulo: 'La importancia de la educación ambiental',
              url: 'https://espanol.epa.gov/espanol/la-importancia-de-la-educacion-ambiental',
              fuente: 'EPA'
            },
            {
              titulo: '¿Qué es la educación ambiental y por qué es clave para la sostenibilidad?',
              url: 'https://www.bbva.com/es/sostenibilidad/que-es-la-educacion-ambiental-y-por-que-es-clave-para-la-sostenibilidad/',
              fuente: 'BBVA'
            }
          ],
          videos: [
            {
              titulo: 'La importancia de la educación ambiental',
              url: 'https://youtu.be/o8SQI5OR3F4?si=b69U3_Fi9ItdxtCQ',
              duracion: '2:47'
            },
          ],
          consejosPracticos: [
           'Infórmate sobre temas ambientales.',
           'Participa en talleres, charlas o cursos verdes.',
           'Comparte lo aprendido con familia y amigos.',
           'Enseña a los niños a cuidar el medio ambiente.',
           'Apoya campañas educativas en tu comunidad.'
          ]
        },
        {
          id: 9,
          img: require('@/assets/img/ecologicos.jpeg'),
          title: 'Compra productos ecológicos',
          desc: 'Elige productos que sean amigables con el medio ambiente y evita los químicos dañinos. Lee las etiquetas y busca certificaciones ambientales.',
                 
          explicacionCompleta: `
          Elegir productos ecológicos significa preferir artículos fabricados con materiales sostenibles, biodegradables o reciclados. Estos productos generan menos contaminación durante su producción y son más saludables para las personas y el medio ambiente.
          `,
          beneficios: [
           'Menor impacto ambiental.',
           'Reducción de residuos y químicos dañinos.',
           'Impulso a empresas responsables.',
           'Promueve un consumo consciente.'
          ],
          articulos: [
            {
              titulo: '5 productos que apuestan por la sostenibilidad',
              url: 'https://weareshifta.com/5-productos-que-apuestan-por-la-sostenibilidad/',
              fuente: 'Shifta'
            },
            {
              titulo: ' Productos sostenibles de BBVA para un futuro verde',
              url: 'https://www.bbva.com/es/sostenibilidad/productos-sostenibles-de-bbva-para-un-futuro-verde/',
              fuente: 'BBVA'
            }
          ],
          videos: [
            {
              titulo: 'Productos y negocios sostenibles',
              url: 'https://youtu.be/P37n6kTYaZ0?si=T1a3dyaN-JO-4jaN',
              duracion: '1:25'
            },
          ],
          consejosPracticos: [
           'Prefiere productos con certificación ecológica.',
           'Elige cosméticos y artículos de limpieza naturales.',
           'Compra ropa hecha con materiales sostenibles.',
           'Reutiliza envases y empaques.',
           'Evita productos de un solo uso.'
          ]
        },
        {
          id: 10,
          img: require('@/assets/img/natu.jpeg'),
          title: 'Apoya iniciativas verdes',
          desc: 'Participa en proyectos comunitarios que promuevan la sostenibilidad y el cuidado del medio ambiente. Tu participación puede inspirar a otros.',
                 
          explicacionCompleta: `
          Apoyar iniciativas verdes significa respaldar proyectos, campañas y organizaciones que buscan proteger el medio ambiente. Desde movimientos locales hasta grandes ONG, cada aporte cuenta para impulsar acciones que generen un impacto positivo.
          `,
          beneficios: [
           'Fortalece proyectos ambientales.',
           'Genera cambios colectivos más visibles.',
           'Apoya la creación de leyes y políticas verdes.',
           'Motiva a más personas a unirse al cambio.'
          ],
          articulos: [
            {
              titulo: 'Iniciativas verdes que están cambiando el mundo',
              url: 'https://www.ilo.org/es/resource/la-iniciativa-verde',
              fuente: 'ILO'
            },
            {
              titulo: 'Iniciativas ambientales en la UGB',
              url: 'https://observatorioverde.ugb.edu.sv/ugb-verde',
              fuente: 'Universidad Gerardo Barrios'
            }
          ],
          videos: [
            {
              titulo: 'UGB Verde - Iniciativas ambientales',
              url: 'https://youtu.be/fzUvgWOank0?si=LCY4SaQQAMsXAMBb',
              duracion: '2:41'
            },
          ],
          consejosPracticos: [
           'Participa en limpiezas comunitarias.',
           'Dona a proyectos ecológicos.',
           'Firma peticiones a favor del medio ambiente.',
           'Únete a grupos verdes en tu ciudad.',
           'Difunde campañas en redes sociales.'
          ]
        },
      ],
    };
  },

  methods: {
    /**
     * Abre el detalle del hábito seleccionado
     */
    verDetalle(indice) {
      this.habitoActual = indice;
      this.mostrarDetalle = true;
    },

    /**
     * Navega al hábito anterior
     */
    habitoAnterior() {
      if (this.habitoActual > 0) {
        this.habitoActual--;
      }
    },

    /**
     * Navega al hábito siguiente
     */
    habitoSiguiente() {
      if (this.habitoActual < this.cards.length - 1) {
        this.habitoActual++;
      }
    },

    /**
     * Vuelve a la vista de lista
     */
    volverALista() {
      this.mostrarDetalle = false;
    },

    /**
     * Agrega el hábito actual
     */

    agregarHabito(cardIndex = null) {
  const indiceHabito = cardIndex === null ? this.habitoActual : cardIndex;
  
  if (indiceHabito === null || indiceHabito === undefined || indiceHabito >= this.cards.length) {
    console.error('Índice de hábito inválido:', indiceHabito);
    alert('Error: No se pudo identificar el hábito seleccionado.');
    return;
  } 
  
  const habitoSeleccionado = this.cards[indiceHabito];
  
  // Verificar que el hábito existe
  if (!habitoSeleccionado) {
    console.error('Hábito no encontrado en índice:', indiceHabito);
    alert(' Error: Hábito no encontrado.');
    return;
  }
  
  // CAMBIO 1: Obtener el ID del usuario actual
  const usuario = localStorage.getItem('usuario');
  if (!usuario) {
    alert(' Debes iniciar sesión para agregar hábitos.');
    return;
  }
  
  let userData;
  try {
    userData = JSON.parse(usuario);
  } catch (error) {
    console.error('Error al parsear usuario:', error);
    alert('Error al obtener información del usuario.');
    return;
  }
  
  // CAMBIO 2: Crear identificador único del usuario
  const usuarioId = userData.id || userData.correo || userData.usuario;

  const claveHabitos = `userHabitos_${usuarioId}`;
  let habitosGuardados = JSON.parse(localStorage.getItem(claveHabitos) || '[]');

console.log('Usuario actual:', localStorage.getItem('usuario'));
console.log('Todas las claves de hábitos:', Object.keys(localStorage).filter(k => k.startsWith('userHabitos_')));
  
  // Verificar límite máximo de 3 hábitos
  if (habitosGuardados.length >= 3) {
    alert(' Ya tienes 3 hábitos agregados. Elimina uno para agregar otro.');
    return;
  }
  
  // Usar el título como identificador único si no hay ID
  const identificadorHabito = habitoSeleccionado.id || habitoSeleccionado.title;
  
  // Verificar si el hábito ya existe
  const habitoExiste = habitosGuardados.some(habito => 
    (habito.id && habito.id === identificadorHabito) || 
    (habito.title === habitoSeleccionado.title)
  );
  
  if (habitoExiste) {
    alert(' Este hábito ya está en tu lista.');
    return;
  }

  const nuevoHabito = {
    id: identificadorHabito,
    title: habitoSeleccionado.title,
    desc: habitoSeleccionado.desc,
    fechaAgregado: new Date().toISOString(),
  };
  
  habitosGuardados.push(nuevoHabito);
  
  // CAMBIO 4: Guardar con la clave específica del usuario
  localStorage.setItem(claveHabitos, JSON.stringify(habitosGuardados));
  
  globalThis.dispatchEvent(new CustomEvent('habitoAgregado', { 
    detail: nuevoHabito 
  }));
  
  alert(`¡Hábito "${habitoSeleccionado.title}" agregado exitosamente!`);
}
      

  }
}
</script>

<style>
.titulo-principal{
  text-align: center;
  margin-bottom: 30px;
}
.titulo-principal h1{
  
  margin-top: 5%;
  font-size: 2.3rem;
  font-weight: bold;
  color: #0b6d11;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  
}
.contenido-habitos{
  margin-top: 100px;
  font-family: 'Poppins', sans-serif;
}

/* Imagen destacada */
.img-hab {
  width: 100%;
  display: block;
  margin: 0 auto 2rem auto;
  max-width: 1100px;
  object-fit: cover;
  height: 400px;
  border-radius: 16px;
  
}

/* Grid de tarjetas */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
}

@media (min-width: 600px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .cards-grid {
    grid-template-columns: repeat(4, 1fr);
    padding: 0 2.5rem;
  }
}

/* Card individual */
.viewcard {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  min-height: 350px;
}

.viewcard:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Imagen de la tarjeta */
.card-img {
  width: 100%;
  max-width: 400px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* Título y descripción */
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2e7d32;
}

.card-desc {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.4;
  
}

/* Botón de tarjeta */
.card-btn {
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: auto; 
}

.card-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}



@media (min-width: 768px) {
  .title-habito {
    font-size: 2rem;
    margin: 2.5rem 0 2rem 0;
  }
}

/* Contenedor de la imagen para mejor control */
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  padding: 0 1rem;
}



@media (max-width: 768px) {
  .img-hab {
    height: 300px;
    max-width: 90%;
  }
  
  .title-habito {
    font-size: 2rem;
  }
}

/* Responsive para móviles */
@media (max-width: 480px) {
  .img-hab {
    height: 250px;
    border-radius: 12px;
  }
  
  .title-habito {
    font-size: 2rem;
    margin: 1.5rem 0 1rem 0;
  }
  
  .img-container {
    margin: 1.5rem 0;
    padding: 0 0.5rem;
  }
}

</style>
