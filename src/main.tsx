import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/500.css"; // Optional: Specify weight
import "@fontsource/poppins/700-italic.css"; // Optional: Weight and style

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
