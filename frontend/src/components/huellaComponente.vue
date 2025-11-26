<template>
  
    <div class="header-huella">
      <h1>Calcular tu huella ecológica</h1>
      <img src="@/assets/img/Huella.png" alt="huella" class="icono-huella" />
    </div>
   
    <!-- Mensaje de carga -->
    <div v-if="cargandoVerificacion" class="mensaje-carga">
      <p>Verificando disponibilidad...</p>
    </div>
    
    <!-- Mensaje cuando NO puede calcular -->
    <div v-else-if="!puedeCalcular" class="mensaje-restriccion">
      <div class="icono-restriccion"></div>
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
        <label for="kilometros">¿Cuántos kilómetros recorres aproximadamente al mes?</label>
        <input 
          type="range" 
          id="kilometros"
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
        <label for="transporte">¿Principal medio de transporte?</label>
        <select 
          id="transporte"
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
        <label for="consumoElectricidad">¿Cuánto consumo mensual aparece en tu recibo de luz? (en kWh)</label>
        <input 
          type="number" 
          id="consumoElectricidad"
          min="0" 
          v-model="consumoElectricidad" 
          placeholder="Ej: 52"
          @change="clearError('consumoElectricidad')"
        >
        <span class="error-message">{{ errors.consumoElectricidad }}</span>
      </div>

      <!-- Energía renovable -->
      <div class="form-group">
        <fieldset :class="{ 'error-border-group': errors.energiaRenovable }">
          <legend>¿Usas energía renovable?</legend>
          <div>
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
        </fieldset>
        <span class="error-message">{{ errors.energiaRenovable }}</span>
      </div>
      <!-- Reciclaje -->
    <div class="form-group">
      <fieldset>
        <legend>¿Qué reciclas? (Selecciona los iconos)</legend>
        <div class="opciones-reciclaje">
          <button
            v-for="item in reciclajeItems"
            :key="item.id"
            @click="toggleRecycleItem(item.id)"
            :class="{
              'item-reciclaje': true, 
              'active': selectedRecycleItems.includes(item.id) 
            }"
            :title="item.name"
            type="button"
          >
            <img :src="item.icon" :alt="item.name">
            <span>{{ item.name }}</span>
          </button>
        </div>
      </fieldset>
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
      { id: 'no_reciclo', name: 'No reciclo', icon:require('@/assets/icons/R_ngar.png'),},
      { id: 'papel', name: 'Papel', icon: require('@/assets/icons/R_papel.png') },
      { id: 'plastico', name: 'Plástico', icon: require('@/assets/icons/R_plastico.png') },
      { id: 'vidrio', name: 'Vidrio', icon: require('@/assets/icons/R_vidrio.png') },
      { id: 'carton', name: 'Cartón', icon: require('@/assets/icons/R_carton.png') }
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
      this.errors.kilometros = ' Los kilómetros deben tener un valor mayor a 0';
      valido = false;
    }
    
    if (!this.transporte) {
      this.errors.transporte = ' Selecciona un medio de transporte';
      valido = false;
    }
    
    if (!this.consumoElectricidad || this.consumoElectricidad <= 0) {
      this.errors.consumoElectricidad = ' Ingresa tu consumo de electricidad en kWh';
      valido = false;
    }
    
    if (!this.energiaRenovable) {
      this.errors.energiaRenovable = ' Indica si usas energía renovable';
      valido = false;
    }

    if (this.selectedRecycleItems.length === 0) {
      this.errors.reciclaje = ' Selecciona al menos una opción de reciclaje';
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
<style scoped>
/* Mensaje de carga */
.mensaje-carga {
  text-align: center;
  padding: 60px 40px;
  font-size: 18px;
  color: #495057;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Mensaje de restricción */
.mensaje-restriccion {
  text-align: center;
  padding: 50px 40px;
  background: linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%);
  border: 2px solid #ffb74d;
  border-radius: 16px;
  margin: 40px auto;
  max-width: 600px;
  box-shadow: 0 8px 24px rgba(255, 152, 0, 0.15);
}

.icono-restriccion {
  font-size: 64px;
  margin-bottom: 20px;
}

.mensaje-restriccion h3 {
  color: #e65100;
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 600;
}

.mensaje-restriccion p {
  color: #6c757d;
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 1.6;
}

.mensaje-restriccion p strong {
  color: #e65100;
  font-weight: 600;
}

/* Header */
.header-huella {
  text-align: center;
  margin-bottom: 50px;
  margin-top: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInDown 0.8s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-huella h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0b6d11 0%, #4CAF50 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  letter-spacing: -0.5px;
}

.header-huella .icono-huella {
  width: 90px;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(11, 109, 17, 0.3));
  transition: transform 0.3s ease;
}

.header-huella .icono-huella:hover {
  transform: scale(1.1) rotate(5deg);
}

