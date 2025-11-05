<template>
  <div class="container">
    <header>
      <h1><i class="fas fa-seedling"></i> Curiosidades Ambientales</h1>
      <p class="subtitle">Descubre algunos datos interesantes sobre el mundo del medio ambiente</p>
    </header>
    
    <div class="filters">
      <button 
        v-for="filter in filters" 
        :key="filter.id"
        @click="setFilter(filter.id)"
        :class="['filter-btn', { active: currentFilter === filter.id }]" >
     
        {{ filter.text }}
      </button>
    </div>
    
    <div class="facts-grid">
      <div 
        v-for="fact in filteredFacts" 
        :key="fact.id"
        class="fact-card" 
        :data-category="fact.category">
      
        <div class="fact-image" :style="{ backgroundImage: `url('${fact.image}')` }"></div>
        <div class="fact-content">
          <span :class="['fact-category', categoryClass(fact.category)]">
            {{ getCategoryName(fact.category) }}
          </span>
          <h3 class="fact-title">{{ fact.title }}</h3>
          <p class="fact-text">{{ fact.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      currentFilter: 'all',
      filters: [
        { id: 'all', text: 'Todas' },
        { id: 'nature', text: 'Naturaleza' },
        { id: 'animals', text: 'Animales' },
        { id: 'oceans', text: 'Océanos' },
        { id: 'climate', text: 'Clima' },
        { id: 'humans', text: 'Humanos'}
      ],
      facts: [
        {
          id: 1,
          category: 'nature',
          title: '¡Las Plantas Hablan! ',
          text: 'Cuando piensas en plantas, ¿qué te viene a la mente?. Las plantas se comunican a través de señales químicas que viajan entre sus raíces, formando una red subterránea compleja. Estas señales les permiten advertirse de peligros, compartir recursos y coordinar comportamientos. ',
          source: 'Estudio de la Universidad de British Columbia',
          image: 'https://static.wixstatic.com/media/ba04b2_c241ec3e43dd496b9addf07808cc5036~mv2.jpg/v1/fill/w_925,h_616,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ba04b2_c241ec3e43dd496b9addf07808cc5036~mv2.jpg'
        },
        {
          id: 2,
          category: 'animals',
          title: 'Las ballenas son ingenieras del ecosistema',
          text: 'Las ballenas contribuyen a la lucha contra el cambio climático. Durante su vida almacenan toneladas de CO₂ y cuando mueren, lo llevan al fondo del océano.',
          source: 'Fondo Monetario Internacional',
          image: 'https://www.imf.org/-/media/Images/IMF/FANDD/article-image/2019/December/chami-index.ashx'
        },
        {
          id: 3,
          category: 'oceans',
          title: 'El 80% de la vida está en los océanos',
          text: 'Aunque los océanos cubren el 71% de la superficie terrestre, albergan el 80% de toda la vida en la Tierra y producen más de la mitad del oxígeno que respiramos.',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80'
        },
        {
          id: 4,
          category: 'climate',
          title: '2023 fue el año más cálido registrado',
          text: 'El año 2023 batió todos los récords de temperatura global, siendo 1.48°C más cálido que los niveles preindustriales, acercándose peligrosamente al límite de 1.5°C del Acuerdo de París.',
          image: 'https://cdn.agenciasinc.es/var/ezwebin_site/storage/images/_aliases/img_1col/media/images/grafico219/11738725-1-esl-MX/grafico2.png'
        },
        {
          id: 5,
          category: 'nature',
          title: 'Los bosques tropicales generan lluvia',
          text: 'La Amazonía libera alrededor de 20 billones de toneladas de agua a la atmósfera cada día, creando "ríos voladores" que influyen en las precipitaciones a miles de kilómetros de distancia.',
          image: 'https://c.files.bbci.co.uk/6A7C/production/_97506272_p05d69hg.jpg'
        },
        {
          id: 6,
          category: 'animals',
          title: 'Pequeñas gigantes',
          text: 'Sabías que sin este animal tan pequeño, la vida en la tierra sería casi imposible. Se estima que alrededor del 84% de los cultivos de alimentos está en manos de las abejas, que se encargan de polinizarlos para que sigan floreciendo. La población de abejas está disminuyendo debido a los gases de efecto invernadero, los pesticidas y un tipo de ácaro conocido como Varroa que es letal para estos insectos.',
          image: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Bees_1_bg_082804.jpg'
        },
        {
          id:7,
          category:'oceans',
          title:'El Plástico y el Mar',
          text:'Cada minuto, se utilizan en el mundo alrededor de un millón de bolsas de plástico. Este plástico, lejos de reciclarse, suele acabar en el mar y apenas se recicla el 5% de este material. De hecho, se estima que un total de 6 millones de toneladas de basura plástica acaba en los mares, alterando los ecosistemas y la fauna.',
          image: 'https://www.bbva.com/wp-content/uploads/2021/12/inmenso-oceano-de-la-basura-apertura.jpg'
        },
        {
          id:7,
          category:'climate',
          title:'¿Un futuro sin chocolate barato? La culpa es del clima.',
          text:'Sabías que el chocolate podría subir cada vez más de precio debido al cambio climático, ya que hay dificultad en el cultivo de esta planta. Esto significaría que algo tan habitual como una chocolatina podría llegar a ser un bien de lujo tan exquisito como el caviar.',
          image:'https://media.es.wired.com/photos/6748f471dfa63bd22092139c/16:9/w_1280,c_limit/GettyImages-1244871766.jpg'
        },
        {
          id:8,
          category:'humans',
          title:'30 litros en un día: El coste de un grifo que gotea',
          text:'Haz imaginado que un grifo de agua goteando puede llegar a desperdiciar hasta 30 litros de agua al día, el equivalente a seis garrafas de agua. Un pequeño gesto como cerrar bien el grifo puede suponer un ahorro muy importante.',
          image: 'https://elmanitasideal.es/wp-content/uploads/2019/01/arreglar-un-grifo-que-gotea.jpg'
        }
      ]
    }
  },
  computed: {
    filteredFacts() {
      if (this.currentFilter === 'all') {
        return this.facts
      }
      return this.facts.filter(fact => fact.category === this.currentFilter)
    }
  },
  methods: {
    setFilter(filter) {
      this.currentFilter = filter
    },
    categoryClass(category) {
      return `category-${category}`
    },
    getCategoryName(category) {
      const categoryMap = {
        'nature': 'Naturaleza',
        'animals': 'Animales',
        'oceans': 'Océanos',
        'climate': 'Clima',
        'humans': 'Humanos'
      }
      return categoryMap[category] || category
    },
}
}
</script>

<style scoped>


.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background-color: #8BC34A;
  color: var(--light);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Poppins', sans-serif;
}

 

h1 {
  font-size: 2.8rem;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(71, 67, 67, 0.3);
  color:white;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  color:whitesmoke;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 12px 24px;
  background: var(--light);
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: var(--dark);
}

.filter-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);


}

.filter-btn.active {

  background-color: #8bc34a9a;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.fact-card {

  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(19, 78, 48, 0.1);
  font-family: 'Poppins', sans-serif;
}

.fact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.fact-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.fact-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(19, 78, 48, 0.7), transparent);
}

.fact-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.fact-category {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 15px;

}

.category-nature, .category-animals, .category-climate, .category-oceans, .category-humans {
  background: #6FBA41;
}


.fact-title {
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: var(--dark);
}

.fact-text {
  margin-bottom: 20px;
  line-height: 1.6;
  flex-grow: 1;
  color: #444;
}

@media (max-width: 768px) {
  .facts-grid {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 2.2rem;
  }
  
  .filter-btn {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
  
  header {
    padding: 20px 15px;
  }
}
</style>