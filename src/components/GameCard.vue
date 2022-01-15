<template>
  <q-card class="q-ma-md" style="height: 200px">
    <q-card-section horizontal class="fit">
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
          readonly
          size="1.5em"
          :max="5"
          icon-half="star_half"
          color="primary"
        />
        <span>{{ game.platforms?.map((p) => p.abbreviation).join(', ') }}</span>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'

import { Game } from './models'

export default defineComponent({
  props: {
    game: {
      type: Object as PropType<Game>,
      required: true
    }
  },
  setup(props) {
    const totalRating = computed(() => {
      const { total_rating } = props.game
      return (5 * total_rating) / 100
    })

    return {
      totalRating
    }
  }
})
</script>
