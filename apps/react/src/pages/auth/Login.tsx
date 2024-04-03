import { ROUTES } from "common";
import { Button, ButtonLink } from "../../components/Button";
import Container from "../../components/Container";
import Heading from "../../components/Heading";
import { getDummyUserId } from "../../utils/storage";

const Login: React.FC = () => {
  return (
    <>
      <Container
        makeBoxed="narrow"
        addVerticalPadding={true}
        makeFullHeight={true}
        centerXY={true}
      >
        <div className="grid grid-cols-1 gap-6">
          <Heading level={1}>Login</Heading>

          <ButtonLink
            href="/api/auth/login/google"
            renderAsReactRouterLink={false}
          >
            Google
          </ButtonLink>

          <form method="post" action={ROUTES.API_AUTH_LOGIN_DUMMY}>
            <input type="hidden" name="username" value={getDummyUserId()} />
            <input type="hidden" name="password" value={"dummy"} />
            <Button>Dummy User</Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Login;
