<template>
  
    <div class="header-huella">
      <h1>Calcular tu huella ecológica</h1>
      <img src="@/assets/img/Huella.png" alt="huella" class="icono-huella" />
    </div>
   
    <!-- Mensaje de carga -->
    <div v-if="cargandoVerificacion" class="mensaje-carga">
      <p>🔍 Verificando disponibilidad...</p>
    </div>
    
    <!-- Mensaje cuando NO puede calcular -->
    <div v-else-if="!puedeCalcular" class="mensaje-restriccion">
      <div class="icono-restriccion">🗓️</div>
      <h3>Cálculo mensual ya realizado</h3>
      <p>{{ mensajeRestriccion }}</p>
      <p v-if="diasRestantes > 0">
        <strong>Próximo cálculo disponible en:</strong> {{ diasRestantes }} días
      </p>
    </div>

    <!-- Formulario normal-->
    <div v-else class="carbon-footprint-form">
      
      <!-- Kilómetros recorridos -->
      <div class="form-group">
        <label>¿Cuántos kilómetros recorres aproximadamente al mes?</label>
        <input 
          type="range" 
          min="0" 
          max="1000" 
          step="10" 
          v-model="kilometros" 
          class="slider"
          @change="clearError('kilometros')"
        >
        <span>{{ kilometros }} km</span>
        <span class="error-message">{{ errors.kilometros }}</span>
      </div>

      <!-- Medio de transporte -->
      <div class="form-group">
        <label>¿Principal medio de transporte?</label>
        <select 
          v-model="transporte" 
          :class="{ 'error-border': errors.transporte }"
          @change="clearError('transporte')"
        >
          <option value="">-- Selecciona --</option>
          <option value="coche">Coche</option>
          <option value="moto">Moto</option>
          <option value="autobus">Autobús</option>
          <option value="bicicleta">Bicicleta</option>
          <option value="a pie">A pie</option>
        </select>
        <span class="error-message">{{ errors.transporte }}</span>
      </div>

      <!-- Electricidad -->
  <div class="form-group">
    <label>¿Cuánto consumo mensual aparece en tu recibo de luz? (en kWh)</label>
    <input 
      type="number" 
      min="0" 
      v-model="consumoElectricidad" 
      placeholder="Ej: 52"
      @change="clearError('consumoElectricidad')"
    >
    <span class="error-message">{{ errors.consumoElectricidad }}</span>
  </div>

      <!-- Energía renovable -->
      <div class="form-group">
        <label>¿Usas energía renovable?</label>
        <div :class="{ 'error-border-group': errors.energiaRenovable }">
          <input 
            type="radio" 
            id="renovablesi" 
            value="si" 
            v-model="energiaRenovable"
            @change="clearError('energiaRenovable')"
          >
          <label for="renovablesi">Sí</label>
          <input 
            type="radio" 
            id="renovableno" 
            value="no" 
            v-model="energiaRenovable"
            @change="clearError('energiaRenovable')"
          >
          <label for="renovableno">No</label>
        </div>
        <span class="error-message">{{ errors.energiaRenovable }}</span>
      </div>

      <!-- Reciclaje -->
      <div class="form-group">
        <label>¿Qué reciclas? (Selecciona los iconos)</label>
        <div class="opciones-reciclaje">
          <div 
            v-for="item in reciclajeItems"
            :key="item.id"
            @click="toggleRecycleItem(item.id)"
            :class="{ 'item-reciclaje': true, 'active': selectedRecycleItems.includes(item.id) }"
            :title="item.name"
          >
            <img :src="item.icon" :alt="item.name">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div v-if="errors.reciclaje" class="error-message">
        {{ errors.reciclaje }}
      </div>
      <div class="center">  
      <button @click="calcularHuella" class="filter-btn green">Calcular</button>
    </div>
  </div>

</template>

<script>
import '../Style.css';

