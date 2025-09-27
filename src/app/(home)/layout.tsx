import Navbar from "@/modules/home/ui/components/navbar";
import { Footer } from "@/modules/home/ui/components/footer";

interface Props {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <main className="max-h-screen flex flex-col min-h-screen overflow-auto hide-scrollbar">
      <Navbar />
      <div className="absolute inset-0 bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] -z-10 h-full w-full bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]"/>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
