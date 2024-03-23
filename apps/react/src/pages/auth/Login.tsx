import { ButtonLink } from "../../components/Button";
import Container from "../../components/Container";
import Heading from "../../components/Heading";

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
        </div>
      </Container>
    </>
  );
};

export default Login;
