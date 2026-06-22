<template>
  <div class="max-w-6xl mx-auto py-8">
    <div class="glass-panel p-8 overflow-hidden">
      <h2 class="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Semua Data Logistik
      </h2>

      <div v-if="Object.keys(groupedData).length === 0" class="text-slate-400 text-center py-8">
        Belum ada data.
      </div>

      <div v-else class="space-y-8">
        <div v-for="(items, date) in groupedData" :key="date" class="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
          
          <!-- Header Per Hari -->
          <div class="bg-slate-800/80 p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 class="font-bold text-lg text-emerald-300">{{ formatDateHeader(date) }}</h3>
            <button @click="copySummary(date, items)" class="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {{ copiedDate === date ? 'Copied!' : 'Copy Summary' }}
            </button>
          </div>

          <!-- Table Per Hari -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="bg-slate-900/40 text-slate-400 uppercase tracking-wider text-xs border-b border-slate-700/50">
                  <th class="p-3 font-medium">Jam</th>
                  <th class="p-3 font-medium">Sender</th>
                  <th class="p-3 font-medium">Receiver</th>
                  <th class="p-3 font-medium text-center">Qty</th>
                  <th class="p-3 font-medium text-center">Empty</th>
                  <th class="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/30">
                <tr v-for="item in items" :key="item.id" class="hover:bg-slate-800/50 transition-colors">
                  <td class="p-3 text-slate-400">{{ formatTime(item.createdAt) }}</td>
                  <td class="p-3 font-medium text-slate-200">{{ item.senderName }}</td>
                  <td class="p-3 text-slate-300">{{ item.receiverName }}</td>
                  <td class="p-3 text-center font-mono bg-slate-900/30">{{ item.quantity }}</td>
                  <td class="p-3 text-center font-mono">
                    <span v-if="item.emptyQuantity !== null" class="text-emerald-400">{{ item.emptyQuantity }}</span>
                    <span v-else class="text-slate-500">-</span>
                  </td>
                  <td class="p-3">
                    <span v-if="item.status === 'Completed'" class="text-emerald-400 text-xs font-medium">Completed</span>
                    <span v-else class="text-yellow-400 text-xs font-medium">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'

const allData = ref([])
const copiedDate = ref(null)

const fetchData = async () => {
  try {
    const data = await $fetch('/api/logistics')
    allData.value = data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  fetchData()
})

const formatTime = (dateString) => {
  return dayjs(dateString).format('HH:mm')
}

const formatDateHeader = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

// Group data by YYYY-MM-DD
const groupedData = computed(() => {
  const groups = {}
  allData.value.forEach(item => {
    const dateKey = dayjs(item.createdAt).format('YYYY-MM-DD')
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(item)
  })
  return groups
})

const copySummary = async (dateKey, items) => {
  // Sort items by time descending to get the "latest" one
  const sortedItems = [...items].sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
  
  if (sortedItems.length === 0) return

  const latestSender = sortedItems[0].senderName
  const latestReceiver = sortedItems[0].receiverName
  
  const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalEmpty = items.reduce((sum, item) => sum + (item.emptyQuantity || 0), 0)

  const formattedDate = dayjs(dateKey).format('DD/MM/YYYY')

  const summaryText = `${formattedDate} - Tech-> Logistic
Sender: ${latestSender}
Receiver: ${latestReceiver}
Qty: ${totalQty}
Empty: ${totalEmpty}`

  try {
    await navigator.clipboard.writeText(summaryText)
    copiedDate.value = dateKey
    setTimeout(() => { copiedDate.value = null }, 2000)
  } catch (err) {
    alert('Failed to copy to clipboard!')
  }
}
</script>