export default {
data() {
  return {
    // Restricción mensual
    puedeCalcular: true,
    mensajeRestriccion: '',
    diasRestantes: 0,
    cargandoVerificacion: true,

    // Datos del formulario
    kilometros: 0,
    transporte: '',
    consumoElectricidad: '',
    energiaRenovable: '',
    reciclajeItems: [
      { id: 'no_reciclo', name: 'No reciclo', icon:require('@/assets/icons/bloqueo.png'),},
      { id: 'papel', name: 'Papel', icon: require('@/assets/icons/papel.png') },
      { id: 'plastico', name: 'Plástico', icon: require('@/assets/icons/plastico.png') },
      { id: 'vidrio', name: 'Vidrio', icon: require('@/assets/icons/vidrio.png') },
      { id: 'carton', name: 'Cartón', icon: require('@/assets/icons/carton.png') }
    ],
    selectedRecycleItems: [],
    errors: {
      kilometros: '',
      transporte: '',
      consumoElectricidad: '',
      energiaRenovable: '',
      reciclaje: '',
    }
  }
},

async mounted() {
  await this.verificarPuedeCalcular();
},

methods: {
  async verificarPuedeCalcular() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/puede-calcular', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      this.puedeCalcular = data.puede_calcular;
      this.mensajeRestriccion = data.mensaje;
      this.diasRestantes = data.dias_restantes || 0;
      
    } catch (error) {
      console.error('Error verificando restricción:', error);
      this.puedeCalcular = true;
    } finally {
      this.cargandoVerificacion = false;
    }
  },

  async calcularHuella() {
    if (!this.validarFormulario()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    await this.verificarPuedeCalcular();
    if (!this.puedeCalcular) {
      alert(this.mensajeRestriccion);
      return;
    }

    const resultado = this.calcularHuellaLocalmente();
    
    this.$router.push({
      path: '/resultados',
      query: {
        resultado: encodeURIComponent(JSON.stringify(resultado)),
        datosOriginales: encodeURIComponent(JSON.stringify(this.getDatosFormulario()))
      }
    });
  },

  toggleRecycleItem(itemId) {
    if (itemId === 'no_reciclo') {
      this.selectedRecycleItems = ['no_reciclo'];
    } else {
      const noRecicloIndex = this.selectedRecycleItems.indexOf('no_reciclo');
      if (noRecicloIndex !== -1) {
        this.selectedRecycleItems.splice(noRecicloIndex, 1);
      }
      
      const itemIndex = this.selectedRecycleItems.indexOf(itemId);
      if (itemIndex === -1) {
        this.selectedRecycleItems.push(itemId);
      } else {
        this.selectedRecycleItems.splice(itemIndex, 1);
      }

      if (this.selectedRecycleItems.length > 0) {
        this.errors.reciclaje = '';
      }
    }
  },

  clearError(field) {
    this.errors[field] = '';
  },
  
  validarFormulario() {
    let valido = true;
    this.errors = {
      kilometros: '',
      transporte: '',
      consumoElectricidad: '',
      energiaRenovable: '',
      reciclaje: '',
    };

    if (this.kilometros <= 0) {
      this.errors.kilometros = '⚠️ Los kilómetros deben tener un valor mayor a 0';
      valido = false;
    }
    
    if (!this.transporte) {
      this.errors.transporte = '⚠️ Selecciona un medio de transporte';
      valido = false;
    }
    
    if (!this.consumoElectricidad || this.consumoElectricidad <= 0) {
      this.errors.consumoElectricidad = '⚠️ Ingresa tu consumo de electricidad en kWh';
      valido = false;
    }
    
    if (!this.energiaRenovable) {
      this.errors.energiaRenovable = '⚠️ Indica si usas energía renovable';
      valido = false;
    }

    if (this.selectedRecycleItems.length === 0) {
      this.errors.reciclaje = '⚠️ Selecciona al menos una opción de reciclaje';
      valido = false;
    }
    
    return valido;
  },

  calcularHuellaLocalmente() {
    const factoresTransporte = {
      coche: 0.12,
      moto: 0.08,
      autobus: 0.09,
      bicicleta: 0,
      'a pie': 0
    };

    const FACTOR_ELECTRICIDAD = 0.69;

    const emisionesTransporte = this.kilometros * (factoresTransporte[this.transporte] || 0);
    const emisionesElectricidad = (this.consumoElectricidad || 0) * FACTOR_ELECTRICIDAD;

    let emisionesTotales = emisionesTransporte + emisionesElectricidad;

    if (this.energiaRenovable === 'si') {
      emisionesTotales *= 0.5;
    }

    const itemsReciclaje = this.selectedRecycleItems.filter(item => item !== 'no_reciclo');
    const descuentoReciclaje = Math.min(itemsReciclaje.length * 0.02, 0.1);
    emisionesTotales *= (1 - descuentoReciclaje);

    return {
      kgCO2: Math.round(emisionesTotales),
      toneladasCO2: (emisionesTotales / 1000).toFixed(2),
      categoria: this.getCategoriaHuella(emisionesTotales / 1000),
      emisionesDetalle: {
        transporte: emisionesTransporte.toFixed(2),
        electricidad: emisionesElectricidad.toFixed(2),
        descuentoRenovable: this.energiaRenovable === 'si' ? 50 : 0,
        descuentoReciclaje: (descuentoReciclaje * 100).toFixed(0)
      },
      fecha: new Date().toISOString()
    };
  },

  getCategoriaHuella(toneladas) {
    if (toneladas < 1) return "Baja";
    else if (toneladas < 5) return "Media";
    else return "Alta";
  },


  getDatosFormulario() {
    return {
      kilometros: this.kilometros,
      transporte: this.transporte,
      electricidad: this.consumoElectricidad, 
      energiaRenovable: this.energiaRenovable,
      reciclaje: Array.isArray(this.selectedRecycleItems) ? this.selectedRecycleItems : []
    };
  }
}
}
</script>


