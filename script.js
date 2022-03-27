const recipies = [
  {
    name: 'picaxe',
    cost: {
      'sticks': 10,
      'rocks': 5,
    },
    unlock: {
      'sticks': 1,
      'rocks': 1,
    }
  },
  {
    name: 'spear',
    cost: {
      'sticks': 5,
      'rocks': 5,
    },
    unlock: {
      'sticks': 1,
      'rocks': 1,
    }
  },
  {
    name: 'campfire',
    cost: {
      'sticks': 5,
      'rocks': 10,
      'leaves': 25,
    },
    unlock: {
      'sticks': 5,
      'rocks': 5,
      'leaves': 5,
    }
  }
]

const data = {
  items: {},
  refresh: 0,
  unlockedRecipies: [],
  log: [],
  storyIndex: 0,
}

const methods = {
  hello() {
    console.log('hello');
  },
  give(item) {
    if(typeof data.items[item] == 'undefined') data.items[item] = 1;
    else data.items[item]++;
    recipies.forEach(recipe => {
      let done = true;
      Object.keys(recipe.unlock).forEach(item => {
        if(data.items[item] < recipe.unlock[item] || data.unlockedRecipies.indexOf(recipe) != -1) done = false
      });
      if(done) data.unlockedRecipies.push(recipe)
    });

    if(item == 'campfire') {
      methods.progressStory();
    }

    data.refresh++;
  },
  giveOption(options) {
    methods.give(options[Math.floor(Math.random() * options.length)]);
  },
  canAfford(item) {
    let done = true;
    data.unlockedRecipies.forEach(recipe => {
      if(recipe.name == item){
        Object.keys(recipe.cost).forEach(cost => {
          if(data.items[cost] < recipe.cost[cost]) done = false;
        });
      }
    });
    return done
  },
  craft(item) {
    data.unlockedRecipies.forEach(recipe => {
      if(recipe.name == item && methods.canAfford(item)) {
        Object.keys(recipe.cost).forEach(cost => {
          data.items[cost] -= recipe.cost[cost];
        });
        methods.give(item);
      }
    });
  },
  progressStory() {
    data.storyIndex++;
    if(data.storyIndex == 1) {
      data.log.push({
        dialogue: `a weathered looking man lets himself a spot near your campfire. he puts his hands out at the fire to warm them up.`
      })
    }
  },
  gather() {
    for(let i = 0; i < 5; i++) {
      methods.giveOption(['sticks', 'rocks', 'leaves']);
    }
  },
  mine() {
    for(let i = 0; i < 3; i++){
      methods.giveOption(['iron', 'coal', 'sulfur', 'rocks']);
    }
  },
  hunt() {
    for(let i = 0; i < 3; i++){
      methods.giveOption(['pelt', 'meat', 'hide']);
    }
  },
  cook() {
    if(data.items.meat > 0) {
      data.items.meat--;
      methods.give('cooked meat');
    }
  }
}

Vue.use(VueMaterial.default);
Vue.config.productionTip = false;

const vm = new Vue({
  el: '#app',
  data: data,
  methods: methods,
});
