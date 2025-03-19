import React, { useState } from 'react';

const Faq = () => {
  const faqs = [
    {
      question: "What is Stay Point?",
      answer: "Stay Point is a platform to find and book hotels at affordable prices.",
    },
    {
      question: "How can I book a hotel?",
      answer: "You can search for hotels, view details, and book directly through our platform.",
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team via Contact page or email",
    },
    {
      question: "Are taxes and fees included in the price?",
      answer: "Most prices include taxes and fees, but some hotels may have additional charges at check-in. Check the booking details for clarity.",
    },
    {
      question: "Can I book hotels in multiple cities at once?",
      answer: "Yes, you can book multiple stays in different cities through our platform.",
    },
  ];

  return (
    <div className="text-center my-20 mx-10">
      <h1 className="text-4xl font-bold text-gray-800 p-2">Frequently Asked <span className="text-cyan-500">Questions</span></h1>
      <p className="text-lg my-1 text-gray-600">Find answers to common questions about Stay Point.</p>
      <div className="w-full flex flex-col gap-6 mt-10">
        {faqs.map((faq, index) => {
          const [isOpen, setIsOpen] = useState(false);
          return (
            <div key={index} className="w-full border border-gray-300 rounded-lg p-4 max-w-3xl mx-auto shadow-md cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">{faq.question}</h2>
                <span>
                  {isOpen ? (
                    <span className='text-cyan-500'>&#9650;</span>
                  ) : (
                    <span className='text-cyan-500'>&#9660;</span>
                  )}
                </span>
              </div>
              {isOpen && <p className="text-md text-left text-gray-600 mt-2">{faq.answer}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faq;