<style>

.mensaje-carga {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #6c757d;
}

.mensaje-restriccion {
  text-align: center;
  padding: 40px;
  background-color: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 12px;
  margin: 20px 0;
}

.header-huella {
  text-align: center;
  margin-bottom: 0px;
  margin-top:100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-huella h1 {
  font-size: 2.3rem;
  font-weight: bold;
  color: #0b6d11;
  display: inline-flex;
  align-items: center;
  gap: 20px;
}

.header-huella .icono-huella {
  width: 90px;
  height: auto;

}

.icono-restriccion {
  font-size: 48px;
  margin-bottom: 16px;
}

.mensaje-restriccion h3 {
  color: #495057;
  margin-bottom: 16px;
}

.mensaje-restriccion p {
  color: #6c757d;
  margin-bottom: 12px;
  font-size: 16px;
}

.btn-verificar {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
}

.btn-verificar:hover {
  background-color: #0056b3;
}

.error-message {
  color: #ff4444;
  font-size: 0.9em;
  display: block;
  margin-top: 5px;
}

.error-border {
  border: 1px solid #ff4444 !important;
}

.error-border-group {
  border: 1px solid #ff4444;
  padding: 10px;
  border-radius: 4px;
}
.calculoT{
  text-align: center;
  margin-bottom: 30px;
  color: #222;
  font-family: 'Poppins', sans-serif;

}
.carbon-footprint-form {
  background-color: #a3ea454a;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family:'Poppins', sans-serif; 
  border-radius: 4%;
}

.form-group {
  margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.slider {
  width: 100%;
  margin: 10px 0;


}

select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #9cd080;
}

input[type="radio"] {
  margin-right: 5px;
}

.opciones-reciclaje {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 10px;
}

.item-reciclaje {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
}

.item-reciclaje:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-reciclaje.active {
  border-color: #4CAF50;
  background-color: #e8f5e9;
}

.item-reciclaje img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 5px;
}

.item-reciclaje span {
  font-size: 14px;
  text-align: center;
}

.calcular-btn {
  background-color: #608f49;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 20px auto; 
  width: 200px;
  text-align: center;
  transition: background-color 0.3s;
  display: block; 
}

.calcular-btn:hover {
  background-color: #407c43;
}

.results-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.footprint-value {
  font-size: 2em;
  font-weight: bold;
  color: #4CAF50;
  margin: 10px 0;
  text-align: center;
}

.results-section h3 {
  margin-top: 20px;
  color: #333;
}

.results-section ul {
  list-style-type: none;
  padding: 0;
}

.results-section li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}
</style>
