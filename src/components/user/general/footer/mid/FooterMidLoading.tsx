const FooterMidLoading = () => {
  return (
    <div className="container mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-10 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-6 w-2/3 bg-gray-200 rounded" />

          <ul className="space-y-2 mt-2">
            {[...Array(5)].map((_, j) => (
              <li key={j} className="h-4 w-3/4 bg-gray-100 rounded" />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterMidLoading;
