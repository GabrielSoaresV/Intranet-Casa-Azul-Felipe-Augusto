package com.controle.demandas.api.validation;

import com.controle.demandas.api.validation.annotation.ValidCpf;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfValidator implements ConstraintValidator<ValidCpf, String> {

    @Override
    public boolean isValid(String cpf, ConstraintValidatorContext context) {
        if (cpf == null || !cpf.matches("\\d{11}")) {
            return false;
        }
        return true;
    }
}
