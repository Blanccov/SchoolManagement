import { Link, LinkProps, useLocation } from "react-router-dom";
import classes from "./Bookmark.module.scss";
import { MouseEventHandler} from "react";
import useAnimated from "hooks/useAnimated.tsx";

interface BookmarkProps extends LinkProps {
    svgIcon: React.ReactNode;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    canActive?: boolean;
}

const Bookmark = (props: BookmarkProps) => {
    const location = useLocation();
    const isActive = location.pathname === props.to;
    const canActive = props.canActive !== false;
    const isAnimated = useAnimated()

    const bookmarkClasses = isActive && canActive ? classes.bookmark__active : '';
    const containerClasses = isAnimated ? `${bookmarkClasses} ${classes.bookmark__anime}` : bookmarkClasses;
    const style = isAnimated ? {} : { transform: 'translateX(40%)' };

    return (
        <div className={containerClasses} style={style}>
            <Link
                to={props.to}
                className={classes.bookmark}
                replace={true}
                onClick={props.onClick}
            >
                <span>{props.children}</span>
                {props.svgIcon}
            </Link>
        </div>
    );
};

export default Bookmark;
