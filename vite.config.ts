import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType:'prompt',
  includeAssets:['favicon.ico', "apple-touch-icon.png", "maskable-icon.png"],
  manifest:{
    name:"React Chat",
    short_name:"Chat",
    description:"Chat where probably you can find new friends and the author of this app too :D",
    icons:[{
      src: '/android-chrome-192x192.png',
      sizes:'192x192',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src:'/android-chrome-512x512.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src: '/apple-touch-icon.png',
      sizes:'180x180',
      type:"image/png",
      purpose:'apple touch icon',
    },
    {
      src: '/maskable-icon.png',
      sizes:'512x512',
      type:'image/png',
      purpose:"any maskable",
    },
  ],
  theme_color:'#171717',
  background_color:'#f0e7db',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation: "any",
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
})
