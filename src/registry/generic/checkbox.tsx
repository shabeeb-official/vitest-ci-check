import { customEvent } from "@/utils/events";
import React from "react";

type ICheckboxProps = {
    className?: string;
    placeholder?: string;
    value?: string;
    eventName?: string;
    checked?: any;
    filterKey?: string;
};

const Checkbox = (props: ICheckboxProps) => {
    const { className, value, eventName, checked, filterKey } = props;
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        customEvent.publish(eventName, {
            value: e.target.value,
        });
    };




    return (
        <input
            type={"checkbox"}
            className={className}
            value={value}
            onChange={onChange}
            checked={checked[filterKey]?.includes(value) ? true : false}
        />
    );
};

export default Checkbox;
