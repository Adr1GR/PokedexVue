import { createApp, onMounted } from "vue";
import { createPinia } from "pinia";
import persist from "pinia-plugin-persistedstate";
import "@/renderer/style.scss";
import "@/renderer/tailwind.css";
import App from "@/renderer/App.vue";
import router from "@/renderer/router/index.js";
import { App as CapApp } from "@capacitor/app";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log("Esperando 5 segundos...");
await wait(5000);
console.log("Ahora inicializo la app");

const app = createApp(App);
app.use(createPinia().use(persist));
app.use(router);
app.mount("#app");

window.addEventListener("androidBackPressed", () => {
  const name = router.currentRoute.value.name;
  if (name !== "home" && name !== "pokemon-list") router.back();
  else CapApp.exitApp();
});
