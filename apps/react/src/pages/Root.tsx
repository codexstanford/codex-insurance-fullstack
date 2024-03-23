import { Link, Outlet } from "react-router-dom";
import Container from "../components/Container";
import useSessionUser from "../hooks/useSessionUser";
import { ROUTES } from "common";
import { ButtonLink } from "../components/Button";
import { MAIN_CONTAINER_MT } from "../consts/classes.const";

const Root: React.FC = () => {
  const user = useSessionUser();

  return (
    <>
      <header className="bg-blue-200 text-black fixed z-50 top-0 left-0 w-full">
        <Container makeBoxed="fluid" className="py-3 flex gap-3 items-center">
          <Link to={ROUTES.INDEX} className="font-bold mr-auto text-2xl">
            CodeX
          </Link>
          {!user && <ButtonLink href={ROUTES.LOGIN}>Login</ButtonLink>}
          {user && (
            <ButtonLink
              href={ROUTES.API_AUTH_LOGUT}
              renderAsReactRouterLink={false}
            >
              Logut
            </ButtonLink>
          )}
        </Container>
      </header>
      <main className={MAIN_CONTAINER_MT}>
        <Outlet />
      </main>
    </>
  );
};

export default Root;
