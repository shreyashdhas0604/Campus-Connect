import React from 'react';
import Header from './Header';

const Home: React.FC = () => {
    return (
        <div>
            <Header />
            <h1>Welcome to Campus Connect</h1>
            <p>Your one-stop platform for all campus activities and connections.</p>
        </div>
    );
};

export default Home;