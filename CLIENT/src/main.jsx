import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom'
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";

import { store } from "./app/store";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <Provider store={store}>

      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
            duration: 3000
        }}
        />

    </Provider>

  </BrowserRouter>

)
