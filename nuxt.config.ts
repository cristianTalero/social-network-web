import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    alias: {
        yup: 'yup/lib/index.js'
    },
    typescript: {
        shim: false
    }
})
