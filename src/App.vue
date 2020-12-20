<template>
  <div id="app">
    <header id="header">
      <div id="anime">
        <h1 ref="anime">Animations.js</h1>
      </div>
      <h2>
        Web Animations API based in
        <a title="Animate.css by Daniel Eden" href="https://daneden.github.io/animate.css/">
          Animate.css
        </a>
      </h2>
    </header>

    <div id="control">
      <label>
        <select title="Effects" name="effects" @input="selectAnimes">
          <optgroup v-for="(val, key) in groups" :key="key" :label="key | label">
            <option
              v-for="(anime, index) in val"
              :selected="effect == anime"
              :value="anime"
              :key="index"
              v-text="anime"
            ></option>
          </optgroup>
        </select>
      </label>
      <label>
        <select
          title="The number of times the animation should repeat. Defaults to 1, and can also take a value of Infinity to make it repeat for as long as the element exists."
          name="Iterations"
          @input="selectIterations"
        >
          <optgroup label="Itarations">
            <option
              v-for="(iteration, key) in iterations"
              :selected="timing.iterations == iteration"
              :value="iteration"
              :key="key"
              v-text="iteration"
            ></option>
          </optgroup>
        </select>
      </label>
      <label>
        <select
          title="The number of milliseconds to delay the start of the animation. Defaults to 0."
          name="Delay"
          @input="selectDelay"
        >
          <optgroup label="Delay">
            <option
              v-for="(delay, key) in delays"
              :selected="timing.delay == delay"
              :value="delay"
              :key="key"
              v-text="delay + ' ms'"
            ></option>
          </optgroup>
        </select>
      </label>
      <label>
        <select
          title="Dictates whether the animation's effects should be reflected by the element(s) prior to playing ('backwards'), retained after the animation has completed playing ('forwards'), or both. Defaults to 'none'."
          name="Delay"
          @input="selectFill"
        >
          <optgroup label="Fill">
            <option
              v-for="(fill, key) in fills"
              :selected="timing.fill == fill"
              :value="fill"
              :key="key"
              v-text="fill"
            ></option>
          </optgroup>
        </select>
      </label>
      <label>
        <button title="Go to previous animation" @click="prev">Prev</button>
      </label>
      <label>
        <button title="Go to next animation" @click="next">Next</button>
      </label>
      <label>
        <button
          title="Starts or resumes playing of an animation, or begins the animation again if it previously finished."
          :class="{ active: isPlay }"
          @click="play"
        >
          Play
        </button>
      </label>
      <label>
        <button
          title="Suspends playing of an animation."
          :class="{ active: !isPlay }"
          @click="pause"
        >
          Pause
        </button>
      </label>
      <label
        ><button
          title="Reverses playback direction, stopping at the start of the animation. If the animation is finished or unplayed, it will play from end to beginning."
          :class="{ active: isReverse }"
          @click="reverse"
        >
          Reverse
        </button></label
      >
      <label hidden>
        <button
          v-text="Number(timing.duration / 1000).toFixed(1) + 's'"
          title="Duration animation"
        ></button>
      </label>
      <div class="ranges">
        <label hidden>
          Duration :
          <input
            title="Duration animation"
            @input="duration"
            type="range"
            min="500"
            max="10000"
            step="500"
            :value="timing.duration"
          />
        </label>
        <label>
          Speed :
          <input
            title="Speed animation"
            @input="speed"
            type="range"
            min="0.01"
            max="2"
            :value="playbackRate"
            step="0.01"
          />
        </label>
        <label>
          Timeline :
          <input
            title="Timeline animation"
            @input="scrubber"
            type="range"
            :value="timeline"
            min="0"
            :max="timing.duration"
            step="1"
          />
        </label>
      </div>
    </div>

    <div id="output">
      <pre class="language-js"><code v-html="outputKeyframes"></code></pre>
      <pre class="language-js"><code v-html="output"></code></pre>
    </div>

    <div id="resources">
      <h2>Resources</h2>
      <ul id="resources-list">
        <li>
          <a
            title="MDN - Web Animations API"
            href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API"
            >MDN - Web Animations API</a
          >
          <span>•</span>
        </li>
        <li>
          <a
            title="Web Animations API resources including Alice in Web Animations API Land, recorded talks and documentation"
            href="http://rachelnabors.com/waapi"
            >Rachel Nabors</a
          >
          <span>•</span>
        </li>
        <li>
          <a
            title="Css tricks - CSS Animations vs Web Animations API"
            href="https://css-tricks.com/css-animations-vs-web-animations-api/"
            >Css tricks - CSS Animations vs Web Animations API</a
          >
          <span>•</span>
        </li>
        <li>
          <a
            title="Tutorial series on the Web Animations API by Daniel C. Wilson"
            href="https://danielcwilson.com/tags/web-animations-api/"
            >Daniel C. Wilson</a
          >
          <span>•</span>
        </li>
        <li>
          <a title="Animate.css by Daniel Eden" href="http://daneden.github.io/animate.css"
            >Animate.css
          </a>
        </li>
      </ul>
    </div>

    <footer id="footer">
      <p>
        <a
          title="Download code source"
          href="https://github.com/robertoentringer/animations.js/raw/master/animations.js"
          >Download Animations.js</a
        >
        or
        <a title="View on GitHub" href="https://github.com/robertoentringer/animations.js"
          >View on GitHub</a
        >. <small>🛠</small> with
        <a title="Vue.js - The Progressive JavaScript Framework." href="https://vuejs.org/">
          Vue.js
        </a>
        <small>❤️</small>. By
        <a title="Roberto Entringer Full-stack Web Developer" href="https://robertoentringer.com"
          >Roberto Entringer</a
        >.
      </p>
    </footer>
  </div>
