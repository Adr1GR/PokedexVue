import { contextBridge } from 'electron';
contextBridge.exposeInMainWorld('app', { ping: () => 'pong' });
