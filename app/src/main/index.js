'use strict'

import path from 'path';
import {app, BrowserWindow, Tray, Menu, ipcMain} from 'electron';
// import menubar from 'menubar';

let mainWindow;
let tray = null;
let trayWindow = null;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createTray() {
  if (tray !== null) {
    return tray;
  }

  tray = new Tray(path.join(__dirname, 'images/tray.png'));

  const bounds = tray.getBounds();
  console.log(bounds);
  trayWindow = new BrowserWindow({
    // width: 100,
    // height: 50,
    // x: bounds.x - 50,
    // y: 10,
    // titleBarStyle: 'hidden',
    // resizable: false,
    // closable: false,
    // alwaysOnTop: true,
    // fullscreenable: false
  });

  trayWindow.loadURL(winURL);
  // if (mb === null) {
  //   mb = menubar({
  //     preloadWindow: true,
  //     icon: path.join(__dirname, 'images/tray.png')
  //   });
  //   mb.on('create-window', () => {
  //     mb.window.loadURL(winURL);
  //     mb.tray.on('drop-files', (e, files) => {
  //       if (files.length !== 1) {
  //       }
  //     });
  //     console.log(mb.tray._events);
  //   });
  // }
  // return mb;
}
//
// ipcMain.on('createTray:req', ({sender}) => {
//   const _tray = createTray();
//   _tray.on('drop', e => {
//     sender.send('tray:log', e);
//   });
//
//   sender.send('createTray:res');
//   // process.nextTick(() => {
//   // setTimeout(() => {
//     // e.sender.send('createTray:res', _tray);
//   // }, 1000)
// });

// function createWindow () {
//   /**
//    * Initial window options
//    */
//   mainWindow = new BrowserWindow({
//     height: 600,
//     width: 800
//   })
//
//   mainWindow.loadURL(winURL)
//
//   mainWindow.on('closed', () => {
//     mainWindow = null
//   })
//
//   // eslint-disable-next-line no-console
//   console.log('mainWindow opened')
// }

app.on('ready', () => {
  // if (process.env.NODE_ENV !== 'production') {
  //   let win = new BrowserWindow({show: false});
  //   win.loadURL(winURL);
  // }

  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
