package com.breakly.entity;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

// Stores a set of ServiceType as a compact comma-separated column, e.g. "MUSIC,NEWS".
@Converter
public class ServiceTypeSetConverter implements AttributeConverter<Set<ServiceType>, String> {

    @Override
    public String convertToDatabaseColumn(Set<ServiceType> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "";
        }
        return attribute.stream().sorted().map(Enum::name).collect(Collectors.joining(","));
    }

    @Override
    public Set<ServiceType> convertToEntityAttribute(String dbData) {
        Set<ServiceType> result = EnumSet.noneOf(ServiceType.class);
        if (dbData != null && !dbData.isBlank()) {
            Arrays.stream(dbData.split(",")).map(String::trim).map(ServiceType::valueOf).forEach(result::add);
        }
        return result;
    }
}

