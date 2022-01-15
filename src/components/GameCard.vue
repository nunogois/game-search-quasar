<template>
  <q-card class="q-ma-md" style="height: 200px">
    <q-card-section
      horizontal
      class="fit"
      @click="$router.push(`/game/${game.id}`)"
    >
      <q-card-section class="q-pa-none">
        <img
          :src="game.cover?.url.replace('t_thumb', 't_cover_big_2x')"
          style="
            height: 100%;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          "
        />
      </q-card-section>
      <q-card-section class="column justify-between">
        <h5 class="q-ma-none">{{ game.name }}</h5>
        <span>{{
          game.first_release_date
            ? new Date(game.first_release_date * 1000)
                .toISOString()
                .split('T')[0]
            : ''
        }}</span>
        <q-rating
          v-model="totalRating"
          v-if="totalRating > -1"
          readonly
          size="1.5em"
          :max="5"
          icon-half="star_half"
          color="primary"
        />
        <span>{{
          game.platforms?.map((p) => p.abbreviation || p.name).join(', ')
        }}</span>
      </q-card-section>
      <q-card-section style="flex: 1; text-align: right">
        <q-btn
          :icon="
            favorites.filter((f) => f.id === game.id).length
              ? 'favorite'
              : 'favorite_border'
          "
          flat
          color="red-9"
          round
          @click.stop="toggleFavorite(game)"
        />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'

import { useQuasar } from 'quasar'

import { Game } from './models'

export default defineComponent({
  props: {
    game: {
      type: Object as PropType<Game>,
      required: true
    }
  },
  setup(props) {
    const $q = useQuasar()

    const totalRating = computed(() => {
      const { total_rating } = props.game
      return total_rating ? (5 * total_rating) / 100 : -1
    })

    const favorites = ref<Game[]>($q.localStorage.getItem('favorites') || [])

    const toggleFavorite = (game: Game) => {
      favorites.value = $q.localStorage.getItem('favorites') || []
      if (favorites.value.filter((f) => f.id === game.id).length)
        favorites.value = favorites.value.filter((f) => f.id !== game.id)
      else favorites.value = [...favorites.value, game]
      $q.localStorage.set('favorites', favorites.value)
    }

    return {
      favorites,
      totalRating,
      toggleFavorite
    }
  }
})
</script>
