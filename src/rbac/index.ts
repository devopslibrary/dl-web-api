export function hasRole(role = false) {
  return (req, res, next) => {
    req.log('Basic auth');

    next();
  };
}
