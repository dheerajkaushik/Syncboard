package com.syncboard.controller;

import com.syncboard.model.DrawAction;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "*")
public class BoardController {

    // Frontend sends to: /app/draw
    // We forward to: /topic/board
    @MessageMapping("/draw")
    @SendTo("/topic/board")
    public DrawAction receiveMessage(DrawAction action) {
        // We just act as a relay.
        // In a more complex app, we might save this to a DB here.
        return action;
    }
}