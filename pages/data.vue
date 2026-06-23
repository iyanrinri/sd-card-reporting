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
            <div class="flex gap-2">
              <button @click="copyRows(date, items)" class="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {{ copiedRowsDate === date ? 'Copied Rows!' : 'Copy Rows' }}
              </button>
              <button @click="copySummary(date, items)" class="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {{ copiedDate === date ? 'Copied Summary!' : 'Copy Summary' }}
              </button>
            </div>
          </div>

          <!-- Table Per Hari -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="bg-slate-900/40 text-slate-400 uppercase tracking-wider text-xs border-b border-slate-700/50">
                  <th class="p-3 font-medium">Jam</th>
                  <th class="p-3 font-medium">Tipe</th>
                  <th class="p-3 font-medium">Sender</th>
                  <th class="p-3 font-medium">Receiver</th>
                  <th class="p-3 font-medium text-center">Qty</th>
                  <th class="p-3 font-medium text-center">Empty</th>
                  <th class="p-3 font-medium text-center">Upload</th>
                  <th class="p-3 font-medium">Status</th>
                  <th class="p-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/30">
                <tr v-for="item in items" :key="item.id" class="hover:bg-slate-800/50 transition-colors">
                  <!-- Action Buttons / Edit Mode -->
                  <td class="p-3 text-slate-400" v-if="editingId === item.id">
                    {{ formatTime(item.createdAt) }}
                  </td>
                  <td class="p-3 text-slate-400" v-else>
                    {{ formatTime(item.createdAt) }}
                  </td>

                  <td class="p-3 font-medium text-slate-200" v-if="editingId === item.id">
                    <input type="text" v-model="editForm.type" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200" />
                  </td>
                  <td class="p-3 font-medium text-slate-200" v-else>
                    {{ item.type || 'Business' }}
                  </td>

                  <td class="p-3 font-medium text-slate-200" v-if="editingId === item.id">
                    <input type="text" v-model="editForm.senderName" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200" />
                  </td>
                  <td class="p-3 font-medium text-slate-200" v-else>
                    {{ item.senderName }}
                  </td>

                  <td class="p-3 text-slate-300" v-if="editingId === item.id">
                    <input type="text" v-model="editForm.receiverName" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200" />
                  </td>
                  <td class="p-3 text-slate-300" v-else>
                    {{ item.receiverName }}
                  </td>

                  <td class="p-3 text-center font-mono bg-slate-900/30" v-if="editingId === item.id">
                    <input type="number" v-model="editForm.quantity" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 text-center" />
                  </td>
                  <td class="p-3 text-center font-mono bg-slate-900/30" v-else>
                    {{ item.quantity }}
                  </td>

                  <td class="p-3 text-center font-mono" v-if="editingId === item.id">
                    <input type="number" v-model="editForm.emptyQuantity" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 text-center" placeholder="-" />
                  </td>
                  <td class="p-3 text-center font-mono" v-else>
                    <span v-if="item.emptyQuantity !== null" class="text-emerald-400">{{ item.emptyQuantity }}</span>
                    <span v-else class="text-slate-500">-</span>
                  </td>

                  <td class="p-3 text-center font-mono" v-if="editingId === item.id">
                    <input type="number" v-model="editForm.uploadedQuantity" class="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 text-center" placeholder="-" />
                  </td>
                  <td class="p-3 text-center font-mono" v-else>
                    <span v-if="item.uploadedQuantity !== null" class="text-blue-400">{{ item.uploadedQuantity }}</span>
                    <span v-else class="text-slate-500">-</span>
                  </td>

                  <td class="p-3" v-if="editingId === item.id">
                    <!-- Status is read-only or auto updated -->
                    <span class="text-slate-500 text-xs">Auto</span>
                  </td>
                  <td class="p-3" v-else>
                    <span v-if="item.status === 'Completed'" class="text-emerald-400 text-xs font-medium">Completed</span>
                    <span v-else class="text-yellow-400 text-xs font-medium">Pending</span>
                  </td>

                  <td class="p-3 text-right">
                    <div v-if="editingId === item.id" class="flex gap-2 justify-end">
                      <button @click="saveEdit(item.id)" class="text-emerald-400 hover:text-emerald-300 text-xs font-medium">Save</button>
                      <button @click="cancelEdit()" class="text-slate-400 hover:text-slate-300 text-xs font-medium">Cancel</button>
                    </div>
                    <div v-else class="flex gap-3 justify-end">
                      <button @click="startEdit(item)" class="text-blue-400 hover:text-blue-300 transition-colors" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="deleteItem(item.id)" class="text-red-400 hover:text-red-300 transition-colors" title="Hapus">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
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
import 'dayjs/locale/id'

