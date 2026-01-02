package com.syncboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker to send messages back to the client on destinations prefixed with /topic
        config.enableSimpleBroker("/topic");

        // Designate the prefix for messages that are bound for @MessageMapping methods in our Controllers
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the /ws endpoint, enabling SockJS fallback options so that alternate transports can be used if WebSocket is not available.
        // We setAllowedOriginPatterns("*") to allow our React Frontend (on port 5173) to connect.
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}