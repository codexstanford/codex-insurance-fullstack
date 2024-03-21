import Heading from "../../components/Heading";

const Login: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        <Heading level={1}>Login</Heading>
        <a href="/api/auth/login/google">Google</a>
      </div>
    </>
  );
};

export default Login;
