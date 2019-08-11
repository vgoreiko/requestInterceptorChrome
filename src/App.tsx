import React from 'react';
import './App.css';
import MainForm from "./components/main-form/main-form"

const App: React.FC = () => {
    return (
        <section id="main" className="App">
            <MainForm/>
            <div id="container"></div>
        </section>);
}

export default App;
