<template>
  <q-page class="column items-center">
    <div style="max-width: 700px">
      <search @search="loadGames" />
      <div class="fit flex items-center justify-center" v-if="loading">
        <q-spinner-tail color="primary" size="10em" />
      </div>
      <div v-else class="fit">
        <div v-if="games.length">
          <game-card
            v-for="game in games"
            :key="game.id"
            :game="game"
            class="cursor-pointer"
          />
        </div>
        <div v-else class="fit flex items-center justify-center">
          <h4>No games found.</h4>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

import { api } from '../boot/axios'

import { Game } from '../components/models'
import Search from '../components/Search.vue'
import GameCard from '../components/GameCard.vue'

export default defineComponent({
  components: { Search, GameCard },
  setup() {
    const $q = useQuasar()
    const route = useRoute()

    const loading = ref(true)
    const games = ref<Game[]>([])

    watch(route, async () => {
      await loadGames()
    })

    const loadGames = async (search = '') => {
      loading.value = true

      if (route.query.favorites) {
        games.value = $q.localStorage.getItem('favorites') as Game[]
      } else {
        search = search ? `?search=${search}` : ''

        const response = await api.get('/games' + search)
        games.value = response.data as Game[]
      }
      loading.value = false
    }

    onMounted(async () => {
      await loadGames()
    })

    return {
      loading,
      games,
      loadGames
    }
  }
})
</script>
