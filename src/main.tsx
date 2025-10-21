import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./route";
import "./index.css"
import { Provider } from 'react-redux';
import { store } from "./redux/store";


const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <RouterProvider router={router} />,
  </Provider>
  
);
