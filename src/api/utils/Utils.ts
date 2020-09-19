import React from "react";

export const CreateClassName = (classNames:any, additionalString:string = ""):string => {
    return Object.keys(classNames).map((className:string) => classNames[className] ? className : "").join(' ') + ' ' + additionalString;
}

// https://css-tricks.com/using-requestanimationframe-with-react-hooks/
export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
    const requestRef: {current: number} = React.useRef();
    const previousTimeRef: {current: number} = React.useRef();

    const animate = (time: number) => {
        if (previousTimeRef.current != undefined && time - previousTimeRef.current > 20) {
            callback(time);
            previousTimeRef.current =  time;
        } else if (!previousTimeRef.current) previousTimeRef.current = time;
        // Loop
        requestRef.current = requestAnimationFrame(animate);
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
};

export const coordinateToPixelStyle = (coord: {x: number, y: number}) => {
    return {
        bottom: coord.y + "px",
        left: coord.x + "px"
    }
};