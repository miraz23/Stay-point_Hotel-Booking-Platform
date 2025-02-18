import React from 'react';

const ContactUs = () => {
  return (
    <div className="my-25 mx-10">
      <div className="mb-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d59063.28067829215!2d91.7897216!3d22.298624!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd9fbcf03a9d5%3A0x505e915314ec7eff!2sAgrabad%2CChattogram!5e0!3m2!1sen!2sbd!4v1739894761129!5m2!1sen!2sbd"
          width="100%"
          height="270px"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="flex flex-wrap -mx-4 mt-15">
        <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
          <div>
            <div className="flex mb-6">
              <i className="bi bi-geo-alt text-2xl text-gray-700 bg-cyan-500 hover:bg-cyan-600 hover:text-gray-800 transition-colors flex justify-center items-center w-[55px] h-[55px] rounded-[40px]"></i>
              <div className='ml-5'>
                <h4 className="text-xl text-gray-700 font-semibold">Location:</h4>
                <p>Agrabad, Chattogram</p>
              </div>
            </div>
            <div className="flex mb-6">
              <i className="bi bi-envelope text-2xl text-gray-700 bg-cyan-500 hover:bg-cyan-600 hover:text-gray-800 transition-colors flex justify-center items-center w-[55px] h-[55px] rounded-[40px]"></i>
              <div className='ml-5'>
                <h4 className="text-xl text-gray-700 font-semibold">Email:</h4>
                <p>staypoint@gmail.com</p>
              </div>
            </div>
            <div className='flex'>
              <i className="bi bi-phone text-2xl text-gray-700 bg-cyan-500 hover:bg-cyan-600 hover:text-gray-800 transition-colors flex justify-center items-center w-[55px] h-[55px] rounded-[40px]"></i>
              <div className='ml-5'>
                <h4 className="text-xl text-gray-700 font-semibold">Call:</h4>
                <p>+880 1812345678</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/3 px-4">
          <form action="" method="post">
            <input type="hidden" name="csrfmiddlewaretoken" value="{% csrf_token %}" />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="contact-name" name="contact-name" className="mt-1 block w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="contact-email" name="contact-email" className="mt-1 block w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input type="text" id="contact-subject" name="contact-subject" className="mt-1 block w-full p-3 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="contact-message" name="contact-message" className="mt-1 block w-full p-3 border border-gray-300 rounded-md" required></textarea>
            </div>
            <button className="bg-gradient-to-r from-cyan-800 to-cyan-500 cursor-pointer text-white text-sm transition-all duration-500 ease-in-out hover:opacity-90 px-3 py-2 rounded-lg uppercase">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;