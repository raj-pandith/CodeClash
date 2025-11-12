package com.CodeClashRoomService.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import com.CodeClashRoomService.model.ContestSettings;
import com.fasterxml.jackson.databind.ObjectMapper;

@Converter
public class ContestSettingsConverter implements AttributeConverter<ContestSettings, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ContestSettings contestSettings) {
        try {
            return objectMapper.writeValueAsString(contestSettings);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert ContestSettings to JSON", e);
        }
    }

    @Override
    public ContestSettings convertToEntityAttribute(String dbData) {
        try {
            if (dbData == null || dbData.isEmpty())
                return null;
            return objectMapper.readValue(dbData, ContestSettings.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON to ContestSettings", e);
        }
    }
}
