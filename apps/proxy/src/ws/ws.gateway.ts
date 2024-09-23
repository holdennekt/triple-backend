import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import { WsThrottlerGuard } from './ws-throttler.guard';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsThrottlerGuard)
export class WsGateway {
  @WebSocketServer()
  server: Server;

  // constructor() {}

  broadcast(event: string, data: unknown) {
    for (const client of this.server.clients) {
      client.send(JSON.stringify({ event, data }));
    }
  }
}
