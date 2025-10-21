package com.CodeClashRoomService.converter;

import jakarta.persistence.AttributeConverter;

import java.util.Map;

import com.CodeClashRoomService.model.PlayerStats;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PlayerStatsMapConverter implements AttributeConverter<Map<String, PlayerStats>, String> {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, PlayerStats> attribute) {
        try {
            return mapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Map<String, PlayerStats> convertToEntityAttribute(String dbData) {
        try {
            return mapper.readValue(dbData, Map.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
