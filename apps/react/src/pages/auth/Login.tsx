import Heading from "../../components/Heading";

const Login: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        <Heading level={1}>Login</Heading>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
        </div>
      </div>
    </>
  );
};

export default Login;
