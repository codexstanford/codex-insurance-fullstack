import { Link, Outlet } from "react-router-dom";
import Container from "../components/Container";
import useSessionUser from "../hooks/useSessionUser";

const Root: React.FC = () => {
  const user = useSessionUser();

  return (
    <>
      <header className="bg-red-500 text-white">
        <Container className="py-3 flex gap-3">
          <Link to={"/"} className="font-bold mr-auto">
            CodeX Insurance Advisor (CIA)
          </Link>
          {!user && <Link to={"/auth/login"}>Login</Link>}
          {user && <a href="/api/auth/logout">Logut</a>}
        </Container>
      </header>
      <main>
        <Container addVerticalPadding={true}>
          <Outlet />
        </Container>
      </main>
    </>
  );
};

export default Root;
