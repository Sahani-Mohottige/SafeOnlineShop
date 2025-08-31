import login from "../assets/login.webp";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-black mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-lg font-semibold text-gray-700">Logging in...</span>
        </div>
      </div>
    );
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
      {/* Left: Auth0 Login */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-white">
        <div className="max-w-md w-full space-y-6 p-8 border shadow-sm">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Pickzy</h2>
          <p className="text-2xl text-gray-500 text-center font-bold mb-4">Hey There! 👋</p>
          <p className="text-sm text-gray-600 font-semibold mb-6">Login securely with Auth0</p>
          <button
            onClick={() => loginWithRedirect()}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>
                <svg className="animate-spin h-5 w-5 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Sign In with Auth0"
            )}
          </button>
        </div>
      </div>
      {/* Right: Background Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={login}
          alt="Login to account"
          className="w-full object-cover h-[900px]"
        />
      </div>
    </div>
  );
};

export default Login;
