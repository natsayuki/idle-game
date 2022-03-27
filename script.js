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
  }
]

const data = {
  items: {},
  tab: 'theforest',
  refresh: 0,
  unlockedRecipies: [],
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
        if(data.items[item] < recipe[item] || typeof data.items[item] == 'undefined') done = false
        console.log(data.unlockedRecipies[recipe]);
        if(data.unlockedRecipies.indexOf(recipe) != -1) done = false;
      });
      if(done) data.unlockedRecipies.push(recipe)
    });
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
  gather() {
    methods.giveOption(['sticks', 'rocks', 'leaves']);
  },
  mine() {
    methods.giveOption(['iron', 'coal', 'sulfur', 'rocks']);
  }
}

Vue.use(VueMaterial.default);
Vue.config.productionTip = false;

const vm = new Vue({
  el: '#app',
  data: data,
  methods: methods,
});
