package com.school.management.schoolmanagment.repository;

import com.school.management.schoolmanagment.model.TeacherSubjectInClass;
import com.school.management.schoolmanagment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmailAndPassword(String email, String password);

    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = :roleName")
    List<User> findByRoleName(String roleName);

    @Query("SELECT tsig FROM TeacherSubjectInClass tsig WHERE tsig.teacher = :teacher")
    List<TeacherSubjectInClass> findTeacherSubjectsInGroup(User teacher);

    @Query("SELECT u FROM User u WHERE u.schoolClass.id = :schoolClassId")
    List<User> findStudentsBySchoolClassId(Long schoolClassId);
    @Query("SELECT u FROM User u WHERE u.schoolClass.id = :schoolClassId AND u.personalInfo.isFromCity = true")
    List<User> findCityMembersBySchoolClassId(Long schoolClassId);

    @Transactional
    @Modifying
    @Query("update User u set u.password =?2 where u.email = ?1")
    void updatePassword(String email, String password);

}
