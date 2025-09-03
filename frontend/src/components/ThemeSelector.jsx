import React from 'react'
import { useThemeStore } from '../store/useThemeStore'
import { PaletteIcon } from 'lucide-react'
import { THEMES } from '../constants'

const ThemeSelector = () => {

  const { theme , setTheme } = useThemeStore()

  return (
    <div className='dropdown dropdown-end'>
        <button tabIndex={0} className='btn btn-ghost btn-circle'>
            <PaletteIcon className='size-7 text-base-content opacity-70'/>
        </button>

        <div 
          tabIndex={0}  
          className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border-b-base-content/10 max-h-80 overflow-y-auto'

        >

            <div className='space-y-1'>
                {THEMES.map((themeOption) => (
                    <button 
                      key={themeOption.name}
                        className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                        theme === themeOption.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5" 
                      }`}
                      onClick={() => setTheme(themeOption.name)}  
                    >

                       <PaletteIcon className='size-4'/>
                       
                       <span className='font-medium'>{themeOption.label}</span>

                       {/* theme preview color */}
                       {themeOption.colors.map((color,i) => (

                        <span
                            key={i} 
                            className='size-2 rounded-full'
                            style={{
                                background : color
                            }}
                        />

                       ))}

                    </button>
                ))}

            </div>

        </div>    
    </div>

  )
}

export default ThemeSelector