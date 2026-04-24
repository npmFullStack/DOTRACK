// src/components/_Footer.jsx

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo and Copyright */}
                    <div className="text-center md:text-left">
                        <div className="font-logo text-3xl tracking-wide font-black">
                            <span className="text-primary">Do</span>
                            <span className="text-white">Track</span>
                        </div>
                        <p className="text-sm text-gray-200">
                            © {currentYear} DoTrack. All rights reserved.
                        </p>
                    </div>

                    {/* Developed by */}
                    <div className="text-sm">
                        <span>Developed by </span>
                        <span className="font-semibold text-white">NorDev</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
