/** @type {import('next').NextConfig} */
const nextConfig = {
    /*webpack:(config) =>{
        config.externals.push({
            "utf-8-validate" :"commonjs utf-8-validate",
            butterutil:"commonjs bufferutil"
        });
        return config;
    }, */
    images:{
        domains:[       //images.remotePatterns     agar domains kam nhji kiya to as it is deprecated
            "utfs.io"
        ]
    },eslint: {
        ignoreDuringBuilds: true,
      }
};

export default nextConfig;
