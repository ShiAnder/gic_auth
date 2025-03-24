import { Navbar } from "./_component/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div className="h-full flex flex-col">
            <Navbar />

            <div className="flex-1 overflow-y-auto bg-sky-500 p-4">
                {children}
            </div>
        </div>
    );
};

export default ProtectedLayout;