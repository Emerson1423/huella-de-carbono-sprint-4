 <template>
  <div class="view-card" @click="$router.push(link)">
    <div class="icon">
      <img :src="require(`@/assets/img/${icon}`)" :alt="title" />
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    link: String,
    icon: String // nombre del archivo PNG
  }
}
</script>

<style scoped>
.view-card {
  background: rgb(6, 156, 59);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 32px 16px;
  text-align: center;
  color: #fff;
  font-size: 1.2em;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 120px;
  font-family:  'Poppins', sans-serif;
}
.view-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.icon img {
  width: 180px;
  height: 180px;
  margin-bottom: 12px;
}
.title {
  font-weight: 600;
}
</style>