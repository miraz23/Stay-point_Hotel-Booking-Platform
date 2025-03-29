import React from 'react'

function Footer() {
  return (
    <footer className="shadow-2xl bg-slate-200 mx-4 md:mx-10 rounded-t-2xl">
        <div className="text-[#333]">
            <div className="pt-6 md:pt-10">
                <h1 className="text-center text-2xl md:text-3xl line-clamp-2 ml-2 cursor-pointer bg-gradient-to-r from-cyan-800 to-cyan-500 text-transparent bg-clip-text" style={{ fontFamily: "Gochi Hand, cursive" }}>
                    STAY POINT
                </h1>
            </div>
            <div className="text-[14px] md:text-[16px] py-4 md:py-5">
                <ul className="flex flex-wrap justify-center gap-4 md:gap-8 px-4">
                    <li><a href="#home" className="hover:text-cyan-700 transition-colors">Home</a></li>
                    <li><a href="#hotels" className="hover:text-cyan-700 transition-colors">Hotels</a></li>
                    <li><a href="#bookings" className="hover:text-cyan-700 transition-colors">Bookings</a></li>
                    <li><a href="#contactus" className="hover:text-cyan-700 transition-colors">Contact Us</a></li>
                    <li><a href="#aboutus" className="hover:text-cyan-700 transition-colors">About Us</a></li>
                </ul>
            </div>
            <div className="flex justify-center text-xl md:text-2xl gap-5 md:gap-7 pb-4 md:pb-5 bg-gradient-to-r from-cyan-800 to-cyan-500 text-transparent bg-clip-text">
                <a href="#instagram" className="hover:opacity-80 transition-opacity"><i className="bi bi-instagram"></i></a>
                <a href="#facebook" className="hover:opacity-80 transition-opacity"><i className="bi bi-facebook"></i></a>
                <a href="#twitter" className="hover:opacity-80 transition-opacity"><i className="bi bi-twitter"></i></a>
            </div>
            <div className="text-center text-[12px] md:text-[13px] pb-3 md:pb-2 italic">
                <p>© 2025 <span> stay point</span> | all rights reseved by <span>stay point</span></p>
            </div>
        </div>
    </footer>
  )
}

export default Footer