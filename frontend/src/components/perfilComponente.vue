<template>
    <!-- Mostrar contenido solo si está autenticado -->
    <template v-if="isAuthenticated">
        <div class="header-perfil">
            <h1><i class="fas fa-leaf"></i> Hola, {{ usuario.usuario }}</h1> 
        </div>
        
        <div class="contenido-perfil">
            <div class="seccion-derecha">
                <!-- SECCIÓN DE HÁBITOS ACTUALIZADA -->
                <div class="seccion-habitos">
                    <h2>
                        <i class="fas fa-leaf"></i> 
                        Mis Hábitos ({{ habitosUsuario.length }}/{{ maxHabitos }})
                    </h2>
                    
                    <!-- Lista de hábitos cuando hay hábitos -->
                    <div v-if="habitosUsuario.length > 0" class="lista-habitos">
                        <div 
                            v-for="(habito, index) in habitosUsuario" 
                            :key="habito.id"
                            class="item-habito"
                            :style="{ borderLeft: `4px solid ${obtenerColorBadge(index)}` }"
                        >
                            <div class="habito-header">
                                <h3>{{ habito.title }}</h3>
                                <button 
                                    @click="eliminarHabito(index)"
                                    class="btn-eliminar"
                                    title="Eliminar hábito"
                                >
                                    Eliminar
                                </button>
                            </div>
                            
                            <p class="habito-descripcion">{{ habito.desc }}</p>
                            
                            <div class="habito-info">
                                <small class="fecha-agregado">
                                    <i class="fas fa-calendar-plus"></i>
                                    Agregado el {{ formatearFecha(habito.fechaAgregado) }}
                                </small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mensaje cuando no hay hábitos -->
                    <div v-else class="sin-habitos">
                        <i class="fas fa-seedling fa-2x"></i>
                        <p>Aún no has agregado ningún hábito ecológico.</p>
                        <p>¡Ve a la sección de hábitos para comenzar!</p>
                    </div>
                    
                    <!-- Información del límite -->
                    <div v-if="habitosUsuario.length < maxHabitos" class="info-limite">
                        <small>
                            <i class="fas fa-info-circle"></i>
                            Puedes agregar {{ maxHabitos - habitosUsuario.length }} hábito(s) más
                        </small>
                    </div>
                    
                    <!-- Advertencia cuando se alcanza el límite -->
                    <div v-else-if="habitosUsuario.length === maxHabitos" class="limite-alcanzado">
                        <small>
                            <i class="fas fa-check-circle"></i>
                            Has alcanzado el límite máximo de hábitos
                        </small>
                    </div>
                </div>
                
                <EstadisticaComponente></EstadisticaComponente>
            </div>
       
            <div class="seccion-izquierda">
                <formsPerfilComponente></formsPerfilComponente>
            </div> 
        </div>
    </template>
</template>

<script>
import EstadisticaComponente from './estadisticaComponente.vue';
import formsPerfilComponente from './formsPerfilComponente.vue';
import axios from 'axios';

