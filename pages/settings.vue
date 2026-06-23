<template>
  <div class="max-w-6xl mx-auto py-8 space-y-8">
    <div class="glass-panel p-8">
      <h2 class="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
        Pengaturan Shift & Receiver
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form Set Shift -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-slate-200">Set Jadwal Receiver</h3>
          <form @submit.prevent="saveShift" class="space-y-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Tanggal (atau pilih Default)</label>
              <div class="flex gap-4">
                <input type="date" v-model="shiftForm.dateString" :disabled="shiftForm.isDefault" class="input-field flex-1" />
                <label class="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" v-model="shiftForm.isDefault" class="rounded bg-slate-800 border-slate-600 text-pink-500 focus:ring-pink-500" />
                  Default Shift
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Shift</label>
              <select v-model="shiftForm.shiftType" class="input-field" required>
                <option value="Pagi">Pagi (06:00 - 13:59)</option>
                <option value="Sore">Sore (14:00 - 21:59)</option>
                <option value="Malam">Malam (22:00 - 05:59)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Nama Receiver</label>
              <input type="text" v-model="shiftForm.receiverName" class="input-field" placeholder="Masukkan nama penerima shift ini" required />
            </div>

            <button type="submit" class="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all active:scale-[0.98]" :disabled="isSavingShift">
              {{ isSavingShift ? 'Menyimpan...' : 'Simpan Shift' }}
            </button>
            
            <div v-if="shiftMsg" class="text-sm text-emerald-400 mt-2">{{ shiftMsg }}</div>
          </form>
        </div>

        <!-- Daftar Shift -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-slate-200">Daftar Jadwal Shift</h3>
          <div class="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden max-h-[400px] overflow-y-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-800 sticky top-0">
                <tr>
                  <th class="p-3 font-medium text-slate-300 border-b border-slate-700">Tanggal</th>
                  <th class="p-3 font-medium text-slate-300 border-b border-slate-700">Shift</th>
                  <th class="p-3 font-medium text-slate-300 border-b border-slate-700">Receiver</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/50">
                <tr v-if="allShifts.length === 0">
                  <td colspan="3" class="p-4 text-center text-slate-400">Belum ada jadwal.</td>
                </tr>
                <tr v-for="shift in allShifts" :key="shift.id" class="hover:bg-slate-700/30">
                  <td class="p-3">
                    <span v-if="shift.dateString === 'default'" class="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs font-semibold">DEFAULT</span>
                    <span v-else>{{ shift.dateString }}</span>
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-1 bg-slate-700 rounded text-xs">{{ shift.shiftType }}</span>
                  </td>
                  <td class="p-3 font-medium">{{ shift.receiverName }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Senders List -->
    <div class="glass-panel p-8">
      <h2 class="text-2xl font-bold mb-4 text-slate-200">Daftar Sender Tersimpan</h2>
      <p class="text-sm text-slate-400 mb-6">Sender di bawah ini akan otomatis muncul sebagai *suggestion* di form logistik.</p>
      
      <div class="flex flex-col gap-3">
        <div v-for="sender in senders" :key="sender.id" class="flex items-center gap-4 bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          
          <div v-if="editingSenderId === sender.id" class="flex-1 flex gap-2">
            <input type="text" v-model="editSenderName" class="input-field flex-1 py-1" />
            <button @click="saveSender(sender.id)" class="text-emerald-400 hover:text-emerald-300 text-sm font-medium px-2">Save</button>
            <button @click="cancelEditSender()" class="text-slate-400 hover:text-slate-300 text-sm font-medium px-2">Cancel</button>
          </div>
          
          <div v-else class="flex-1 flex justify-between items-center">
            <span class="font-medium text-slate-200">{{ sender.name }}</span>
            <div class="flex gap-2">
              <button @click="startEditSender(sender)" class="text-blue-400 hover:text-blue-300 p-1" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="deleteSender(sender.id)" class="text-red-400 hover:text-red-300 p-1" title="Hapus">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="senders.length === 0" class="text-slate-500 text-sm italic py-4">
          Belum ada sender yang tersimpan.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import dayjs from 'dayjs'

const shiftForm = ref({
  isDefault: false,
  dateString: dayjs().format('YYYY-MM-DD'),
  shiftType: 'Pagi',
  receiverName: ''
})

const isSavingShift = ref(false)
const shiftMsg = ref('')
const allShifts = ref([])
const senders = ref([])

const editingSenderId = ref(null)
const editSenderName = ref('')

const startEditSender = (sender) => {
  editingSenderId.value = sender.id
  editSenderName.value = sender.name
}

const cancelEditSender = () => {
  editingSenderId.value = null
  editSenderName.value = ''
}

const saveSender = async (id) => {
  if (!editSenderName.value.trim()) return
  try {
    await $fetch(`/api/senders/${id}`, {
      method: 'PUT',
      body: { name: editSenderName.value }
    })
    editingSenderId.value = null
    fetchSenders() // Refresh
  } catch (error) {
    alert('Failed to update sender')
  }
}

const deleteSender = async (id) => {
  if (!confirm('Yakin ingin menghapus sender ini?')) return
  try {
    await $fetch(`/api/senders/${id}`, {
      method: 'DELETE'
    })
    fetchSenders() // Refresh
  } catch (error) {
    alert('Failed to delete sender')
  }
}

const fetchShifts = async () => {
  try {
    allShifts.value = await $fetch('/api/shifts')
  } catch (error) {
    console.error('Error fetching shifts')
  }
}

const fetchSenders = async () => {
  try {
    senders.value = await $fetch('/api/senders')
  } catch (error) {
    console.error('Error fetching senders')
  }
}

onMounted(() => {
  fetchShifts()
  fetchSenders()
})

const saveShift = async () => {
  isSavingShift.value = true
  shiftMsg.value = ''
  
  const dateStr = shiftForm.value.isDefault ? 'default' : shiftForm.value.dateString

  try {
    await $fetch('/api/shifts', {
      method: 'POST',
      body: {
        dateString: dateStr,
        shiftType: shiftForm.value.shiftType,
        receiverName: shiftForm.value.receiverName
      }
    })
    shiftMsg.value = 'Jadwal berhasil disimpan!'
    shiftForm.value.receiverName = ''
    fetchShifts()
    setTimeout(() => shiftMsg.value = '', 3000)
  } catch (error) {
    alert('Terjadi kesalahan saat menyimpan shift.')
  } finally {
    isSavingShift.value = false
  }
}
</script>
