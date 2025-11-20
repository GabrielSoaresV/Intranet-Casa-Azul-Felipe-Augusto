package com.projetoavaliacao.service;

import com.projetoavaliacao.model.JovemAprendiz;
import org.springframework.data.jpa.domain.Specification;

public class JovemSpecification {

    public static Specification<JovemAprendiz> pesquisa(String termo) {
        return (root, query, builder) -> {
            String likeTerm = "%" + termo.toLowerCase() + "%";
            return builder.or(
                    builder.like(builder.lower(root.get("nome")), likeTerm),
                    builder.like(builder.lower(root.get("matricula")), likeTerm),
                    builder.like(builder.lower(root.get("email")), likeTerm),
                    builder.like(builder.lower(root.get("nomeresponsavel")), likeTerm)
            );
        };
    }
}
