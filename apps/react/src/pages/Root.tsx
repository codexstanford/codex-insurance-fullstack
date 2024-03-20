import { Link, Outlet } from "react-router-dom";
import Container from "../components/Container";

const Root: React.FC = () => {
  return (
    <>
      <header className="bg-red-500 text-white">
        <Container className="py-3 flex gap-3">
          <Link to={"/"} className="font-bold mr-auto">
            CodeX Insurance Advisor (CIA)
          </Link>
          <Link to={"/auth/login"}>Login</Link>
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
