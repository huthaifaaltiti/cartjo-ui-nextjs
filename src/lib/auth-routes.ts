// Routes that logged-in users should be redirected AWAY from
export const publicRoutes = ["/auth"];

// Routes that require ANY valid session (customer or admin)
export const protectedRoutes = ["/wishlist", "/user", "/checkout", "/orders"];

// Routes that require admin/administrator role specifically
export const adminRoutes = ["/dashboard"];
