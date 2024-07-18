import React from "react";

const MainHeader = () => {
    return (
        <header className="header-banner position-relative">
            <div className="overlay"></div>
            <div className="container position-relative">
                <div className="row">
                    <div className="col-md-8">
                        <div className="animated-texts overlay-content">
                            <h1 className="display-3 mb-4">
                                <span className="hotel-color">WELCOME TO HOTEL</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default MainHeader;
