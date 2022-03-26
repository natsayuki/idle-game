const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

Vue.component('progress-button', {
  props: ['time', 'cd'],
  data: function() {
    return {
      actionTime: 0,
      cooldownTime: 0,
      active: false,
    }
  },
  methods: {
    startAction() {
      this.$data.active = true;
    },
    stopAction() {
      this.$data.active = false;
    },
    getWidth() {
      if(this.$data.cooldownTime <= 0){
        return map(this.$data.actionTime, 0, this.$props.time, 0, 86);
      } else {
        return map(this.$data.cooldownTime, 0, this.$props.cd, 0, 86);
      }
    },
    tick() {
      if(this.$data.active && this.$data.actionTime < parseInt(this.$props.time) && this.$data.cooldownTime <= 0) {
        this.$data.actionTime += .2;
      }
      else if(this.$data.cooldownTime > 0) {
        this.$data.cooldownTime -= .2;
      }
      else if(this.$data.actionTime >= parseInt(this.$props.time)) {
        this.$data.cooldownTime = parseInt(this.$props.cd);
        this.$data.actionTime = 0;
      }
    }
  },
  mounted: function() {
    const self = this
    setInterval(function() {
      self.tick();
    }, 200);
  },
  template: `
<md-button :md-ripple="false" class="progress-button" :disabled="cooldownTime > 0">
  <span class="progress-button-cooldown-bar" :style="'width: ' + getWidth() + 'px'"></span>
  <slot></slot>
  <div class="progress-button-wrapper" @mousedown="startAction" @mouseup="stopAction" @mouseleave="stopAction"></div>
</md-button>
  `
});
