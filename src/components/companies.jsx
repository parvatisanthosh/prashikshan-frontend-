import React from "react";

const companies = [
  { name: "Google", logo: "https://www.logo.wine/a/logo/Google/Google-Logo.wine.svg" },
  { name: "Microsoft", logo: "https://www.logo.wine/a/logo/Microsoft/Microsoft-Logo.wine.svg" },
  { name: "Amazon AWS", logo: "https://www.logo.wine/a/logo/Amazon_Web_Services/Amazon_Web_Services-Logo.wine.svg" },
  { name: "TechCorp", logo: "https://dummyimage.com/100x40/007bff/fff&text=TechCorp" },
  { name: "ABC College", logo: "https://dummyimage.com/100x40/28a745/fff&text=ABC+College" },
  { name: "IIT Delhi", logo: "https://dummyimage.com/100x40/ffc107/fff&text=IIT+Delhi" }
];

export default function Companies() {
  return (
    <section className="px-10 py-16 bg-slate-50">
      <h2 className="text-3xl font-bold text-black-700 mb-6 text-center">Past Companies & Institutes</h2>
      <div className="flex flex-wrap justify-center gap-8 items-center">
        {companies.map((c, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow flex items-center">
            <img src={c.logo} alt={c.name} className="h-10 w-auto mr-3" />
            <span className="text-blue-700 font-semibold">{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
