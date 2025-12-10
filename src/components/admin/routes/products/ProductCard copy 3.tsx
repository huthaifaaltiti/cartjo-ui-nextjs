const ProductCardDemo = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Cards
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Dashboard View
            </button>
            <button
              onClick={() => setActiveTab("customer")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "customer"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Customer View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "dashboard" ? (
            <>
              <DashboardProductCard />
              <DashboardProductCard />
              <DashboardProductCard />
            </>
          ) : (
            <>
              <CustomerProductCard />
              <CustomerProductCard />
              <CustomerProductCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardDemo;
