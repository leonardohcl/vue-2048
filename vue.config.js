module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production'
      ? 'https://leonardohcl.github.io/vue-2048/'
      : '/',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/styles/base";`,
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        }
      })
  },
}
