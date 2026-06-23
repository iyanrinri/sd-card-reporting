<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="glass-panel p-8">
      <h2 class="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Form Tech (Lengkapi Data)
      </h2>

      <div v-if="pendingData.length === 0" class="text-slate-400 py-8 text-center bg-slate-800/30 rounded-lg border border-slate-700/50">
        Tidak ada data logistik yang pending.
      </div>

      <div v-else class="space-y-4">
        <div v-for="item in pendingData" :key="item.id" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/80 transition-colors">
          
          <!-- Info Section -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                Pending
              </span>
              <span class="text-sm text-slate-400">{{ formatDate(item.createdAt) }}</span>
            </div>
            <h3 class="font-semibold text-lg text-white mb-1">ID: #{{ item.id }} - {{ item.senderName }}</h3>
            <p class="text-sm text-slate-300">
              Receiver: <span class="text-white">{{ item.receiverName }}</span> | 
              Quantity: <span class="font-mono text-white bg-slate-700 px-1.5 py-0.5 rounded">{{ item.quantity }}</span>
            </p>
          </div>

          <!-- Action Section -->
          <form @submit.prevent="submitData(item.id)" class="flex items-end gap-3 shrink-0">
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Jumlah Empty</label>
              <input type="number" v-model="emptyInputs[item.id]" class="input-field py-2 w-24" placeholder="Cth: 5" min="0" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-400 mb-1">Jumlah Uploaded</label>
              <input type="number" v-model="uploadedInputs[item.id]" class="input-field py-2 w-24" placeholder="Cth: 5" min="0" />
            </div>
            <button type="submit" class="btn-primary py-2 px-4 w-auto h-[42px]" :disabled="isSubmitting === item.id">
              {{ isSubmitting === item.id ? '...' : 'Save' }}
            </button>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const pendingData = ref([])
const emptyInputs = ref({})
const uploadedInputs = ref({})
const isSubmitting = ref(null)

const fetchData = async () => {
  try {
    const data = await $fetch('/api/logistics?status=Pending')
    pendingData.value = data
    data.forEach(item => {
      emptyInputs.value[item.id] = item.emptyQuantity !== null ? item.emptyQuantity : ''
      uploadedInputs.value[item.id] = item.uploadedQuantity !== null ? item.uploadedQuantity : ''
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  fetchData()
})

const formatDate = (dateString) => {
  return dayjs(dateString).format('DD MMM YYYY, HH:mm')
}

const submitData = async (id) => {
  isSubmitting.value = id
  try {
    const payload = {}
    if (emptyInputs.value[id] !== undefined) payload.emptyQuantity = emptyInputs.value[id]
    if (uploadedInputs.value[id] !== undefined) payload.uploadedQuantity = uploadedInputs.value[id]

    const updated = await $fetch(`/api/logistics/${id}`, {
      method: 'PUT',
      body: payload
    })
    
    if (updated.status === 'Completed') {
      pendingData.value = pendingData.value.filter(item => item.id !== id)
    } else {
      const idx = pendingData.value.findIndex(item => item.id === id)
      if (idx !== -1) pendingData.value[idx] = updated
    }
  } catch (error) {
    alert('Terjadi kesalahan saat menyimpan.')
  } finally {
    isSubmitting.value = null
  }
}
</script>
