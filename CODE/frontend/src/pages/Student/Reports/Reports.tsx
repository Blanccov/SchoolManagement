import classes from "./Reports.module.scss";
import SelectOptions from "forms/SelectHeaders/SelectOptions.tsx";
import PieChart, {GradeDict} from "ui/Charts/PieChart.tsx";
import {SubjectsGrades} from "api/Grades.tsx";
import {useEffect, useState} from "react";
import { useSelector} from "react-redux";
import {RootState} from "state/store.tsx";
import Button from "ui/Button/Button.tsx";
import {exportStudentGrades} from "api/User.tsx";
import {PARENT} from "utilitiesconstants.tsx/";

export interface SubjectSelectionState {
    [key: string]: boolean;
}

// Generate initial state of selected subjects
export function generateSubjectSelectionStates(subjects: string[], initState?: boolean): SubjectSelectionState {
    const initialState: { [key: string]: boolean } = {};
    subjects.forEach((subject) => {
        if (initState != null) initialState[subject] = initState;
        else initialState[subject] = true;
    });
    return initialState;
}

// Extract subjects from response
function getSubjects(grades: SubjectsGrades[]): string[] {
    const subjects: string[] = []

    grades.forEach( (item) => {
        subjects.push(item.subjectName)
    })

    return subjects;
}

// Get distinct grades count to pass to PieChart module
function getGradesCount(grades: SubjectsGrades[]): GradeDict {
    const sampleGrades: GradeDict = {
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0,
    };

    for (const subject of grades) {
        for (const grade of subject.grades) {
            const gradeKey = grade.grade.toString();
            sampleGrades[gradeKey]++;
        }
    }

    return sampleGrades;
}

const StudentReports = () => {
    const parent = useSelector((state: RootState) => state.parentChildrenData)
    const user = useSelector((state: RootState) => state.login);
    const grades = useSelector((state: RootState) => state.studentGrades.grades);
    // const grades = DUMMY_GRADES

    // Subjects extracted from response
    const [subjects, setSubjects] = useState<string[]>(getSubjects(grades));
    // Subjects selected in filter
    const [selectedSubjects, setSelectedSubjects] = useState<SubjectSelectionState>(generateSubjectSelectionStates(getSubjects(grades)));
    // Grades prepared for PieChart module
    const [studentGrades, setStudentGrades] = useState<GradeDict>(getGradesCount(grades));
    // State of export
    const [exportState, setExportState] = useState<string>("Export");
    const [clearState, setClearState] = useState<string>("Clear");


    useEffect(() => {
        setSubjects(getSubjects(grades));
        setSelectedSubjects(generateSubjectSelectionStates(getSubjects(grades)));
        setStudentGrades(getGradesCount(grades));
    }, [grades]);

    // Filter grades when selectedSubjects or date range changes
    useEffect(() => {
        if (grades.length > 0) {
            const filteredGrades = filterGrades();
            const newGrades = getGradesCount(filteredGrades);
            setStudentGrades(newGrades);
        }
    }, [selectedSubjects, grades]);

    const onCheckboxChange = (subject: string) => {
        setSelectedSubjects((prevState) => ({
            ...prevState,
            [subject]: !prevState[subject],
        }));
    };

    const filterGrades = (): SubjectsGrades[] => {
        return grades
            .filter((subject) => selectedSubjects[subject.subjectName]) // Filter by selected subjects
            .filter((subject) => subject.grades.length > 0); // Remove subjects with no grades in range
    };

    const resetFilters = () => {
        setSelectedSubjects(generateSubjectSelectionStates(subjects));
        displayExportState("Cleared!", "clear")
    }

    function displayExportState(state: string, type: "export" | "clear") {
        switch (type) {
            case "export":
                setExportState(state);

                setTimeout(() => {
                    setExportState("Export");

                }, 2000);
                break

            case "clear":
                setClearState(state)

                setTimeout(() => {
                    setClearState("Clear");

                }, 2000);
                break
        }
    }

    const exportRequest = () => {
        setExportState("Exporting...");

        const selectedSubjectNames = Object.keys(selectedSubjects)
            .filter(subject => selectedSubjects[subject]);

        // console.log(selectedSubjectNames)

        let id = user.id

        if (user.role === PARENT && parent.selected != -1)
            id = parent.children[parent.selected].id

        exportStudentGrades(id, selectedSubjectNames)
            .then(data => {
                console.log('Export request response', data);

                displayExportState("Exported!", "export")
            })
            .catch(error => {
                console.error('Error requesting student grades report', error);

                displayExportState("Export failure!", "export");
            });
    }

    return (
        <main className={classes.content}>
            <div className={classes.filters}>
                <SelectOptions
                    name={"Subject"}
                    options={subjects}
                    onCheckboxChange={onCheckboxChange}
                    checkedItems={selectedSubjects}
                />
            </div>

            <div className={classes.charts}>
                <PieChart data={studentGrades} />
            </div>

            <div className={classes.buttons}>
                <Button
                    type={"button"}
                    children={exportState}
                    onClick={exportRequest}
                    className={
                        exportState == "Exported!"
                            ? classes.export_success
                            : exportState == "Export failure!"
                                ? classes.export_failure
                                : ""
                    }
                />
                <Button
                    type={"button"}
                    children={clearState}
                    onClick={resetFilters}
                    className={
                        clearState == "Cleared!"
                            ? classes.export_success
                            : ""
                    }
                />
            </div>
        </main>
    );
};

export default StudentReports;