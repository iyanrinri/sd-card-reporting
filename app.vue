<template>
  <div class="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30">
    <!-- Navbar (Hidden on /logistics and /success) -->
    <nav v-if="!['/logistics', '/success'].includes(route.path)" class="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <NuxtLink to="/" class="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            LogistikApp
          </NuxtLink>
          <div class="flex space-x-4">
            <NuxtLink to="/logistics" class="text-sm font-medium text-slate-300 hover:text-white transition-colors" active-class="text-blue-400">Runner</NuxtLink>
            <NuxtLink to="/tech" class="text-sm font-medium text-slate-300 hover:text-white transition-colors" active-class="text-blue-400">Tech</NuxtLink>
            <NuxtLink to="/data" class="text-sm font-medium text-slate-300 hover:text-white transition-colors" active-class="text-blue-400">Data</NuxtLink>
            <NuxtLink to="/settings" class="text-sm font-medium text-slate-300 hover:text-white transition-colors" active-class="text-blue-400">Settings</NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