/* Formulario principal */
.carbon-footprint-form {
  background: linear-gradient(135deg, #ffffff 0%, #f8fff9 100%);
  max-width: 700px;
  margin: 0 auto 60px;
  padding: 40px;
  font-family: 'Poppins', sans-serif;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(11, 109, 17, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.1);
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Grupos de formulario */
.form-group {
  margin-bottom: 40px;
  font-family: 'Poppins', sans-serif;
  animation: slideIn 0.5s ease;
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(76, 175, 80, 0.08);
  transition: all 0.3s ease;
}

.form-group:hover {
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.12);
  border-color: rgba(76, 175, 80, 0.2);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

label, legend {
  display: block;
  margin-bottom: 16px;
  font-weight: 600;
  color: #2d5016;
  font-size: 1.05rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
}

label::before, legend::before {
  color: #4CAF50;
  font-size: 0.8em;
}

/* Slider mejorado */
.slider {
  width: 100%;
  height: 8px;
  margin: 15px 0;
  border-radius: 10px;
  background: linear-gradient(to right, #81c784 0%, #4CAF50 100%);
  outline: none;
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50 0%, #0b6d11 100%);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(11, 109, 17, 0.3);
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(11, 109, 17, 0.4);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50 0%, #0b6d11 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 12px rgba(11, 109, 17, 0.3);
  transition: all 0.3s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(11, 109, 17, 0.4);
}

.form-group span {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #4CAF50;
}

/* Select ultra moderno */
select {
  width: 100%;
  padding: 16px 20px;
  border-radius: 14px;
  border: 2px solid #e8f5e9;
  background: linear-gradient(145deg, #ffffff, #fafafa);
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  cursor: pointer;
  color: #2d5016;
  font-weight: 500;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234CAF50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 45px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.12), 0 4px 12px rgba(76, 175, 80, 0.15);
  background: white;
}

select:hover {
  border-color: #81c784;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Estilo moderno para las opciones del select */
select option {
  padding: 12px 16px;
  background: white;
  color: #2d5016;
  font-weight: 500;
  border-radius: 8px;
  margin: 4px 0;
}

select option:hover,
select option:focus {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  color: #0b6d11;
}

select option:checked {
  background: linear-gradient(135deg, #4CAF50, #0b6d11);
  color: white;
  font-weight: 600;
}

select option[value=""] {
  color: #9e9e9e;
  font-style: italic;
}

/* Input number ultra moderno */
input[type="number"] {
  width: 100%;
  padding: 16px 20px;
  border-radius: 14px;
  border: 2px solid #e8f5e9;
  background: linear-gradient(145deg, #ffffff, #fafafa);
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  color: #2d5016;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

input[type="number"]:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.12), 0 4px 12px rgba(76, 175, 80, 0.15);
  background: white;
  transform: translateY(-1px);
}

input[type="number"]:hover {
  border-color: #81c784;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

input[type="number"]::placeholder {
  color: #9e9e9e;
  font-weight: 400;
}

/* Radio buttons ultra modernos */
fieldset {
  border: 2px solid #e8f5e9;
  border-radius: 14px;
  padding: 24px;
  background: linear-gradient(145deg, #ffffff, #fafafa);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

fieldset:hover {
  border-color: #c8e6c9;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.08);
}

fieldset div {
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-top: 12px;
}

input[type="radio"] {
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #81c784;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  margin-right: 10px;
  background: white;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

input[type="radio"]:hover {
  border-color: #4CAF50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
  transform: scale(1.1);
}

input[type="radio"]:checked {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #4CAF50, #0b6d11);
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.15), inset 0 0 0 3px white;
}

input[type="radio"]:checked::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: radioPulse 0.3s ease;
}

@keyframes radioPulse {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

fieldset label {
  cursor: pointer;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 1.05rem;
  padding: 8px 12px;
  border-radius: 8px;
}

fieldset label::before {
  display: none;
}

fieldset label:hover {
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

input[type="radio"]:checked + label {
  color: #0b6d11;
  font-weight: 700;
}

/* Opciones de reciclaje ultra modernas */
.opciones-reciclaje {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 16px;
  margin-top: 24px;
  padding: 8px;
}

.item-reciclaje {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 24px 16px;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid transparent;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  min-width: 110px;
  box-shadow: 
    4px 4px 12px rgba(0, 0, 0, 0.08),
    -4px -4px 12px rgba(255, 255, 255, 0.9);
  overflow: hidden;
}

.item-reciclaje::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(11, 109, 17, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 20px;
  z-index: 0;
}

.item-reciclaje:hover::before {
  opacity: 1;
}

.item-reciclaje:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 
    8px 8px 20px rgba(76, 175, 80, 0.15),
    -4px -4px 16px rgba(255, 255, 255, 1),
    inset 0 0 0 2px rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.3);
}

.item-reciclaje.active {
  border-color: #4CAF50;
  background: linear-gradient(145deg, #e8f5e9, #c8e6c9);
  box-shadow: 
    0 12px 30px rgba(76, 175, 80, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(76, 175, 80, 0.2);
  transform: translateY(-10px) scale(1.05);
}

.item-reciclaje.active::before {
  opacity: 1;
}

.item-reciclaje.active::after {
  content: '✓';
  position: absolute;
  top: 8px;
  right: 8px;
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, #4CAF50, #0b6d11);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  animation: checkPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 2;
}

@keyframes checkPop {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.item-reciclaje img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin-bottom: 12px;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.12));
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 1;
}

.item-reciclaje:hover img {
  transform: scale(1.15) rotate(5deg);
  filter: drop-shadow(0 6px 12px rgba(76, 175, 80, 0.3));
}

.item-reciclaje.active img {
  transform: scale(1.1);
  filter: drop-shadow(0 6px 12px rgba(76, 175, 80, 0.4));
}

.item-reciclaje span {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: #2d5016;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
}

.item-reciclaje:hover span {
  color: #0b6d11;
  transform: scale(1.05);
}

.item-reciclaje.active span {
  color: #0b6d11;
  font-weight: 700;
}

/* Mensajes de error */
.error-message {
  color: #d32f2f;
  font-size: 0.9em;
  display: block;
  margin-top: 8px;
  font-weight: 500;
  text-align: left;
  padding-left: 4px;
}

.error-border {
  border: 2px solid #d32f2f !important;
  animation: shake 0.5s ease;
}

.error-border-group {
  border: 2px solid #d32f2f;
  padding: 20px;
  border-radius: 12px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Botón calcular mejorado */
.center {
  text-align: center;
  margin-top: 40px;
}

.filter-btn.green {
  background: linear-gradient(135deg, #4CAF50 0%, #0b6d11 100%);
  color: white;
  padding: 16px 48px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(11, 109, 17, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.filter-btn.green:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(11, 109, 17, 0.4);
  background: linear-gradient(135deg, #45a049 0%, #0a5d0f 100%);
}

.filter-btn.green:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(11, 109, 17, 0.3);
}

/* Responsivo */
@media (max-width: 768px) {
  .header-huella {
    margin-top: 40px;
    margin-bottom: 30px;
    flex-direction: column;
    gap: 15px;
  }

  .header-huella h1 {
    font-size: 1.8rem;
    flex-direction: column;
    text-align: center;
  }

  .header-huella .icono-huella {
    width: 70px;
  }
  
  .carbon-footprint-form {
    padding: 30px 20px;
    margin: 0 15px 40px;
    border-radius: 20px;
  }

  .form-group {
    padding: 20px 16px;
    margin-bottom: 28px;
  }

  label, legend {
    font-size: 0.95rem;
  }

  .slider {
    height: 6px;
  }

  .slider::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
  }

  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
  }

  .form-group span {
    font-size: 1.1rem;
  }

  select, input[type="number"] {
    font-size: 0.95rem;
    padding: 14px 18px;
  }

  fieldset {
    padding: 18px;
  }

  fieldset div {
    gap: 25px;
  }

  input[type="radio"] {
    width: 20px;
    height: 20px;
  }

  fieldset label {
    font-size: 0.95rem;
  }
  
  .opciones-reciclaje {
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 12px;
  }
  
  .item-reciclaje {
    min-width: 90px;
    padding: 18px 12px;
  }
  
  .item-reciclaje img {
    width: 52px;
    height: 52px;
  }

  .item-reciclaje span {
    font-size: 12px;
  }

  .filter-btn.green {
    padding: 14px 40px;
    font-size: 1rem;
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .header-huella {
    margin-top: 30px;
    margin-bottom: 25px;
  }

  .header-huella h1 {
    font-size: 1.5rem;
    gap: 12px;
  }

  .header-huella .icono-huella {
    width: 60px;
  }

  .carbon-footprint-form {
    padding: 24px 16px;
    margin: 0 10px 30px;
  }

  .form-group {
    padding: 18px 14px;
    margin-bottom: 24px;
  }

  label, legend {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }

  label::before, legend::before {
    font-size: 0.7em;
  }

  .form-group span {
    font-size: 1rem;
  }

  select, input[type="number"] {
    font-size: 0.9rem;
    padding: 12px 16px;
  }

  fieldset {
    padding: 16px;
  }

  fieldset div {
    gap: 20px;
    flex-wrap: wrap;
  }

  input[type="radio"] {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }

  fieldset label {
    font-size: 0.9rem;
    padding: 6px 10px;
  }

  .opciones-reciclaje {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .item-reciclaje {
    min-width: auto;
    padding: 16px 10px;
  }

  .item-reciclaje img {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
  }

  .item-reciclaje span {
    font-size: 11px;
  }

  .item-reciclaje.active::after {
    width: 22px;
    height: 22px;
    font-size: 12px;
    top: 6px;
    right: 6px;
  }

  .filter-btn.green {
    padding: 14px 32px;
    font-size: 0.95rem;
    width: 100%;
  }

  .error-message {
    font-size: 0.85em;
  }
}

@media (max-width: 360px) {
  .header-huella h1 {
    font-size: 1.3rem;
  }

  .header-huella .icono-huella {
    width: 50px;
  }

  .carbon-footprint-form {
    padding: 20px 12px;
  }

  .form-group {
    padding: 16px 12px;
  }

  .opciones-reciclaje {
    gap: 8px;
  }

  .item-reciclaje {
    padding: 12px 8px;
  }

  .item-reciclaje img {
    width: 42px;
    height: 42px;
  }

  .item-reciclaje span {
    font-size: 10px;
  }
}
</style>