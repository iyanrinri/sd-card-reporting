<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <h1 class="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
      Welcome to LogistikApp
    </h1>
    <p class="text-xl text-slate-300 mb-12 max-w-2xl">
      A modern, fast, and secure logistics tracker. Choose your role below to get started.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      <!-- Runner Card -->
      <NuxtLink to="/logistics" class="glass-panel p-8 hover:scale-[1.02] transition-transform cursor-pointer group">
        <div class="h-16 w-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/30 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2">Logistik / Runner</h2>
        <p class="text-slate-400">Input sender name, quantity, and auto-assign receiver based on shift.</p>
      </NuxtLink>

      <!-- Tech Card -->
      <NuxtLink to="/tech" class="glass-panel p-8 hover:scale-[1.02] transition-transform cursor-pointer group">
        <div class="h-16 w-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-500/30 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2">Tech</h2>
        <p class="text-slate-400">View pending logistics and input the empty quantity.</p>
      </NuxtLink>
    </div>
  </div>
</template>
