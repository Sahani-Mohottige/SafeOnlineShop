
import { useAuth0 } from "@auth0/auth0-react";
import register from "../assets/register.webp";


const Register = () => {
  const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Welcome, {user?.name || user?.email}!</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Auth0 Register/Login */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white">
        <div className="max-w-md w-full space-y-6 p-8 border shadow-sm">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Pickzy</h2>
          <p className="text-2xl text-gray-500 text-center font-bold mb-4">👋 Register/Login with Auth0</p>
          <p className="text-sm text-gray-600 font-semibold mb-6">Create your account securely with Auth0</p>
          <button
            onClick={() => loginWithRedirect()}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Sign Up / Login with Auth0
          </button>
        </div>
      </div>
      {/* Right: Background Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={register}
          alt="Register illustration"
          className="w-full object-cover h-[850px]"
        />
      </div>
    </div>
  );
};

export default Register;
