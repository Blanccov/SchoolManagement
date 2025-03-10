import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "state/store.tsx"; // Ensure AppDispatch is exported from the store
import Column from "layouts/TaskBoard/Column.tsx";
import boardStyles from "./Board.module.scss";
import TaskCardInterface from "@/interfaces/TaskCardInterface/TaskCardInterface.tsx";
import SelectOptions from "forms/SelectHeaders/SelectOptions.tsx";
import AddCard from "ui/Card/TaskCard/AddCard.tsx";
import { fetchNewTasks } from "state/tasks/tasksSlice.tsx";

function getSubjectsAndClasses(cards: TaskCardInterface[]): { subjects: string[], classes: string[] } {
    const subjectsSet = new Set<string>();
    const classesSet = new Set<string>();
    cards.forEach(card => {
        subjectsSet.add(card.subject);
        if (card.className) {
            classesSet.add(card.className);
        }
    });
    return { subjects: Array.from(subjectsSet), classes: Array.from(classesSet) };
}

const Board = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.studentTasks.tasks);
    const user = useSelector((state: RootState) => state.login);

    const { subjects, classes } = getSubjectsAndClasses(tasks);

    const [selectedSubjects, setSelectedSubjects] = useState<{ [key: string]: boolean }>({});
    const [selectedClasses, setSelectedClasses] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (user.id) {
            dispatch(fetchNewTasks({ userId: user.id, role: user.role }));
        }
    }, [dispatch, user.id, user.role]);

    const onSubjectChange = (subject: string) => {
        const newSelectedSubjects = { ...selectedSubjects };
        newSelectedSubjects[subject] = !newSelectedSubjects[subject];
        setSelectedSubjects(newSelectedSubjects);
    };

    const onClassChange = (className: string) => {
        const newSelectedClasses = { ...selectedClasses };
        newSelectedClasses[className] = !newSelectedClasses[className];
        setSelectedClasses(newSelectedClasses);
    };

    const filteredCards = tasks.map(card => {
        const subjectFilterPassed = Object.keys(selectedSubjects).length === 0 || Object.values(selectedSubjects).every(value => !value) || selectedSubjects[card.subject];
        const classFilterPassed = Object.keys(selectedClasses).length === 0 || Object.values(selectedClasses).every(value => !value) || !card.className || selectedClasses[card.className];

        return { ...card, isSelected: subjectFilterPassed && classFilterPassed };
    });

    return (
        <>
            <div className={boardStyles.headers}>
                <SelectOptions
                    name={"Subject"}
                    options={subjects}
                    onCheckboxChange={onSubjectChange}
                    checkedItems={selectedSubjects}
                    className={boardStyles.headers__select}
                />
                {user.role === "Teacher" &&
                    <>
                        <SelectOptions
                            name={"Class"}
                            options={classes}
                            onCheckboxChange={onClassChange}
                            checkedItems={selectedClasses}
                            className={boardStyles.headers__select}
                        />
                        <AddCard />
                    </>
                }
            </div>

            <div className={boardStyles.board}>
                <Column title="TO-DO" status="TO_DO" cards={filteredCards} setCards={() => { }} />
                <Column title="DONE" status="DONE" cards={filteredCards} setCards={() => { }} />
                <Column title="GRADED" status="GRADED" cards={filteredCards} setCards={() => { }} />
            </div>
        </>
    );
};

export default Board;
