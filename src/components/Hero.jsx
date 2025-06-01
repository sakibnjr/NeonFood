import { ArrowDown } from 'lucide-react'

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
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Delicious Food
              <span className="block text-primary-200">Delivered Fast</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-lg">
              Experience the finest flavors from our kitchen to your doorstep. 
              Fresh ingredients, authentic recipes, and lightning-fast delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#menu"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
              >
                Order Now
              </a>
              <button 
                onClick={scrollToMenu}
                className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
              >
                View Menu
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-96 h-96 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="text-8xl">🍕</div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-3xl animate-bounce">
                🍟
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-red-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
                🍔
              </div>
            </div>
          </div>
        </div>
        
        {/* Clickable scroll indicator */}
        <button 
          onClick={scrollToMenu}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-2"
          aria-label="Scroll to menu"
        >
          <ArrowDown size={24} className="text-primary-200 hover:text-white transition-colors" />
        </button>
      </div>
    </section>
  )
}

export default Hero 