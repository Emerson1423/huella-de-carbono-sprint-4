<template>
        <!-- Panel de estadísticas -->
    <div v-if="estadisticas && estadisticas.tieneCalculos" class="stats-panel">
      <h2>Tus Estadísticas</h2>
      <ul>
        <li><strong>Total de cálculos:</strong> {{ estadisticas.totalCalculos }}</li>
        <li><strong>Promedio de emisiones:</strong> {{ estadisticas.promedioEmisiones }} kg CO₂</li>
        <li><strong>Mínimo:</strong> {{ estadisticas.menorEmisiones }} kg CO₂</li>
        <li><strong>Máximo:</strong> {{ estadisticas.mayorEmisiones }} kg CO₂</li>
        <li><strong>Primer cálculo:</strong> {{ formatearFecha(estadisticas.primerCalculo) }}</li>
        <li><strong>Último cálculo:</strong> {{ formatearFecha(estadisticas.ultimoCalculo) }}</li>
      </ul>
    </div>
</template>

<script>

export default {
  data() {
    return {
        estadisticas: null,
      

    }
  },
  async created() {
    await this.cargarEstadisticas();
  },
  methods: {
    async cargarEstadisticas() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/estadisticas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar estadísticas');
        const data = await response.json();
        this.estadisticas = data.estadisticas;
      } catch (error) {
        console.error(error);
        this.$toast?.error('Error al cargar estadísticas');
      }
    },
    formatearFecha(fecha) {
      if (!fecha) return 'N/A';
      return new Date(fecha).toLocaleDateString('es-ES');
    }

   
  }
}

</script>

<style>
.stats-panel {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  font-family: 'Poppins', sans-serif;
}

.stats-panel h2 {
   margin-top: 0;
   color: #333;
   margin-bottom: 20px;
   border-bottom: 2px solid #e0e0e0;

}

.stats-panel ul {
  list-style: none;
  padding: 0;
}

.stats-panel li {
  margin: 10px 0;
  padding: 5px 0;
}

.no-stats {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}
</style>