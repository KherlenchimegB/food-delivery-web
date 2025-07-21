export const Footer = () => {
  return (
    <div className="bg-[#1C1C1E] text-white py-10 mt-10">
      <div className="bg-[#EF4444] text-white text-center py-3 font-semibold text-[28px]">
        <p className="whitespace-nowrap overflow-auto">
          Fresh fast delivered &nbsp; Fresh fast delivered &nbsp; Fresh fast
          delivered &nbsp; Fresh fast delivered &nbsp; Fresh fast delivered
        </p>
      </div>

      <footer className="bg-[#1e1e1e] text-white px-4 md:px-20 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <img src="./logos/home-logo.png" alt="logo" className="w-8 h-8" />
              <div>
                <h2 className="font-semibold text-xl text-red-500">NomNom</h2>
                <p className="text-sm text-gray-300">Swift delivery</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-gray-400">NOMNOM</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {["Home", "Contact us", "Delivery zone"].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-gray-400">MENU</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {[
                "Salads",
                "Pizzas",
                "Desserts",
                "Appetizers",
                "Main dishes",
              ].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-gray-400">Invisible</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {[
                "Brunch",
                "Desserts",
                "Side dish",
                "Beverages",
                "Fish & Sea foods",
              ].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-3">
            <h3 className="font-semibold text-gray-400">FOLLOW US</h3>
            <div className="w-[28px] h-[27px] flex gap-6">
              <img src="/logos/fb.png" alt="facebook link" />
              <img src="/logos/instagram.png" alt="instagram link" />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-600 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 Nomnom LLC</p>
          <div className="flex gap-4">
            {["Privacy policy", "Terms and condition", "Cookie policy"].map(
              (text, i) => (
                <span key={i}>{text}</span>
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
