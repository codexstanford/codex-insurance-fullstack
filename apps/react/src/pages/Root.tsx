import { Link, Outlet } from "react-router-dom";
import Container from "../components/Container";
import useSessionUser from "../hooks/useSessionUser";
import { ROUTES } from "common";

const Root: React.FC = () => {
  const user = useSessionUser();

  return (
    <>
      <header className="bg-blue-200 text-black fixed  top-0 left-0 w-full">
        <Container className="py-3 flex gap-3 items-center">
          <Link to={ROUTES.INDEX} className="font-bold mr-auto text-2xl">
            CodeX
          </Link>
          {!user && <Link to={"/auth/login"}>Login</Link>}
          {user && <a href="/api/auth/logout">Logut</a>}
        </Container>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Root;
