import React from 'react'

function Footer() {
  return (
    <footer className="shadow-2xl bg-slate-200 mx-10 rounded-t-2xl">
        <div className="text-[#333]">
            <div className="pt-10">
                <h1 className="text-center text-3xl line-clamp-2 ml-2 cursor-pointer bg-gradient-to-r from-cyan-800 to-cyan-500 text-transparent bg-clip-text" style={{ fontFamily: "Gochi Hand, cursive" }}>
                    STAY POINT
                </h1>
            </div>
            <div className="text-[16px] py-5">
                <ul className="flex justify-center gap-8">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#hotels">Hotels</a></li>
                    <li><a href="#bookings">Bookings</a></li>
                    <li><a href="#contactus">Contact Us</a></li>
                    <li><a href="#aboutus">About Us</a></li>
                </ul>
            </div>
            <div className="flex justify-center text-2xl gap-7 pb-5 bg-gradient-to-r from-cyan-800 to-cyan-500 text-transparent bg-clip-text">
                <a href="#instagram"><i className="bi bi-instagram"></i></a>
                <a href="#facebook"><i className="bi bi-facebook"></i></a>
                <a href="#twitter"><i className="bi bi-twitter"></i></a>
            </div>
            <div className="text-center text-[13px] pb-2 italic">
                <p>© 2025 <span> stay point</span> | all rights reseved by <span>stay point</span></p>
            </div>
        </div>
    </footer>
  )
}

export default Footer