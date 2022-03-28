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
  },
  {
    name: 'shelter',
    cost: {
      'leaves': 25,
      'rocks': 25,
      'sticks': 75,
    },
    unlock: {
      'unobtainable': 1,
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
        if(data.items[item] < recipe.unlock[item] || typeof data.items[item] == 'undefined' || data.unlockedRecipies.indexOf(recipe) != -1) done = false
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
        dialogue: `a weathered looking man walks up and settles down at a spot near your campfire. he puts his hands out at the fire to warm them up.`
      });
    }
    if(data.storyIndex == 2) {
      data.log.push({
        dialogue: `the man looks haggared and hungry, like he could use a bite to eat. you notice him staring at your cooked meat.`,
        choices: [
          {
            choice: 'offer',
            action: function() {
              data.items['cooked meat']--;
              methods.progressStory();
            }
          }
        ]
      });
    }
    if(data.storyIndex == 3) {
      data.log.push({
        dialogue: `you extend your hand. the man graciously accepts the piece of cooked meat. he bites and chews it quickly. the man finishes, then looks up at you. he makes you an offer. he can teach you how to build shelter in turn for your food.`,
        choices: [
          {
            choice: 'accept',
            action: function() {
              methods.progressStory();
            }
          }
        ]
      });
    }
    if(data.storyIndex == 4) {
      data.log.push({
        dialogue: `"with shelter we can expand. and with expansion comes more knowledge"`
      });
      recipies.forEach(recipe => {
        if(recipe.name == 'shelter') data.unlockedRecipies.push(recipe);
      });
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
      if(data.storyIndex == 1) methods.progressStory();
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
