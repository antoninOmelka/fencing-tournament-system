"use client"
import "./styles/global/global.css";

import { StyledButton } from "./styles/shared/buttons";

function LandingPage() {

    return (
        <div className="page-container">
            <p className="welcome-icon">⚔️</p>
            <h1 className="welcome-heading">Welcome to DuelBoard</h1>
            <p className="welcome-details">Add participants to begin.</p>
            <StyledButton variant="contained" href="/participants">Go to Participatns</StyledButton>
        </div>
    );
}

export default LandingPage;