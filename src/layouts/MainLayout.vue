<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <span @click="$router.push('/')" class="cursor-pointer">
            game-search-quasar
          </span>
        </q-toolbar-title>

        <q-btn icon="favorite" flat to="/?favorites=1" />
        <q-btn
          icon="fab fa-github"
          flat
          type="a"
          target="_blank"
          href="https://github.com/nunogois"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
