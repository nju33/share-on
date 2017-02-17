<template>
  <div>
    <div ref="success" class="root success" v-if="isSuccess" @click="handleSuccessClick($electron)">
      <span v-text="uri" class="message success"></span>
      <span class="action success">Copied!!</span>
    </div>
    <div class="root error" v-if="isError" @click="handleErrorClick($electron)">
      <span v-text="errorMessage" class="message error"></span>
      <span v-if="errorCode" v-text="errorCode" class="action error"></span>
    </div>
    <!-- <landing-page></landing-page> -->
  </div>
</template>

<script>
  import path from 'path';
  import queryString from 'query-string';
  import LandingPage from 'components/LandingPageView';

  let tid = null;
  let tcid = null;

  export default {
    components: {
      LandingPage
    },
    data() {
      return {
        uri: null,
        isSuccess: false,
        // uri: 'http://file.io/akjlD',
        // isSuccess: true,
        isError: false,
        errorMessage: null,
        errorCode: null
        // isError: true,
        // errorMessage: 'adlsfj',
        // errorCode: 500,
      }
    },
    methods: {
      handleSuccessClick({ipcRenderer}) {
        this.$electron.clipboard.writeText(this.$data.uri);
        if (tcid !== null) {
          return;
        }
        if (tid !== null) {
          clearTimeout(tid);
        }
        this.$refs.success.classList.add('active');
        tid = setTimeout(() => {
          this.$refs.success.classList.remove('active');
          tid = null;
          tcid = setTimeout(() => {
            tcid = null;
            ipcRenderer.send('close-window');
          }, 1000);
        }, 2000)
      },
      handleErrorClick({ipcRenderer}) {
        ipcRenderer.send('close-window');
      }
    },
    mounted() {
      const parsedSearch = queryString.parse(location.search);

      if ('success' in parsedSearch) {
        this.$data.isSuccess = true;
        this.$data.uri = decodeURIComponent(parsedSearch.uri);
      } else if ('error' in parsedSearch) {
        this.$data.isError = true;
        this.$data.errorCode = parsedSearch.code;
        this.$data.errorMessage = decodeURIComponent(parsedSearch.msg);
      }
    }
  }
</script>

<style>
  body {
    font-family: Verdana, Geneva, sans-serif;
    font-size: 14px;
  }
</style>

<style scope>
  body {
    margin: 0;
  }
  .root {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    user-select: none;
  }

  .root.success {
    /*background-image: linear-gradient(to bottom, #176c34, #1b813e);*/
    background: #1b813e;
    transition: 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  }

  .root.success:before,
  .root.success:after {
    content: '';
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }

  .root.success:before {
    background-image: linear-gradient(to bottom, #176c34, transparent);
    transition: 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    opacity: .75;
  }

  .root.success:after {
    background-image: linear-gradient(to bottom, #694b15, #1b813e);
    transition: 1s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    opacity: 0;
  }

  .root.success.active:before {
    opacity: 0;
  }

  .root.success.active:after {
    opacity: .75;
  }

  .root.error {
    background: #961f32;
    color:
  }

  .root.error:before {
    content: '';
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, #811b2b, transparent);
    transition: 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    opacity: .75;
  }

  .message {
    margin: 0 auto;
    display: inline-block;
    padding: .5em .75em;
    border-radius: 5px;
    font-size: 1.2em;
    position: relative;
    z-index: 2;
    color: rgba(255,255,255,.89);
  }

  .message.success {
    top: -.25em;
  }

  .action.success {
    display: block;
    position: absolute;
    z-index: 2;
    right: 50%;
    transform: translate(50%, 200%);
    bottom: 1em;
    padding: .3em .5em;
    font-size: .75em;
    color: rgba(255,255,255,.89);
    border: 1px solid rgba(255,255,255,.75);
    background: rgba(255,255,255,.3);
    transition: .5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .active .action.success {
    transform: translate(50%, 0);
  }

  .action.error {
    display: block;
    position: absolute;
    z-index: 2;
    top: .5em;
    right: 50%;
    transform: translate(50%, 0%);
    padding: .3em .5em;
    font-size: .75em;
    color: rgba(255,255,255,.55);
  }
</style>
