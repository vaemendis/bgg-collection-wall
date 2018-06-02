'use strict'

var GameComponent = {
  props: ['game'],
  template:
    `<div class="cell">
      <div class="game">
        <a :href="gameUrl">
          <div class=thumb>          
              <img :src="game.thumbnail"/>          
          </div>
          <div class="label">
            {{game.name}}
          </div>
        </a>
      </div>
    </div>`,
    computed: {
      gameUrl(){
        return `https://boardgamegeek.com/boardgame/${this.game.gameId}`
      }
    }
}

const gameVue = new Vue({
  el: '#wall',
  data: {
    loaded: false,
    games: [],
    error: null
  },
  components: {
    game: GameComponent
  },
  methods: {
    getUrlParam(paramName) {
      var searchParams = new URLSearchParams(window.location.search)
      return searchParams.get(paramName)
    }
  },
  mounted() {
    let user = this.getUrlParam('user')
    document.title = `BGG Wall - ${user}'s collection`
    fetchJsonp(`https://bgg-json.azurewebsites.net/collection/${user}`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        // keep only owned games
        this.games = json.filter(g => {return g.owned})
        this.loaded = true
      })
      .catch((error) => {
        this.error = error.message
        this.loaded = true
      })
  }
})
