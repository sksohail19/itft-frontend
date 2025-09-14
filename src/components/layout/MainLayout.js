import Navbar from "../Navbar";
import Footer from "../Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
   /* return (
        <div className="d-flex flex-column min-vh-100">
            <main className="flex-grow-1">{children}</main>
        </div>
    )*/
};

export default MainLayout;
