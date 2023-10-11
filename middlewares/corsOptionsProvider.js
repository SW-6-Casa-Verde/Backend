const corsOptionsProvider = (req, callback) => {
  const origin = req.header('Origin');
  const allowlist = [
    process.env.DEV_HOST, 
    process.env.PRODUCT_HOST, 
    process.env_CLIENT_LIVE_SERVER
  ];
  const isAllowed = allowlist.includes(origin);

  if (!isAllowed) {
      const error = new Error("Not allowed by CORS");
      error.status = 403;
      return callback(error);
  }

  const corsOptions = {
    origin: origin,
    methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS', // 허용할 HTTP 메서드 목록
    credentials: true,
  };

  callback(null, corsOptions);
};

export default corsOptionsProvider;
