/** @type {import('next').NextConfig} */
// En prod el backend no vive en el mismo contenedor que Next: el proxy debe apuntar a la URL real (Seenode).
const apiInternalBase = (
  process.env.API_INTERNAL_URL || "http://127.0.0.1:4000"
).replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@fullstack-reo/ui"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiInternalBase}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
