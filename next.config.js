/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React Compiler to avoid requiring babel-plugin-react-compiler locally
  reactCompiler: false,
  
  redirects() {
    return [
      {
        source: '/docs',
        destination: 'https://docs.netlify.com/frameworks/next-js/overview/',
        permanent: false,
      },
      {
        source: '/old-blog/:slug',
        destination: '/classics',
        permanent: true,
      },
      {
        source: '/github',
        destination: 'https://github.com/netlify-templates/next-platform-starter',
        permanent: false,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/quotes/random',
      },
      {
        source: '/blog',
        destination: '/classics',
      },
      // Serve StartBootstrap Agency dist via file-serving route
      {
        source: '/',
        destination: '/agency/index.html',
      },
    ];
  },
};

export default nextConfig;
