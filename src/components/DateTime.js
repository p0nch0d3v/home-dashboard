import React from 'react';

export default function DateTime(props){
    return (
        <div>
            <div>{props.date}</div>
            <div>{props.time}</div>
        </div>
    )
}
