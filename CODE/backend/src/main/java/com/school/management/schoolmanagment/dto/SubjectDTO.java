package com.school.management.schoolmanagment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectDTO {

    private Long id;
    private String name;
    private TeacherInfoDTO teacherInfo;
}
