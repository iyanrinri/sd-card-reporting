<template>
  <div class="max-w-2xl mx-auto py-16 text-center">
    <div class="glass-panel p-12 flex flex-col items-center justify-center">
      <div class="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Terima Kasih!
      </h2>
      <p class="text-slate-300 text-lg mb-8">
        Data pelaporan logistik Anda sudah berhasil tersimpan ke dalam sistem.
      </p>
      
      <NuxtLink to="/logistics" class="btn-primary inline-flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Input Form Lagi
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useHead } from 'nuxt/app'

useHead({
  title: 'Success - Logistik SD Card'
})
</script>
