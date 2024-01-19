const asyncHandler = (fn) => async (req, res, next) => {
   try {
      await fn(req, res, next);
   } catch (error) {
      res.status(err.statusCode || 500).json({
         success: false,
         message: error.message,
      });
   }
};

export default asyncHandler;

// const asyncHandler = ()=> {};
// const asyncHandler = (func) => {() => {}};
// const asyncHandler = (func) => () => {};

// This is utlizing promise approach
// const asyncHandler = (requestHandler) => {
//    return (req, res, next) => {
//       Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//    };
// };
