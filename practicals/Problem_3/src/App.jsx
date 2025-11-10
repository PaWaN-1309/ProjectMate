import React from "react";
import "./index.css"; // external/global CSS
import styles from "./App.module.css"; // CSS Module

export default function App() {
    const inlineStyle = {
        padding: "16px",
        borderRadius: "6px",
        background: "#e8f5e9",
        marginBottom: "12px"
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
            <h2>React Styling Examples</h2>

            <div style={inlineStyle}>
                <strong>Inline style</strong>
                <div>Applied via style object in JSX.</div>
            </div>

            <div className="externalBox">
                <strong>External (global) CSS</strong>
                <div>Styled by src/index.css using a className.</div>
            </div>

            <div className={styles.moduleBox}>
                <strong>CSS Module</strong>
                <div>Scoped styles from App.module.css (imported as styles).</div>
            </div>
        </div>
    );
}