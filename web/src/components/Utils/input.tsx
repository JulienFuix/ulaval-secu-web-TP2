import React from "react";

interface ChildProps {
    callback: (value: any) => void;
    placeholder: string;
    title: string;
    type: string;
}

export default function InputField(props: ChildProps) {
    const handleChangeFieldValue = (res: any) => {
        props.callback(res.target.value);
    }

    return (
        <div className="w-full mt-4 mb-4">
            <p className="text-DMsans mb-2">{props.title}</p>
            <input className="w-full h-[50px] pl-3 rounded-lg bg-[#ecf0f1]" type={props.type} placeholder={props.placeholder} onChange={handleChangeFieldValue} />
        </div>
    )
}