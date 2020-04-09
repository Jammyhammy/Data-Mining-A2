import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//const sql = require('mssql/msnodesqlv8');

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
  console.log("hello")
  player = new YT.Player('player', {
    playerVars: {
      'autoplay': 1, 
      'controls': 1,
      'autohide': 0,
      'loop': 1,
      'wmode':'opaque' },
    videoId: '2S_gyFbtyFo',
    events: {
      'onReady': onPlayerReady}
  });
}
console.log(player)

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
 event.target.mute();
  //event.target.setPlaybackRate(0.5);
}

Vue.config.productionTip = false
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
new Vue({
  render: h => h(App),
}).$mount('#app')

