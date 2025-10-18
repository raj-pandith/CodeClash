package com.Messenger.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.Messenger.ChatMessage;

@Controller
public class ChatController {

    @MessageMapping("/sendMessage") // client → server
    @SendTo("/topic/public") // server → all clients
    public ChatMessage send(ChatMessage message) {
        return message; // broadcast message
    }
}
