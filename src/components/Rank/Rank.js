import React from "react";

const Rank = ({user}) => {
    return (
        <div>
            <div className="white f3">
                {`Welcome! ${user.name.charAt(0).toUpperCase() + user.name.slice(1) },
                     your current entry is ... `}
            </div>
            <div className="white f1">
                {user.entries}
            </div>
        </div>
    );
}

export default Rank;