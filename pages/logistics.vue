<template>
  <div class="max-w-2xl mx-auto py-8">
    <div class="glass-panel p-8">
      <h2 class="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
        Form Logistik / Runner
      </h2>
      <p class="text-sm text-slate-400 mb-6">
        Formulir pelaporan harian untuk serah terima SD Card.
      </p>

      <form @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Tanggal (Date)</label>
          <input type="datetime-local" v-model="form.date" class="input-field" required @change="calculateReceiver" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Tipe / Location</label>
          <input type="text" v-model="form.type" list="type-suggestions" class="input-field" placeholder="Pilih atau ketik tipe (mis: Business, Ext Staffinc)" required />
          <datalist id="type-suggestions">
            <option value="Business"></option>
            <option value="Ext Staffinc"></option>
            <option value="Ext MyRobins"></option>
          </datalist>
        </div>

        <div class="relative">
          <label class="block text-sm font-medium text-slate-300 mb-2">Sender Name</label>
          <input type="text" v-model="form.senderName" class="input-field" placeholder="Masukkan nama pengirim" required autocomplete="off" @focus="showSuggestions = true" @blur="hideSuggestions" />
          
          <!-- Suggestions Dropdown -->
          <ul v-if="showSuggestions && filteredSenders.length > 0" class="absolute z-10 w-full bg-slate-800 border border-slate-700 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl">
            <li v-for="sender in filteredSenders" :key="sender.id" @mousedown="selectSender(sender.name)" class="px-4 py-2 hover:bg-slate-700 cursor-pointer text-slate-200">
              {{ sender.name }}
            </li>
          </ul>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
          <input type="number" v-model="form.quantity" class="input-field" placeholder="Masukkan jumlah SD Cards yang di serahkan" required min="1" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Receiver Name</label>
          <input type="text" v-model="receiverName" class="input-field bg-slate-800/80 text-slate-400 cursor-not-allowed" disabled />
        </div>

        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit Data' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import dayjs from 'dayjs'

const form = ref({
  date: '',
  type: 'Business',
  senderName: '',
  quantity: ''
})

const senders = ref([])
const showSuggestions = ref(false)
const receiverName = ref('Loading...')
const shiftData = ref(null)

const isSubmitting = ref(false)

const fetchSenders = async () => {
  try {
    senders.value = await $fetch('/api/senders')
  } catch (error) {
    console.error('Error fetching senders')
  }
}

const fetchShifts = async (dateStr) => {
  try {
    shiftData.value = await $fetch(`/api/shifts?dateString=${dateStr}`)
    calculateReceiver()
  } catch (error) {
    console.error('Error fetching shifts')
  }
}

const calculateReceiver = () => {
  if (!form.value.date || !shiftData.value) return
  
  const hour = dayjs(form.value.date).hour()
  let currentShift = 'Malam'
  if (hour >= 6 && hour < 14) currentShift = 'Pagi'
  else if (hour >= 14 && hour < 22) currentShift = 'Sore'

  // Try to find shift for today
  const todayShift = shiftData.value.shifts?.find(s => s.shiftType === currentShift)
  if (todayShift) {
    receiverName.value = todayShift.receiverName
    return
  }
  
  // Try to find default shift
  const defaultShift = shiftData.value.defaults?.find(s => s.shiftType === currentShift)
  if (defaultShift) {
    receiverName.value = defaultShift.receiverName
    return
  }

  // Fallback
  receiverName.value = `Penerima ${currentShift} (Default System)`
}

onMounted(async () => {
  form.value.date = dayjs().format('YYYY-MM-DDTHH:mm')
  await fetchSenders()
  await fetchShifts(dayjs().format('YYYY-MM-DD'))
})

// Update shift data when date changes significantly (e.g. new day)
watch(() => form.value.date, (newDate) => {
  if (!newDate) return
  const newDateStr = dayjs(newDate).format('YYYY-MM-DD')
  // We only re-fetch if the day changed. For simplicity, just calculate receiver.
  calculateReceiver()
})

const filteredSenders = computed(() => {
  if (!form.value.senderName) return senders.value
  const query = form.value.senderName.toLowerCase()
  return senders.value.filter(s => s.name.toLowerCase().includes(query))
})

const selectSender = (name) => {
  form.value.senderName = name
  showSuggestions.value = false
}

const hideSuggestions = () => {
  setTimeout(() => showSuggestions.value = false, 200)
}

const submitForm = async () => {
  isSubmitting.value = true
  try {
    await $fetch('/api/logistics', {
      method: 'POST',
      body: {
        type: form.value.type,
        senderName: form.value.senderName,
        receiverName: receiverName.value,
        quantity: form.value.quantity,
        date: form.value.date
      }
    })
    
    // Redirect to success page
    await navigateTo('/success')
  } catch (error) {
    alert('Terjadi kesalahan saat menyimpan data.')
    isSubmitting.value = false
  }
}
</script>
