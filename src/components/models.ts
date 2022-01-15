export interface Game {
  id: number
  cover: {
    url: string
  }
  first_release_date: number
  name: string
  platforms: Platform[]
  total_rating: number
}

export interface GameDetails extends Game {
  game_modes: GameMode[]
  genres: Genre[]
  involved_companies: Company[]
  screenshots: Screenshot[]
  similar_games: Game[]
  summary: string
  themes: Theme[]
  url: string
}

interface Platform {
  abbreviation: string
  name: string
}

interface GameMode {
  name: string
}

interface Genre {
  name: string
}

interface Company {
  company: {
    name: string
  }
}

interface Screenshot {
  url: string
}

interface Theme {
  name: string
}
