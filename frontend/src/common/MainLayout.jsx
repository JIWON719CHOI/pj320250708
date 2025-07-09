import { Outlet } from "react-router";

export function MainLayout() {
  return (
    <div>
      <div>
        navbar
        <a href="/frontend/public">HOME</a>
        <a href="/board/add">WRITE</a>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
