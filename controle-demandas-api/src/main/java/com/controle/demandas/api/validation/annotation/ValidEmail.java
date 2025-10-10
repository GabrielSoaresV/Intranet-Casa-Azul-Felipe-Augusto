package com.controle.demandas.api.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

import com.controle.demandas.api.validation.EmailValidator;

@Documented
@Constraint(validatedBy = EmailValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidEmail {
    String message() default "Email inválido";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
