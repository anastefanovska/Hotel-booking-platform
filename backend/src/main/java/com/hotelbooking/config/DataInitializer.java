package com.hotelbooking.config;

import com.hotelbooking.model.Role;
import com.hotelbooking.model.User;
import com.hotelbooking.model.Room;
import com.hotelbooking.repository.RoleRepository;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.sql.rowset.serial.SerialBlob;

import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Blob;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // === ROLES ===
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

        // === USERS ===
        if (!userRepository.existsByEmail("user@example.com")) {
            User user = new User();
            user.setFirstName("Regular");
            user.setLastName("User");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRoles(List.of(userRole));
            userRepository.save(user);
        }

        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(List.of(adminRole));
            userRepository.save(admin);
        }

        // === ROOMS ===
        if (roomRepository.count() == 0) {
            roomRepository.save(createRoom("Single", new BigDecimal("30.00"), "images/single.jpg"));
            roomRepository.save(createRoom("Double", new BigDecimal("50.00"), "images/double.jpg"));;
            roomRepository.save(createRoom("Family", new BigDecimal("100.00"), "images/family.jpg"));
            roomRepository.save(createRoom("Studio", new BigDecimal("80.00"), "images/studio.jpg"));
            roomRepository.save(createRoom("Suite", new BigDecimal("120.00"), "images/suite.jpg"));
            roomRepository.save(createRoom("Superior", new BigDecimal("200.00"), "images/superior.jpg"));
            roomRepository.save(createRoom("Deluxe", new BigDecimal("150.00"), "images/deluxe.jpg"));
            roomRepository.save(createRoom("Deluxe", new BigDecimal("160.00"), "images/deluxe2.jpg"));
            roomRepository.save(createRoom("Presidential Suite", new BigDecimal("400.00"), "images/ps.jpg"));
            roomRepository.save(createRoom("Penthouse", new BigDecimal("300.00"), "images/penthouse.jpg"));
        }

        System.out.println("✅ Users, roles, and rooms initialized successfully!");
    }

    private Room createRoom(String type, BigDecimal price, String imagePath) throws Exception {
        InputStream inputStream = new ClassPathResource(imagePath).getInputStream();
        byte[] imageBytes = inputStream.readAllBytes();
        Blob blob = new SerialBlob(imageBytes);
        Room room = new Room();
        room.setRoomType(type);
        room.setRoomPrice(price);
        room.setPhoto(blob);
        room.setBooked(false);
        return room;
    }
}
