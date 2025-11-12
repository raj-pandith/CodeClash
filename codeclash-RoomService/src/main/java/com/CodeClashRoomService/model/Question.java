package com.CodeClashRoomService.model;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Data
public class Question {
    private String id;
    private String title;
    private String difficulty;

    // getters and setters
}
