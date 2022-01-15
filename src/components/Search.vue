<template>
  <q-input
    v-model="input"
    type="search"
    debounce="500"
    outlined
    placeholder="Search"
    dense
    class="fit q-px-md q-pt-md"
    clearable
    @keydown.enter.prevent="search"
    @clear="search"
  >
    <template v-slot:append>
      <q-btn icon="search" flat dense @click="search" />
    </template>
  </q-input>
  <q-list bordered separator class="fit q-mx-md" v-if="suggestedGames.length">
    <q-item
      v-for="game in suggestedGames"
      :key="game.id"
      class="cursor-pointer"
      :to="`/game/${game.id}`"
    >
      <img
        :src="game.cover?.url?.replace('t_thumb', 't_cover_big_2x')"
        style="max-height: 50px"
      />
      <div class="flex items-center">
        <span class="q-ml-md">{{ game.name }}</span>
      </div>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import { Game } from './models'
import { api } from '../boot/axios'

export default defineComponent({
  emits: ['search'],
  setup(_, ctx) {
    const input = ref('')
    const suggestedGames = ref<Game[]>([])

    watch(input, async () => {
      await loadGameSuggestions(input.value)
    })

    const loadGameSuggestions = async (search: string) => {
      suggestedGames.value = []
      if (search) {
        const response = await api.get(`/games?search=${search}`)
        suggestedGames.value = response.data as Game[]
      }
    }

    const search = () => {
      suggestedGames.value = []
      ctx.emit('search', input.value)
    }

    return {
      input,
      suggestedGames,
      search
    }
  }
})
</script>
