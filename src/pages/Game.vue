<template>
  <q-page class="row items-start">
    <div class="fullscreen flex items-center justify-center" v-if="!game">
      <q-spinner-tail color="primary" size="10em" />
    </div>
    <div v-else class="q-ma-md">
      <div class="text-center">
        <img
          :src="game.cover?.url.replace('t_thumb', 't_original')"
          class="q-ma-md"
          style="max-height: 400px"
        />
      </div>
      <h3 class="text-center">{{ game.name }}</h3>
      <h4 class="text-center">
        {{ game.involved_companies?.map((c) => c.company.name).join(', ') }}
      </h4>
      <div class="text-center" v-if="totalRating >= 0">
        <q-rating
          v-model="totalRating"
          readonly
          size="1.5em"
          :max="5"
          icon-half="star_half"
          color="primary"
        />
      </div>
      <div class="text-center q-mt-lg">
        <q-btn
          :label="isFavorite ? 'Remove as Favorite' : 'Add as Favorite'"
          icon="favorite"
          color="red"
          :elevated="!isFavorite"
          :outline="isFavorite"
          @click="toggleFavorite(game)"
        />
      </div>
      <h5>Description</h5>
      <p>
        {{ game.summary }}
      </p>
      <h5>Information</h5>
      <ul class="q-pl-none">
        <li v-for="(value, key) in info" :key="key">
          <span class="text-weight-bold">{{ key }}:</span> {{ value }}
        </li>
        <li>
          <span class="text-weight-bold">IGDB: </span>
          <a :href="game.url" target="_blank">Open on IGDB</a>
        </li>
      </ul>
      <h5>Screenshots</h5>
      <q-responsive :ratio="16 / 9" style="max-width: 700px; margin: auto">
        <q-carousel
          swipeable
          animated
          arrows
          thumbnails
          ref="screenshotCarousel"
          infinite
          v-model="currentScreenshot"
          v-model:fullscreen="fullscreen"
        >
          <q-carousel-slide
            v-for="(screenshot, index) in game.screenshots"
            :key="index"
            :name="index"
            :img-src="screenshot.url.replace('t_thumb', 't_original')"
            class="cursor-pointer"
            @click="fullscreen = !fullscreen"
          />
        </q-carousel>
      </q-responsive>
      <h5>Similar Games</h5>
      <q-responsive :ratio="9 / 12" style="max-width: 300px; margin: auto">
        <q-carousel
          swipeable
          animated
          arrows
          thumbnails
          infinite
          v-model="currentSimilarGame"
        >
          <q-carousel-slide
            v-for="(similarGame, index) in game.similar_games"
            class="cursor-pointer"
            :key="index"
            :name="index"
            :img-src="
              similarGame.cover.url.replace('t_thumb', 't_cover_big_2x')
            "
            @click="$router.push('/game/' + similarGame.id)"
          />
        </q-carousel>
      </q-responsive>
    </div>
  </q-page>
</template>

<script lang="ts">
import { QCarousel } from 'quasar'
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

import { api } from '../boot/axios'

import { Game, GameDetails } from '../components/models'

export default defineComponent({
  setup() {
    const $q = useQuasar()

    const game = ref<GameDetails>()
    const currentScreenshot = ref(0)
    const currentSimilarGame = ref(0)
    const fullscreen = ref(false)
    const screenshotCarousel = ref<QCarousel>()
    const favorites = ref<Game[]>($q.localStorage.getItem('favorites') || [])

    const route = useRoute()

    watch(route, async () => {
      game.value = undefined
      await loadGame()
    })

    const totalRating = computed(() => {
      if (game.value) {
        const { total_rating } = game.value
        return (5 * total_rating) / 100
      }
      return -1
    })

    const isFavorite = computed(() => {
      if (game.value) {
        return favorites.value.filter((f) => f.id === game.value?.id).length > 0
      }
      return false
    })

    const info = computed(() => {
      if (game.value) {
        return {
          Release: game.value.first_release_date
            ? new Date(game.value.first_release_date * 1000)
                .toISOString()
                .split('T')[0]
            : '',
          Platforms: game.value.platforms?.map((p) => p.name).join(', '),
          Modes: game.value.game_modes?.map((m) => m.name).join(', '),
          Genre: game.value.genres?.map((g) => g.name).join(', '),
          Themes: game.value.themes?.map((p) => p.name).join(', ')
        }
      }
      return {}
    })

    const toggleFavorite = (gameDetails?: GameDetails) => {
      favorites.value = $q.localStorage.getItem('favorites') || []
      const game = gameDetails as Game
      if (game && favorites.value.filter((f) => f.id === game.id).length)
        favorites.value = favorites.value.filter((f) => f.id !== game.id)
      else favorites.value = [...favorites.value, game]
      $q.localStorage.set('favorites', favorites.value)
    }

    const loadGame = async () => {
      const response = await api.get(`/games?id=${route.params.id as string}`)
      game.value = (response.data as Game[])[0] as GameDetails
    }

    onMounted(async () => {
      await loadGame()

      window.addEventListener('keydown', (e) => {
        if (screenshotCarousel.value && fullscreen.value) {
          if (e.key === 'ArrowRight') screenshotCarousel.value.next()
          else if (e.key === 'ArrowLeft') screenshotCarousel.value.previous()
          else if (e.key === 'Escape') fullscreen.value = false
        }
      })
    })

    return {
      totalRating,
      info,
      currentScreenshot,
      fullscreen,
      currentSimilarGame,
      screenshotCarousel,
      isFavorite,
      toggleFavorite,
      game
    }
  }
})
</script>

<style lang="sass">
ul
  list-style: none
</style>
