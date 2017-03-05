'use strict'

import fs from 'fs';
import path from 'path';
import {app, BrowserWindow, Tray, Menu, ipcMain} from 'electron';
import got from 'got';
import FormData from 'form-data';

let mainWindow;
let tray = null;
let trayWindow = null;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow(url) {
  const bounds = tray.getBounds();
  trayWindow = new BrowserWindow({
    width: 250,
    height: 100,
    x: bounds.x - 108,
    y: 10,
    frame: false,
    movable: false,
    resizable: false,
    closable: false,
    alwaysOnTop: true,
    fullscreenable: false
  });
  trayWindow.loadURL(url);
  return trayWindow;
}

function createTray() {
  if (tray !== null) {
    return tray;
  }

  tray = new Tray(path.join(__dirname, 'images/trayTemplate.png'));
  tray.setToolTip('Share On');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Quit',
      click() {
        app.quit();
      }
    }
  ]))
  tray.on('drop-files', (e, files) => {
    if (trayWindow !== null) {
      return;
    }

    if (files.length > 1) {
      const code = '';
      const msg = 'Please select only one file';
      trayWindow = createWindow(`${winURL}?error&code=${code}&msg=${msg}`);
      return;
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(files[0]));
    got.post('https://file.io', {
      body: form,
      json: true
    })
      .then(res => {
        if (res.body.success) {
          const encURI = encodeURIComponent(res.body.link);
          trayWindow = createWindow(`${winURL}?success&uri=${encURI}`);
        } else {
          const code = '';
          const msg = 'Unknown error';
          trayWindow = createWindow(`${winURL}?error&code=${code}&msg=${msg}`);
        }
      })
      .catch(({statusCode, statusMessage}) => {
        const code = statusCode;
        const msg = encodeURIComponent(statusMessage);
        trayWindow = createWindow(`${winURL}?error&code=${code}&msg=${msg}`);
      });
  });
}

// let win = null;
app.on('ready', () => {
  // win = new BrowserWindow({
  //   x: 0,
  //   y: 0,
  //   width: 250,
  //   height: 100,
  //   frame: false
  // });
  // win.loadURL(winURL);
  app.dock.hide();
  createTray();
});

ipcMain.on('close-window', () => {
  if (trayWindow !== null) {
    trayWindow.destroy();
    trayWindow = null;
  }
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
