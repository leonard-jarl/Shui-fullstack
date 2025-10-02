import {
  BrowserRouter as RouterProvider,
  Routes,
  Route,
} from "react-router-dom";

import Logo from "../components/logo/Logo";
import Water from "../components/water/Water";
import Home from "../pages/home/Home";
import NotFound from "../pages/notfound/NotFound";

function Router() {
  return (
    <RouterProvider>
        <Logo />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Water />
    </RouterProvider>
  );
}

export default Router;
