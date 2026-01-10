<script setup lang="ts">
//const config = useRuntimeConfig()
//const apiBase = config.public.apiBase || 'http://localhost:4000'
//const config = useRuntimeConfig()
//await $fetch(`${config.public.apiBase}/notes`)

const config = useRuntimeConfig()
const apiBase = process.server ? config.apiBaseInternal : config.public.apiBase

//const { data: notes } = await useFetch('/notes', { apiBase })

type Note = { id: number; text: string; createdAt: string }

const { data: notes, refresh } = await useFetch<Note[]>(`${apiBase}/notes`)

const newText = ref('')

const { isLoggedIn, authHeaders, logout } = useAuth()

// edit state
const editingId = ref<number | null>(null)
const editText = ref('')
const busyId = ref<number | null>(null)
const busyAdd = ref(false)

const dtf = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short',
  timeStyle: 'medium',
  timeZone: 'Europe/London',
})

const formatDate = (iso: string) => dtf.format(new Date(iso))

async function addNote() {
  if (!newText.value.trim()) return
  busyAdd.value = true
  try {
    await $fetch(`${apiBase}/notes`, {
      method: 'POST',
      body: { text: newText.value },
      headers: authHeaders(),
    })
    newText.value = ''
    await refresh()
  } finally {
    busyAdd.value = false
  }
}

function startEdit(n: Note) {
  editingId.value = n.id
  editText.value = n.text
}

function cancelEdit() {
  editingId.value = null
  editText.value = ''
}

async function saveEdit(id: number) {
  const txt = editText.value.trim()
  if (!txt) return
  busyId.value = id
  try {
    await $fetch(`${apiBase}/notes/${id}`, {
      method: 'PATCH',
      body: { text: txt },
      headers: authHeaders(),
    })
    cancelEdit()
    await refresh()
  } finally {
    busyId.value = null
  }
}

async function deleteNote(id: number) {
  if (!confirm('Delete this note?')) return
  busyId.value = id
  try {
    await $fetch(`${apiBase}/notes/${id}`, { 
      method: 'DELETE', 
      headers: authHeaders(), 
      })
    if (editingId.value === id) cancelEdit()
    await refresh()
  } finally {
    busyId.value = null
  }
}
</script>

<template>
  <main style="max-width: 720px; margin: 40px auto; font-family: system-ui;">
    <h1>Nuxt + Nest + Prisma: Notes</h1>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h1>Notes</h1>
      <div>
        <NuxtLink v-if="!isLoggedIn" to="/login">Login</NuxtLink>
        <button v-else @click="logout()" style="margin-left:10px;">Logout</button>
      </div>
    </div>


    <!-- Add -->
    <div style="display:flex; gap: 8px; margin: 16px 0;">
      <input v-model="newText" placeholder="Write a note..." style="flex:1; padding:10px;" />
      <button @click="addNote" :disabled="busyAdd || !isLoggedIn" style="padding:10px 14px;">
        {{ busyAdd ? 'Adding...' : 'Add' }}
      </button>
    </div>

    <!-- List -->
    <ul v-if="notes" style="padding:0; list-style:none;">
      <li
        v-for="n in notes"
        :key="n.id"
        style="padding:12px; border:1px solid #ddd; border-radius:10px; margin:10px 0;"
      >
        <template v-if="editingId === n.id">
          <div style="display:flex; gap:8px; align-items:center;">
            <input v-model="editText" style="flex:1; padding:10px;" />
            <button
              @click="saveEdit(n.id)"
              :disabled="busyId === n.id || !isLoggedIn"
              style="padding:10px 14px;"
            >
              {{ busyId === n.id ? 'Saving...' : 'Save' }}
            </button>
            <button @click="cancelEdit" :disabled="busyId === n.id" style="padding:10px 14px;">
              Cancel
            </button>
          </div>
        </template>

        <template v-else>
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
            <div style="flex:1;">
              <div>{{ n.text }}</div>
              <small style="opacity:.7;">{{ formatDate(n.createdAt) }}</small>
            </div>

            <div style="display:flex; gap:8px;">
              <button @click="startEdit(n)" :disabled="busyId === n.id || !isLoggedIn" style="padding:8px 10px;">
                Edit
              </button>
              <button @click="deleteNote(n.id)" :disabled="busyId === n.id || !isLoggedIn" style="padding:8px 10px;">
                {{ busyId === n.id ? '...' : 'Delete' }}
              </button>
            </div>
          </div>
        </template>
      </li>
    </ul>
  </main>
</template>
