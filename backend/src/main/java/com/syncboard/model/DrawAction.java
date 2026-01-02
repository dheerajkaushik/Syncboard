package com.syncboard.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawAction {
    private String type; // "start", "draw", "end"
    private double x;
    private double y;
    private String color;
    private double brushSize;

    private String lineId;   // Add this! Unique ID for the stroke
    private String senderId;
}