export default {
    components: {
        formsPerfilComponente, 
        EstadisticaComponente
    },
    
    data() {
        return {
            isAuthenticated: true, 
            usuario: {
                usuario: '',
                id: null  // Agregar ID al objeto usuario
            },
            usuarioId: null,
            habitosUsuario: [],
            maxHabitos: 3,
            cargando: false
        };
    },
        
        async mounted() {
            await this.obtenerPerfil();
            this.cargarHabitos();
            globalThis.addEventListener('perfilActualizado', this.onPerfilActualizado);
            globalThis.addEventListener('userUpdated', this.onPerfilActualizado);
            globalThis.addEventListener('habitoAgregado', this.onHabitoAgregado);
        },
            
        beforeUnmount() {
            globalThis.removeEventListener('perfilActualizado', this.onPerfilActualizado);
            globalThis.removeEventListener('userUpdated', this.onPerfilActualizado);   
            globalThis.removeEventListener('habitoAgregado', this.onHabitoAgregado);
        },
    methods: {    
        onPerfilActualizado() {
            this.obtenerPerfil();
        },
        
        obtenerToken() {
            const token = localStorage.getItem('token');
            return token;
        },
        
        async obtenerPerfil() {
            try {
                this.cargando = true;
                const token = this.obtenerToken();
                
                if (!token) {
                    console.warn('No hay token disponible');
                    this.usuario.usuario = 'Usuario';
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/perfil', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data) {
                    if (response.data.user && response.data.user.usuario) {
                        this.usuario = response.data.user;
                        // IMPORTANTE: Establecer el usuarioId después de obtener el perfil
                        this.usuarioId = response.data.user.id || response.data.user.correo || response.data.user.usuario;
                        // Cargar hábitos con el nuevo usuarioId
                        this.cargarHabitos();
                    } else {
                        this.usuario.usuario = 'Usuario';
                    }
                }
                
            } catch (error) {
                console.error('Error al obtener perfil:', error);
                this.usuario.usuario = 'Usuario';
            } finally {
                this.cargando = false;
            }
        },
        
        /**
         * Cargar hábitos del localStorage (específicos del usuario)
         */
        cargarHabitos() {
            if (!this.usuarioId) {
                console.warn('No hay usuario identificado para cargar hábitos');
                this.habitosUsuario = [];
                return;
            }
            
            const claveHabitos = `userHabitos_${this.usuarioId}`;
            const habitos = JSON.parse(localStorage.getItem(claveHabitos) || '[]');
            this.habitosUsuario = habitos;
            console.log(`Hábitos cargados para usuario ${this.usuarioId}:`, habitos);
        },

        /**
         * Manejar cuando se agrega un nuevo hábito
         */
        onHabitoAgregado() {
            this.cargarHabitos();
        },

        /**
         * Eliminar un hábito específico
         */
        eliminarHabito(index) {
            if (!this.usuarioId) {
                alert('Error: No se puede eliminar el hábito');
                return;
            }
            
            if (confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
                this.habitosUsuario.splice(index, 1);
                
                const claveHabitos = `userHabitos_${this.usuarioId}`;
                localStorage.setItem(claveHabitos, JSON.stringify(this.habitosUsuario));
                
                globalThis.dispatchEvent(new CustomEvent('habitoEliminado'));
            }
        },

        /**
         * Obtener el color del badge según el índice
         */
        obtenerColorBadge(index) {
            const colores = ['#4caf50', '#2196f3', '#ff9800'];
            return colores[index % colores.length];
        },
        
        /**
         * Formatear fecha para mostrar
         */
        formatearFecha(fechaISO) {
            const fecha = new Date(fechaISO);
            return fecha.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short', 
                day: 'numeric'
            });
        },
        
        redirectToLogin() {
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.caja-perfil {
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    font-family: 'Poppins', sans-serif;
    max-width: 600px;
    width: 95%;
    margin: 0 auto;
    padding: 25px;
    box-sizing: border-box;
}

.header-perfil {
    color: rgb(113, 185, 85);
    padding: 25px;
    text-align: center;
    font-family: 'Poppins', sans-serif;  
    border-radius: 20px;
    max-width: 1000px;
    margin: 0 auto;
}

.header-perfil h1 {
    font-size: 2.2rem;
    margin: 0;
    font-family: 'Poppins', sans-serif;  
}

.contenido-perfil {
    display: grid;
    grid-template-columns: 2fr 1fr;
}

.seccion-izquierda, .seccion-derecha {
    display: flex;
    flex-direction: column;
    gap: 55px;
}

.seccion-habitos {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Poppins', sans-serif;
    position: relative;
}

.seccion-habitos h2 {
    color: #333;
    margin-top: 0;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.lista-habitos {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.item-habito {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
}

.item-habito:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.habito-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}

.habito-header h3 {
    margin: 0;
    color: #2e7d32;
    font-size: 1.1rem;
    flex: 1;
}

.btn-eliminar {
background: #FF4742;
  border: 1px solid #FF4742;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  line-height: 10px;
  min-height: 20px;
  outline: 0;
  padding: 12px 14px;
  text-align: center;


}

.btn-eliminar:hover {
    background: #d32f2f;
    transform: scale(1.1);
}

.habito-descripcion {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 8px 0;
}

.habito-info {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid #eee;
}

.fecha-agregado {
    color: #888;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 5px;
}

.sin-habitos {
    text-align: center;
    padding: 30px;
    color: #888;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 15px 0;
}

.sin-habitos i {
    color: #4caf50;
    margin-bottom: 10px;
}

.info-limite {
    background: #e8f5e9;
    padding: 8px 12px;
    border-radius: 6px;
    margin-top: 10px;
    color: #2e7d32;
    text-align: center;
}

.limite-alcanzado {
    background: #fff3cd;
    padding: 8px 12px;
    border-radius: 6px;
    margin-top: 10px;
    color: #856404;
    text-align: center;
}

.info-limite i,
.limite-alcanzado i {
    margin-right: 5px;
}

.contenido-historial {
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-autenticado {
    text-align: center;
    padding: 50px;
    color: #666;
}

.btn-login {
    background: linear-gradient(to right, #58a21c, #49ae27);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 20px;
}

.btn-login:hover {
    background: linear-gradient(to right, #27ae60, #219653);
}

@media (max-width: 768px) {
    .contenido-perfil {
        grid-template-columns: 1fr;
    }
    
    .header-perfil h1 {
        font-size: 1.8rem;
    }
    
    .item-habito {
        padding: 12px;
    }
    
    .habito-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .btn-eliminar {
        align-self: flex-end;
    }
}
</style>