<template>
  <div id="app">
    <div class="anime"><h1 ref="anime">Animations.js</h1></div>
    <h2>
      Web Animations API based in
      <a
        title="Animate.css by Daniel Eden"
        href="https://daneden.github.io/animate.css/"
      >
        Animate.css
      </a>
    </h2>
    <div class="control">
      <label>
        <select title="Effects" name="effects" @input="selectAnimes">
          <optgroup
            v-for="(val, key) in groups"
            :key="key"
            :label="key | label"
          >
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
        <select title="Iterations" name="Iterations" @input="selectIterations">
          <optgroup label="Itarations">
            <option
              v-for="(iteration, key) in iterations"
              :selected="timing.iterations == iteration"
              :value="iteration"
              :key="key"
              v-text="iteration"
            >
            </option>
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
          title="Play animation"
          :class="{ active: isPlay }"
          @click="play"
        >
          Play
        </button>
      </label>
      <label>
        <button
          title="Pause animation"
          :class="{ active: !isPlay }"
          @click="pause"
        >
          Pause
        </button>
      </label>
      <label
        ><button
          title="Reverse animation"
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
      <div>
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
          Scrubber :
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
    <p>
      <a
        title="Download code source"
        href="https://github.com/robertoentringer/animations.js/raw/master/animations.js"
        >Download Animations.js</a
      >
      or
      <a
        title="View on GitHub"
        href="https://github.com/robertoentringer/animations.js"
        >View on GitHub</a
      >. <small>🛠</small> with
      <a
        title="Vue.js - The Progressive JavaScript Framework."
        href="https://vuejs.org/"
      >
        Vue.js
      </a>
      <small>❤️</small>. By
      <a
        title="Roberto Entringer Full-stack Web Developer"
        href="https://robertoentringer.com"
        >Roberto Entringer</a
      >.
    </p>
  </div>
</template>

<script>
import "web-animations-js";
import { groups, animations } from "animations.js";
export default {
  name: "app",
  frameID: null,
  data() {
    return {
      groups,
      animations,
      effect: null,
      timing: {
        duration: 1000,
        fill: "forwards",
        iterations: 1
      },
      animate: null,
      index: 0,
      playbackRate: 1,
      isPlay: true,
      iterations: [1, 2, 3, 4, 5, "Infinity"],
      isReverse: false,
      timeline: 0
    };
  },
  mounted() {
    this.effect = this.effect || this.effects[this.index];
    this.index = this.effects.indexOf(this.effect);
    this.anime();
  },
  computed: {
    size() {
      return this.effects.length;
    },
    effects() {
      return [].concat(...Object.values(this.groups));
    },
    keyframes() {
      return this.animations[this.effect];
    }
  },
  filters: {
    label(val) {
      return val.charAt(0).toUpperCase() + val.slice(1).replace("_", " ");
    }
  },
  methods: {
    selectAnimes(e) {
      this.index = this.effects.indexOf(e.target.value);
      this.effect = e.target.value;
      this.anime();
    },
    selectIterations(e) {
      this.timing.iterations =
        e.target.value === "Infinity" ? Infinity : Number(e.target.value);
      this.anime();
    },
    duration(e) {
      this.timing.duration = e.target.value * 1;
      this.anime();
    },
    play() {
      this.animate.play();
      this.isPlay = true;
      this.adjustScrubber();
    },
    pause() {
      this.animate.pause();
      this.isPlay = false;
      cancelAnimationFrame(this.$options.frameID);
    },
    reverse() {
      this.animate.reverse();
      this.isPlay = true;
      this.isReverse = !this.isReverse;
      this.adjustScrubber();
    },
    next() {
      this.index = this.index == this.size - 1 ? 0 : this.index + 1;
      this.effect = this.effects[this.index];
      this.anime();
    },
    prev() {
      this.index = this.index == 0 ? this.size - 1 : this.index - 1;
      this.effect = this.effects[this.index];
      this.anime();
    },
    anime() {
      if (this.animate) this.animate.cancel();
      this.animate = this.$refs.anime.animate(this.keyframes, this.timing);
      this.adjustScrubber();
      this.animate.playbackRate = this.playbackRate;
      this.isPlay = true;
      if (this.isReverse) this.animate.reverse();
      this.animate.onfinish = this.finish;
    },
    speed(e) {
      this.playbackRate = Number(e.target.value);
      this.animate.playbackRate = this.playbackRate;
      if (this.animate.playState !== "running") this.play();
    },
    finish() {
      this.isPlay = false;
      this.timeline = this.animate.currentTime;
      cancelAnimationFrame(this.$options.frameID);
    },
    scrubber(e) {
      this.timeline = Number(e.target.value);
      this.animate.currentTime = this.timeline * this.timing.iterations;
      this.animate.pause();
      cancelAnimationFrame(this.$options.frameID);
    },
    adjustScrubber() {
      if (this.timeline && Math.abs(this.timeline) == this.animate.currentTime)
        this.finish();
      else this.timeline = this.animate.currentTime / this.timing.iterations;
      this.$options.frameID = requestAnimationFrame(this.adjustScrubber);
    }
  }
};
</script>

<style src="normalize.css"></style>
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}
#app {
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
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
    margin: 0 0 8vh;
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
    text-transform: capitalize;
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
  .anime {
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
  .icon {
    opacity: 0.45;
    display: inline-block;
    vertical-align: middle;
    line-height: 0;
  }
  .control {
    display: flex;
    flex-wrap: wrap;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 4vh;
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
    div {
      width: 100%;
      margin: 2rem 0.2rem 0;
      display: flex;
    }
  }
}
</style>
