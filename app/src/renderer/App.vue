<template>
  <div id="#app">
    <landing-page></landing-page>
  </div>
</template>

<script>
  import path from 'path';
  import LandingPage from 'components/LandingPageView';
  import './imgs/tray.png';

  export default {
    components: {
      LandingPage
    },
    mounted() {
      const {ipcRenderer} = this.$electron;
      const {Tray} = this.$electron.remote;
      const win = this.$electron.remote.getCurrentWindow();
      let tray = null;

      ipcRenderer.send('createTray:req');
      ipcRenderer.on('createTray:res', e => {
        // ipcRenderer.on('tray:log', (e, log) => {
        ipcRenderer.on('tray:log', function() {
          console.log(arguments);
        });
      });

      // createTray();
      //
      // function createTray() {
      //   if (tray === null) {
      //     // const iconPath = path.join(__dirname, './images/tray.png');
      //     // console.log(iconPath);
      //     tray = new Tray('./imgs/tray.png');
      //   }
      //   return tray;
      // }

      // debugger
      // ipcRenderer.send('createTray:req');
      // // ipcRenderer.on('createTray:res', (e, tray) => {
      // ipcRenderer.on('createTray:res', function(e, tray) {
      //   console.log(arguments);
      //   tray.on('drop', e => {
      //     console.log(e);
      //   });
      // })
    }
  }
</script>

<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  * {
    margin: 0;
    padding: 0;
  }

  html,
  body { height: 100%; }

  body {
    align-items: center;
    background:
      radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      );
    background-position: center;
    display: flex;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: center;
  }
</style>
