package com.controle.demandas.api.repository;

import com.controle.demandas.api.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {

    boolean existsByEmail(String email);

    Optional<Profile> findByEmail(String email);
}
