import React from 'react';
import MainContext from './context/MainContext';
import ProtectedRouter from './components/Utils/protectedRouter';

function App() {
    return (
        <MainContext>
            <ProtectedRouter />
        </MainContext>
    );
}

export default App;
