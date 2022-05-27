import { useDrop } from 'react-dnd';
import CourseManager from '../CourseManager';
import { Alert } from '../types/AlertTypes';
import { Color, UserOptions } from '../types/BaseTypes';
import {
    CourseDragItem,
    CourseLocation,
    Course,
    PlanModificationFunctions,
    FavoritesData,
} from '../types/PlanTypes';
import Class from './Class';

interface QuarterProps {
    data: Course[];
    favorites: FavoritesData;
    location: CourseLocation;
    f: PlanModificationFunctions;
    alert: Alert;
    switches: UserOptions;
    title: string;
    color: Color;
}

function Quarter(props: QuarterProps) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'Class',
        drop: (item: CourseDragItem, monitor) => {
            if (monitor.didDrop()) {
                return;
            }
            if (item.from) {
                props.f.moveCourse(item.course, item.from, props.location);
            } else {
                props.f.addCourse(item.course, props.location);
            }
            return { moved: true };
        },
        collect: monitor => ({ isOver: monitor.isOver() }),
    }));

    let courses = props.data;
    let classes: JSX.Element[] | JSX.Element = [];
    if (courses) {
        if (courses.length > 0) {
            classes = courses.map((classData, index) => {
                return (
                    <Class
                        course={classData}
                        favorites={props.favorites}
                        alert={props.alert}
                        location={props.location}
                        f={props.f}
                        switches={props.switches}
                        key={index}
                    />
                );
            });
        } else {
            classes = (
                <div
                    className="p-2 compact:px-2 compact:py-0.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-dashed border-black dark:border-gray-500
                    overflow-hidden whitespace-nowrap opacity-40"
                >
                    <p className="text-md font-bold text-black dark:text-white">
                        No classes to show.
                    </p>
                    <p className="compact:hidden text-xs dark:text-white">
                        Use the search bar.
                    </p>
                </div>
            );
        }
    }

    let units = CourseManager.getQuarterCredits(courses);

    let unitString = 'units';
    if (units === 1) {
        unitString = 'unit';
    }

    return (
        <div
            ref={drop}
            className={`relative block rounded-lg px-8 pt-4 pb-8 border-2
            ${
                isOver
                    ? `border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50`
                    : `border-solid bg-${props.color}-50 dark:bg-gray-800 border-${props.color}-400`
            }
                space-y-3 h-full shadow-lg compact:py-2 compact:shadow-sm`}
        >
            <p className="text-center font-bold text-md m-0 p-0 text-gray-600 dark:text-gray-400 compact:text-sm">
                {props.title}
            </p>
            {classes}
            {props.switches.get.quarter_units && (
                <p className="absolute right-2 top-0 text-right text-xs p-0 m-0 text-gray-400 font-normal">
                    <span className="font-medium">{units}</span> {unitString}
                </p>
            )}
        </div>
    );
}

export default Quarter;