dayjs.locale('id')

const allData = ref([])
const copiedDate = ref(null)
const copiedRowsDate = ref(null)

const editingId = ref(null)
const editForm = ref({
  type: '',
  senderName: '',
  receiverName: '',
  quantity: '',
  emptyQuantity: '',
  uploadedQuantity: ''
})

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

const startEdit = (item) => {
  editingId.value = item.id
  editForm.value = {
    type: item.type || 'Business',
    senderName: item.senderName,
    receiverName: item.receiverName,
    quantity: item.quantity,
    emptyQuantity: item.emptyQuantity !== null ? item.emptyQuantity : '',
    uploadedQuantity: item.uploadedQuantity !== null ? item.uploadedQuantity : ''
  }
}

const cancelEdit = () => {
  editingId.value = null
}

const saveEdit = async (id) => {
  try {
    const payload = { ...editForm.value }
    // If emptyQuantity is empty string, convert to null
    if (payload.emptyQuantity === '') payload.emptyQuantity = null
    if (payload.uploadedQuantity === '') payload.uploadedQuantity = null
    
    await $fetch(`/api/logistics/${id}`, {
      method: 'PUT',
      body: payload
    })
    
    editingId.value = null
    fetchData() // Refresh data
  } catch (error) {
    alert('Failed to save edit')
  }
}

const deleteItem = async (id) => {
  if (!confirm('Yakin ingin menghapus data ini?')) return
  try {
    await $fetch(`/api/logistics/${id}`, {
      method: 'DELETE'
    })
    fetchData() // Refresh data
  } catch (error) {
    alert('Failed to delete item')
  }
}

const formatTime = (dateString) => {
  return dayjs(dateString).format('HH:mm')
}

const formatDateHeader = (dateString) => {
  return dayjs(dateString).format('dddd, DD MMMM YYYY (DD/MM/YYYY)')
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
  const totalUploaded = items.reduce((sum, item) => sum + (item.uploadedQuantity || 0), 0)

  const formattedDate = dayjs(dateKey).format('DD/MM/YYYY')

  const summaryText = `${formattedDate} - Logistic -> Tech
Sender: ${latestSender}
Receiver: ${latestReceiver}
Qty: ${totalQty}
Empty: ${totalEmpty}
Uploaded: ${totalUploaded}`

  try {
    await navigator.clipboard.writeText(summaryText)
    copiedDate.value = dateKey
    setTimeout(() => { copiedDate.value = null }, 2000)
  } catch (err) {
    alert('Failed to copy to clipboard!')
  }
}

const copyRows = async (dateKey, items) => {
  // Sort items by time ascending for row-by-row chronological view
  const sortedItems = [...items].sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf())
  
  if (sortedItems.length === 0) return

  const formattedDate = dayjs(dateKey).format('DD/MM/YYYY')
  
  let rowsText = ''
  
  sortedItems.forEach((item, index) => {
    // Round time to nearest hour or just keep format
    // Based on user request, there's no time in the output
    // Format:
    // 23/06/2026 - Logistic -> Tech
    // Jakarta - Cibubur - Ext Staffinc
    // Sender: Aris
    // Receiver: Angga
    // Qty: 21
    // Empty: 0
    // ================
    
    const emptyStr = item.emptyQuantity !== null ? item.emptyQuantity : '0'
    const typeStr = item.type || 'Business'

    rowsText += `${formattedDate} - Logistic -> Tech\n`
    rowsText += `Jakarta - Cibubur - ${typeStr}\n`
    rowsText += `Sender: ${item.senderName}\n`
    rowsText += `Receiver: ${item.receiverName}\n`
    rowsText += `Qty: ${item.quantity}\n`
    rowsText += `Empty: ${emptyStr}`
    
    if (index < sortedItems.length - 1) {
      rowsText += '\n================\n'
    } else {
      // Also add separator at the very end to match user's exact format structure if preferred,
      // but the user only showed separators between/after.
      rowsText += '\n================'
    }
  })

  try {
    await navigator.clipboard.writeText(rowsText)
    copiedRowsDate.value = dateKey
    setTimeout(() => { copiedRowsDate.value = null }, 2000)
  } catch (err) {
    alert('Failed to copy to clipboard!')
  }
}
</script>
