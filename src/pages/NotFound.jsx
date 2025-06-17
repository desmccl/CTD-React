import React from "react";
import {Link} from 'react-router';

const NotFound = () => {
    return (
        <div>
            <h1>Page Not Found</h1>
            <Link to="/">Go back home</Link>
        </div>
    );
};

export default NotFound;
