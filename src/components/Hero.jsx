import { ArrowDown, Star, Clock } from 'lucide-react'

const Hero = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu')
    if (menuSection) {
      menuSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/20 to-orange-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Main Content - More Compact */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8 relative z-10 min-h-[calc(100vh-100px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-amber-200 font-medium text-sm">Premium Culinary Experience</span>
            </div>

            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 lg:mb-6 font-serif">
              <span className="block text-white">Exquisite</span>
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Flavors
              </span>
              <span className="block text-amber-100 text-2xl lg:text-3xl xl:text-4xl font-light mt-1">
                Delivered Fresh
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-300 mb-6 lg:mb-8 max-w-2xl leading-relaxed">
              Embark on a culinary journey where traditional recipes meet modern innovation. 
              Every dish is a masterpiece crafted with passion and served with pride.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 lg:mb-8">
              <button
                onClick={scrollToMenu}
                className="group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-3 text-base lg:text-lg font-semibold shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105"
              >
                <span>Explore Menu</span>
                <ArrowDown className="w-5 h-5 group-hover:animate-bounce" />
              </button>
              <button 
                onClick={scrollToMenu}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-base lg:text-lg font-semibold"
              >
                <Clock className="w-5 h-5" />
                <span>Quick Order</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-sm lg:max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-amber-400">15+</div>
                <div className="text-xs lg:text-sm text-gray-400 font-medium">Signature Dishes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-amber-400">4.9</div>
                <div className="text-xs lg:text-sm text-gray-400 font-medium">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-amber-400">15m</div>
                <div className="text-xs lg:text-sm text-gray-400 font-medium">Avg Prep Time</div>
              </div>
            </div>
          </div>
          
          {/* Visual Elements */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Main Food Circle */}
              <div className="w-72 xl:w-80 h-72 xl:h-80 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-amber-500/30 shadow-2xl">
                <div className="text-6xl xl:text-7xl transform hover:scale-110 transition-transform duration-500">
                  🍽️
                </div>
              </div>
              
              {/* Floating Food Items */}
              <div className="absolute -top-3 -right-3 w-16 xl:w-20 h-16 xl:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl xl:text-3xl animate-bounce shadow-xl">
                🍕
              </div>
              <div className="absolute -bottom-3 -left-3 w-14 xl:w-16 h-14 xl:h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-xl xl:text-2xl animate-pulse shadow-xl">
                🍔
              </div>
              <div className="absolute top-1/2 -left-6 xl:-left-8 w-12 xl:w-14 h-12 xl:h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-lg xl:text-xl animate-bounce delay-300 shadow-xl">
                🥗
              </div>
              <div className="absolute top-6 xl:top-8 right-6 xl:right-8 w-14 xl:w-16 h-14 xl:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-xl xl:text-2xl animate-pulse delay-500 shadow-xl">
                🍰
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-3 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-3 right-1/4 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping delay-700"></div>
              <div className="absolute top-3/4 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
        
      {/* Scroll Indicator */}
      <div className="absolute bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={scrollToMenu}
          className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 lg:p-3 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Scroll to menu"
        >
          <ArrowDown size={18} className="text-amber-300 group-hover:text-amber-200 transition-colors" />
        </button>
      </div>

      {/* Additional Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-500/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-r from-orange-600/5 to-transparent"></div>
    </section>
  )
}

export default Hero 