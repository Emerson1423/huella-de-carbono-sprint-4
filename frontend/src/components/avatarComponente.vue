<template>
    <div class="container-avatar">
        <div class="avatar-preview">
            <div class="avatar-container">
                <img :src="user.personajeBase" class="avatar-base" alt="Personaje base">
            </div>
        </div>

        <div v-if="seccionActual === 'personajes'" class="opciones-container">
            <h3>Elige un personaje</h3>
            <div class="opciones-grid">
                <div v-for="personaje in opcionesPersonajes" 
                     :key="personaje.id" 
                     class="opcion-item"
                     :class="{selected: user.personajeBase === personaje.image}"
                     @click="seleccionarPersonaje(personaje)">
                    <img :src="personaje.image" :alt="personaje.nombre" class="opcion-imagen-personaje">
                    <span class="opcion-nombre">{{ personaje.nombre }}</span>
                </div>
            </div>
            
            <button class="card-btn" @click="updateAvatar">Seleccionar</button>
        </div>
    </div>
</template>

<script>
export default {   
    data(){
        return {
            user:{
                personajeBase: require('@/assets/perfil/reemplazarP.png')
            },
            personajeSeleccionado: null,
            
            opcionesPersonajes: [
                { id: 1, image: require('@/assets/perfil/reciclarP.png'), nombre: "Recicla" },
                { id: 2, image: require('@/assets/perfil/reemplazarP.png'), nombre: "Reemplaza" },
                { id: 3, image: require('@/assets/perfil/reduceP.png'), nombre: "Reduce"},     
                { id: 4, image: require('@/assets/perfil/renuevaP.png'), nombre: "Renueva" },      
                { id: 5, image: require('@/assets/perfil/reutilizarP.png'), nombre: "Reutiliza" },    
            ],
            seccionActual: 'personajes'
        };
    },

    methods: {
        seleccionarPersonaje(personaje) {
            this.user.personajeBase = personaje.image;
            this.personajeSeleccionado = personaje;
        },
        
        async updateAvatar() {
            try {
                
                if (!this.user.personajeBase) {
                    alert('Por favor selecciona un personaje primero');
                    return;
                }
              
                const avatarData = {
                    personajeBase: this.user.personajeBase
                };
              localStorage.setItem('avatarPreferencias', JSON.stringify(avatarData));

              globalThis.dispatchEvent(new Event('storage'));
              console.log('Avatar guardado:', this.user.personajeBase);
                
            } catch (error) {
                console.error('Error al cambiar avatar:', error);
                alert('Error al cambiar el avatar');
            }
        },

        cargarPreferencias() {
            const guardado = localStorage.getItem('avatarPreferencias');
            if (guardado) {
                const datos = JSON.parse(guardado);
                this.user.personajeBase = datos.personajeBase || this.user.personajeBase;
            }
        }
    },
    
    mounted() {
        this.cargarPreferencias();
    }
}
</script>

<style>
.container-avatar {
  display: flex;
  flex-direction:column;
  align-items: center;
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;  
  margin-bottom:20px;
  margin-top: 20px;


}

.avatar-preview {
  margin-bottom: 10px;
}

.avatar-container {
  width: 150px;
  height: 200px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid #2ecc71;
}

.avatar-base {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  top: 0;
  left: 0;
}

.selector-seccion {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.selector-seccion button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}



.selector-seccion button:hover {
  background-color: #d0d0d0;
}

.opciones-container {
  width: auto;
  padding-bottom: 40px;
}

.opciones-container h3 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.opciones-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  padding-bottom: 60px;
}

.opcion-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.opcion-item:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.opcion-item.selected {
  border-color: #27ae60;
  background-color: #e8f5e9;
}

.opcion-imagen-personaje {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 8px;
}

.opcion-imagen {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 8px;
}

.opcion-nombre {
  font-size: 0.8rem;
  text-align: center;
  color: #555;
}

/* Responsive */
@media (max-width: 480px) {
  .opciones-grid {
    grid-template-columns: 1fr;
  }
  
  .selector-seccion {
    flex-direction: column;
    align-items: center;
  }
  
  .selector-seccion button {
    width: 100%;
  }
}
.card-btn {
  background:#549d18;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 15px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 100px;
  font-size: 1rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.card-btn:hover {
  background: #52a973;

}

</style>