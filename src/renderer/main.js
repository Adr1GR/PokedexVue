import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/renderer/style.scss'
import '@/renderer/tailwind.css'
import App from '@/renderer/App.vue'
import router from '@/renderer/router/index.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