</template>

<script>
import 'web-animations-js'
import Prism from 'prismjs'
import { groups, animations } from 'animations.js'
export default {
  name: 'app',
  frameID: null,
  data() {
    return {
      groups,
      animations,
      effect: null,
      timing: {
        duration: 1000,
        fill: 'forwards',
        iterations: 1,
        delay: 0,
        endDelay: 0
      },
      animate: null,
      index: 0,
      playbackRate: 1,
      isPlay: true,
      iterations: [1, 2, 3, 4, 5, 'Infinity'],
      delays: [0, 500, 1000, 1500, 2000, 2500, 3000],
      fills: ['none', 'forwards', 'backwards', 'both', 'auto'],
      isReverse: false,
      timeline: 0
    }
  },
  mounted() {
    this.effect = this.effect || this.effects[this.index]
    this.index = this.effects.indexOf(this.effect)
    this.anime()
  },
  computed: {
    outputKeyframes() {
      let code = `const ${this.effect} = ${this.format(this.keyframes)};`
      code = code.replace(/"([^(")"]+)":/g, '$1:')
      return Prism.highlight(code, Prism.languages.javascript, 'javascript')
    },
    output() {
      let code = `const timing = ${this.format(this.timing)};`
      code += `\n\nelement.animate(\n  ${this.effect},\n  timing\n);`
      code = code.replace(/"([^(")"]+)":/g, '$1:')
      return Prism.highlight(code, Prism.languages.javascript, 'javascript')
    },
    size() {
      return this.effects.length
    },
    effects() {
      return [].concat(...Object.values(this.groups))
    },
    keyframes() {
      return this.animations[this.effect]
    }
  },
  filters: {
    label(val) {
      return val.charAt(0).toUpperCase() + val.slice(1).replace('_', ' ')
    }
  },
  methods: {
    format(content) {
      return JSON.stringify(content, null, 2)
    },
    selectAnimes(e) {
      this.index = this.effects.indexOf(e.target.value)
      this.effect = e.target.value
      this.anime()
    },
    selectIterations(e) {
      this.timing.iterations = e.target.value === 'Infinity' ? Infinity : Number(e.target.value)
      this.anime()
    },
    selectDelay(e) {
      this.timing.delay = Number(e.target.value)
      this.anime()
    },
    selectFill(e) {
      this.timing.fill = e.target.value
      this.anime()
    },
    duration(e) {
      this.timing.duration = e.target.value * 1
      this.anime()
    },
    play() {
      this.animate.play()
      this.isPlay = true
      this.adjustScrubber()
    },
    pause() {
      this.animate.pause()
      this.isPlay = false
      cancelAnimationFrame(this.$options.frameID)
    },
    reverse() {
      this.animate.reverse()
      this.isPlay = true
      this.isReverse = !this.isReverse
      this.adjustScrubber()
    },
    next() {
      this.index = this.index == this.size - 1 ? 0 : this.index + 1
      this.effect = this.effects[this.index]
      this.anime()
    },
    prev() {
      this.index = this.index == 0 ? this.size - 1 : this.index - 1
      this.effect = this.effects[this.index]
      this.anime()
    },
    anime() {
      if (this.animate) this.animate.cancel()
      this.animate = this.$refs.anime.animate(this.keyframes, this.timing)
      this.adjustScrubber()
      this.animate.playbackRate = this.playbackRate
      this.isPlay = true
      if (this.isReverse) this.animate.reverse()
      this.animate.onfinish = this.finish
    },
    speed(e) {
      this.playbackRate = Number(e.target.value)
      this.animate.playbackRate = this.playbackRate
      if (this.animate.playState !== 'running') this.play()
    },
    finish() {
      this.isPlay = false
      this.timeline = this.animate.currentTime
      cancelAnimationFrame(this.$options.frameID)
    },
    scrubber(e) {
      this.timeline = Number(e.target.value)
      this.animate.currentTime = this.timeline * this.timing.iterations
      this.animate.pause()
      cancelAnimationFrame(this.$options.frameID)
    },
    adjustScrubber() {
      if (this.timeline && Math.abs(this.timeline) == this.animate.currentTime) this.finish()
      else this.timeline = this.animate.currentTime / this.timing.iterations - this.timing.delay
      this.$options.frameID = requestAnimationFrame(this.adjustScrubber)
    }
  }
}
</script>

