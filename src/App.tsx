import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import * as ReactDOM from "react-dom/client";
// import HomePage from './pages/HomePage'
import Home from "./routes/Home";
import Chats from "./routes/Chats";
import ChatGPT from "./routes/ChatGPT";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: '/:id',
      element: <Chats />,
    },
    {
      path: '/chat/:id',
      element: <ChatGPT />,
    }
  ]);

  return (
    <div className="app">

      <RouterProvider router={router} />
    </div>
  );
}

export default App
