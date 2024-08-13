import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3002, {cors:{origin:'*'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    client.broadcast.emit('New-joining', {
      message: `A new user with id:${client.id} has joined the chat`,
    });
  }

  handleDisconnect(client: any) {
    this.server.emit('User-left', {message: `The user with id:${client.id} left the chat`})
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() message: any) {

    this.server.emit('message', message);
  }
}
