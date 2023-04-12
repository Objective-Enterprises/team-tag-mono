import express from 'express'
import path from 'path'
import http from 'http'
import https from 'https'
import fs from 'fs'
import socketIo from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from '../shared/socket'
import Procedural from './Procedural'
const stage = new Procedural()
stage.start()
const app = express()
const staticPath = path.join(__dirname, '..', '..', 'dist')
const staticMiddleware = express.static(staticPath)
app.use(staticMiddleware)
const configPath = './config.json'
async function start (): Promise<void> {
  async function makeServer (): Promise<https.Server | http.Server> {
    const configured = fs.existsSync(configPath)
    if (configured) {
      const config = await import(configPath)
      if (config.secure === true) {
        const key = fs.readFileSync('./sis-key.pem')
        const cert = fs.readFileSync('./sis-cert.pem')
        const credentials = { key, cert }
        return new https.Server(credentials, app)
      }
    }
    return new http.Server(app)
  }
  const server = await makeServer()
  const io = new socketIo.Server<ClientToServerEvents, ServerToClientEvents>(server)
  const PORT = process.env.PORT ?? 3000
  console.info('PORT set as', PORT)
  server.listen(PORT, () => {
    console.info(`Listening on :${PORT}`)
    setInterval(tick, 30)
  })
  async function updateClients (): Promise<void> {
    const sockets = await io.fetchSockets()
    sockets.forEach(socket => {
      const message = stage.update(socket.id)

      socket.emit('updateClient', message)
    })
  }
  function tick (): void {
    void updateClients()
  }
  io.on('connection', (socket) => {
    stage.join(socket.id)
    socket.on('updateServer', message => {
      stage.control({ id: socket.id, controls: message.controls })
    })
    socket.on('debug', () => {
      stage.debug({ label: 'client' })
    })
    socket.on('disconnect', () => {
      console.info('disconnect:', socket.id)
      stage.leave(socket.id)
    })
  })
}
void start()