<style src="normalize.css"></style>
<style src="prismjs/themes/prism-okaidia.css"></style>
<style lang="scss">
$text-color: #333;
$border-color: #ccc;
$title-color: #9c27b0;
$bg-button: #fff;
* {
  outline: none;
}
[hidden] {
  display: none;
}
body {
  color: $text-color;
  background-color: hsla(0, 0, 0, 0.02);
}
small {
  font-size: 0.7rem;
}
a {
  text-decoration: none;
  color: lighten($text-color, 20%);
  &:hover {
    text-decoration: underline;
  }
}
h2 {
  font-weight: 300;
}
input {
  display: block;
  width: 100%;
  margin: 1rem 0;
}
select,
button {
  -webkit-appearance: none;
  padding: 1rem;
  background: none;
  border: 1px solid $border-color;
  border-radius: 4px;
  text-align-last: center;
  font-size: 1rem;
  width: 100%;
  &[name='effects'] {
    text-transform: capitalize;
  }
  background-color: $bg-button;
  &:focus,
  & {
    color: $text-color;
  }
  &:hover {
    cursor: pointer;
    border-color: darken($border-color, 20%);
  }
}
#app {
  padding: 0 1rem;
}
#header {
  margin-top: 8vh;
  margin-bottom: 4vh;
}
#footer {
  margin-top: 4vh;
  padding: 2vh 0;
  border-top: 1px solid $border-color;
}
#output {
  margin-top: 2vh;
  margin-bottom: 4vh;
}
#resources {
  text-align: left;
  h2 {
    margin-bottom: 0.5rem;
  }
}
#resources-list {
  padding: 0;
  margin: 0;
  list-style: none;
}
#resources-list li {
  display: inline;
  span {
    display: inline-block;
    padding: 0 0.5rem;
    font-size: 1.5rem;
    vertical-align: middle;
  }
}
#header,
#control,
#output,
#resources,
#footer {
  width: 100%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
#output {
  display: flex;
  overflow: hidden;
  pre {
    height: 30rem;
    overflow: auto;
    max-width: 100%;
    margin: 0;
    &:first-child {
      margin: 0 0.4rem 0 0;
      flex: 1;
    }
  }
}
#anime {
  backface-visibility: visible;
  pointer-events: none;
  margin-bottom: 1rem;
  h1 {
    margin: 0;
    font-weight: 100;
    color: $title-color;
    font-size: 8vw;
    line-height: 0.7;
    display: inline-block;
  }
}
#header {
  h2 {
    margin: 0;
    padding: 0;
  }
}
#control {
  display: flex;
  flex-wrap: wrap;
  .active {
    background-color: lighten($border-color, 8%);
  }
  label {
    &:hover .icon {
      opacity: 1;
    }
    line-height: 0;
    padding: 0.2rem;
    flex: 1 1 auto;
  }
  .ranges {
    width: 100%;
    margin: 2rem 0 0;
    display: flex;
  }
}
#output {
  padding: 0 0.25rem;
  box-sizing: border-box;
  code {
    max-height: 30rem;
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
