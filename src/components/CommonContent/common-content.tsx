import React, { FunctionComponent } from "react";

interface ICommonContent {
    title: string;
}

const CommonContent: FunctionComponent<ICommonContent> = ({
    children,
    title
}) => {
    return (
        <div
            style={{
                padding: "16px"
            }}
        >
            <h1>
                {title}
            </h1>
            {children}
        </div>
    );
}

export default CommonContent;