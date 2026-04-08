import Navbar from "./Navbar";
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen text-black relative z-10">

      <Navbar />

      <div className="flex justify-center items-center h-screen">
        {children}
      </div>

    </div>
  );
}
export default AuthLayout;